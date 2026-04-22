# LP v3 実装 実行計画 v2

**v2最終化（v2→v2.1 で第2巡レビューのカバレッジ残8点も反映 = 100/100）**

v2.1 追加:
- B-1 マッピング表 §9 行に Q2「並行されている方もいます」柔化 DoD 項目追加
- DoD リストに Q2文言 / evidence/ ディレクトリ / welcome_messages.json の3項目追加
- Phase A-3 に景表法7条2項対応の立証資料保管ディレクトリ新設
- Phase E-4 に LMES Welcome 2通構成テンプレ（video + quick_reply×6）を本リポ同梱
- `scripts/check_evidence.mjs` 追加: 数値言及→ docs/evidence/ 資料存在必須化

---

**v1→v2 変更点サマリ（第1巡3並列レビュー指摘を全反映）**

1. **計測差替を凍結**: Lead維持、ViewContent「追加」のみ。稼働中学習¥21,538を守る（リスクR2）
2. **LIFF + CAPI Lead 送信を本PRスコープに包含**（カバレッジC1、v3.txt 99点核心の実装）
3. **特商法未決定を「隠し公開＋allowlist」化**。未記入時は該当セクション `display:none`（リスクR3）
4. **Meta creative 差替は「旧ad不触、新ad追加で並走」固定**、旧 creative_id/post_id を事前記録（リスクR7）
5. **CI lint を Node.js 製に置換**（Windows/Linux両対応、ロケール非依存）
6. **B-2 セクション別 HTMLスケルトン + v3.txt行番号マッピング表**を先に作る
7. **DoD 5項目追加**: Voice4 / Q7構造否定 / SLA5営業日 / 月20名残枠更新 / 打消しCSS
8. **工数を 120-180分** に現実化
9. **Phase 開始前に `git tag v1-image-lp` を強制**
10. **Meta Personal Attributes 事前 lint**（`scripts/check_meta_policy.mjs`）
11. **予算ガード**: 新ad は日予算¥1,500上限、並走72hで¥9,000を超えない
12. **ロールバック Runbook** を `docs/ROLLBACK.md` に分離、事前 creative_id 取得強制

---

## 0. 前提条件とプレースホルダ戦略

| # | 項目 | 本計画の扱い |
|---|---|---|
| 0-1 | LINE 公式友だち追加 URL | 未決 → lmes.jp継続、`assets/url-map.json` 1行差替で切替可 |
| 0-2 | 特商法: 住所・電話・代表者氏名 | 未決 → セクション `display:none` + allowlist、判断後に表示化 |
| 0-3 | 運営者顔写真 | 未決 → `operator_placeholder.svg` 自動描画 |
| 0-4 | 自己紹介動画URL | 未決 → 「近日公開」プレースホルダ枠 |
| 0-5 | 実績数値（提携数・累計） | 未決 → `<span class="stat-pending">準備中</span>` |
| 0-6 | LIFF 中間ページ（CAPI） | **今回実装**（Netlify Functions 1本） |

**原則**: 判断待ちがあっても作業が止まらない設計。未決は「隠すが壊れない」が基本。

---

## 必須準備（Phase 開始前）

```bash
# v1原型をタグ付け（ロールバック起点）
git tag v1-image-lp
git push origin v1-image-lp
git push revirall v1-image-lp

# 現行 Meta creative ID を控える（ロールバック用）
# → docs/ROLLBACK.md に記録（Phase I 前に必須）
mcp__meta-ads__get_ads(...) → creative.id を保存
mcp__meta-ads__get_ad_creatives(...) → post_id も保存
```

---

## Phase A: ファイル準備（10分）

### A-1. Gemini画像の正式配置
| 元 | 新 |
|---|---|
| `lp/assets/v3/fv_5x4_1500x1200.{webp,jpg}` | `lp/assets/hero_v3.{webp,jpg}` |
| `lp/assets/v3/feed_4x5_1080x1350.{webp,jpg}` | `lp/assets/og_v3.{webp,jpg}` |

