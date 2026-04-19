# REVIRALL Meta広告 現況ステータス

**最終更新**: 2026-04-19 15:52 JST

> 💡 このファイルは「今どうなっているか」の一次情報。新しいセッションで Claude を立ち上げたとき、このURLを貼るだけでAIは最新状態を把握できる:
> https://github.com/IKEMENLTD/revirall-meta-ads-automation/blob/main/STATUS.md

---

## 🟢 配信ステータス: **稼働中**

| 階層 | ID | 状態 |
|---|---|---|
| アカウント | act_1215978840164411 | 🟢 ACTIVE (AMEX自動課金) |
| Campaign | 120242015802140634 | 🟢 ACTIVE |
| AdSet | 120242031270160634 | 🟢 ACTIVE |
| Ad メリット訴求v2 🏆 | 120242031283000634 | 🟢 ACTIVE |

**配信開始**: 2026-04-19 15:44 JST（再開）

## 💰 予算設定

| 項目 | 値 |
|---|---|
| 日予算 (AdSet) | ¥5,000 |
| spend_cap (Campaign) | ¥394,000（累計93,632 + 当月+¥300k） |
| 想定月額 | ¥100,000〜¥150,000 |
| 累計消化 | ¥93,632（再開前まで） |

## 🎯 クリエイティブ戦略

**1個だけ運用**: **メリット訴求v2**（Creative ID 944828921851151）
- タイトル: 「今のコミュニティに収益をプラス」
- 本文: コミュニティ運営者・サロン主宰者訴求
- 過去実績（小サンプル）: CPM¥1,036 / LPV¥243 / link→LPV 90%

**停止中**:
- 動画CR001（120242031284610634）PAUSED
- 痛み訴求v2（120242031280060634）PAUSED

## 🎛️ 配信設定

| 項目 | 値 |
|---|---|
| Campaign objective | OUTCOME_LEADS |
| Optimization goal | OFFSITE_CONVERSIONS |
| custom_event_type | LEAD |
| Bid strategy | LOWEST_COST_WITHOUT_CAP |
| Pixel | 2450922202046153 (REVIRALL_Pixel) |
| Page | 1119702451216065 (クローズドasp運営事務局) |
| 年齢 | 30-50歳 |
| 地域 | 日本 |
| Interests | 中小ビジネス / スタートアップ / 起業 / Online community |
| 配置 | FB Feed + IG Stream + IG Story（Reels除外） |
| Attribution | CLICK_THROUGH 7日 |

## 🏗️ LP状態

- URL: https://dairiten-muryoanken1.netlify.app/
- privacy: /privacy/ 実在
- FV直下CTA ✅ デプロイ済
- Pixel発火 ✅ Playwright検証済（PageView + Lead両方）
- 注意: **旧Pixel 1825532134811143 がGTM経由で二重発火中**（後日対処）

## 📋 保留中のタスク

### ユーザー側
- [ ] Claude Code 再起動（meta-ads-local MCP有効化）
- [ ] TOS承諾3本
  - Lead Gen TOS: https://www.facebook.com/legal/leadgen/tos
  - Custom Audience TOS: https://www.facebook.com/customaudiences/app/tos/?act=1215978840164411
  - Pipeboard再接続: https://pipeboard.co/connections
- [ ] Instagramビジネスアカウント連携

### Claude側（MCP経由でできる）
- [ ] 24時間後: Lead発火の実集計確認
- [ ] 48〜72時間後: CPL算出、スケール判断
- [ ] TOS承諾後: カスタムオーディエンス3本作成
- [ ] Lead Gen TOS承諾後: Instant Form用adset作成 (form_id=952326073949935)

## 📊 期待値 vs 要警戒ライン

### 楽観〜中間シナリオ
| 期間 | impression | click | Lead | CPL |
|---|---|---|---|---|
| 24h | 500〜1,500 | 5〜15 | 1〜5 | ¥1,000〜¥5,000 |
| 7d | 5,000〜15,000 | 50〜150 | 30〜50 | ¥700〜¥3,000 |
| 30d | 30,000〜60,000 | 300〜600 | 150〜200 | ¥500〜¥2,000 |

### 警戒ライン（越えたら即停止）
- 24時間 spend < ¥500 → 配信問題
- 48時間 Lead = 0 → Pixel or LP issue再調査
- CPL > ¥6,000 → クリエ or ターゲ見直し

## 🔗 関連リンク

- GitHub: https://github.com/IKEMENLTD/revirall-meta-ads-automation
- LP: https://dairiten-muryoanken1.netlify.app/
- Ads Manager: https://adsmanager.facebook.com/adsmanager/
- Pipeboard: https://pipeboard.co/connections

---

## セッション履歴

- 2026-04-16: Claude Ads導入、LP構築、キャンペーン初期構築（session 1-2）
- 2026-04-18: 初動分析、PDCA、MCP設定、敗者停止（`logs/2026-04-18-session.md`）
- 2026-04-19: Pipeboard脱却→セルフホストMCP、リポジトリ化、2巡レビュー、配信再開（`logs/2026-04-19-session.md`）
