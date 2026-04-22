# LP v3 実装 実行計画 v1

**対象**: `lp/index.html` を replacement_v3.txt 準拠で全面刷新
**スタート**: v1原型（今公開されている 185 行画像LP）
**ゴール**: ライブLPが全30項目のNG→PASSに転換、計測/計測最適化/Meta審査/法令適合 すべて通る状態
**ブランチ戦略**: `main` 直接、フェーズごとに atomic commit
**対象リポ**: IKEMENLTD/revirall-meta-ads-automation + REVIRALL/muryouanken001（両pushする）
**タイムボックス目安**: 作業60-90分／Netlifyデプロイ1-2分×各push

---

## 0. 前提条件と用意が要るもの

| # | 項目 | 情報源 | 本計画での扱い |
|---|---|---|---|
| 0-1 | LINE公式友だち追加URL（lin.ee/xxxxx or line.me/R/ti/p/@xxxxx） | ユーザー | **今は lmes.jpを残す**、決まれば即差替（後述 Phase E2） |
| 0-2 | 特商法: 代表者氏名・住所・電話・メール | ユーザー | **プレースホルダ継続**、CI lintで公開ブロック |
| 0-3 | 運営者顔写真 | ユーザー | **プレースホルダ画像**（シルエット＋「撮影待ち」ラベル） |
| 0-4 | 自己紹介動画URL | ユーザー | **セクション枠を用意し後日埋込** |
| 0-5 | 提携一次代理店数・累計実績等の数値 | ユーザー | プレースホルダ `<span class="stat-placeholder">` でCI対象化 |
| 0-6 | LIFF中間ページ実装 | 別タスク | **今回はスコープ外**（Phase F でFollowupチケット化） |

→ すべて「埋まっていないこと」を可視化しつつ、埋まり次第 1 箇所差替で済むよう設計する。

---

## Phase A: ファイル準備（10分）

### A-1. 新Gemini画像を正式アセット位置へ配置

| 元（v3生成） | 新（正式配置） | 用途 |
|---|---|---|
| `lp/assets/v3/fv_5x4_1500x1200.webp` | `lp/assets/hero_v3.webp` | LP FV |
| 〃 `.jpg` | `lp/assets/hero_v3.jpg` | `<picture>` フォールバック |
| `lp/assets/v3/feed_4x5_1080x1350.webp` | `lp/assets/og_v3.webp` | og:image（4:5） |
| 〃 `.jpg` | `lp/assets/og_v3.jpg` | 〃 |

→ `v3/` サブフォルダは削除せず**履歴として残す**（ADR的扱い）
→ Meta広告用の 4:5/1:1/9:16 は `v3/` のまま広告運用で参照

### A-2. 旧画像（lp01a_*.jpg）の扱い

- 保持: フッター画像 `lp01a_14.jpg` は背景として残して OK
- 廃止: `lp01a_01.jpg`〜`lp01a_18.jpg` の中で、**本文テキストを画像化しているもの**は撤去（HTML化で代替）
- 検証: 新LPでは画像は「FV・運営者写真・装飾」のみ、本文テキスト画像は 0 を目標

### A-3. 成果物

- `lp/assets/hero_v3.{webp,jpg}` 配置済み
- `lp/assets/og_v3.{webp,jpg}` 配置済み
- 旧画像は物理削除せず参照のみ外す（ロールバック容易化）

---

## Phase B: HTML 骨子の再構築（20分）

### B-1. 新 `lp/index.html` の構造（semantic HTML）

```
<!doctype html>
<html lang="ja">
<head>
  ・ <title>, <meta description>, OGP 更新
  ・ viewport, robots=noindex,follow 継続
  ・ <link rel="preload"> で hero_v3.webp
  ・ <link rel="stylesheet" href="./assets/styles.css"> ※単独ファイル分離
  ・ GTM (GTM-P6PWGNDF) + Meta Pixel (2450922202046153) 継続
</head>
<body>
  <header>（省略可）</header>
  <main class="lp-wrap">
    <section class="hero">          ← FV: H1 + subhead + 補助3点 + CTA + 安心3点 + 打消し
    <section class="operator-badge"> ← 運営者バッジ（顔写真＋3数値）※placeholder
    <section class="empathy">        ← 共感ブロック（チェックリスト5項目）
    <section class="solution">       ← 3特徴カード
    <section class="steps">          ← 3ステップ
    <section class="compare">        ← 比較テーブル（よくある vs 当プログラム）
    <section class="voices">         ← Voice 1-4（検討中止含む）
    <section class="operator">       ← 運営者プロフィール＋自己紹介動画枠
    <section class="recommend">      ← こんな方におすすめ
    <section class="faq">            ← Q&A 全8問
    <section class="scarcity">       ← 月20名訴求＋残り枠
    <section class="final-cta">      ← 最終CTA（安心3点 再掲）
  </main>
  <footer>
    <section class="tokushoho">      ← 特商法表記（プレースホルダ継続）
    <section class="privacy">        ← 個情法準拠プラポリ（または別ページ /privacy/）
  </footer>
  <script>…計測ロジック…</script>
</body>
</html>
```

