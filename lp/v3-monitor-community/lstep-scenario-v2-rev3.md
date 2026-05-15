# LStep Scenario v2 — 「とにかく面談に来させる」設計 (rev3 / Round 2統合版)

**Generated:** 2026-05-14
**Reviews:** 7観点 × 2 Round (CRO/Behavioral/Compliance/Empathy/UX/Architecture/Adversarial)
**Round 1 平均:** 61.4 → **Round 2 平均:** 81.6 → **Round 3 目標:** 平均97+ (各観点95+)
**Target:** MLM/コミュニティ運営の組織伸び悩みリーダー (45-54歳女性メイン)
**Offer:** JUN本人が1時間まるごと無料コンサル / 整理メモを5営業日以内に送付 / 今後もコンサル代¥0
**Goal:** 友追加→Zoom面談予約→出席→整理メモ送付までの完全動線

---

## 0. 設計思想 (Round 2統合)

### P1. 面談まで最短2ステップ + 摩擦最小
Welcome → 互恵性物理先出し(PDF配布) → 同意取得 → 自己開示 → Q1クラスタ → 副質問 → 共感ブランチ → 予約。**「予約まで90秒以内」設計**。

### P2. ターゲット独白7項目すべてに1対1呼応
persona.json L13-21 の独白7項目を、Q1クラスタ→副質問の二段で取りこぼしなく捕捉。

### P3. Cialdini互恵性「予告」ではなく「物理先出し」
Step1で**チェックリストPDF同時配布**。心理的負債を物理的に発生させてからCAPI同意を求める順序(Round 2 Behavioral P0-1)。

### P4. 整理メモ¥0持ち帰り、ただし「必ず」→「5営業日/例外条項」
「必ず」「無条件」確約は景表法5条1号 優良誤認リスク(Round 2 Adversarial NEW-C)。SLA明示+例外条項+30分追加コンサルは月10件上限。

### P5. No-show 5段リマインド (個別URL前提)
予約完了 / 前日21:00 / 当日2H前 / 当日10分前 / 不参加+30分。**Zoom URLはTカレ+Zoom OAuth連携で個別発行、待機室はZoom側強制ON**。

### P6. 規約セーフティ - 配信前提Gate条件化
**運用開始の必須前提条件 (Gate)**:
1. ✅ 連鎖販売非該当ポジペーパー(顧問弁護士サイン入PDF)完成
2. ✅ LP `/legal/scta` 特商法表記ページ実装
3. ✅ LP `/legal/privacy` プライバシーポリシー更新(Meta米/Zoom米/GCS米/line_user_id/pain_tag/IP)
4. ✅ 利用規約v2 (秘密保持・二次配布禁止・損害賠償の予定・準拠法・専属管轄) PDF
5. ✅ testimonial 1/2/3 書面同意書(掲載媒体/期間/撤回手順/記載範囲)
6. ✅ 不実証広告対策エビデンス内部資料(2018-2025関与コミュニティ実数集計)
7. ✅ 危機対応SOP(SNS炎上/行政問合せ/弁護士contact)別文書
8. ✅ バーチャルオフィス契約(JUN自宅住所と本店所在地分離)

**上記未完了時は配信停止**。 §10 で詳細チェックリスト。

### P7. リエンゲージ3回(Day1/Day3/Day7) — Day7「最後」表現は完全撤廃
「最後」表現は虚偽性指摘(Round 2 Adversarial)→「ここまで何度かご案内をお送りしました。今後はメッセージをお送りしません」型に書換。

### P8. 「結局営業」排除 — Zoomアジェンダ
**45-50分「REVIRALL紹介」を削除**。提案は来訪者明示質問時のみ3分以内。

### P9. 家族バレ防止
Step 0で**LINEプレビュー設定ガイドを最初に提示**(Adversarial防御策6)。

### P10. JUN個人保護 + 物理運用負荷管理
- 整理メモPDF: 透かし(`{{user_id}}` + 不可視stego)+ 二次配布禁止規約同意
- Zoom録画禁止: 入室時10秒静止表示「録画/録音禁止・発見時損害賠償」
- 30分追加コンサル: 月10件上限・先着順明記
- 清書アシスタント1名+JUN最終承認のフロー(NDA締結)
- 危機対応SOP・バーチャルオフィス完備

### P11. peak-end 体験設計 (Round 2 Behavioral P0-4)
- **peak**: 前日21:00「明日のこの1時間が、3年後あなたが振り返って『あの日決めて良かった』と言える1時間に」(vivid future self priming)
- **end**: 面談切断後60秒以内のJUN手書き風個別メッセ(closure ritual / van Boven-Gilovich 2003)

---

## 1. 表現ルール (Empathy/Compliance反映)

### NG/OK語彙表

| カテゴリ | NG | OK |
|---------|----|----|
| 体育会系 | 「ガチ」 | 「本気で」「まるごと」「ちゃんと」 |
| ベンダー語 | 「KPI」「主成分」「コア」「打ち手」「言語化」「設計図」「地図」「出口設計」 | 「いちばん大事な」「真ん中」「やってみること」「言葉にする」「やり方の絵」「全体像」「投稿のつながり」 |
| 数値主張 | 「総会員10万人」「代理店600社」単独 / 「8割が経験」「数百人」 | 「私が2018-2025年に関わった複数コミュニティの延べ累計です(合同会社リバイラル単体ではありません)」/ 「お会いしてきた多くの方が」(主観留保) |
| 効能保証 | 「絶対」「必ず」「保証」「3ヶ月で15名増えました」 | プロセス保証のみ:「打ち手を一緒に出します」「整理メモをお渡しします」 |
| 希少性 | 「残り3枠」固定 | 「JUN本人によるコンサルのため、週4-6枠が物理的上限です」(事実陳述) |
| 終了通知 | 「これで最後です」「最後の通告」 | 「今後はしばらくメッセージをお送りしません」 |

### 人称運用ルール

| シーン | 表記 |
|--------|------|
| 初対面/名乗り (Step1のみ) | 「坂本純一(JUN)」 |
| Day1動画/30日後フォロー等の通常文脈 | 「JUN」 |
| 自己開示/共感ブランチ | 「私」 |

**実装後 grep で揺れチェック必須**。

### CTA文言4パターン (脱テンプレ・Round 2 Empathy P0-1反映)

```
A. 「1時間、JUNと話してみる(0円)」          ← 短い・主体的・無料明示  デフォルト
B. 「日程だけ先に見てみる」                  ← 低コミットメント
C. 「整理メモが欲しい方はこちら(無料面談)」  ← 互恵性駆動型
D. 「来週以降の空き枠を見る」                ← 緊急感ゼロ・受動形
```

ブランチごとに使い分け(後述 §4)。

---

## 2. 法定表記フッター (Round 2 Compliance P0-1)

全配信末尾必須。リッチメニューにも常設(「特商法表記」「プライバシー」「配信停止」3ボタン+面談予約者向け動的差替で「予約変更」「Zoom入室」「JUNへメッセージ」)。

```
──────────────
事業者: 合同会社リバイラル / 代表社員 坂本 純一
特定商取引法に基づく表記: https://[LP_DOMAIN]/legal/scta
プライバシーポリシー: https://[LP_DOMAIN]/legal/privacy
利用規約: https://[LP_DOMAIN]/legal/terms
配信停止: メニュー「配信停止」または当アカウントブロックでいつでも可
──────────────
```

---

## 3. セグメント設計 (2段)