`v3/` サブフォルダは保持（Meta広告用に維持）。

### A-2. SVG プレースホルダ生成
- `lp/assets/operator_placeholder.svg`（120×120 円形シルエット、`<text>撮影予定</text>` 添え）
- `lp/assets/voice_avatar_0{1,2,3,4}.svg`（抽象4色）
- `lp/assets/video_placeholder.svg`（16:9 矩形、`<text>近日公開</text>`）

### A-3. 立証資料保管ディレクトリ作成（景表法7条2項対応）

```
mkdir -p docs/evidence/
touch docs/evidence/.gitkeep
```

`docs/evidence/README.md` に以下を明記:
- 本ディレクトリは「提携〇社」「実績〇件」「〇年目」等の数値の**合理的根拠資料**を保管する
- 消費者庁から景表法7条2項に基づき **15日以内** に資料提出を求められた場合の即応場所
- ファイル例: 提携契約書PDF、Stripe/請求ダッシュボードのスクショ、法人登記簿など
- **plaintext秘密情報（トークン・パスワード）禁止**
- 配置後、数値 placeholder を LP に記入する段階で `scripts/check_evidence.mjs` が対応資料の存在を確認

CI lint `scripts/check_evidence.mjs`:
```js
// LPに "提携\d+社" "実績\d+件" "\d+年目" 等の数値が現れたら、
// docs/evidence/ に1ファイル以上存在することを必須化
```

### A-4. 旧画像退役マップ
| 旧ファイル | 置換 |
|---|---|
| `lp01a_01.jpg` (FV) | → `hero_v3.{webp,jpg}` |
| `lp01a_04.jpg`〜`18.jpg`（本文画像） | → 全撤去（HTMLテキスト化） |
| `cta_area.jpg`, `btn.jpg` | → CSS + HTMLボタンで代替 |

参照のみ外し、物理削除はPhase K のみ（後続 revert の余裕）。

---

## Phase B: HTML + 段階計測（40分、v2で大幅拡充）

### B-1. セクション → v3.txt 行番号マッピング表

| HTMLセクション | クラス | v3.txt 行番号 | DoD 重要項目 |
|---|---|---|---|
| Hero FV | `.hero` | §1, L80-120 | ✅ H1「"売り込まない"コミュニティ運営の、新しい選択肢。」、✅ サブキャッチ「固定費の見直し」、✅ 補助3点、✅ 運営者バッジ、✅ 安心3点、✅ 打消し、✅ CTA「LINEで友だち追加 → 15分だけ、話を聞きに行く」 |
| 共感 | `.empathy` | §2, L122-145 | ✅ チェックリスト5項目、Meta Personal Attributes 事前lint通過 |
| 解決 | `.solution` | §3, L147-180 | ✅ 3特徴カード、打消し表示 |
| ステップ | `.steps` | §4, L182-210 | ✅ 3ステップ |
| 比較 | `.compare` | §5, L212-240 | ✅ 比較テーブル、打消し「当社調べ・2026年4月時点」 |
| Voice | `.voices` | §6, L242-280 | ✅ Voice 1-3 + **Voice 4 検討中止事例**、顔写真 or シルエット |
| 運営者 | `.operator` | §7, L282-315 | ✅ 顔写真 placeholder、✅ 自己紹介動画枠、✅ 定量プロフィール |
| おすすめ | `.recommend` | §8, L317-335 | ✅ 5項目リスト |
| FAQ | `.faq` | §9, L337-395 | ✅ Q1-Q8 全8問、**Q7=構造否定形3要件列挙**、**Q2=「並行されている方もいます」柔化**（景表法5条1号、v3.txt T項目） |
| 希少性 | `.scarcity` | §10 上部, L397-415 | ✅ 月20名、✅ 残り枠〇名（週次更新）、✅ 自社基準注記 |
| 最終CTA | `.final-cta` | §10 下部, L417-435 | ✅ 安心3点マイクロコピー再掲、CTA |
| 特商法 | `.tokushoho` | §11, L437-475 | ✅ **5営業日以内書面開示SLA**、allowlist条件時 `display:none` |
| プラポリ（別ページ） | `/privacy/` | §12, L477-540 | ✅ 個情法17/21/27/32-34/40条全網羅 |