### B-2. HTMLテキスト内容

**完全に `replacement_v3.txt` の各セクション文言をHTML化**。改行はタグで明示、画像内テキストは一切使わない。`<h1>` は FV、`<h2>` は各セクション見出し、`<h3>` はカード/ステップ小見出し。

### B-3. CTA の href

**今回は暫定的に既存 lmes.jp URL を継続**。LINE直リンクが取れたら `url-map.json` 経由で一括切替可能な構造にする（現状の仕組み流用）。

### B-4. 計測コード差し替え（要注意）

現行 index.html:77-89（CTAクリック時に `fbq('track','Lead')`）を次のように変更:

```js
el.addEventListener('click', function(e) {
  // 1. フロント側は ViewContent (興味示し)
  if (typeof fbq === 'function') {
    fbq('track', 'ViewContent', { content_name: 'CTA_to_LINE' });
  }
  // 2. (将来) CAPI側で Lead を送る → 別サーバー実装
  // 3. fbclid → _fbc 保持（Safari ITP対策）
  var params = new URLSearchParams(location.search);
  var fbclid = params.get('fbclid');
  if (fbclid) {
    var fbc = 'fb.1.' + Date.now() + '.' + fbclid;
    document.cookie = '_fbc=' + fbc + '; Max-Age=7776000; Path=/; SameSite=Lax; Secure';
  }
  // 4. 遷移を 300ms 遅らせて送信完了を待つ
  var href = el.href;
  if (href) {
    e.preventDefault();
    setTimeout(function() { window.location.href = href; }, 300);
  }
});
```

**Meta側変更も必要（手動）**: Events Manager で「Lead」→「ViewContent」カスタムコンバージョン設定 or 最適化イベント変更。これは**本PR のスコープ外、別ステップで**。

### B-5. 成果物

- 新 `lp/index.html`（既存を上書き）
- 旧版は git 履歴から復元可能（バックアップファイル作らない）

---

## Phase C: CSS（15分）

### C-1. 新 `lp/assets/styles.css`

**方針**:
- モバイル優先（max-width 750px）＋ デスクトップ用にメディアクエリ
- フォント: `-apple-system, "Yu Gothic UI", "Hiragino Sans", Meiryo, sans-serif`（外部フォント不使用でLCP改善）
- カラーパレット: 既存画像に合わせベージュ（#C3AC90）＋ LINE緑（#06C755）
- CTAボタン: 緑フル幅、丸み14px、poyopoyoアニメ継続
- 安心3点マイクロコピー: 淡いベージュbackground、左アイコン`✓`
- 希少性ブロック: 薄いピンク背景、太字数字
- 比較テーブル: 2列、交互背景
- Voice カード: 角丸、シャドウ、写真placeholder円形120px

### C-2. 主要クラス

```
.hero__h1 { font-size: clamp(28px, 6vw, 42px); font-weight: 900; line-height: 1.35; }
.hero__subhead { font-size: clamp(16px, 3.5vw, 20px); line-height: 1.7; }
.cta-btn { display:block; background:#06C755; color:#fff; border-radius:14px; ... }
.safety-bullets { background:#F8F4EB; padding:16px; border-radius:8px; ... }
.scarcity { background:#FFF4ED; border:2px solid #F19B6A; ... }
.compare-table td { padding:12px; border-bottom:1px solid #E8DFD2; ... }
.voice-card { background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.06); ... }
```

### C-3. `<picture>` 要素サンプル

```html
<picture>
  <source srcset="./assets/hero_v3.webp" type="image/webp">
  <img src="./assets/hero_v3.jpg" alt="コミュニティ運営者のイメージ写真"
       width="1500" height="1200" fetchpriority="high">
</picture>
```

### C-4. 成果物

- `lp/assets/styles.css`（新規）
- `lp/index.html` から `<link rel="stylesheet">` 参照

---

## Phase D: ブランドアセット整備（5分）