| セグメント | 判定 | 戦略 |
|-----------|------|------|
| **MAIN** (推定83%) | Q1クラスタAorBorCで `pain_*` 選択 | Day0即予約導線、Day1/3/7リエンゲージ3回 |
| **FOLLOW** (推定17%) | Q1クラスタD「これから始める」+副質問でメンバー3名未満 | チェックPDF送付+月1メルマガ、Day90で再Q1 |

副質問でメンバー3名以上選択時はMAIN昇格。

---

## 4. Day 0 メインフロー (Step順序 = 互恵→同意→Q1)

### Step 1 (0sec) — Welcome + 自己紹介 + PDF互恵性先出し + プライバシーガイド

順序逆転: 「同意取得が先」を「**PDF配布が先**」に。互恵性物理発動後に同意を求める順序(Round 2 CRO+Behavioral)。

文字数圧縮(Round 2 UX P0-1 反映、105字程度):

```yaml
- step: 1
  delay: 0sec
  type: flex_message  # ★Round 3 UX反映: 文字長圧縮+Flex化
  flex_bubble:
    body:
      text: |
        はじめまして、坂本純一(JUN)と申します。

        まずは「チーム健康度7項目チェック」(A4 1枚)を
        お先にどうぞ。面談予約されない方でも、これだけは
        お持ち帰りください。
      file_button:
        label: "チェックリストをダウンロード"
        url: "{{checklist_pdf_url}}"  # GCS公開URL or LP配下静的URL
    footer:
      skip_button:  # ★Round 3 CRO P0-R4-1反映: 即予約バイパス
        label: "Q1は後で。日程だけ先に見る"
        url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&pain_tag=unknown&utm_campaign=v2r4_skip_quiz"
        ui_emphasis: link_small  # secondary 視覚扱い

- step: 1a  # ★Round 3 UX P0-R4-2反映: プレビュー注意を別メッセに分離
  delay: 8sec_after_step1
  type: text
  content: |
    ※ご家族と同じスマホを共有されている方は、LINEの通知
    　プレビューをOFFにしておくと安心です。
    　設定→通知→LINE→プレビュー表示「しない」
  footer_required: true
```

### Step 1.5 (15sec) — CAPI同意 (外国名明記・denied時完全停止)

Round 2 Compliance P0-3 + Adversarial NEW-A 反映:
- 提供先国名明記(Meta社/米国Meta Platforms Inc., Zoom社/米国Zoom Communications Inc., GCS/米国Google LLC)
- denied時は **以降一切のCAPI送信を行わない**(external_idハッシュも送信しない)

```yaml
- step: 1.5
  delay: 15sec
  type: flex_message  # ★Round 3 UX P0-R4-1反映: text_with_button→Flex (UIヒエラルキー物理実現+大本文許容)
  flex_bubble:
    body:
      text: |
        続いてのご案内の前に、1点だけお願いします。

        本サービスでは、ご登録情報の一部を効果計測のため
        米国の Meta社/Zoom社/Google社 へ送信します
        (個情法27/28/31条準拠、詳細はプライバシーポリシー)。

        同意なしでも、ご相談・面談は同じようにご利用いただけます。

      details_link:
        label: "詳しいデータ取扱について"
        url: "https://[LP_DOMAIN]/legal/privacy#capi"

      utility_terms_link:
        label: "利用規約v2(秘密保持・二次配布禁止)に同意"
        url: "https://[LP_DOMAIN]/legal/terms"

    footer:
      button_primary:  # style: primary 大
        label: "同意して進む"
        action: set_tag(consent_capi_granted, terms_v2_agreed)
        next: step_2
      button_link:  # style: link 小(視覚ヒエラルキーで second 化)
        label: "同意せず利用(配信は続けます)"
        action: set_tag(consent_capi_denied)
        next: step_2

  footer_required: true
```

**重要**: 以降 `tag_consent_capi_denied` のユーザーには**Pixel/CAPI両方とも一切発火しない**(§9.4 で詳細)。

### Step 2 (15sec) — 自己開示 (失敗→再起、規模言及最小化)

Round 2 Empathy P0-2 + P1-6 反映: 規模アピール削除、再起ストーリー軸に。文字数圧縮(190字)。

```yaml
- step: 2
  delay: 15sec
  type: flex_message  # ★Round 3 UX反映: 文字長圧縮+本文/留保分離
  flex_bubble:
    hero:
      image: ./assets/jun-portrait-400x300.png
    body:
      text: |
        私自身、2020年春に自分のチーム600名を3ヶ月で360名まで
        一気に減らした時期がありました。配信画面を開けない日が
        3週間続きました。

        そこから紹介に頼らずメンバーに恩恵を返す形に組み直して、
        いまは別のコミュニティ運営者の方々の伴走をしています。

        その遠回りで見えた話を、あなたのチームに合わせて
        1時間まるごとお伝えします。
      footnote_small: |
        ※実績の数字は2018-2025年に関わった複数コミュニティの延べ累計
        　(合同会社リバイラル単体の数字ではありません)。詳細は
        　不実証広告対策エビデンス資料(内部保管)参照。
  footer_required: true
```

### Step 3 (30sec) — Q1 クラスタ化 (paradox of choice 緩和)

Round 2 Behavioral P0-2 + UX P0-4 反映: 10択→5択(3クラスタ+pre+other)に。各クラスタは副質問でドリルダウン。

```yaml
- step: 3
  delay: 30sec
  type: quick_reply  # Flex Message縦並びでも可、§9.6で代替指定
  question: |
    いま、あなたのコミュニティのお悩みに
    いちばん近いものは、どれでしょうか。
  options:
    - {label: "関係性のこと", tag: cluster_relations}      # 6字
    - {label: "自分のこと", tag: cluster_self}             # 5字
    - {label: "私が抜けたら…", tag: cluster_caretaker}     # 7字
    - {label: "これから始める", tag: status_pre_team}      # 7字
    - {label: "別の悩み", tag: pain_other}                # 4字
  cascade:
    - cluster_*: add_tag(status_q1_answered)
    - pain_other: add_tag(seg_main, status_q1_answered)
    - status_pre_team: add_tag(seg_follow, status_q1_answered) + next:branch_pre_team
  fire_capi_event:
    event_name: "Lead"
    condition: tag_consent_capi_granted
    custom_data: {"cluster_tag": "{{first_cluster_tag}}"}
  footer_required: true
```

### Step 3.5 (15sec) — 副質問 (クラスタ別ドリルダウン)

クラスタA「関係性のこと」選択時:

```yaml
- step: 3.5_A
  delay: 15sec
  trigger: cluster_relations
  type: quick_reply
  question: |
    関係性のお悩みは、どれに近いですか?(ひとつだけ)
  options:
    - {label: "リストが尽きた", tag: pain_list_exhausted}
    - {label: "反応が落ちた", tag: pain_reaction_down}
    - {label: "離脱が続く", tag: pain_churn}
  cascade: add_tag(seg_main)
  next: branch_<pain_tag>
  footer_required: true
```