### B-2. 新 `lp/index.html` 骨子

```html
<!doctype html>
<html lang="ja">
<head>
  <!-- v2: Meta Personal Attributes lint OK / Q7/Voice4 DoD pass -->
  <meta charset="utf-8">
  <title>コミュニティ運営者向け 新しい選択肢｜JUN</title>
  <meta name="description" content="売り込まないコミュニティ運営の新しい選択肢。インフラの見直しで、あなたの人脈が自然に活きます。">
  <meta property="og:image" content="./assets/og_v3.jpg">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex,follow">
  <link rel="preload" as="image" href="./assets/hero_v3.webp" type="image/webp">
  <link rel="stylesheet" href="./assets/styles.css">
  <!-- GTM + Meta Pixel 継続 -->
</head>
<body>
  <main class="lp-wrap">
    <section class="hero">...</section>
    <section class="operator-badge">...</section>
    <section class="empathy">...</section>
    ...
    <section class="final-cta">...</section>
  </main>
  <footer>
    <section class="tokushoho" data-pending="true">...</section>
  </footer>
  <script src="./assets/tracking.js"></script>
</body>
</html>
```

`data-pending="true"` が付いたセクションは、CSS で `[data-pending] { display: none; }` → 特商法未記入でも公開可。placeholder が埋まったら HTML側で `data-pending` 属性を外す。

### B-3. 計測スクリプト `lp/assets/tracking.js`（v2: 段階計測）

```js
// ========== Stage 1 (今回実装) ==========
// Lead 維持 + ViewContent 追加発火（既存学習を守る）
// fbclid → _fbc cookie 保持（Safari ITP 対応）

document.addEventListener('DOMContentLoaded', function() {
  // fbclid 保持
  var params = new URLSearchParams(location.search);
  var fbclid = params.get('fbclid');
  if (fbclid) {
    var fbc = 'fb.1.' + Date.now() + '.' + fbclid;
    document.cookie = '_fbc=' + fbc +
      '; Max-Age=7776000; Path=/; SameSite=Lax; Secure';
    sessionStorage.setItem('_fbc', fbc);
  }

  // CTA クリック計測
  document.querySelectorAll('.cta-btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');            // ← 既存学習維持のため残す
        fbq('track', 'ViewContent', {    // ← 将来の切替用に追加
          content_name: 'CTA_to_LINE'
        });
      }
      var href = el.href;
      if (href) {
        e.preventDefault();
        setTimeout(function() { window.location.href = href; }, 300);
      }
    });
  });
});

// ========== Stage 2 (別PR、LIFF完成後) ==========
// - Lead発火を停止、ViewContent のみに
// - Meta Events Manager で最適化イベントを LINE_Follow_CAPI に変更
// - 3日観測後、問題なければ ad set の最適化目標を変更
```

### B-4. Meta Personal Attributes 文言事前 lint

`scripts/check_meta_policy.mjs`（Node製）:
- NGワード: 「あなたは」「頭を下げ」「悩み」「不安」「困窮」（Personal Attributes抵触常連）
- LP HTML + creative copy テキストをスキャン
- ヒットあれば warning、strict mode で fail

---

## Phase C: CSS（25分）

### C-1. `lp/assets/styles.css`

**方針**: モバイル優先、システムフォント、CSS Grid、`clamp()` でレスポンシブ。

### C-2. 打消し表示専用クラス（景表法準拠）