### D-1. 顔写真プレースホルダ
`lp/assets/operator_placeholder.svg` を新規作成（120×120円形シルエット + 「撮影予定」ラベル）。

### D-2. Voice 用シルエットアイコン
`lp/assets/voice_avatar_01.svg` 〜 `voice_avatar_04.svg`（抽象人物図形、各色で識別）

### D-3. 自己紹介動画枠プレースホルダ
動画が未用意のため、枠＋「近日公開」テキストで暫定表示。`.video-placeholder` クラスで CSS 矩形。

---

## Phase E: CTA / トラッキング（10分）

### E-1. 今回やること（HTML側 fb tracking）
Phase B-4 の JS を index.html に仕込む。

### E-2. 今回は**やらない**（Phase F に繰越）

- LIFF中間ページ実装（サーバー側作業、別リポor Netlify Functions）
- LMES webhook → CAPI Lead送信
- Meta Events Manager の最適化イベント切替

→ これらは TODO 明記（コメント + `/docs/TODO_phase2.md` に分離）

### E-3. CTAリンクの管理

- 既存 `lp/assets/url-map.json` 方式を活用
- `utm_code` によって LINE URL 切替の仕組みはそのまま
- 具体 URL は当面 lmes.jp 継続、ユーザーから LINE直 URL 受領次第 `url-map.json` のみ編集で全差替可

---

## Phase F: ガードレール（CI / 法令）（10分）

### F-1. `scripts/check_placeholders.sh`

```bash
#!/bin/bash
set -e
FILES=(lp/index.html lp/privacy/index.html)
PATTERNS=('\[差し替え\]' 'XXXX' 'XXX-XXXX' '〇〇' 'example\.jp' 'example\.com')
ERR=0
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  for p in "${PATTERNS[@]}"; do
    if grep -qE "$p" "$f"; then
      echo "ERROR: '$p' remains in $f" >&2; ERR=1
    fi
  done
done
exit $ERR
```

→ ローカル動作を手元で確認後、commit。

### F-2. Netlify build hook

`netlify.toml` に `command = "bash scripts/check_placeholders.sh"` を足す。**プレースホルダが残ったままプッシュしても、Netlifyビルド fail で本番反映されない。**

### F-3. プライバシーポリシー

既存 `lp/privacy/index.html` を、replacement_v3.txt § セクション12（個情法17-40条網羅版）に書き換え。

---

## Phase G: ローカル動作確認（5分）

### G-1. ローカルプレビュー
```bash
cd lp && python -m http.server 8000
# → http://localhost:8000 で目視
```

### G-2. チェックリスト
- [ ] FV H1 表示、打消し表示同一画面内
- [ ] CTA 4箇所すべて存在、hrefが url-map経由で差替わる
- [ ] 計測スクリプト console エラーなし
- [ ] モバイル幅（DevTools 375px）で崩れなし
- [ ] スクリーンリーダー（NVDA等）でH1読み上げOK

### G-3. プレースホルダ lint 走らせる
```bash
bash scripts/check_placeholders.sh
# ERROR が複数出ることを確認（意図通り。埋まるまでNetlifyに出ない）
```

---

## Phase H: コミット＆デプロイ（5分）

### H-1. atomic commit

```
feat(lp): implement v3 — HTML rewrite + new hero + measurement

- Replace all-image LP with semantic HTML (h1-h6, sections, tables, lists)
- Hero image swapped to Gemini-generated hero_v3 (.webp + .jpg fallback)
- CTA link preserved but tracking event: Lead → ViewContent
- Add fbclid → _fbc cookie persistence (Safari ITP workaround)
- Add operator badge, 3 features, 3 steps, comparison table, voices,
  FAQ (8Q including Q7 structural negation), scarcity block, etc.
- Rewrite privacy policy to full PIPA compliance (arts 17,21,27,32-34,40)
- Add scripts/check_placeholders.sh CI guard
- Netlify build now fails if placeholders remain
```

### H-2. 両リポへ push

```bash
git push origin main
git push revirall main
```

### H-3. Netlify 自動再ビルド
- Netlify dashboard で ビルド SUCCESS 確認
- ビルドが fail したら placeholder lint の出力確認
- 配信URLで目視確認

---

## Phase I: Meta広告クリエイティブ差替（10分）

### I-1. 新4:5画像をMetaにアップ
Python直叩き or MCP で:
- `lp/assets/v3/feed_4x5_1080x1350.jpg` を `upload_ad_image`
- 新 image_hash 取得

### I-2. 新 creative 作成
- 既存 creative (`1955442268412358`) のコピーで、image_hash のみ差替
- copy/headline/description/CTA は v3 テキストで再作成

