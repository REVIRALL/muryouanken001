# LP v4-monitor-community

**Generated:** 2026-05-18
**Base:** v3-monitor-community (R1〜R6 修正済 / 5観点並列レビュー平均96.4到達後の最新)
**Version:** v4.0.0
**Messaging:** P1疲弊×P6向上心 並列レーン + 画像多用

---

## v3 → v4 変更点

### 1. P6(向上心型)レーンを反映済の最新コンテンツ
- v3-monitor-community のR6時点の HTML / Lstep CSV / persona.json / segments.json をコピー
- Empathy 8項目(P6項目「打ち手は十分やっている。ただ、どれが効いてどれが効いていないかを切り分けられない」追加済)
- Block 3 に「3つの構造軸(顧客選定・タイミング・順序)」のロジカル説明ブロック
- Block 11 Final にサブコピー(「あと一手の正体を3軸で言語化」)
- FAQ Q8 「すでに色々試してきました。それでも有用?」
- Lstep CSV 71行(cluster_optimization + Branch K 12行追加版)

### 2. 画像多用化(v4 新規追加)
- **Hero floating cards** : `benefit-card-visual.png` + `dashboard-benefit-v3.jpg` を 2カードグリッドで表示(Hero右側ポートレート下)
- **Block 3 problem-deep** : 「3つの構造軸」ブロックに `diagram-shift.png` を左側アイコン配置
- **Block 4 step cards** : 各stepカード上部に `method-1-v2.png` / `method-2-v2.png` / `method-3-v2.png` を 16:9 で配置
- **Block 7b Track Record** : `owner-working.png` を中央配置(JUN現在地ビジュアル)
- **Block 8 Peek 3カテゴリ** : 各カード上部に金融(青)/美容(オレンジ)/体験(ベージュ)のグラデ背景+大型SVGアイコンを 4:3 で配置
- **Empathy gift PDF** : `benefits-flatlay.png` を左カラムに配置、3:1 グリッドで視覚的引き締め

### 3. メタデータ更新
- `<title>` `<canonical>` `og:url` `og:image` `og:site_name` JSON-LD 全て v3 → v4
- footer version表記: `v3.0.2 / messaging-v3 (福利厚生軸)` → `v4.0.0 / messaging-v4 (P1疲弊×P6向上心 並列レーン+画像多用)`

---

## 注意事項

### URL置換 TODO
- `https://lin.ee/PLACEHOLDER` が7箇所残存(LP 6 + Lstep day3 1)
- 公式LINE短縮URL確定後に一括置換
- CTA毎の utm_campaign は分離済(v2r3_day0_a〜j, v2r4_follow_day60, v2r6_day0_k_audience/timing/sequence/all)

### 未対応の追加画像生成案(banana skillで生成可)
本v4は既存assets画像を最大活用しているが、以下は新規生成で更に画像多用化できる:

1. **Empathy 8項目用 小サムネ画像 (8枚)** — 各カードに1枚ずつ感情アイコン的イラスト
2. **Block 3 「3軸マトリクス」専用インフォグラフィック** — 現状は diagram-shift.png 流用
3. **Block 8 Peek 金融/美容/体験 実写風画像 (3枚)** — 現状はSVGアイコン+グラデ
4. **testimonial-4 (Sさん)専用顔写真** — 現状はイニシャル「S」+本人非公開
5. **Block 6 各testimonialの「結果ビフォー/アフター」キャプチャ風画像 (3-4枚)**

これらを生成する場合は banana skill (`/banana`) で個別依頼。

---

## デプロイ
- リポジトリ: REVIRALL/muryouanken001
- パス: `lp/v4-monitor-community/`
- 公開URL想定: `https://revirall.jp/lp/v4-monitor-community/`

## 関連
- v3 (R6完成版): `lp/v3-monitor-community/`
- Lstepシナリオスプシ: https://docs.google.com/spreadsheets/d/1yAJr4EBeYvp_RpeqfoXLP97B0B6rhLm-cqqo1EMxyjI/edit