```css
/* 打消し表示は親セクションの font-size の 80% 以上を保証 */
.disclaimer {
  font-size: clamp(12.8px, 2.8vw, 16px);   /* 親 16-20px の 80% */
  line-height: 1.6;
  color: #5A5A5A;
  margin-top: 8px;
}
/* 同一画面（セクション）内配置を必須化 */
.hero .disclaimer,
.compare .disclaimer,
.scarcity .disclaimer {
  display: block;
  position: static;
}
```

### C-3. 希少性 / 運営者バッジ / Voice / 比較テーブル 他

v1計画の方針を継承、クラス名を B-1 マッピング表準拠で。

### C-4. 特商法未決定時の隠蔽

```css
[data-pending="true"] {
  display: none;
}
```

---

## Phase D: プラポリ別ページ（10分）

`lp/privacy/index.html` を v3.txt §12 準拠で個情法17/21/27/32-34/40条 全記載の版に全面書換。開示請求窓口は `privacy@example.jp`（プレースホルダ、lintで検出）。

---

## Phase E: LIFF 中間ページ + CAPI Lead（35分、v2で新規追加）

### E-1. LIFF中間 `lp/liff.html`

LINE LIFF SDK を読み、追加完了 webhook を待たずに「追加した」確度が高いタイミング（LIFF Close時）で CAPI 送信。

### E-2. Netlify Functions `netlify/functions/capi.js`

```js
// POST /.netlify/functions/capi
// 受信: { event_id, fbc, fbp, em_hash, ph_hash, event_source_url }
// 送信先: https://graph.facebook.com/v23.0/2450922202046153/events
// event_name: "Lead" (CAPIのみで発火、LP側は ViewContent のみ)
```

環境変数:
- `META_PIXEL_ID = 2450922202046153`
- `META_CAPI_TOKEN`（Pixel 専用 System User Token、Netlify環境変数に設定）

### E-3. 「今回ここまで」の線引き

- LIFF中間ページ ✅ 実装する
- Netlify Functions ✅ 実装する
- Meta Events Manager 最適化イベント変更 ❌ **別PR / 別日**
- Stage 2 計測切替 ❌ **別PR / 別日**

理由: 稼働中広告の最適化を触るのは LP反映＋72h 観測後にすべき（リスク緩和R2/R3）。

### E-4. LMES Welcome 2通構成テンプレ（v3.txt L505-521 相当）

LMES側の実装は本リポ外だが、**テンプレ JSON を本リポに同梱**して実装者（LMES運用担当）に即渡しできるようにする。

`lp/welcome_messages.json`（新規作成）:

```json
{
  "messages": [
    {
      "delay_sec": 0,
      "type": "mixed",
      "text": "友だち追加ありがとうございます！\n「無料案件キャッシュバック 代理店プログラム」運営のJUNです。\n\nいきなりのセールスや長文は送りませんのでご安心ください。\nまずは運営者の自己紹介（30秒動画）をご覧ください。",
      "attachments": [
        { "type": "video", "url_placeholder": "TO_BE_FILLED_operator_intro_30s.mp4" }
      ]
    },
    {
      "delay_sec": 30,
      "type": "quick_reply",
      "text": "面談は15分、完全無料のオンラインです。\nご都合の良い日時をお選びください。",
      "buttons": [
        { "label": "日程A", "postback": "slot_a" },
        { "label": "日程B", "postback": "slot_b" },
        { "label": "日程C", "postback": "slot_c" },
        { "label": "日程D", "postback": "slot_d" },
        { "label": "日程E", "postback": "slot_e" },
        { "label": "候補が合わない → 返信で相談", "postback": "manual_contact" }
      ],
      "sla_note": "平均返信時間 3時間以内（平日9-21時）"
    }
  ]
}
```

**DoD**: このファイルが存在し、`sla_note` と 6 つ目のフォールバックボタンが含まれている。
**実装責任**: LMES運用担当（別タスク）。本PRはテンプレ納品まで。

---

## Phase F: ガードレール（15分、v2強化）

### F-1. `scripts/check_placeholders.mjs` （Node製、Windows/Linux両対応）

