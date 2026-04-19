# 運用: Lead イベント本番発火の確認

`fbq('track', 'Lead')` が本番トラフィックで**実際に発火してMetaに到達しているか**を検証する。セットアップ完了後、LP再デプロイのたびに実施推奨。

## 前提
- `docs/01-03` のセットアップ完了
- LP (`lp/index.html`) がNetlifyにデプロイ済み（`docs/06-netlify-deploy.md`）

## なぜ重要か

Meta Ads MCP の `get_insights` で `actions: [{action_type: "lead", value: "N"}]` が取れれば本番発火OK。現状（2026-04-18時点）では2日¥93k消化してLead=0件 → LP側で実発火していないと推定。

## 方法① MCP経由の確認（最推奨、Claude Code利用者向け）

Claude Code で以下を実行:
```
mcp__meta-ads-local__get_insights で
  object_id="act_1215978840164411",
  time_range="last_3d",
  level="account"
```

### 期待する出力
`actions` 配列に以下が入っていれば本番発火成功:
```json
{"action_type": "lead", "value": "N"}
```

### 遅延
Meta集計は最大1-24時間の遅延あり。LP再デプロイ直後なら2-3時間待ってから確認。

## 方法② Chrome DevTools Network タブ（即時検証）

### 手順
1. LPを開いてF12キー → Network タブ
2. フィルタ欄に `facebook.com/tr` を入力
3. ページロード直後: `facebook.com/tr?id=<pixel_id>&ev=PageView&...` が 200 OKで飛ぶ
4. CTAボタンクリック: `facebook.com/tr?id=<pixel_id>&ev=Lead&...` が 200 OKで飛ぶ

### チェックポイント
- status 200 = Meta到達OK
- status 4xx/5xx = エラー、パラメータ不正など
- リクエスト自体が発生しない = JS側で `fbq('track', 'Lead')` が実行されていない

## 方法③ Meta Pixel Helper（Chrome拡張、初心者向け）

### インストール
https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc

### 確認手順
1. LPを開く
2. 右上 Pixel Helper アイコンをクリック
3. 緑のチェックで `PageView` 1件以上表示されればOK
4. CTAボタンをCtrl+クリック（新タブ開くが離脱しない）
5. Pixel Helperに `Lead` が1件増えていればOK

### 失敗パターン
- ❌ `Lead` が出ない → LPのJavaScriptで `fbq('track', 'Lead')` が実行されていない
- ❌ 黄色/赤のWARNING → イベントは送信されたがMeta側で検出に問題あり

## 方法④ Meta Events Manager テストイベント

### 手順
1. Meta Events Manager を開く: https://business.facebook.com/events_manager2/list/dataset
2. 対象のPixelを選択 → 画面上部タブの「**テストイベント**」をクリック
3. テストイベントコード（例: `TEST12345`）が発行される
4. LP側で `test_event_code` を指定した形で fbq を呼ぶ必要がある（既存LP実装は対応していないため、ソース側の修正が必要）:
   ```javascript
   fbq('init', '<pixel_id>', {}, {test_event_code: 'TEST12345'});
   ```
5. LPを開いてCTAクリック
6. Events Manager のテストイベント画面にリアルタイム表示

### 注意
- **URL クエリ `?fbclid_test=` はMeta仕様に存在しない**。test_event_code 注入は JS初期化時のみ可能。
- Events Manager の URL 構造は変更されうる。見つからない場合は Business Suite → Events Manager から辿る。

## 故障モード別の対処

| 症状 | 原因 | 対処 |
|---|---|---|
| Pixel Helperに PageView すら出ない | Pixelコード自体が動いていない | `index.html` 冒頭 `<script>fbq('init',...)</script>` を確認 |
| PageView はOK、Lead だけ出ない | CTAクリックハンドラが動いていない | `index.html` のDOMContentLoaded内 event listener を確認 |
| Leadは出るがMCP insightsに反映されない | Meta側の集計遅延 or 品質拒否 | 24h待機 → Events Manager overviewで確認 |
| status 4xx | Pixel ID誤り / トークン無効 | `index.html` 内の Pixel ID を確認 |

## 参考: LP index.html の該当部分

```javascript
document.addEventListener('DOMContentLoaded', async function() {
  document.querySelectorAll('.cta-btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }
      var href = el.href;
      if (href) {
        e.preventDefault();
        setTimeout(function() { window.location.href = href; }, 300);
      }
    });
  });
  // ...url-map fetch...
});
```

キーポイント:
- `.cta-btn` クラスの全ボタンに自動バインド
- `setTimeout 300ms` でMetaへの送信時間を確保してからLINE遷移
- url-map fetchの失敗はLeadイベントに影響しない設計

## 次へ
→ `05-benchmark-analysis.md` で配信実績を業界相場と比較
