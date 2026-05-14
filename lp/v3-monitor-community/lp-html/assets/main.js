/* ==============================================
   クローズドASP運営事務局 (合同会社リバイラル) community-monitor LP v3.0.1 (福利厚生軸)
   - Cookie consent gate (改正個情法27条 + Meta Consent API)
   - Pixel events: PageView / Lead×6+位置 / CompleteRegistration /
                   ViewContent×2 / ScrollDepth 25/50/75/100 / FAQ_Q1_open
   - IntersectionObserver scroll depth + ViewContent
   - Sticky CTA show/hide (after Hero, hide on Final)
   - Exit Intent overlay (PC, 1x per session, focus trap, idle fallback 75s)
   - data-reveal scroll animations (cards / sections)
   - Smooth anchor offset + Year auto fill
   ============================================== */
(function () {
  'use strict';

  // ---------- Year ----------
  var y = document.getElementById('footer-year');
  if (y) y.textContent = String(new Date().getFullYear());

  // ---------- Helpers ----------
  function fbqSafe() {
    if (typeof window.fbq === 'function') {
      try { window.fbq.apply(window, arguments); } catch (e) { /* noop */ }
    }
  }

  // ---------- Cookie Consent (R4 CRIT-3 / Fix-13) ----------
  var CONSENT_KEY = 'revirall_cookie_consent_v1';
  var consent = (function () {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  })();
  var consentAccepted = consent === 'accepted_marketing';

  function pixelGated(fn) {
    // run only if user accepted marketing/measurement cookies
    if (consentAccepted) fn();
  }

  function applyConsent(accepted) {
    consentAccepted = !!accepted;
    try { localStorage.setItem(CONSENT_KEY, accepted ? 'accepted_marketing' : 'denied'); } catch (e) {}
    if (accepted) {
      fbqSafe('consent', 'grant');
      fbqSafe('track', 'PageView');
      // CAPI: send PageView with action_source=website (server-side mirror)
      // POST /api/capi { event_name:'PageView', event_source_url, action_source:'website', user_data:{...hashed} }
    } else {
      fbqSafe('consent', 'revoke');
    }
  }

  var banner = document.getElementById('cookieBanner');
  var btnAccept = document.getElementById('cookieAccept');
  var btnDeny = document.getElementById('cookieDeny');
  // Fix-B (R2 CRIT-2): Hero被り回避。初回表示は scrollY>100 or 3秒経過後に出す。
  if (consent === null && banner) {
    var bannerShown = false;
    function showBanner() {
      if (bannerShown) return;
      bannerShown = true;
      banner.hidden = false;
    }
    // 3秒遅延フォールバック
    setTimeout(showBanner, 3000);
    // スクロール開始でも出す
    window.addEventListener('scroll', function onScrollOnce() {
      if (window.scrollY > 100) {
        showBanner();
        window.removeEventListener('scroll', onScrollOnce);
      }
    }, { passive: true });
  } else if (consentAccepted) {
    // Already opted in earlier — fire PageView immediately
    fbqSafe('consent', 'grant');
    fbqSafe('track', 'PageView');
  }
  if (btnAccept) btnAccept.addEventListener('click', function () {
    applyConsent(true);
    if (banner) banner.hidden = true;
  });
  if (btnDeny) btnDeny.addEventListener('click', function () {
    applyConsent(false);
    if (banner) banner.hidden = true;
  });

  /**
   * Send a Lead event with CTA position metadata.
   * Mirrors to CAPI server-side via the deferred hook below.
   */
  function trackLead(ctaPosition) {
    var payload = {
      content_name: 'community-monitor LP v3 - Benefit Menu Diagnosis',
      content_category: 'lead',
      cta_position: ctaPosition || 'unknown',
      messaging_version: 'v2_benefit'
    };
    pixelGated(function () { fbqSafe('track', 'Lead', payload); });
    // CAPI: POST /api/capi { event_name:'Lead', event_source_url, action_source:'website',
    //                        user_data:{...hashed}, custom_data: payload }
    if (window.console && console.debug) console.debug('[Lead]', payload);
  }

  // ---------- CTA click tracking (Lead × 4 positions) ----------
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-cta]');
    if (!el) return;
    var pos = el.getAttribute('data-cta') || 'unknown';
    trackLead(pos);
  }, { passive: true });

  // ---------- Scroll depth (25/50/75/100) - Pixel + dataLayer ----------
  var depthMarks = [25, 50, 75, 100];
  var fired = {};
  function checkScrollDepth() {
    var doc = document.documentElement;
    var scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight * 100;
    depthMarks.forEach(function (d) {
      if (!fired[d] && scrolled >= d) {
        fired[d] = true;
        pixelGated(function () {
          fbqSafe('trackCustom', 'ScrollDepth', { depth: d });
        });
        if (window.console && console.debug) console.debug('[Scroll]', d + '%');
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'scroll_depth', percent: d });
        }
      }
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        checkScrollDepth();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ---------- ViewContent (pricing block 8 + final CTA block 11) ----------
  var viewContentTargets = [
    { sel: '[data-block="8"]', name: 'pricing_view' },
    { sel: '[data-block="11"]', name: 'final_cta_view' }
  ];
  if ('IntersectionObserver' in window) {
    viewContentTargets.forEach(function (t) {
      var el = document.querySelector(t.sel);
      if (!el) return;
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !seen) {
            seen = true;
            pixelGated(function () {
              fbqSafe('track', 'ViewContent', {
                content_name: t.name,
                content_category: 'lp_section'
              });
            });
            if (window.console && console.debug) console.debug('[ViewContent]', t.name);
            io.unobserve(el);
          }
        });
      }, { rootMargin: '0px 0px -25% 0px', threshold: 0.15 });
      io.observe(el);
    });
  }

  // ---------- Sticky CTA show on scroll (Fix-C R2 CRIT-3) ----------
  // Hero scroll途中(scrollY>240)から表示、Final近接で非表示
  var sticky = document.getElementById('stickyCta');
  var finalBlock = document.querySelector('[data-block="11"]');
  var finalInView = false;
  if (sticky) {
    function updateSticky() {
      var shouldShow = (window.scrollY > 240) && !finalInView;
      if (shouldShow) sticky.classList.add('visible');
      else sticky.classList.remove('visible');
    }
    var stickyTicking = false;
    window.addEventListener('scroll', function () {
      if (!stickyTicking) {
        requestAnimationFrame(function () {
          updateSticky();
          stickyTicking = false;
        });
        stickyTicking = true;
      }
    }, { passive: true });
    if ('IntersectionObserver' in window && finalBlock) {
      var finalIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          finalInView = e.isIntersecting;
          updateSticky();
        });
      }, { rootMargin: '0px 0px -20% 0px', threshold: 0 });
      finalIO.observe(finalBlock);
    }
    updateSticky();
  }

  // ---------- Reveal on scroll (v2 — variants + stagger) ----------
  var autoRevealSelectors = [
    '[data-block] header',
    '.empathy-card', '.step-card', '.testimonial-card', '.plan-card', '.peek-card',
    '.method-block', '.story-act', '.faq-item', '.shift-card', '.oos-row',
    '.problem-callout', '.problem-image-frame', '.peek-cta',
    '.final-photo', '.final-letter', '.final-message',
    '.ornament-divider', '.method-image', '.story-photo',
    '.hero-portrait', '.method-iconrow'
  ].join(', ');
  var revealTargets = document.querySelectorAll(autoRevealSelectors);
  revealTargets.forEach(function (el) {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
  });
  // Auto stagger parents — apply to grids that contain cards
  var staggerParents = document.querySelectorAll(
    '.peek-grid, .method-iconrow, ul[aria-label="信頼情報"]'
  );
  staggerParents.forEach(function (p) {
    if (!p.hasAttribute('data-reveal-stagger')) p.setAttribute('data-reveal-stagger', '');
  });
  // Include parent triggers in the IO set
  var triggerTargets = document.querySelectorAll(autoRevealSelectors + ', [data-reveal], [data-reveal-stagger]');

  if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revealIO.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    triggerTargets.forEach(function (el) { revealIO.observe(el); });
  } else {
    triggerTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Scroll progress bar ----------
  if (!document.querySelector('.scroll-progress') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    var raf = null;
    var updateBar = function () {
      raf = null;
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      var pct = Math.min(100, Math.max(0, (scrollTop / max) * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', function () {
      if (raf === null) raf = window.requestAnimationFrame(updateBar);
    }, { passive: true });
    updateBar();
  }

  // ---------- FAQ Q1 open tracking ----------
  var q1 = document.querySelector('.faq-item[data-q="q1"]');
  if (q1) {
    q1.addEventListener('toggle', function () {
      if (q1.open) {
        if (window.console && console.debug) console.debug('[FAQ_Q1_Open]');
        if (window.dataLayer) window.dataLayer.push({ event: 'faq_q1_open' });
      }
    });
  }

  // ---------- Exit intent (PC, 1x per session) + focus trap + idle fallback ----------
  var overlay = document.getElementById('exitOverlay');
  var closer = document.getElementById('exitClose');
  var EXIT_KEY = 'revirall_v3_exit_shown';
  var lastFocusBeforeExit = null;
  function isPc() { return window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches; }
  function focusableInOverlay() {
    if (!overlay) return [];
    return Array.prototype.slice.call(overlay.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }
  function trapTab(ev) {
    if (!overlay || overlay.hidden) return;
    if (ev.key !== 'Tab') return;
    var f = focusableInOverlay();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault(); last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault(); first.focus();
    }
  }
  function showExit() {
    if (!overlay) return;
    if (sessionStorage.getItem(EXIT_KEY)) return;
    sessionStorage.setItem(EXIT_KEY, '1');
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    lastFocusBeforeExit = document.activeElement;
    var f = focusableInOverlay();
    if (f.length) f[0].focus();
  }
  function hideExit() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusBeforeExit && lastFocusBeforeExit.focus) lastFocusBeforeExit.focus();
  }
  if (overlay) {
    document.addEventListener('mouseout', function (ev) {
      if (!isPc()) return;
      if (ev.clientY <= 0 && (!ev.relatedTarget && !ev.toElement)) {
        showExit();
      }
    }, { passive: true });

    // Idle-timer fallback: 75s on pricing block triggers exit on PC
    if (isPc() && 'IntersectionObserver' in window) {
      var pricingEl = document.querySelector('[data-block="8"]');
      if (pricingEl) {
        var idleTimer = null;
        var pricingIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting && !idleTimer) {
              idleTimer = setTimeout(function () { showExit(); }, 75000);
            } else if (!e.isIntersecting && idleTimer) {
              clearTimeout(idleTimer); idleTimer = null;
            }
          });
        }, { threshold: 0.4 });
        pricingIO.observe(pricingEl);
      }
    }

    if (closer) closer.addEventListener('click', hideExit);
    overlay.addEventListener('click', function (ev) {
      if (ev.target === overlay) hideExit();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !overlay.hidden) hideExit();
      trapTab(ev);
    });
  }

  // ---------- Smooth offset for sticky-anchor jump (delegation) ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - 12;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  // ---------- CompleteRegistration (thanks page hook) ----------
  // thanks.html should call: window.__revirallCompleteRegistration()
  // This LP exposes the function so thanks.html can mirror to Pixel + CAPI consistently.
  window.__revirallCompleteRegistration = function (extra) {
    pixelGated(function () {
      fbqSafe('track', 'CompleteRegistration', Object.assign({
        content_name: 'consultation_booked',
        content_category: 'booking_completed'
      }, extra || {}));
    });
    if (window.console && console.debug) console.debug('[CompleteRegistration]', extra || {});
  };

})();