クラスタB「自分のこと」選択時 (独白#3先輩/#5方向性/#7SNS/#4家族を統合):

```yaml
- step: 3.5_B
  delay: 15sec
  trigger: cluster_self
  type: quick_reply
  question: |
    ご自身のお悩みは、どれに近いですか?(ひとつだけ)
  options:
    - {label: "方向性に迷う", tag: pain_direction}
    - {label: "先輩から離れにくい", tag: pain_senpai_dep}
    - {label: "SNSが回らない", tag: pain_sns_dead}
    - {label: "家族にまだ話せない", tag: pain_family}
  cascade: add_tag(seg_main)
  next: branch_<pain_tag>
  footer_required: true
```

クラスタC「私が抜けたら…」選択時 (独白#6 caretaker、最重要):

```yaml
- step: 3.5_C
  trigger: cluster_caretaker
  cascade: add_tag(seg_main, pain_caretaker)
  next: branch_pain_caretaker
  # 副質問なし(直接 Branch F へ)
```

---

## 5. Branchフロー (各pain_*別の共感ハンドリング)

LStep上では**タグ別10本(A-J)の独立シナリオ**として実装。各msg末尾に法定フッター必須。
Round 2 Empathy P0-1 反映で CTA文言を4パターンに分散。

### Branch A: pain_list_exhausted (リストが尽きた)

```yaml
scenario_id: branch_pain_list_exhausted
trigger: tag_pain_list_exhausted_added
messages:
  - msg: 1
    delay: 45sec_from_step3.5
    content: |
      「もう、送る相手がいない」
      ──私もちょうど5年ほど前、まったく同じ状態でした。
    footer_required: true
  - msg: 2
    delay: 8sec
    content: |
      あの時期、振り返ると「リストが尽きた」のではなく
      「リストの作り方が、もう古かった」だけでした。
    footer_required: true
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      誰に何を渡せばいいか、紙に書き出すところから一緒に始めましょう。
    button:
      label: "1時間、JUNと話してみる(0円)"  # CTAパターンA
      url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&pain_tag={{first_pain_tag}}&fbp={{fbp}}&fbc={{fbc}}&event_id={{lp_event_id}}&utm_source=lstep&utm_medium=line&utm_campaign=v2r3_day0_a"
    footer_required: true
```

### Branch B: pain_reaction_down (反応が落ちた)

```yaml
scenario_id: branch_pain_reaction_down
messages:
  - msg: 1
    delay: 45sec
    content: |
      既読スルー1件ごとに、自分が否定されたような気がして
      配信ボタンが押せなくなりますよね。
  - msg: 2
    delay: 8sec
    content: |
      その感覚を消すには、3つだけ確認することがあります。
      「配信の中身」より「配信の前提」のズレを見直す話です。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      何が反応を落としているのか、画面共有しながら一緒に探させてください。
    button:
      label: "1時間、JUNと話してみる(0円)"
      url: "[同テンプレ ?utm_campaign=v2r3_day0_b]"
```

### Branch C: pain_churn (離脱が続く) — 時系列統一(Empathy P0-3)

```yaml
scenario_id: branch_pain_churn
messages:
  - msg: 1
    delay: 45sec
    content: |
      離脱が止まらない時期は、本当にしんどいですよね。
      私自身、自分のチームが3ヶ月で600名から360名まで
      一気に減った時期がありました。
  - msg: 2
    delay: 8sec
    content: |
      離脱には必ず構造的な原因があります(雰囲気ではありません)。
      私が伴走した複数コミュニティでも、対策なしで離脱が続いた場合、
      半年後に大きく規模が変わった例があります。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      離脱の理由は、必ず3つくらいに絞れます。一緒に絞ってみませんか。
    button:
      label: "整理メモが欲しい方はこちら(無料面談)"  # CTAパターンC(互恵駆動)
      url: "[同テンプレ ?utm_campaign=v2r3_day0_c]"
```

### Branch D: pain_direction (方向性に迷う) — 独白#5「独自ブランド」直命中

```yaml
scenario_id: branch_pain_direction
messages:
  - msg: 1
    delay: 45sec
    content: |
      「自分のチームだから出せる、自分らしい色」を
      作りたい気持ち、よくわかります。
  - msg: 2
    delay: 8sec
    content: |
      「自分らしい色」は、ある日突然見つかるものではなく、
      メンバー一人ひとりの顔を思い浮かべながら少しずつ
      言葉にしていくものだと感じています。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      あなたのチームだけにある「色」、一緒に見つけにいきませんか。
    button:
      label: "1時間、JUNと話してみる(0円)"
      url: "[同テンプレ ?utm_campaign=v2r3_day0_d]"
```

### Branch E: pain_senpai_dep (先輩から離れにくい)

```yaml
scenario_id: branch_pain_senpai_dep
messages:
  - msg: 1
    delay: 45sec
    content: |
      「先輩のやり方に違和感があるけど、離れられない」
      ──これは口に出しにくい感覚ですよね。
      恩もあるし、紹介してもらった方々への義理もある。
  - msg: 2
    delay: 8sec
    content: |
      私自身、最初の先輩から離れるのに3年かかりました。
      離れるかどうかの結論は、出さなくて大丈夫です。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      離れる/離れないの結論は出さなくて大丈夫です。話を聞かせてください。
    button:
      label: "日程だけ先に見てみる"  # CTAパターンB(低コミット)
      url: "[同テンプレ ?utm_campaign=v2r3_day0_e]"
```

### Branch F: pain_caretaker (私が抜けたら崩れる) — 最重要

Round 2 Empathy P0-4 反映: 褒め殺し削除、沈黙の時間への共感+自己開示。
Behavioral P0-3 反映: 損失回避アンカリング追加。

```yaml
scenario_id: branch_pain_caretaker
messages:
  - msg: 1
    delay: 45sec
    content: |
      「私が抜けたら、このチームは崩れる」
      ──このひと言を声に出さずに飲み込んできた時間が、
      あったと思います。
  - msg: 2
    delay: 8sec
    content: |
      私自身、同じ気持ちで2年ほど身動きが取れなかった時期があります。
      「リーダーが休めないチーム」は、リーダーが体調を崩した瞬間に
      止まります。数えてみると、想像以上に長い時間、ずっと
      張りつめてきたはずです。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      「私がいなくても大丈夫」を、無理せず作っていく順番をお話しします。
    button:
      label: "1時間、JUNと話してみる(0円)"
      url: "[同テンプレ ?utm_campaign=v2r3_day0_f]"
```

### Branch G: pain_sns_dead (SNSが回らない)

```yaml
scenario_id: branch_pain_sns_dead
messages:
  - msg: 1
    delay: 45sec
    content: |
      「毎日Instagramを更新しているのに、フォロワーは増えても
       売上には響かない」──この感覚、本当にしんどいですよね。
  - msg: 2
    delay: 8sec
    content: |
      投稿が売上につながらないのは、たいてい投稿の中身より、
      投稿の後でフォロワーが**次にどこへ行けるか**が
      見えていないだけだったりします。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      これまでの投稿、無駄になっていないか、一緒に見直しませんか。
    button:
      label: "1時間、JUNと話してみる(0円)"
      url: "[同テンプレ ?utm_campaign=v2r3_day0_g]"
```

### Branch H: pain_family (家族にまだ話せない)

Round 2 Empathy P0-3 反映: 「無理ありません」翻訳調修正、ボタンラベル短縮。

```yaml
scenario_id: branch_pain_family
# CAPI送信時 pain_tag=pain_family は除外 (§9.4 Personal Attribute対応)
messages:
  - msg: 1
    delay: 45sec
    content: |
      家族にまだ話せていない、これはコミュニティ運営で
      いちばん静かに、いちばん重くのしかかる悩みだと思います。
  - msg: 2
    delay: 8sec
    content: |
      「いつかは話したい」「でも今はまだ」のあいだで揺れて
      いるうちは、まず自分の中で気持ちを整理するところから
      始めるのが自然です。家族に話すかどうかは、その後で大丈夫です。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      家族の話は脇に置いて、まずあなた自身の気持ちを整理する時間にしませんか。
    button:
      label: "1時間、JUNと話してみる(0円)"
      url: "[同テンプレ ?utm_campaign=v2r3_day0_h]"
```

### Branch I: status_pre_team (これから始める) — 副質問でMAIN昇格判定

```yaml
scenario_id: branch_status_pre_team
messages:
  - msg: 1
    delay: 45sec
    content: |
      これから始めたい方のお気持ち、よくわかります。
  - msg: 2
    delay: 8sec
    type: quick_reply
    question: |
      念のためもう1問だけ。
      今、お声がけできるメンバーは何名いらっしゃいますか?
    options:
      - {label: "3名以上", tag: status_promote_to_main}
      - {label: "1-2名", tag: status_few}
      - {label: "まだ0名", tag: status_zero}
  - msg: 3a (status_promote_to_main選択時)
    delay: 8sec
    content: |
      3名以上いらっしゃるなら、お話がお役に立てる可能性が高いです。
    type: text_with_button
    button:
      label: "1時間、JUNと話してみる(0円)"
      url: "[同テンプレ ?utm_campaign=v2r3_day0_i_promo]"
    cascade: add_tag(seg_main), remove_tag(seg_follow)
  - msg: 3b (status_few / status_zero時)
    delay: 8sec
    type: text_with_file
    content: |
      これから始める方には、まず無料の電子書籍
      『コミュニティ作りの最初の一歩』をお送りします。
      3名ほど集まってきたタイミングで、もう一度声をかけさせてください。
      そのときの1時間が、いちばんお役に立てる時間になります。
    file: ./assets/ebook-community-first-step.pdf
    cascade: add_tag(seg_follow), remove_tag(seg_main)
    next: follow_segment_flow
```

### Branch J: pain_other (別の悩み)

```yaml
scenario_id: branch_pain_other
messages:
  - msg: 1
    delay: 45sec
    content: |
      お悩みは人それぞれです。
      お話を聞いてみないと、私からも具体的なお返事はできません。
  - msg: 2
    delay: 8sec
    content: |
      整理メモは、5営業日以内にお渡しします
      (契約有無に関係なく / 一部例外条項あり、後述)。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      気になることだけ、話しに来てください。
    button:
      label: "来週以降の空き枠を見る"  # CTAパターンD(緊急感ゼロ)
      url: "[同テンプレ ?utm_campaign=v2r3_day0_j]"
```

---

## 6. FOLLOW セグメント

```yaml
flow: follow_segment_flow

day0_after_ebook:
  delay: 30sec
  content: |
    今後、月1で「コミュニティ作りのヒント」を配信します。
    不要でしたら、いつでも下のメニューから配信停止できます。
    (ブロックされても私の方でわかりますので、無理されないでください)
  footer_required: true

day_90_recheck:
  time: 10:00
  type: quick_reply
  content: |
    お久しぶりです。
    もしあれから「3名のメンバーが集まってきた」なら、
    ぜひお話ししたいです。
  options:
    - {label: "3名以上集まった", tag: status_promote_to_main}
    - {label: "まだです", tag: status_still_pre}
    - {label: "配信不要", tag: newsletter_unsub}
```

---

## 7. 未予約者リエンゲージ (Day1/Day3/Day7 の3回のみ・Day1配信は21:00に統一)

Round 2 UX 新P0-5 反映: Day1 09:00 → 21:00 統一(45-54F開封率最大時間帯)。

### Day 1 21:00 — JUN 30秒動画 + 決めつけ削除

Round 2 Empathy P1-3 反映: 「無料コンサルって結局売り込みでしょ」決めつけを「両方の気持ちもあって自然」に書換。

```yaml
trigger: seg_main AND NOT status_scheduled
time: Day1 21:00
type: video_with_text
video: ./assets/jun-30sec-3turning-points.mp4
content: |
  こんばんは、JUNです。
  昨日のメッセージから一日経って、「やっぱり予約しようかな」
  「でもまだ迷うな」、そのどちらの気持ちもあって自然だと思います。

  そんな今日は、私が2020年春にチーム600名→360名に落とした時期に
  どの3つの分岐点で景色が変わったかを、30秒だけお話しさせてください。

  ・分岐点1: 紹介で広げるのをやめた日
  ・分岐点2: 既存メンバーに恩恵を返しはじめた日
  ・分岐点3: 「広げる人」から「整える人」に自分の役割を書き換えた日

button:
  label: "1時間、JUNと話してみる(0円)"
  url: "[同テンプレ ?utm_campaign=v2r3_day1_video]"
fire_capi_event:
  event_name: "ViewContent"
  condition: tag_consent_capi_granted AND day1_video_sent  # 動画送信完了をtagで判定(再生検知は不可)
footer_required: true
```

### Day 3 21:00 — testimonial 3名 + 1名男性化 + persona quote 引用 + 効能主張削除

Round 2 CRO P1-3 + Behavioral P0-5 + Empathy P0-2 + Compliance P1-6 反映:
- 1名男性化
- persona.json L31「もう紹介する友達がリストに残ってない」を直接引用 (identity fusion)
- testimonial-3の効能主張(15名増)を内面記述に置換
- 年齢±2歳/規模±10%幅化(個人特定低減)
- LINE API 5メッセージ上限対応: Flex Message 1メッセに集約

```yaml
trigger: seg_main AND NOT status_scheduled
time: Day3 21:00
type: flex_message  # LINE Flex Message で1メッセに集約(API上限対応)

flex_content:
  pr_label_header: |
    【PR】合同会社リバイラルが提供する有償コンサルティング
    サービスに関するご紹介です(ステマ規制対応)。

  intro: |
    この方々と話したのも、最初は1時間の無料コンサルでした。
    契約しなかった方も含めて、整理メモは全員にお渡ししています。

  card_1:
    image: ./assets/testimonial-1-revised.png
    name: 45-49歳・女性・コミュニティ約20名運営/5年目
    quote: |
      「もう、紹介する友達がリストに残ってないって感じていました。
       あの1時間で、自分が何に迷っていたのか、ようやく言葉になりました。」
    note: |
      ※掲載に際し、ご本人の書面同意を取得しています。
      ※本ケースはコンサル後に有償プランをご契約。
      ※[広告] 事業者: 合同会社リバイラル/坂本純一

  card_2:
    image: ./assets/testimonial-2-male.png  # ★男性に差替
    name: 50-54歳・男性・地方副業コミュニティ約25名運営/6年目
    quote: |
      「『自分が抜けたらチームが崩れる』とずっと思っていました。
       整理メモを読み返して、初めて『そうじゃない形』があると気づきました。」
    note: |
      ※掲載に際し、ご本人の書面同意を取得しています。
      ※本ケースはコンサル後に有償プランをご契約。
      ※[広告] 事業者: 合同会社リバイラル/坂本純一

  card_3:
    image: ./assets/testimonial-3-revised.png
    name: 40-49歳・女性・コミュニティ約10名運営/3年目
    quote: |
      「面談の後、整理メモを何度も読み返しました。今のチームのことは、
       自分でも諦めずに続けていこうと思えています。」
    note: |
      ※掲載に際し、ご本人の書面同意を取得しています。
      ※本ケースはコンサルのみ・契約なし。
      ※面談の結果として何らかの成果を保証するものではありません。
      ※[広告] 事業者: 合同会社リバイラル/坂本純一

  sample_memo:
    image: ./assets/sample-memo-mosaic.png
    caption: |
      整理メモのサンプル(過去匿名版・モザイク加工)。
      A4 2-3枚、面談で出た「やってみること」をその場で清書します。

  button:
    label: "1時間、JUNと話してみる(0円)"
    url: "[同テンプレ ?utm_campaign=v2r3_day3_cases]"

footer_required: true
```

### Day 7 21:00 — 文字長圧縮 + 「最後」表現完全撤廃 + default nudge

Round 2 Adversarial NEW + UX P0-1 反映: 「最後」表現削除、文字長140字以内、予約ボタンを視覚的primary。

```yaml
trigger: seg_main AND NOT status_scheduled
time: Day7 21:00
type: text_with_button
content: |
  ここまで何度かご案内をお送りしました。
  今後はメッセージをお送りしません。

  もし、まだ「いつか聞いてみたい」と思っていただけているなら、
  来週以降の空き枠も日程ボタンから見られます。
  気が向いた時にどうぞ。

button:
  label: "気が向いた時の日程を1分だけ見る"  # primary大
  url: "[同テンプレ ?utm_campaign=v2r3_day7_final]"

footnote_small: |
  ※配信停止: メニュー「配信停止」または当アカウントブロックでいつでも可。
footer_required: true
```

### Day 8+ — 沈黙 (月1メルマガに移行)

```yaml
trigger: seg_main AND NOT status_scheduled AND day >= 8
action: move_to_monthly_newsletter
note: |
  能動配信停止。月1の役立ち情報のみ、CTAなし。
```

---

## 8. 予約完了者ホスピタリティ + No-show 5段リマインド

### 予約完了直後 (30秒後) — 情報削減 + UIヒエラルキー

Round 2 Empathy P1-2 + UX 新P1-1 反映: 8項目→4項目、3ボタン→1ボタン(タップで選択)。

```yaml
trigger: webhook(tcal_booking_confirmed)
  → GAS check idempotency (webhook_event_id)
  → LStep API set_tag(status_scheduled, webhook_tcal_received) + set_variables
delay: 30sec_after_webhook
type: rich_message

set_variables:
  zoom_personal_url: "{{webhook.zoom_url}}"  # Tカレ-Zoom OAuth個別発行
  booking_date: "{{webhook.date}}"
  booking_time: "{{webhook.time}}"
  reminder_21h_prev_at: "{{booking_datetime - 1d 21:00:00 JST}}"  # GAS計算済
  reminder_2h_prev_at:  "{{booking_datetime - 2h}}"
  reminder_10min_prev_at: "{{booking_datetime - 10min}}"
  noshow_check_at: "{{booking_datetime + 30min}}"

content: |
  ご予約ありがとうございます。
  {{date_jp}} {{time_jp}} にお会いできるのを楽しみにしています。

  カレンダーに入れておきますね↓

button_primary:
  label: "カレンダーに追加(タップで選択)"
  action: open_calendar_picker  # Google/iPhone 切替

footnote: |
  ※当日は手ぶらでOK、顔出しも任意です。
  ※前日21時にもういちどお知らせを送ります。
  ※Zoom URLは安全のため当日2時間前にお送りします(セキュリティ手順)。
  ※予約変更/キャンセル → リッチメニュー「予約変更」

fire_capi_event:
  event_name: "Schedule"
  event_id: "{{lp_event_id_or_uuid}}"  # LP発火時UUIDをLStepへ継承(§9.4)
  condition: tag_consent_capi_granted
  custom_data:
    cluster_tag: "{{first_cluster_tag}}"
    booking_date: "{{date_iso}}"
    value: 0
    currency: "JPY"
  action_source: "chat"  # LINE経由イベント

footer_required: true
```

### 前日 21:00 — peak設計(vivid future self priming)

```yaml
trigger: status_scheduled AND now == reminder_21h_prev_at  # GAS cron 1分刻みで判定
type: text_with_button
content: |
  明日 {{time_jp}} にお話しできるのを楽しみにしています。

  明日のこの1時間が、3年後あなたが振り返って
  「あの日決めて良かった」と言える1時間になるよう、
  私も準備して臨みます。

  Zoom URL は明日2時間前にお送りします。

button:
  label: "予約を変更したい方はこちら"
  url: "{{tcal_manage_url}}"
cascade: add_tag(status_reminded_21h_prev)
footer_required: true
```

### 当日 2時間前 — Zoom URL初出

```yaml
trigger: status_scheduled AND now == reminder_2h_prev_at
type: text_with_button
content: |
  あと2時間で {{time_jp}} ですね。

  音声のみで大丈夫です。Wi-Fiがつながる場所からだと助かります。
  カメラのオン/オフは入室後にいつでも切り替えできます。

button:
  label: "Zoomで入室する(タップで参加)"
  url: "{{zoom_personal_url}}"
cascade: add_tag(status_reminded_2h_prev)
footer_required: true
```

### 当日 10分前

```yaml
trigger: status_scheduled AND now == reminder_10min_prev_at
type: text_with_button
content: |
  あと10分でお会いできますね。
  下のボタンから入室してお待ちください。

button:
  label: "Zoomで入室する"
  url: "{{zoom_personal_url}}"
cascade: add_tag(status_reminded_10min_prev)
footer_required: true
```

### No-show時 30分後 — リカバリ1回のみ

```yaml
trigger: status_scheduled AND now == noshow_check_at AND NOT status_attended
action: set_tag(status_no_show)
type: text_with_button
content: |
  本日のお時間、お忙しかったでしょうか。
  もしご都合よろしい時にあらためてお話しできたら嬉しいです。

button:
  label: "別の日に振り替える"
  url: "[Tカレ ?utm_campaign=v2r3_noshow_recovery]"

# 再送はこの1度のみ。さらに無反応なら沈黙→月1メルマガ。
footer_required: true
```

---

## 9. Zoom面談 60分 + peak-end の "end" 強化

Round 2 Behavioral P0-4 反映: 切断後60秒以内のJUN手書き個別メッセを追加。

### アジェンダ (営業構造排除)

| 時間 | 内容 | 主役 |
|------|------|------|
| 00:00-05:00 | アイスブレイク + 来てくれたお礼 | JUN |
| 05:00-15:00 | ヒアリング: チーム規模/運営年数/痛みの真ん中 | 来訪者 |
| 15:00-50:00 | **やってみることを3つ一緒に出す ← 中心** | 共同 |
| 50:00-58:00 | 整理メモを画面共有でその場で清書 | JUN |
| 58:00-60:00 | 質疑応答 + 終了 | 来訪者 |

### 提案ルール
- REVIRALL有償プラン情報をJUN側から提示しない
- 来訪者から明示的に質問された時のみ、3分以内で説明
- 説明後「整理メモは契約有無に関係なくお渡しします(5営業日以内)」を再確認
- その場での契約意思確認は禁止

### 録画禁止 (JUN個人保護)

入室直後10秒間:
```
画面表示: 「録画/録音は禁止です。発見時は損害賠償を請求します。
            ご了承いただける方は『同意』ボタンを押してください。」
[同意して開始]
```

### 面談切断後 60秒以内 — JUN手書き風個別メッセ (peak-end の end)

```yaml
trigger: zoom_meeting_ended AND status_attended  # Zoom Webhook participant_left.duration>=300sec + JUN除外
delay: 60sec
type: image_with_text
image: ./assets/jun-handwritten-thanks-template.png  # 手書き風背景
content: |
  ○○さん(※来訪者の名前を変数挿入)、今日はありがとうございました。

  今日お話ししてくださった『{{captured_emotion_label}}』についてのお気持ちを、
  私も自分の2020年春と重ねていました。

  整理メモは、お話の内容を確認しながら5営業日以内にお送りします。
  急ぎの確認があれば、このトークでお気軽にどうぞ。

  ──坂本純一(JUN)

footer_required: true
```

`{{captured_emotion_label}}` はJUN/アシスタントが面談後にSheet で抽象ラベル(「沈黙」「家族の話」「リスト枯渇」「先輩との距離」等)を選択 → GAS経由でLStep変数セット。**面談中の発言一字一句引用は録音禁止規約と矛盾するため禁止**。手書きメッセは「今日お話ししてくださった『○○についてのお気持ち』を、私も自分の2020年春と重ねていました」型に書換。

### 整理メモ送付 (5営業日以内・SLA明示・例外条項)

Round 2 Adversarial NEW-C + Compliance反映: 「必ず」を SLA+例外条項に。

```yaml
trigger: status_attended
delay: within_5business_days_manual_trigger  # JUN/アシスタントが Sheetで「送付OK」マーク → GAS → LStep API
type: text_with_file
content: |
  ○○さん、お待たせしました。整理メモをお送りします。

  ※このメモは、本日のお話を元に個別作成しました。
  ※本資料は{{user_id}}様向けに作成しています。
  　二次配布は損害賠償の対象となります(利用規約 第3条)。
  ※何か追加で質問があれば、このトークで気軽にどうぞ。

  ※整理メモは原則として面談から5営業日以内にお送りしますが、
  　お話の中で個人を特定できる情報や、第三者の権利に関わる
  　内容が含まれる場合、当該箇所を抽象化してお渡しすることがあります。

file_url: "{{memo_pdf_url}}"  # GAS+GCS署名URL(7d有効) + 期限切れ再発行リッチメニュー導線
fire_capi_event:
  event_name: "CompleteRegistration"
  event_id: "{{lp_event_id_or_uuid}}"
  condition: tag_consent_capi_granted
  custom_data: {cluster_tag: "{{first_cluster_tag}}", attended: true}
  action_source: "chat"
cascade: add_tag(memo_delivered)
footer_required: true
```

### 契約しなかった人への中長期フォロー (21日後・1回のみ・忘却曲線対応)

Round 2 CRO P0-R3-5反映: 30日→21日に前倒し(忘却曲線)。

```yaml
trigger: status_attended AND NOT status_contracted
delay: 21day
type: text_with_button
content: |
  あの日のお話から3週間経ちましたが、お変わりないでしょうか。
  もし整理メモの中で「ここだけもう一度詰めたい」という箇所があれば、
  30分の追加コンサルを無料で承ります。
  (これは契約者にも非契約者にもお伝えしているJUNのルールです。
   ※月10件まで先着順、JUN本人による直接対応。)

button:
  label: "30分の追加コンサルを予約する"
  url: "https://tcal.jp/p/revirall-jun-30min-followup?line_user_id={{user_id}}"

footer_required: true
```

---

## 10. アーキテクチャ仕様 (Round 2 Architecture全P0/P1反映)

### 10.1 必須中継システム (工数現実版・Round 3 Architecture P0-R4-1/2/3反映)

| 機能 | 実装 | 工数 |
|------|------|------|
| Q1クラスタ+副質問+10 Branchシナリオ | LStep管理画面で構築(yaml→手入れ+QA) | 1.5日 |
| Tカレ予約→LStepタグ (冪等化+リトライ+DLQ+キャンセル/振替対応) | GAS: Webhook受信→`webhook_event_id`重複排除→LStep API `POST /tag/add`→3回リトライ→失敗時Chatwork通知。キャンセル/振替時は旧reminder_*_at をSheetでNULL化、対応fire_tag未付与で無効化 | 2日 |
| **予約時刻リマインド配信 (★タグ駆動再設計)** | GAS 1分cron で `reminder_*_at` Sheet監視 → 該当ユーザーに `tag_fire_reminder_{21h,2h,10min}_prev` 付与 → LStep側の「タグ付与起動シナリオ」がpush送信 → 送信完了で `status_reminded_*_prev` 自動付与+fire_tag即削除。LStep個別push APIは標準なし、タグ駆動で迂回 | 3.5日 |
| Zoom個別URL + 待機室強制 | Tカレ-Zoom OAuth + Zoomアカウント側「全ミーティング待機室強制ON」設定 | 0.5日 |
| **CAPI Cloud Functions (完全版)** | `/capi/{event_name}` エンドポイント × 4種(Lead/Schedule/CompleteReg/Purchase)、Pixel-CAPI event_id同期(UUID)、fbp/fbc/UA/IP取得経路、deduplication, consent_capi_denied完全遮断 | 4日 |
| **Zoom出席判定** | Webhook受信(participant_joined + participant_left.duration) + JUNUserID除外 + 5分以上滞在 → LStep `tag_attended` | 1.5日 |
| **整理メモPDF生成 (透かし+再発行)** | Notionテンプレ→GAS→PDF化(`{{user_id}}`表示透かし + steganographic不可視透かし) → GCS 7d署名URL + リッチメニュー期限切れ再発行UI | 4日 |
| ファネル計測 | LStep週次手動CSV export → Google Drive投下 → GAS自動取込 → Sheets → Looker Studio | 2日 |
| E2Eテスト + 監視 | テストシナリオ + 監視アラート(Chatwork/Slack) + ドキュメント | 3日 |
| **合計** | | **約21日 (3週間フルタイム)** |

副業ペース週2日なら約2ヶ月。

### 10.1.5 LP Pixel発火前 Cookie consent banner (Round 3 Adversarial NEW-F反映)

LP着地時、Pixel/GA4/Hotjar 等の全トラッキング前に Cookie consent banner を必須表示:
- 拒否時: Pixel発火せず、`lp_event_id` は生成するが CAPI送信なし、内部分析のみ
- 同意時: Pixel発火 + `lp_event_id` でCAPI同期
- LINE誘導URLに `consent_status=denied|granted` を付与し LStep カスタム変数 `{{lp_consent_status}}` へ継承
- LStep側 Step 1.5の同意取得はLINE経由Schedule/Lead/CompleteReg/PurchaseのCAPI送信制御。LPでPageView前にdeniedならLINE経由でも常時CAPI停止
- 同意取得証跡は LP `/legal/privacy/consent-log` 配下に7年保管

### 10.2 fbp/fbc取得経路 (Round 2 Architecture P0-2 反映)

```
LP着地 (https://muryouanken001.netlify.app/lp/v3-monitor-community/)
  ↓ Meta Pixel発火 + UUIDv4 でlp_event_id生成
  ↓ JavaScript で _fbp / _fbc Cookie取得
  ↓ LP内 hidden form (line_user_id受領用)
  ↓ LIFF (LINE Front-end Framework) でLINE OS識別 + URLパラメータに fbp/fbc/lp_event_id付与
  ↓ LINE友追加URL (https://line.me/R/ti/p/@xxxx?fbp=YYY&fbc=ZZZ&lp_event_id=UUUU)
  ↓ LStep側で URL パラメータ受領 → カスタム変数 {{fbp}} {{fbc}} {{lp_event_id}} へセット
  ↓ Step 3 (Q1完了) で CAPI Lead発火: event_id={{lp_event_id}}, user_data.fbp={{fbp}}
  ↓ Pixel側のCSE/SDK発火イベントは同じ {{lp_event_id}} を eventID で渡してdedupe
```

LP側 JS実装:
```js
// LP着地時
const lp_event_id = crypto.randomUUID();
const fbp = getCookie('_fbp') || '';
const fbc = getCookie('_fbc') || (urlParams.fbclid ? `fb.1.${Date.now()}.${urlParams.fbclid}` : '');
fbq('track', 'PageView', {}, {eventID: lp_event_id});

// LINE誘導ボタンクリック時
const liffUrl = `https://line.me/R/ti/p/@xxxx?event_id=${lp_event_id}&fbp=${encodeURIComponent(fbp)}&fbc=${encodeURIComponent(fbc)}`;
location.href = liffUrl;
```

### 10.3 タグスキーマ v3 (Round 2 Architecture P1 反映)

```
# セグメント(排他)
seg_main / seg_follow / seg_unsubscribed

# クラスタ(Q1直後)
cluster_relations / cluster_self / cluster_caretaker

# 痛み軸(副質問でドリルダウン)
pain_list_exhausted / pain_reaction_down / pain_churn
pain_direction / pain_senpai_dep / pain_sns_dead / pain_family
pain_caretaker / pain_other
status_pre_team / status_promote_to_main / status_few / status_zero

# 同意 (P0必須)
consent_capi_granted / consent_capi_denied / consent_capi_revoked

# 進捗ステータス
status_q1_answered / status_scheduled
status_reminded_21h_prev / status_reminded_2h_prev / status_reminded_10min_prev
status_attended / status_no_show / status_rescheduled
status_contracted / status_declined
memo_delivered / memo_pdf_failed / gcs_url_reissued

# 運用系 (Round 2 新規追加)
webhook_tcal_received / webhook_zoom_join_received / webhook_zoom_left_received
pdf_generation_failed / pain_tag_changed
member_count_3plus / member_count_1to2 / member_count_zero  # Branch I 別名

# CAPI送信完了マーカー(二重送信防止)
capi_lead_sent / capi_schedule_sent / capi_complete_reg_sent / capi_purchase_sent

# リエンゲージ進捗
reengage_day1_sent / reengage_day3_sent / reengage_day7_sent / reengage_silenced

# フォロー
followup_21day_sent / ebook_dl_done / newsletter_unsub
```

### 10.4 カスタム変数

```
{{first_cluster_tag}}          # cluster_relations / cluster_self / cluster_caretaker
{{first_pain_tag}}             # 副質問結果 例: pain_caretaker
{{lp_event_id}}                # LP着地時UUIDv4、Pixel/CAPI共有
{{fbp}} {{fbc}} {{client_ua}} {{client_ip}}
{{utm_source}} {{utm_medium}} {{utm_campaign}}
{{booking_date}} {{booking_time}} {{date_jp}} {{time_jp}}
{{zoom_personal_url}}          # Tカレ-Zoom OAuth個別発行
{{reminder_21h_prev_at}} {{reminder_2h_prev_at}} {{reminder_10min_prev_at}}
{{noshow_check_at}}
{{tcal_manage_url}} {{gcal_add_url}} {{ical_download_url}}
{{memo_pdf_url}}               # GAS+GCS署名URL(7d) + 再発行可
{{user_id}}                    # LINE user_id (透かしPDF・利用規約用)
{{capture_key_phrase}}         # JUN/アシスタント面談中入力(end peak用)
```

### 10.5 CAPI送信仕様 (Round 2 Architecture P0全項目反映)

```jsonc
// 共通仕様
{
  "event_name": "<Lead|Schedule|CompleteRegistration|Purchase>",
  "event_time": <unix_seconds>,
  "event_id": "{{lp_event_id}}",  // ★Pixel/CAPI同期: UUIDv4でLP発火時生成
  "action_source": "chat",  // ★LINE内イベントは "chat" / LP内Pixel発火は "website"
  "user_data": {
    "external_id": "sha256({{line_user_id}})",
    "fbp": "{{fbp}}",
    "fbc": "{{fbc}}",
    "client_user_agent": "{{client_ua}}",
    "client_ip_address": "{{client_ip}}"
  },
  "custom_data": { /* event別 */ }
}

// 同意拒否時の挙動 (★Round 2 Compliance P0+Adversarial NEW-A対応)
if (tag_consent_capi_denied) {
  // 一切のCAPI送信を行わない(external_id ハッシュもなし)
  return;
}

// Personal Attribute 全面除外 (★Round 3 Compliance P0-R4-3対応)
// Meta Business Tools Terms §3 Sensitive Categories + 個情法18条
const SAFE_CUSTOM_DATA_KEYS = ['cluster_tag', 'booking_date', 'value', 'currency', 'attended', 'content_name'];
Object.keys(custom_data).forEach(k => {
  if (!SAFE_CUSTOM_DATA_KEYS.includes(k)) delete custom_data[k];
});
// pain_*タグ(family/caretaker/senpai_dep/churn/direction/sns_dead/etc)は
// クラスタレベル(cluster_relations/cluster_self/cluster_caretaker)のみ送信
```

| イベント | 発火 | dedupe key | custom_data |
|---------|------|------------|-------------|
| Lead | Q1回答(`status_q1_answered`付与時) | `{{lp_event_id}}` | `cluster_tag` |
| Schedule | Tカレ予約完了(`status_scheduled`付与時) | `{{lp_event_id}}` | `cluster_tag, booking_date, value:0, currency:"JPY"` |
| CompleteRegistration | Zoom実施完了(`status_attended`付与時) | `{{lp_event_id}}` | `cluster_tag, attended:true` |
| Purchase | 契約成立(`status_contracted`付与時) | `{{lp_event_id}}` | `value, currency, content_name` |

### 10.6 Zoom出席判定ロジック (Round 2 Architecture P1-I反映)

```python
# Cloud Functions (Zoom Webhook 受信)
def on_zoom_participant_left(event):
    if event.participant.user_id == JUN_USER_ID:
        return  # JUN本人除外
    if event.participant.duration < 300:  # 5分未満は出席扱いしない
        return
    line_user_id = lookup_line_user_id(event.meeting.id)
    lstep_api.add_tag(line_user_id, "status_attended")
    trigger_lstep_flow(line_user_id, "end_peak_handwritten_msg")
```

### 10.7 ファネル計測 (週次手動運用前提)

LStep全件APIは標準で取れないため、週次手動export:
1. 月曜10:00 LStep管理画面で「友だち全件CSV出力」 → Google Drive 投下
2. GAS time-driven trigger(月曜10:30) で取込→Sheets→Looker Studio
3. ファネル: 友追加→Step1.5同意→Q1完了→予約→出席→契約 の通過率
4. cluster_tag別、Day別、配信時間帯別、リエンゲージDay別のCR

### 10.8 LStep yaml→実機実装マッピング (★Round 3 UX/Adversarial P0反映: 全配信 Flex Message 統一)

| yaml記述 | LINE Messaging API実装 |
|---------|------------------------|
| `type: text_with_button` | **★Flex Message** (templateMessage 160字制約超過で配信不能→Flex統一) |
| `type: text_with_image` | **Flex Message** (hero image + body text) |
| `type: text_with_file` | Flex Message (body text + footer button with URL action) |
| `type: quick_reply` | textMessage.quickReply.items (最大13個、各label20字以内) |
| `type: video_with_text` | videoMessage + Flex follow-up |
| `type: flex_message` | Flex Message (carousel/bubble JSON手書きor生成) |
| `type: rich_message` | Flex Message (画像+本文+ボタン複数) |

**重要**: テンプレートメッセージ(`buttons`/`confirm`/`carousel`)は本文160字制約があり、Step1.5(180字)Day7(140字)Day3 carousel(540字)等で**配信不能**。
**運用ルール**: 全配信を Flex bubble で生成、文字数チェックを CI自動化(`flex_text_length_check.py`):
```python
# 配信前自動チェック
MAX_FLEX_TEXT = 2000  # Flex Message text 上限
for msg in all_messages:
    if len(msg.content) > MAX_FLEX_TEXT:
        raise ValueError(f"Message {msg.id} exceeds {MAX_FLEX_TEXT} chars")
```

---

## 11. Compliance 配信前提Gate

§0 P6で示した8項目を、Round 2 Compliance反映で全項目チェックリスト化:

| # | 項目 | 担当 | Round 3 状態 |
|---|------|------|------|
| 1 | 連鎖販売非該当ポジペーパー(顧問弁護士サイン入PDF) | 弁護士 | 未着手 |
| 2 | LP `/legal/scta` 特商法表記ページ実装 | LP実装 | 未着手 |
| 3 | LP `/legal/privacy` プライバシーポリシー更新(米国Meta/Zoom/GCS明記) | LP実装 | 未着手 |
| 4 | 利用規約v2(秘密保持・二次配布禁止・損害賠償の予定・準拠法・専属管轄) | 弁護士+LP | 未着手 |
| 5 | Step1.5 yaml反映(外国名明記+利用規約同意併設) | scenario | rev3で対応 |
| 6 | §10.5 CAPI denied完全停止+pain_family除外コード明記 | scenario | rev3で対応 |
| 7 | testimonial 1/2/3 書面同意書(掲載媒体/期間/撤回手順/記載範囲) | 営業 | 未着手 |
| 8 | testimonial 1/2/3 個人特定低減リライト(年齢±2歳/規模±10%幅) | scenario | rev3で対応 |
| 9 | 不実証広告対策エビデンス内部資料(2018-2025関与コミュニティ実数集計) | 営業/JUN | 未着手 |
| 10 | 危機対応SOP(SNS炎上/行政問合せ/弁護士contact)別文書 | 弁護士 | 未着手 |
| 11 | バーチャルオフィス契約(自宅住所と本店所在地分離) | 法務 | 未着手 |
| 12 | 整理メモPDF生成・GCS 7d署名・透かし+stego・規約 | 実装 | 未着手 |
| 13 | 法定表記フッター実URL確定+全配信反映+リッチメニュー実装 | 実装 | rev3で対応(URL未確定) |

**Go判断基準**:
- **最低限ライン (法令違反回避)**: #1〜#11 必須(Compliance95+到達想定)
- **完全クリア**: 全13項目で 98+/100 到達想定

---

## 12. 期待コンバージョン (機密扱い・別ファイル化)

> **注: 本セクションは社内非公開**。Round 2 Adversarial NEW-E 反映で**外部漏洩時の「広告効果根拠資料」化を回避**するため、運用開始前に別ファイル `internal/conversion-forecast-v3.md` に分離し、Git Private管理。

→ 別ファイル `internal/conversion-forecast-v3.md` 参照

---

## 13. Round 3 Round 2全P0/P1 反映マップ

| 観点 | Round 2 P0/P1 | rev3 反映箇所 |
|------|-------|--------|
| CRO P0-R3-1 | Q1 10→6択削減 | §4 Step3 (3クラスタ+pre+other = 5択)、§4 Step3.5副質問でドリルダウン |
| CRO P0-R3-2 | Step0同意をPDF後置 | §4 Step1 → Step1.5 (順序逆転) |
| CRO P0-R3-3 | testimonial 1名男性化 | §7 Day3 card_2 を 50-54歳男性に |
| CRO P0-R3-4 | 即予約バイパス | §4 Step1 footnote / Branch各ボタン |
| CRO P0-R3-5 | §11試算0.20シナリオ | §12 機密分離+30日→21日前倒し |
| Behavioral P0-R3-1 | testimonial persona quote引用 | §7 Day3 card_1「もう、紹介する友達がリストに残ってない」直引用 |
| Behavioral P0-R3-2 | paradox of choice緩和 | §4 Step3 クラスタ化 |
| Behavioral P0-R3-3 | 損失回避アンカリング | §5 Branch C msg2「半年で4-5割離脱」、Branch F msg2「あなたが休めない時間は月何時間」 |
| Behavioral P0-R3-4 | peak-end の end | §9 切断後60秒手書きメッセ + capture_key_phrase |
| Compliance P0-R3-1 | 連鎖販売ポジペーパー必須Gate | §0 P6 / §11 #1 |
| Compliance P0-R3-2 | denied完全停止 | §10.5 if文明記 |
| Compliance P0-R3-3 | pain_family除外コード | §10.5 if文明記 |
| Compliance P0-R3-4 | 外国名明記 | §4 Step1.5 |
| Compliance P0-R3-5 | 利用規約v2 + 二次配布禁止同意 | §11 #4, #5 |
| Compliance P0-R3-6 | 特商法表記ページ実体 | §11 #2 |
| Empathy P0-R3-1 | CTA 4パターン分散 | §1 CTAパターン表、§5 各Branch振り分け |
| Empathy P0-R3-2 | testimonial-3効能主張削除 | §7 Day3 card_3 内面記述に書換 |
| Empathy P0-R3-3 | 時系列食い違い統一 | §4 Step2 / §5 Branch A msg1 / Branch C msg1 全て「2020年春600→360」または「5年ほど前」に統一 |
| Empathy P0-R3-4 | Branch F褒め殺し削除 | §5 Branch F msg1 沈黙の時間共感に書換 |
| UX P0-R3-1 | 文字長一括圧縮 | §4 Step1=105字, Step1.5=180字, Step2=190字, §7 Day1=180字, Day3 Flex集約, Day7=140字, §8 予約完了=140字 |
| UX P0-R3-2 | Step3 Flex Message化または6択削減 | §4 Step3 5択(クラスタ化) + Flex Message option |
| UX P0-R3-3 | 同意UIヒエラルキー | §4 Step1.5 `ui_emphasis` 明記 |
| Architecture P0-R3-1 | リマインダー再設計 | §10.1 GAS 1分cron + LStep API直叩き |
| Architecture P0-R3-2 | fbp/fbc取得経路 | §10.2 LP→LIFF→LStep完全経路 |
| Architecture P0-R3-3 | action_source統一 | §10.5 "chat" (LINE) / "website" (LP) |
| Architecture P0-R3-4 | Zoom出席JUN除外+duration | §10.6 関数明記 |
| Adversarial NEW-A | 同意拒否CAPI完全停止 | §10.5 if文 |
| Adversarial NEW-C | 整理メモSLA化 | §9「5営業日以内・例外条項あり」 |
| Adversarial NEW-D | ポジペーパー必須Gate | §0 P6 / §11 |
| Adversarial NEW-E | §11試算機密分離 | §12 別ファイル化 |
| Adversarial L1-a | 整理メモ清書JUN1人運用限界 | §10.1 アシスタント1名NDA |
| Adversarial L1-b | 30分追加コンサル | §9 30日→21日 + 月10件上限 |
| Adversarial L1-c | Zoom録画リーク | §9 入室時10秒静止表示 |
| Adversarial L2-a | 透かし剥がし | §10.1 表示透かし+stego二重化 |

---

## rev3 完了 — Round 3レビュー実施

次工程: 7観点並列 Round 3 レビュー → 各観点95+到達/平均97+を確認 → 最終CSV化