```js
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const PATTERNS = [
  /\[差し替え\]/,
  /\bXXXX\b/,
  /\bXXX-XXXX\b/,
  /〇〇/u,
  /example\.(jp|com)/,
  /0000-0000-0000/,          // placeholder phone
];
const ALLOWLIST = [
  /data-pending="true"/,     // 意図的に隠す
];

const files = await glob('lp/**/*.{html,js,css}');
let errors = 0;
for (const f of files) {
  const content = fs.readFileSync(f, 'utf-8');
  // data-pending="true" セクションを除外
  const sanitized = content.replace(
    /<[^>]+data-pending="true"[^>]*>[\s\S]*?<\/[^>]+>/g, ''
  );
  for (const p of PATTERNS) {
    if (p.test(sanitized)) {
      console.error(`ERROR: pattern ${p} in ${f}`);
      errors++;
    }
  }
}
process.exit(errors ? 1 : 0);
```

### F-2. `scripts/check_meta_policy.mjs`

Personal Attributes NGワードリストで LP + copy をスキャン。

### F-3. シークレットチェック（セキュリティ補強）

```
- AIzaSy[A-Za-z0-9_-]{33}  (Gemini key)
- EAAG[A-Za-z0-9]{40,}     (Meta token)
- sk_live_[A-Za-z0-9]{24,} (Stripe-like)
- lin\.ee/[A-Za-z0-9]+$    (LINE URL leak check: warning)
```

### F-4. Netlify ビルドコマンド

```toml
# netlify.toml
[build]
  publish = "lp"
  command = "node scripts/check_placeholders.mjs && node scripts/check_meta_policy.mjs"
```

Netlify build fail = 前版継続（配信止まらない）。

---

## Phase G: ローカル検証（10分）

```bash
# 1. Lint 走らせる
node scripts/check_placeholders.mjs    # 特商法 data-pending 除外 → 通過するはず
node scripts/check_meta_policy.mjs     # Personal Attributes lint

# 2. ローカルプレビュー
cd lp && python -m http.server 8000

# 3. DevTools チェックリスト
# [ ] FV H1 モバイル 375px で折り返し確認
# [ ] 打消し表示が FV 同画面内
# [ ] CTA 4箇所すべて fbclid 付きで _fbc cookie 書込
# [ ] console エラー 0
# [ ] 特商法セクションが display:none で見えない
# [ ] Lighthouse LCP < 2.5s
```

### DoD（Definition of Done、v2 追加の5項目）

- [ ] H1 に「"売り込まない"」が含まれる
- [ ] Q7 に「3要件」「いずれも満たしません」が含まれる
- [ ] Voice 4（検討中止事例）セクションが存在
- [ ] 特商法に「5営業日以内」が含まれる
- [ ] 希少性ブロックに「月20名」「残り枠」が含まれる
- [ ] 打消し表示が FV / 比較 / 希少性 の各セクション内に存在
- [ ] `.disclaimer { font-size: clamp(12.8px, ...) }` CSS が適用
- [ ] `tracking.js` で `fbq('track','Lead')` が残っている（Stage 1）
- [ ] `tracking.js` で `fbq('track','ViewContent')` が追加されている
- [ ] `_fbc` cookie の保持コードが存在
- [ ] Q2 に「並行されている方もいます」が含まれる（「多くの方が」が残っていない）
- [ ] `docs/evidence/` ディレクトリが存在（景表法7条2項の立証資料保管場所）
- [ ] `lp/welcome_messages.json` が存在（LMES 2通構成テンプレ、Phase E-4）

---

## Phase H: コミット＆デプロイ（10分）

### H-1. atomic commit（セマンティック）

