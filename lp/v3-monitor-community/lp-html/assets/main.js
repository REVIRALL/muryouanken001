/* ==============================================
   REVIRALL community-monitor LP v3 - main.js
   - CTA tracking (Pixel + CAPI hook placeholders)
   - IntersectionObserver: ViewContent + scroll depth
   - Exit Intent (PC only, 1回限り via sessionStorage)
   - FAQ Q1 open tracking
   - Year stamp
   ============================================== */

(function () {
  'use strict';

  // ---------------------------------------------
  // Util: safe Pixel call
  // ---------------------------------------------
  function pixelTrack(eventName, params, eventId) {
    try {
      if (typeof window.fbq === 'function') {
        const opts = eventId ? { eventID: eventId } : undefined;
        if (params && opts) {
          window.fbq('trackCustom', eventName, params, opts);
        } else if (params) {
          window.fbq('track', eventName, params);
        } else {
          window.fbq('track', eventName);
        }
      }
    } catch (e) {
      // Pixel failures must never break user experience
      console && console.warn && console.warn('[pixel] track failed', e);
    }
  }

  function pixelTrackStandard(eventName, params, eventId) {
    try {
      if (typeof window.fbq === 'function') {
        const opts = eventId ? { eventID: eventId } : undefined;
        if (opts) {
          window.fbq('track', eventName, params || {}, opts);
        } else {
          window.fbq('track', eventName, params || {});
        }
      }
    } catch (e) {
      console && console.warn && console.warn('[pixel] track failed', e);
    }
  }

  // Generate a stable-ish event_id (for Pixel-CAPI dedup)
  function genEventId(prefix) {
    const rand = Math.random().toString(36).slice(2, 10);
    const ts = Date.now();
    return `${prefix}_${ts}_${rand}`;
  }

  // ---------------------------------------------
  // Year stamp in footer
  // ---------------------------------------------
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------------------------------------------
  // CTA click tracking (all elements with [data-cta])
  // Each click fires Pixel "Lead" with cta_position
  // ---------------------------------------------
  const ctas = document.querySelectorAll('[data-cta]');
  ctas.forEach((el) => {
    el.addEventListener('click', function () {
      const ctaPosition = el.getAttribute('data-cta') || 'unknown';
      const eventId = genEventId(`lead_${ctaPosition}`);

      pixelTrackStandard(
        'Lead',
        {
          cta_position: ctaPosition,
          content_name: 'community-monitor LP v3',
          content_category: 'booking_intent',
        },
        eventId
      );

      // CAPI: send Lead with custom_data.cta_position=hero / mid / final / sticky / exit
      // Server hook should consume the same eventId for Pixel-CAPI dedup.
      // Example payload to forward server-side:
      //   {
      //     event_name: 'Lead',
      //     event_id: eventId,
      //     event_source_url: location.href,
      //     action_source: 'website',
      //     custom_data: { cta_position: ctaPosition }
      //   }

      // GA4 (optional)
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', `${ctaPosition}_cta_click`, {
            cta_position: ctaPosition,
          });
        }
      } catch (e) { /* noop */ }
    }, { passive: true });
  });

  // ---------------------------------------------
  // IntersectionObserver: ViewContent (per block)
  // Fires once per block when ≥50% visible
  // ---------------------------------------------
  const blocks = document.querySelectorAll('[data-block]');
  if ('IntersectionObserver' in window && blocks.length > 0) {
    const seenBlocks = new Set();
    const blockObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const blockId = entry.target.getAttribute('data-block');
            if (blockId && !seenBlocks.has(blockId)) {
              seenBlocks.add(blockId);
              pixelTrackStandard(
                'ViewContent',
                {
                  content_name: `block_${blockId}`,
                  content_category: 'lp_section',
                },
                genEventId(`viewcontent_b${blockId}`)
              );
              // CAPI: send ViewContent with custom_data.block=<blockId>
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    blocks.forEach((b) => blockObserver.observe(b));
  }

  // ---------------------------------------------
  // Scroll depth: 25 / 50 / 75 / 100
  // ---------------------------------------------
  (function setupScrollDepth() {
    const milestones = [25, 50, 75, 100];
    const fired = new Set();

    function calcDepthPct() {
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollable = Math.max(docHeight - winHeight, 1);
      return Math.min(100, Math.round((scrollTop / scrollable) * 100));
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const pct = calcDepthPct();
        milestones.forEach((m) => {
          if (pct >= m && !fired.has(m)) {
            fired.add(m);
            pixelTrack(
              'ScrollDepth',
              { depth: m, content_name: 'community-monitor LP v3' },
              genEventId(`scroll_${m}`)
            );
            // CAPI: send ScrollDepth (custom event) with custom_data.depth=<m>
            try {
              if (typeof window.gtag === 'function') {
                window.gtag('event', `scroll_${m}`, { depth: m });
              }
            } catch (e) { /* noop */ }
          }
        });
      });
      // Reset ticking after the rAF callback
      setTimeout(() => { ticking = false; }, 100);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  // ---------------------------------------------
  // FAQ Q1 open tracking
  // ---------------------------------------------
  const q1 = document.querySelector('[data-faq="q1"]');
  if (q1) {
    q1.addEventListener('toggle', function () {
      if (q1.open) {
        pixelTrack(
          'FAQ_Q1_Open',
          { question: 'is_this_mlm' },
          genEventId('faq_q1_open')
        );
        // CAPI: optionally forward — most accounts skip FAQ events server-side
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'faq_q1_open');
          }
        } catch (e) { /* noop */ }
      }
    });
  }

  // ---------------------------------------------
  // Exit Intent popup (PC only, 1回限り)
  // ---------------------------------------------
  (function setupExitIntent() {
    const modal = document.getElementById('exit-modal');
    if (!modal) return;

    const isTouch =
      'ontouchstart' in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const isWidePC = window.matchMedia && window.matchMedia('(min-width: 768px)').matches;
    if (isTouch || !isWidePC) return; // mobile/tablet — skip

    const SS_KEY = 'revirall_v3_exit_shown';
    if (sessionStorage.getItem(SS_KEY) === '1') return;

    function showModal() {
      if (sessionStorage.getItem(SS_KEY) === '1') return;
      sessionStorage.setItem(SS_KEY, '1');
      modal.classList.remove('hidden');
      modal.removeAttribute('hidden');

      pixelTrack(
        'ExitIntent_Shown',
        { content_name: 'community-monitor LP v3' },
        genEventId('exit_intent_shown')
      );
      // CAPI: ExitIntent_Shown (optional — usually not server-tracked)

      // Focus management — accessibility
      const focusTarget = modal.querySelector('a[data-cta], button[data-exit-close]');
      if (focusTarget) {
        focusTarget.focus();
      }

      // Cleanup global listeners
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('keydown', onEscPre);
    }

    function hideModal() {
      modal.classList.add('hidden');
      modal.setAttribute('hidden', '');
    }

    function onMouseOut(e) {
      // Trigger when cursor leaves toward the top of the viewport
      if (!e.relatedTarget && e.clientY <= 0) {
        showModal();
      }
    }

    function onEscPre(e) {
      // No-op; reserved
    }

    function onEscClose(e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        hideModal();
      }
    }

    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('keydown', onEscClose);

    // Close handlers
    const closers = modal.querySelectorAll('[data-exit-close]');
    closers.forEach((btn) => {
      btn.addEventListener('click', hideModal);
    });
  })();

  // ---------------------------------------------
  // Smooth-scroll anchor handling for internal hash links
  // (covers cases where a CTA links to #booking)
  // ---------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Move keyboard focus to the target (a11y)
        if (target instanceof HTMLElement) {
          const prevTabindex = target.getAttribute('tabindex');
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          if (prevTabindex === null) {
            // Restore after blur
            target.addEventListener(
              'blur',
              () => target.removeAttribute('tabindex'),
              { once: true }
            );
          }
        }
      }
    });
  });
})();