### I-3. 既存ad `120242221519280634` の creative を差替
- `update_ad(ad_id, creative_id=新)`
- ※ クリエイティブ更新は**新post生成**になるので、エンゲージメント履歴はリセットされる点に注意
- 代案: 新ad を同 adset に追加し、旧adを PAUSED

### I-4. 判断基準
- 現状のadが ACTIVE で初Lead出始めなら、**古adはPAUSEにせず並走A/B**
- リセットOKなら creative だけ入替でシンプル
- **推奨**: 新ad追加→ACTIVE→3日様子見→勝者残す

---

## Phase J: 計測の検証（5分）

### J-1. Meta Events Manager でテストイベント
- https://business.facebook.com/events_manager/ → ピクセル `2450922202046153` → Test Events
- テストブラウザURLで LP を開く（fbclid付き）
- CTA クリック → ViewContent 発火を確認
- fbp/fbc cookie が送信されているか確認

### J-2. GTM dataLayer
- GTM-P6PWGNDF で新イベント変数を見ているか
- 既存タグの想定動作が壊れていないか

---

## Phase K: ロールバック計画

ハイリスク箇所と戻し方:

| リスク | 影響 | 戻し方 |
|---|---|---|
| Lead→ViewContent変更で学習悪化 | 最適化が遅れる | `git revert <commit>` で push、Meta側も最適化イベント再設定 |
| 新LPでCVR更に低下 | 広告費ムダ | Phase H のcommitを revert、アセットは残す |
| Netlify build fail | 本番止まる（前版配信継続） | lint エラー修正 or placeholder 埋めて再push |
| CTA URL が間違っていた | 離脱 or 誤誘導 | `url-map.json` を1行修正で即復旧 |

---

## 計測可能な成功指標

| 指標 | 現在 | 目標（2週間） |
|---|---|---|
| HTMLテキスト量 | ~300文字（法的部分のみ） | 3,000文字以上 |
| H1-H3 数 | 0 | 合計 20+ |
| 画像でテキスト表示している数 | 15 | 3以下（FV + 運営者 + 背景装飾のみ） |
| LCP (Lighthouse) | 3-5秒 | <2.5秒 |
| LP CVR (Meta Lead / LPV) | 0% 〜 1.8% | 3〜5% |
| Meta審査ステータス | 配信中 | 継続配信（リジェクトなし） |
| Landing Page Health Score | 52/100 | 90+ |

---

## TODO（今PRのスコープ外、別チケット化）

1. LIFF中間ページ実装＋CAPI Lead送信（サーバーサイド）
2. LINE公式友だち追加URL を lin.ee へ切替
3. 運営者顔写真・自己紹介動画 撮影＆差替
4. 特商法 実住所・電話・氏名 記入
5. 提携数・実績数 実数値記入
6. Meta Events Manager で最適化イベント変更（Lead → カスタムLead_CAPI）
7. Consent Mode V2（将来EU対応時）

---

## 実行順序（依存関係）

```
A-1 画像配置
  └→ B-1 HTML骨子
        └→ B-2 テキスト流し込み
              └→ B-3 CTA href 配線
                    └→ B-4 計測JS埋込
                          └→ C-1 CSS作成
                                └→ D-x アイコン等placeholder
                                      └→ E-x TODO分離
                                            └→ F-x CI/ガード
                                                  └→ G-x ローカル確認
                                                        └→ H-x commit&push
                                                              └→ Netlify自動
                                                                    └→ I-x Meta差替
                                                                          └→ J-x 計測検証
```

所要合計: 60-90分（並行なし、1人作業）。Claude が続けてやる場合は半分以下で可能。

---

## 未解決論点（ユーザー判断要）

1. **LINE公式友だち追加 URL を今回取得するか？**
   - Yes → Phase E-3 で即 url-map.json に反映、lmes中継削減
   - No → プレースホルダ継続、後日1行差替

2. **Meta広告 既存adの creative をどう差替えるか？**
   - a) 既存adを update（post再生成、履歴リセット）
   - b) 新adを追加して並走（推奨）

3. **特商法の実住所・電話を今回入れるか？**
   - Yes → ユーザーから情報取得
   - No → プレースホルダ継続、Netlify build は lint fail → **事実上本番反映されない**
   - **警告**: No 選択の場合、今回push しても Netlify build fail で**何も変わらない**ので、placeholder lint を後で足す段取りにしないと Phase H で止まる

---

以上。v1 は「ほぼ何も決め打ちしない、ユーザー判断フック多数」型の計画書。