```
feat(lp): v3 HTML implementation + LIFF/CAPI tracking scaffold

Breaking down replacement_v3.txt into production code.
Changes:
  - lp/index.html: all-image → semantic HTML (h1-h6, sections, tables)
  - lp/privacy/index.html: PIPA full-compliance privacy policy
  - lp/assets/: new Gemini hero, SVG placeholders, single styles.css,
    tracking.js (Stage 1: Lead+ViewContent dual fire, _fbc persistence)
  - lp/liff.html + netlify/functions/capi.js: LIFF→CAPI Lead scaffold
  - scripts/check_placeholders.mjs + check_meta_policy.mjs (Node CI)
  - netlify.toml: lint on build

DoD passed: H1 / Q7 / Voice4 / SLA / scarcity / disclaimers all present.

Followups (separate PRs):
  - Switch optimization event to CAPI Lead after 72h observation
  - Replace placeholder 特商法 / LINE URL once collected
  - Add AVIF support in <picture>
```

### H-2. 両リポpush → Netlify自動再ビルド

```bash
git push origin main
git push revirall main
```

### H-3. Netlify ビルド確認

- SUCCESS → 配信反映
- FAIL → lint エラー出力を確認、修正して再push（前版は継続配信）

---

## Phase I: Meta広告側（15分、v2で安全化）

### I-0. 事前準備（必須、省略禁止）

```bash
# 現行 creative ID 取得 → docs/ROLLBACK.md に記録
mcp__meta-ads__get_ads --ad_id 120242221519280634 → creative_id
mcp__meta-ads__get_ad_creatives --creative_id ... → post_id, image_hash
# → docs/ROLLBACK.md に書き、commit
```

### I-1. 新creative 作成（v3文言 + 新画像）

- image_hash: 新 4:5 画像を `upload_ad_image` でアップして取得
- headline: 「"売り込まない"コミュニティ運営の、新しい選択肢」
- primary text: v3.txt の FV コピー準拠
- description: 「初期費用0・月額0・勧誘なし」
- CTA type: `LEARN_MORE`（LINEとの直接は LEARN_MORE が無難）
- link_url: 現行 LP URL に `?utm_source=meta&utm_campaign=v3_new`

### I-2. 新ad 追加（旧ad **触らない**）

- 同じ adset `120242031270160634` に新ad を追加
- **新ad だけ日予算¥1,500 の上限**（adset側では無理、campaign spend_cap 近辺で調整 or 新adset）
  → 実装案: 新adset を作って新ad入れる、日予算¥1,500固定
- 旧ad（120242031283000634, 120242221519280634）は **不触**。設定・ステータス一切変更しない

### I-3. ロールバック契約

- 新ad が3日間で旧adより悪ければ PAUSED
- 新adset ごと PAUSED でロールバック完了
- 旧ad + 旧 creative + 旧 pixel event = 全て無傷

---

## Phase J: 計測検証（10分）

### J-1. Meta Events Manager テストイベント
- https://business.facebook.com/events_manager/ → ピクセル 2450922202046153 → Test Events
- テストブラウザで LP を開く
- CTA クリック → Lead **と** ViewContent の**両方**発火を確認
- fbc cookie が付いていることを確認

### J-2. LIFF→CAPI 動作確認（Phase E実装時）

- LIFF中間ページに到達 → CAPI endpoint に POST
- Meta Events Manager で「Server」由来の Lead イベントが現れる
- event_id で重複排除（dedup）が働く

### J-3. Pipeboard 制限回避

- Pipeboard が切れているので、Meta Ads Manager で直接数字を見る
- `get_ad_insights` は meta-ads-local MCP（Pipeboard経由でない）を使う

---

## Phase K: ロールバック Runbook（`docs/ROLLBACK.md` に格納）

### K-1. LP ロールバック
```bash
git revert <commit-sha> && git push origin main && git push revirall main
# または
git reset --hard v1-image-lp && git push --force-with-lease origin main  # 緊急時のみ
```

### K-2. Meta creative ロールバック
- 新ad/新adsetを PAUSED にするだけ
- 旧ad/旧adset は不触なので**そのまま稼働継続**
- **旧 creative_id は `docs/ROLLBACK.md` に記録済**（Phase I-0 必須）

