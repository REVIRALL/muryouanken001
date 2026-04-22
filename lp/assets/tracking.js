// ========== Stage 1 tracking (Lead 維持 + ViewContent 追加) ==========
// 稼働中キャンペーンの学習資産を守るため、Lead イベントは残す。
// ViewContent は将来の Stage 2 切替用に並走追加発火。
// Safari ITP 対応: fbclid を受領したらファーストパーティ _fbc Cookie に保存。

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', async function () {
    // ---- fbclid 保持（LP 着地時） ----
    try {
      var params = new URLSearchParams(location.search);
      var fbclid = params.get('fbclid');
      if (fbclid) {
        var fbc = 'fb.1.' + Date.now() + '.' + fbclid;
        document.cookie =
          '_fbc=' + fbc +
          '; Max-Age=7776000' + // 90 日
          '; Path=/' +
          '; SameSite=Lax' +
          '; Secure';
        try { sessionStorage.setItem('_fbc', fbc); } catch (_) {}
      }
      // utm_code 保持（既存仕様）
      var utmCode = params.get('utm_code') || '';
      if (utmCode) {
        try { sessionStorage.setItem('utm_code', utmCode); } catch (_) {}
      }
    } catch (_) {
      // URLSearchParams 未対応環境でも処理継続
    }

    // ---- CTA クリック計測 ----
    var ctaNodes = document.querySelectorAll('.cta-btn');
    ctaNodes.forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (typeof fbq === 'function') {
          try { fbq('track', 'Lead'); } catch (_) {}               // Stage 1: 既存学習維持
          try { fbq('track', 'ViewContent', {                        // Stage 2 準備
            content_name: 'CTA_to_LINE',
            content_category: el.getAttribute('data-cta') || 'unknown'
          }); } catch (_) {}
        }
        var href = el.getAttribute('href');
        if (href) {
          e.preventDefault();
          // 発火を確実にするため遷移を 300ms 遅らせる
          setTimeout(function () { window.location.href = href; }, 300);
        }
      });
    });

    // ---- url-map.json による CTA リンク先の動的切替（既存仕様を継承） ----
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
    } catch (_) {
      // url-map.json が存在しない/エラーでも既存の href を維持
    }
  });
})();
