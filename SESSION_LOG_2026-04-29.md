# 作業ログ & 次のアクション (2026-04-29)

## 本日実施したこと

### 1. Meta広告 直近4日分析
| 日付 | 消化 | Imp | Click | CTR | CPM | LPV | LPV率 | Lead | CR | ROAS |
|---|---|---|---|---|---|---|---|---|---|---|
| 04-26 | ¥5,419 | 724 | 22 | 3.04% | ¥7,485 | 18 | 82% | 0 | 0 | 0 |
| 04-27 | ¥6,100 | 742 | 21 | 2.83% | ¥8,221 | 9 | 43% | 1 | 2 | 2.13 |
| 04-28 | ¥4,625 | 610 | 19 | 3.11% | ¥7,582 | 8 | 42% | 1 | 2 | 2.81 |
| 04-29(途中) | ¥6,434 | 778 | 22 | 2.83% | ¥8,270 | 13 | 59% | 3 | 2 | 2.10 |

- アカウント: REVIRALL (`act_1215978840164411`)
- 稼働キャンペーン: `120242015802140634` 無料案件代理店001 (OUTCOME_LEADS)
- 稼働広告セット: `120242031270160634` 代理店001_ブロード_CV最適化
- ターゲ: JP / 30-50歳 / 興味(中小ビジネス・スタートアップ・起業・Online community) / FB+IG feed/stories

### 2. LP v2 確認結果（C:\Users\ooxmi\Downloads\無料案件代理店LP\v2）
- Pixel ID: `2450922202046153`
- Lead/CompleteRegistration実装は正常動作（4/27からCV計上開始）
- 問題: **PageView発火が fbevents.js onload待ち** → CTA即押しユーザーでLPV未計上
- これがLPV率42%-59%の主因

### 3. 実施した修正

#### a) Meta広告 日予算アップ
- 広告セット `120242031270160634` daily_budget: ¥5,000 → ¥10,000
- 実施時刻: 2026-04-29 11:01 JST
- 自動チャージ有効（残高枯渇リスクなし）
- 学習リセット発生の可能性あり（数日CPA変動許容）

#### b) LP v2 PageView発火修正
- ファイル: `lp/v2/index.html` line 30-66
- 変更内容: `s.onload` 内のinit/PageView発火 → スタブキューに即積み方式へ
- ローカルパス: `C:\Users\ooxmi\Downloads\無料案件代理店LP\v2\index.html`
- リポジトリ: REVIRALL/muryouanken001
- commit: `d2fa991`
- push完了: 2026-04-29
- デプロイ: Netlify (`dairiten-muryoanken1.netlify.app`) auto deploy

#### 修正コード差分
```diff
-  // Pixelスクリプト読込関数
+  // Pixelスクリプト読込関数（onload待ちせず init/PageView をスタブキューに即積む）
   window.__loadFbq = function(){
     ...
-    s.onload = function(){
-      fbq('consent', 'grant');
-      fbq('init', '2450922202046153');
-      fbq('track', 'PageView');
-    };
   };

   fbq('consent', initialConsent);
   if (initialConsent === 'grant') {
+    // fbevents.jsのロード完了を待たずキューに積む(ロード後にqueueから自動消化)
+    fbq('init', '2450922202046153');
+    fbq('track', 'PageView');
     window.__loadFbq();
   }
```

---

## 次にやるべきこと（優先度順）

### 【最優先・今週中】

#### 1. LPV回復モニタリング
- 4/30 と 5/1 の `landing_page_view` 数値をチェック
- 期待値: LPV率 80%超に回復
- もし戻らなければ → Pixel Helperでブラウザ実機検証

#### 2. CAPI（Conversion API）連携
- 現状はブラウザPixelのみ → iOS/AdBlocker/InApp等で20-30%取りこぼし
- Stape または Meta CAPI Gateway 設置
- LP側のeventID付きdedup実装は完了済み → サーバー受信先を作るだけ

#### 3. 高品質シグナル送信（EMQ向上）
- 現在送信: utm_code, origin, value, currency
- 不足: em(email), ph(phone), fn/ln, fbp, fbc, client_user_agent, client_ip
- LINE誘導前にメール/電話の任意入力を1ステップ追加

### 【高優先・来週】

#### 4. 真のCV送信（LINE登録完了→CAPI Lead）
- 現状: CTAクリック時点でLeadとCR発火 = ノイズ多い
- 改善: LINE Webhook で「友だち追加完了」検知 → CAPIで本物のLead送信
- 効果: CPAが実数値化、最適化精度UP

#### 5. クリエイティブ多様化
- 現状: 単一広告（推測） → 疲労リスク
- 投入案: UGC風縦動画15-30秒×2本 + カルーセル1本 + 静止画フィード2本
- 週次でCTR/CPA下位を停止、上位を残すローテ運用

#### 6. ファネル中間イベント追加
- Quiz_Q1_View / Quiz_Complete / CTA_View の3点
- 離脱ポイント可視化 → CRO施策の効果測定可能に

### 【中優先・2週間以内】

#### 7. Lookalike / Advantage+ 追加
- LINE登録者リストCSVアップロード → 1-3% Lookalike作成
- 別キャンペーンでテスト配信
- Advantage+ Audience も別アドセットでABテスト

#### 8. 配置別最適化
- `breakdown=publisher_platform,platform_position` で各配置のCPA確認
- Audience Networkは大抵切ったほうが良い

#### 9. Retargeting キャンペーン新設
- LP訪問7日以内 × LINE未追加 オーディエンス
- 別訴求（Q&A・実例）で追撃 → CV全体の20-30%上乗せ期待

#### 10. キャンペーン構造CBO化
- 現状1キャンペーン1アドセット → 拡大時に予算配分柔軟性なし
- 推奨: Campaign A(Advantage+) / B(LAL) / C(Interest) / D(Retarget) のCBO構成

### 【中優先・LP本体】

#### 11. 信頼性セクション増強
- 実績数字（紹介件数、稼働代理店数、平均月収）
- 顔出し代表者・社名
- 第三者ロゴ（取引先・メディア）
- 実名/イニシャル登録者の声

#### 12. ヒートマップ導入
- Microsoft Clarity（無料）or Hotjar
- モバイル離脱ポイント可視化

### 【中長期】

#### 13. UTM標準化
- 現状 `utm_code` のみ → `utm_source/medium/campaign/content/term` 5階層へ
- GA4 + Looker Studio 連携でファネル統合

#### 14. LINEステップ配信→深層CV
- LINE登録後7日のステップ配信で本コンバージョン捕捉
- value設定を「登録¥6,000」→「初回紹介¥30,000」へ昇格

---

## 観察すべきKPI（明日以降）

| 指標 | 現状 | 目標 |
|---|---|---|
| LPV率 | 42-59% | 80%以上 |
| CPM | ¥7,500-8,300 | ¥6,000台 |
| CV件数(CR)/日 | 2件 | 5件以上 |
| CPA(CR) | ¥4,036 | ¥2,500以下 |
| ROAS | 2.10 | 3.0以上 |
| CV週次累計 | 8件想定 | 50件超(学習脱出) |

---

## メモ
- 残高自動チャージ有効 → 配信停止リスクなし
- 学習リセット可能性あり（予算2倍）→ 2-3日は数値変動許容
- CRの真贋（実LINE登録か）はLINE管理画面で要確認