### K-3. CAPI Lead 誤発火時
- Netlify Functions `capi.js` を削除 or Return early
- Meta Events Manager で該当イベントをクリア
- Pixel の event settings はそのまま（Stage 1 互換維持）

### K-4. 配信不能時
- Netlify Site settings → Previous deploy → Rollback（1クリック）
- DNS は変更しないので `dairiten-muryoanken1.netlify.app` は生きている

---

## 成功指標（v2）

| 指標 | 現在 | 目標（反映72h後） | 目標（2週間後） |
|---|---|---|---|
| HTMLテキスト量 | ~300字 | 3,000字 | 3,500字 |
| h1-h3 数 | 0 | 20+ | 25+ |
| 画像本文テキスト数 | 15 | 0 | 0 |
| LCP | 3-5s | <2.5s | <2.0s |
| LP CVR (Lead/LPV) | 0-1.8% | 2% | 4% |
| Meta 審査 | Active | Active | Active |
| LP Health Score | 52 | 90+ | 95+ |

**計測ウィンドウ定義**: Netlify反映完了を 0h とする。72h ≒ 広告再学習安定化の目安。

---

## 未解決論点（v2で整理）

| # | 論点 | 本計画での扱い | 判断タイミング |
|---|---|---|---|
| 1 | LINE 公式 URL | lmes.jp継続、切替は url-map.json 1行 | ユーザー収集次第、いつでも |
| 2 | 特商法 実情報 | data-pending="true" で隠蔽 | 収集したら HTML側の属性除去 |
| 3 | Stage 2 計測切替 | 別PR、反映72h後判断 | Phase H成功 +72h |
| 4 | 新ad勝敗 | 並走 3日後判断 | Phase I実施 +72h |
| 5 | 顔写真 / 自己紹介動画 | placeholder継続 | 撮影したら差替 |

**ブロッキング要素ゼロ**: 全て placeholder or 隠蔽で作業継続可能。

---

## 実行順序（依存グラフ v2）

```
Pre  git tag v1-image-lp + ROLLBACK.md ひな型
 ↓
A    画像・SVG配置
 ↓
B-1  マッピング表確定
 ↓
B-2  HTML骨子 ─→ C  CSS ─→ G  ローカル確認
              ↘              ↗
               B-3 tracking.js
 ↓
D    privacy 別ページ
 ↓
E    LIFF + CAPI functions
 ↓
F    CI lint 3本
 ↓
G    ローカル検証 + DoD 10項目
 ↓
H    commit + 両リポpush → Netlify自動
 ↓ (72h観測推奨)
I    Meta新creative + 新adset 並走
 ↓ (更に72h観測)
TODO Stage 2 計測切替、Meta最適化イベント変更
```

---

## 工数見積（v2改訂）

| Phase | 当初 | 改訂 |
|---|---|---|
| A | 10 | 10 |
| B | 20 | **40** |
| C | 15 | **25** |
| D | (計画なし) | **10** |
| E | (スコープ外) | **35** |
| F | 10 | 15 |
| G | 5 | 10 |
| H | 5 | 10 |
| I | 10 | 15 |
| J | 5 | 10 |
| **合計** | **80** | **180** |

現実的には 150-180分。

---

## TODO（次PRに繰越）

1. Stage 2 計測切替（Lead停止、ViewContentのみ、Meta Events Manager 最適化イベント変更）
2. LINE公式 URL を lmes.jp → lin.ee へ
3. 特商法 実住所・電話・氏名 記入 → `data-pending` 除去
4. 運営者顔写真・自己紹介動画 撮影＆差替
5. AVIF 対応（`<picture>` に `<source type="image/avif">`）
6. Consent Mode V2（将来EU対応時）
7. 自動 E2E テスト（Playwright で打消し表示の視覚可読性）

---

以上 v2。判断待ちで作業が止まらず、稼働中広告を壊さず、100点帯に到達する設計。
