/* ============================================
   LP v2 — Behavior  (rev 2026-04-25)
   - Quiz modal (3-step diagnostic)
   - Pixel firing: Image GET + fetch(keepalive) — Meta /tr/ is GET-only
   - FAQ accordion (CSS grid-rows transition)
   - Sticky CTA reveal (20-95% scroll)
   - Focus trap, iOS scrollLock, reveal-on-scroll
   ============================================ */

(function () {
  'use strict';

  var PIXEL_ID = '2450922202046153';
  var LINE_URL_BASE = 'https://s.lmes.jp/landing-qr/2009804039-gtVVGAua?uLand=tas1Lx';
  // 真の事業価値: 面談1件¥30,000 / 診断完了は半熱なので¥3,000 (1/10)
  // Meta CV最適化が高価値Lead優先化されるよう、記録ROAS実態に合わせて引き上げ (2026-05-02)
  var QUIZ_LEAD_VALUE = 3000;             // 診断完了 = 半熱 (旧¥500 → ¥3,000)
  var LINE_REGISTRATION_VALUE = 30000;    // LINEクリック = 本熱・面談1件相当 (旧¥3,000 → ¥30,000)
  var LEAD_CURRENCY = 'JPY';

  // --- Utilities ---
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function uid() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  }
  function pushDataLayer(obj) {
    if (window.dataLayer) window.dataLayer.push(obj);
  }

  // --- Pixel firing: Meta /tr/ is GET endpoint, so use Image + keepalive fetch (NOT sendBeacon POST) ---
  function fireEvent(eventName, customData, eventId) {
    eventId = eventId || uid();
    customData = customData || {};

    // Cookie同意チェック - 未同意ユーザーへのPixel送信を遮断
    if (!window.__consentGranted) {
      pushDataLayer({
        event: 'fb_event_blocked_no_consent',
        ev_name: eventName,
        ev_data: customData
      });
      return eventId;
    }

    var url = 'https://www.facebook.com/tr/?id=' + encodeURIComponent(PIXEL_ID) +
              '&ev=' + encodeURIComponent(eventName) +
              '&dl=' + encodeURIComponent(window.location.href) +
              '&rl=' + encodeURIComponent(document.referrer || '') +
              '&eid=' + encodeURIComponent(eventId) +          // legacy dedup param
              '&event_id=' + encodeURIComponent(eventId) +     // current Meta dedup param
              '&noscript=1';
    Object.keys(customData).forEach(function (k) {
      url += '&cd[' + encodeURIComponent(k) + ']=' + encodeURIComponent(customData[k]);
    });

    // 1) Image GET — works in all browsers including in-app
    try {
      var img = new Image(1, 1);
      img.referrerPolicy = 'no-referrer-when-downgrade';
      img.src = url;
    } catch (e) { /* swallow */ }

    // 2) keepalive fetch — guaranteed to complete even on page unload (iOS 13+/Chrome 66+)
    try {
      if (window.fetch) {
        fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          keepalive: true,
          credentials: 'include'
        }).catch(function () { /* swallow */ });
      }
    } catch (e) { /* swallow */ }

    // 3) fbq parallel — Meta dedupes via eventID
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', eventName, customData, { eventID: eventId });
      } catch (e) { /* swallow */ }
    }

    // 4) dataLayer for GA4/CAPI relay (future)
    pushDataLayer({
      event: 'fb_' + eventName.toLowerCase(),
      event_id: eventId,
      ev_name: eventName,
      ev_data: customData
    });

    return eventId;
  }

  // --- UTM / session ---
  function getUtm() {
    try {
      var p = new URLSearchParams(window.location.search);
      var code = p.get('utm_code') || sessionStorage.getItem('utm_code') || '';
      if (p.get('utm_code')) sessionStorage.setItem('utm_code', p.get('utm_code'));
      return code;
    } catch (e) { return ''; }
  }
  var utmCode = getUtm();

  // --- Build LINE URL with quiz answers (for L-step segmentation) ---
  function buildLineUrl(origin) {
    var params = [];
    if (utmCode) params.push('utm_code=' + encodeURIComponent(utmCode));
    if (origin) params.push('o=' + encodeURIComponent(origin));
    if (quiz.answers[0]) params.push('a1=' + encodeURIComponent(quiz.answers[0]));
    if (quiz.answers[1]) params.push('a2=' + encodeURIComponent(quiz.answers[1]));
    if (quiz.answers[2]) params.push('a3=' + encodeURIComponent(quiz.answers[2]));
    return LINE_URL_BASE + (params.length ? '&' + params.join('&') : '');
  }

  // --- Quiz ---
  var quiz = {
    answers: [],
    currentStep: 0,
    totalSteps: 3,
    questions: [
      {
        title: 'Q1. LINEで連絡できる友人・知り合いは、何人くらいいますか？',
        choices: [
          { label: '〜30人', value: 'small' },
          { label: '30〜100人', value: 'medium' },
          { label: '100〜300人', value: 'large' },
          { label: '300人より多い', value: 'xlarge' }
        ]
      },
      {
        title: 'Q2. いま、身近な方に何かを紹介していますか？',
        choices: [
          { label: '自分の商品を紹介している', value: 'own' },
          { label: '他社の商品やサービスを紹介している', value: 'affiliate' },
          { label: 'まだ何も紹介していない', value: 'none' },
          { label: 'いろいろやっている', value: 'mixed' }
        ]
      },
      {
        title: 'Q3. いちばん気になっていることは？',
        choices: [
          { label: '身近な人に喜ばれる紹介がしたい', value: 'value' },
          { label: '副収入をしっかり稼ぎたい', value: 'revenue' },
          { label: '相手と長く付き合いたい', value: 'retention' },
          { label: '全部気になる', value: 'all' }
        ]
      }
    ]
  };

  // --- DOM-safe quiz step rendering (no innerHTML for user-derived content) ---
  function renderQuizStep(idx) {
    var q = quiz.questions[idx];
    var stepEl = $('#quiz-step-' + idx);
    if (!stepEl) return;
    stepEl.textContent = '';

    var labelEl = document.createElement('p');
    labelEl.className = 'quiz__step-num';
    labelEl.textContent = 'STEP ' + (idx + 1) + ' / ' + quiz.totalSteps;

    var qEl = document.createElement('h3');
    qEl.className = 'quiz__question';
    qEl.textContent = q.title;

    var choicesEl = document.createElement('div');
    choicesEl.className = 'quiz__choices';
    choicesEl.setAttribute('role', 'radiogroup');
    choicesEl.setAttribute('aria-label', q.title);

    q.choices.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz__choice';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('data-value', c.value);
      btn.setAttribute('data-step', String(idx));
      var span = document.createElement('span');
      span.textContent = c.label;
      btn.appendChild(span);
      choicesEl.appendChild(btn);
    });

    stepEl.appendChild(labelEl);
    stepEl.appendChild(qEl);
    stepEl.appendChild(choicesEl);
  }

  function showQuizStep(idx) {
    quiz.currentStep = idx;
    $$('.quiz__step').forEach(function (el) {
      el.setAttribute('data-active', el.id === 'quiz-step-' + idx ? 'true' : 'false');
    });
    $$('.quiz__progress-dot').forEach(function (el, i) {
      el.setAttribute('data-active', i <= idx ? 'true' : 'false');
    });
    var first = $('#quiz-step-' + idx + ' .quiz__choice');
    if (first) first.focus();
  }

  // Map answers → result type with monthly range and case count (CRO P0)
  function mapAnswersToType(a) {
    var size = a[0], biz = a[1], goal = a[2];
    // honest negative branch: very small + no existing offering = limited fit now
    if (size === 'small' && biz === 'none') {
      return {
        label: 'スタートタイプ ／ 少人数から始める方向け',
        monthlyRange: '月 1〜5万円',
        caseCount: '5案件',
        body: 'まずは身近な方から始めるのに最適なタイプです。少人数でも成果が出やすい案件を厳選してご紹介します。実際に20〜30人から始めて、紹介料を伸ばしていった方が多くいらっしゃいます。'
      };
    }
    if (size === 'xlarge') {
      return {
        label: 'プレミアムタイプ ／ 人脈が多い方向け',
        monthlyRange: '月 10〜30万円',
        caseCount: '12案件',
        body: '300人より多く知り合いがいる方には、電気やガスなど、紹介料の大きい案件が合います。人脈が多い方に特に好評なタイプで、12の中から、あなたに合うものをご案内します。'
      };
    }
    if (size === 'large') {
      return {
        label: '成長タイプ ／ 100〜300人の知り合いがいる方向け',
        monthlyRange: '月 3〜10万円',
        caseCount: '8案件',
        body: '100〜300人くらいの知り合いがいる方には、無料サービス系と、お得な切替系の組み合わせがよく選ばれます。8つの中からご提案します。'
      };
    }
    if (biz === 'none') {
      return {
        label: 'はじめてタイプ ／ 副業初心者の方向け',
        monthlyRange: '月 数千円〜3万円',
        caseCount: '5案件',
        body: '初めての方には、相手に喜ばれやすい「無料登録系」からのスタートが向いています。成果が出やすい5つを選んでご案内します。'
      };
    }
    if (goal === 'retention') {
      return {
        label: '関係重視タイプ ／ 身近な人と長く付き合いたい方',
        monthlyRange: '月 5〜15万円',
        caseCount: '6案件',
        body: '身近な方と長く良い関係を保ちたい方向けに、「続けるほど得する情報」を届けられる案件を中心にご案内します。'
      };
    }
    return {
      label: 'ベーシックタイプ / バランス型',
      monthlyRange: '月 3〜12万円',
      caseCount: '7個',
      body: 'いろいろな案件を組み合わせた基本セットから、あなたに合わせてご提案します。'
    };
  }

  function showResult() {
    $('#quiz-flow').hidden = true;
    $('#quiz-result').hidden = false;

    var rt = mapAnswersToType(quiz.answers);
    $('#result-type').textContent = rt.label;
    var mEl = $('#result-monthly'); if (mEl) mEl.textContent = rt.monthlyRange;
    var cEl = $('#result-cases'); if (cEl) cEl.textContent = rt.caseCount;
    $('#result-body').textContent = rt.body;
    var ctaEl = $('#result-cta-text');
    if (ctaEl) ctaEl.textContent = rt.caseCount + 'の案件サンプルを今すぐLINEで受け取る';

    fireEvent('Lead', {
      content_name: 'quiz_complete',
      content_category: 'agency_program',
      value: QUIZ_LEAD_VALUE,
      currency: LEAD_CURRENCY,
      utm_code: utmCode,
      a1: quiz.answers[0] || '',
      a2: quiz.answers[1] || '',
      a3: quiz.answers[2] || ''
    });
  }

  function selectChoice(btn) {
    var val = btn.getAttribute('data-value');
    var step = parseInt(btn.getAttribute('data-step'), 10);
    quiz.answers[step] = val;
    btn.setAttribute('aria-checked', 'true');

    pushDataLayer({ event: 'quiz_answer', step: step + 1, value: val });

    if (step < quiz.totalSteps - 1) {
      setTimeout(function () { showQuizStep(step + 1); }, 220);
    } else {
      setTimeout(showResult, 220);
    }
  }

  // --- Modal: open/close + focus trap + iOS scroll lock ---
  var modal = null;
  var lastFocusBeforeModal = null;
  var savedScrollY = 0;

  function trapFocus(e) {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    if (e.key !== 'Tab') return;
    var focusables = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openModal() {
    if (!modal) modal = $('#quiz-modal');
    lastFocusBeforeModal = document.activeElement;
    savedScrollY = window.scrollY;

    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock');
    document.body.style.top = '-' + savedScrollY + 'px';

    // hide sticky CTA while modal is open
    var sticky = $('.sticky-cta');
    if (sticky) sticky.setAttribute('data-visible', 'false');

    quiz.answers = [];
    quiz.currentStep = 0;
    $('#quiz-flow').hidden = false;
    $('#quiz-result').hidden = true;
    [0, 1, 2].forEach(renderQuizStep);
    showQuizStep(0);

    document.addEventListener('keydown', trapFocus);
    pushDataLayer({ event: 'quiz_open' });
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-lock');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);

    document.removeEventListener('keydown', trapFocus);
    try {
      if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === 'function' && document.body.contains(lastFocusBeforeModal)) {
        lastFocusBeforeModal.focus();
      }
    } catch (e) { /* element may have been removed */ }
  }

  // --- LINE CTA click handler ---
  function handleLineClick(e, opts) {
    e.preventDefault();
    var origin = (opts && opts.origin) || 'cta';
    var eventId = uid();

    // クイズ未経由のLINE直行クリックではLeadも併発
    // (クイズ完了経由は showResult() で既にLead発火済み)
    if (origin !== 'quiz_result') {
      fireEvent('Lead', {
        content_name: 'line_direct',
        content_category: 'agency_program',
        origin: origin,
        value: QUIZ_LEAD_VALUE,
        currency: LEAD_CURRENCY,
        utm_code: utmCode
      });
    }

    fireEvent('CompleteRegistration', {
      content_name: 'line_cta',
      content_category: 'agency_program',
      origin: origin,
      value: LINE_REGISTRATION_VALUE,
      currency: LEAD_CURRENCY,
      utm_code: utmCode
    }, eventId);

    pushDataLayer({
      event: 'line_cta_click',
      event_id: eventId,
      origin: origin,
      utm_code: utmCode
    });

    // Build URL with quiz answers for L-step segmentation
    window.location.href = buildLineUrl(origin);
  }

  // --- UTM動的キーワード挿入 (2026-05-02): utm_contentでh1切替 ---
  // CV勝者(35-44女性)向けに見出しトーンを最適化、男性層は別フレーム
  function applyDynamicHeadline() {
    try {
      var content = new URLSearchParams(window.location.search).get('utm_content') || '';
      var h1 = $('.hero__title');
      if (!h1 || !content) return;
      if (content === 'female_3554' || content === 'female') {
        h1.innerHTML = '集めた会員リストを、<br>信用を壊さずに、<br><em>月収に。</em>';
      } else if (content === 'male_3544' || content === 'male') {
        h1.innerHTML = '眠っている人脈を、<br>信用を壊さずに、<br><em>副収入に。</em>';
      }
      pushDataLayer({ event: 'dynamic_headline', utm_content: content });
    } catch (e) { /* swallow */ }
  }

  // --- Boot ---
  document.addEventListener('DOMContentLoaded', function () {
    applyDynamicHeadline();

    // Quiz open buttons
    $$('[data-action="open-quiz"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    // Close modal
    $$('[data-action="close-quiz"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal();
      });
    });
    if ($('#quiz-modal')) {
      $('#quiz-modal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });

    // 特商法表記モーダル
    var tokushohoModal = $('#tokushoho-modal');
    function openTokushoho() {
      if (!tokushohoModal) return;
      tokushohoModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('scroll-lock');
      var closeBtn = tokushohoModal.querySelector('.modal__close');
      if (closeBtn) setTimeout(function(){ closeBtn.focus(); }, 50);
    }
    function closeTokushoho() {
      if (!tokushohoModal) return;
      tokushohoModal.setAttribute('aria-hidden', 'true');
      if (!modal || modal.getAttribute('aria-hidden') === 'true') {
        document.body.classList.remove('scroll-lock');
      }
    }
    $$('[data-action="open-tokushoho"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openTokushoho();
      });
    });
    $$('[data-action="close-tokushoho"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        closeTokushoho();
      });
    });
    if (tokushohoModal) {
      tokushohoModal.addEventListener('click', function (e) {
        if (e.target === this) closeTokushoho();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tokushohoModal && tokushohoModal.getAttribute('aria-hidden') === 'false') {
        closeTokushoho();
      }
    });

    // Quiz choice clicks (delegated)
    document.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('.quiz__choice');
      if (c) selectChoice(c);
    });

    // LINE CTA
    $$('[data-action="line-cta"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        handleLineClick(e, { origin: el.getAttribute('data-origin') || 'cta' });
      });
    });

    // FAQ accordion
    $$('.faq__item').forEach(function (item) {
      var q = item.querySelector('.faq__q');
      q.addEventListener('click', function () {
        var open = item.getAttribute('data-open') === 'true';
        item.setAttribute('data-open', open ? 'false' : 'true');
        q.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });

    // Sticky CTA: show in 20-95% scroll range (always present after hero, hides near footer)
    var stickyEl = $('.sticky-cta');
    if (stickyEl) {
      var lastVisible = false;
      var rafScheduled = false;
      function checkSticky() {
        rafScheduled = false;
        if (modal && modal.getAttribute('aria-hidden') === 'false') {
          if (lastVisible) { stickyEl.setAttribute('data-visible', 'false'); lastVisible = false; }
          return;
        }
        var doc = document.documentElement;
        var ratio = window.scrollY / Math.max(1, (doc.scrollHeight - window.innerHeight));
        var shouldShow = ratio > 0.28 && ratio < 0.95;
        if (shouldShow !== lastVisible) {
          stickyEl.setAttribute('data-visible', shouldShow ? 'true' : 'false');
          lastVisible = shouldShow;
        }
      }
      window.addEventListener('scroll', function () {
        if (!rafScheduled) {
          rafScheduled = true;
          requestAnimationFrame(checkSticky);
        }
      }, { passive: true });
    }

    // Engagement event: Scroll50 (CustomEvent — not stand. ViewContent)
    var sent50 = false;
    var scroll50RafScheduled = false;
    function checkScroll50() {
      scroll50RafScheduled = false;
      if (sent50) return;
      var doc = document.documentElement;
      var scrolled = (window.scrollY + window.innerHeight) / Math.max(1, doc.scrollHeight);
      if (scrolled >= 0.5) {
        sent50 = true;
        fireEvent('Scroll50', { content_name: 'scroll_50', utm_code: utmCode });
      }
    }
    window.addEventListener('scroll', function () {
      if (sent50 || scroll50RafScheduled) return;
      scroll50RafScheduled = true;
      requestAnimationFrame(checkScroll50);
    }, { passive: true });

    // Reveal-on-scroll
    if ('IntersectionObserver' in window) {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            revealIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
      $$('.reveal').forEach(function (el) { revealIO.observe(el); });
    } else {
      $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    }
  });
})();
