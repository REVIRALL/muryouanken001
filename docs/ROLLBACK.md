# ROLLBACK Runbook

LP v3 実装（2026-04-22）で何か壊れたときの戻し方。

## 0. 直前の稼働状態スナップショット（Phase Pre 実行時点）

**Git tag**: `v1-image-lp` — 実装前の原型（画像LP、CVR 0-1.8%）

**Meta 広告アカウント**: `act_1215978840164411` (REVIRALL)

**Campaign**: `120242015802140634` 無料案件代理店001（OUTCOME_LEADS、ACTIVE、spend_cap ¥394,000）

**Ad Set**: `120242031270160634` 代理店001_ブロード_CV最適化（ACTIVE、daily_budget ¥5,000）
- targeting: 30-50歳、JP、4インタレスト、FB Feed + IG stream/story
- optimization_goal: OFFSITE_CONVERSIONS
- promoted_object: pixel 2450922202046153, custom_event_type LEAD

**配信中 Ads**:
| Ad ID | Name | Creative ID | Status |
|---|---|---|---|
| 120242031283000634 | メリット訴求v2_CV最適化 | 944828921851151 | ACTIVE |
| 120242221519280634 | 新選択肢v3_CV最適化 | 1955442268412358 | ACTIVE |

**PAUSED Ads**（参考）:
| Ad ID | Name | Creative ID |
|---|---|---|
| 120242031284610634 | 動画_代理店CR001_CV最適化 | 3963462027287439 |
| 120242031280060634 | 痛み訴求v2_CV最適化 | 26636234776010818 |

**Pixel**: 2450922202046153 (REVIRALL_Pixel)
**Facebook Page**: 1119702451216065 (クローズドasp運営事務局)

---

## 1. LP ロールバック（Netlify反映版）

### 軽度（commit単位で戻す）
```bash
cd revirall-meta-ads-automation
git log --oneline -10                     # 問題のあるcommitを特定
git revert <commit-sha>                   # 反転commit作成
git push origin main
git push revirall main
# → Netlify 自動で前版をビルド&配信
```

### 重度（v1原型に完全復旧）
```bash
git reset --hard v1-image-lp
git push --force-with-lease origin main
git push --force-with-lease revirall main
```
※ `--force` を使うので、他の未push変更がある場合は先に退避

### Netlify ダッシュボードから直接
Netlify site → Deploys → Previous deploy → **「Publish deploy」** ボタン 1クリック
（gitを触らずに配信だけ戻す、最速）

---

## 2. Meta 広告 ロールバック

### 原則
本PR（LP v3実装）では **Meta 広告側は一切触らない**。したがって、上記 稼働中 Ads / Adset / Campaign / Pixel 設定は**すべて無傷のまま維持**される。

### もし Phase I（新adset/新ad 追加）を実行した場合の戻し方
```
新 adset を PAUSED にする
→ 新 ad 自動 PAUSED
→ 旧 adset 120242031270160634 は不触なので配信継続
```

Meta Ads Manager で:
- Ad Sets タブ → 新adset 選択 → 状態 PAUSED

### 学習データを守る
既存 Pixel event（Lead）は維持、LP側では `fbq('track','Lead')` を**削除しない**（Stage 1 計測仕様）。

---

## 3. CAPI ロールバック

Netlify Functions `netlify/functions/capi.js` が誤動作する場合:
```bash
git rm netlify/functions/capi.js
git commit -m "revert: disable CAPI function"
git push origin main
```

Meta Events Manager で重複イベントが記録されていたら、Pixel詳細 → Event debugging で状態確認。

---

## 4. Pipeboard MCP 制限到達時

Pipeboard 無料枠の週次制限に到達した場合:
- **代替1**: `meta-ads-local` MCP（セルフホスト、env.META_ACCESS_TOKEN使用）
- **代替2**: Meta Ads Manager Web UI 直接参照
- **代替3**: Meta Marketing API 直叩き（`scripts/` に Python 例あり）

---

## 5. 連絡先

トラブル時の判断者: JUN（運営者）
本 Runbook 管理: REVIRALL/muryouanken001 repo オーナー

---

*最終更新: 2026-04-22（LP v3 実装 Phase Pre）*
