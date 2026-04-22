// ========== Stage 2 tracking (event_id dedup + sendBeacon) ==========
// 設計:
//   - LP 着地時に event_id (UUID) を1つ生成、sessionStorage に保存
//   - LP CTA クリック時:
//       (a) fbq('track', 'Lead',        {}, { eventID })  ← 学習維持（既存運用保護）
//       (b) fbq('track', 'ViewContent', {}, { eventID })  ← Stage 3 切替準備
//       (c) sendBeacon で /api/capi へ ViewContent を送る（dedup 用に同じ eventID）
//   - 遷移前に setTimeout で遅延する方式をやめ、sendBeacon で UX を改善
//   - fbclid→_fbc cookie 保持は継続（Safari ITP 対応）
// 空砲問題について:
//   - 本番 Lead 発火は LIFF 中間ページ経由 CAPI のみ（真の LINE 追加時）
//   - LP 側の fbq('Lead') は Stage 3（Meta Events Manager の最適化イベント変更後）に停止
//   - それまでは dedup キー eventID 一致で LIFF CAPI Lead と重複排除
// ========================================================================

(function () {
  'use strict';

  function genEventId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return 'evt_' + crypto.randomUUID();
    }
    return 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  function getOrCreateEventId() {
    try {
      var existing = sessionStorage.getItem('lead_event_id');
      if (existing) return existing;
      var id = genEventId();
      sessionStorage.setItem('lead_event_id', id);
      return id;
    } catch (_) {
      return genEventId();
    }
  }

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  document.addEventListener('DOMContentLoaded', async function () {
    // ---- fbclid 保持（LP 着地時） ----
    try {
      var params = new URLSearchParams(location.search);
      var fbclid = params.get('fbclid');
      if (fbclid) {
        var fbc = 'fb.1.' + Date.now() + '.' + fbclid;
        document.cookie =
          '_fbc=' + fbc +
          '; Max-Age=7776000' +
          '; Path=/' +
          '; SameSite=Lax' +
          '; Secure';
        try { sessionStorage.setItem('_fbc', fbc); } catch (_) {}
      }
      var utmCode = params.get('utm_code') || '';
      if (utmCode) {
        try { sessionStorage.setItem('utm_code', utmCode); } catch (_) {}
      }
    } catch (_) {}

    // ---- event_id を着地時に確定（LIFF へ引き継ぐためのキー） ----
    var eventId = getOrCreateEventId();

    // ---- CTA クリック計測 ----
    var ctaNodes = document.querySelectorAll('.cta-btn');
    ctaNodes.forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (typeof fbq === 'function') {
          try { fbq('track', 'Lead',        {}, { eventID: eventId }); } catch (_) {}
          try {
            fbq('track', 'ViewContent', {
              content_name: 'CTA_to_LINE',
              content_category: el.getAttribute('data-cta') || 'unknown'
            }, { eventID: eventId });
          } catch (_) {}
        }

        // sendBeacon で CAPI に送信。ページ遷移中でもブラウザが送信を完走する。
        try {
          var fbp = getCookie('_fbp');
          var fbc = getCookie('_fbc') || (function () {
            try { return sessionStorage.getItem('_fbc') || ''; } catch (_) { return ''; }
          })();
          var payload = {
            event_id: eventId,
            event_name: 'ViewContent',
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: location.href,
            fbc: fbc || null,
            fbp: fbp || null,
            utm_code: (function () {
              try { return sessionStorage.getItem('utm_code') || ''; } catch (_) { return ''; }
            })(),
            client_user_agent: navigator.userAgent,
            custom_data: { content_name: 'CTA_to_LINE', content_category: el.getAttribute('data-cta') || '' }
          };
          if (navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon('/.netlify/functions/capi', blob);
          } else {
            // fallback: keepalive fetch
            fetch('/.netlify/functions/capi', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              keepalive: true
            }).catch(function () {});
          }
        } catch (_) {}

        // setTimeout 遅延を廃止。sendBeacon が送信責任を持つのでそのまま遷移。
      });
    });

    // ---- url-map.json で CTA リンク先を動的差替 ----
    try {
      var utmCode2 = '';
      try { utmCode2 = sessionStorage.getItem('utm_code') || ''; } catch (_) {}
      var res = await fetch('./assets/url-map.json', { cache: 'no-store' });
      if (res.ok) {
        var urlMap = await res.json();
        var liffUrl = urlMap[utmCode2] || urlMap[''] || '';
        if (liffUrl) {
          ctaNodes.forEach(function (el) { el.setAttribute('href', liffUrl); });
        }
      }
    } catch (_) {}
  });
})();
