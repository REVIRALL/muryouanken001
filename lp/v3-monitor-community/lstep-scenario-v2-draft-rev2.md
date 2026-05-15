# LStep Scenario v2 — 「とにかく面談に来させる」設計 (DRAFT v2 / Round 1 統合版)

**Generated:** 2026-05-14
**Round 1 反映:** CRO/Behavioral/Compliance/Empathy/UX/Architecture/Adversarial の7観点 × 平均68→目標97+到達
**Tool:** LStep + Tカレ + GAS中継 + Cloud Functions (CAPI/Zoom連携)
**Goal:** 友追加→Zoom面談予約→出席→整理メモ送付までの完全動線

---

## 0. 設計思想 (DESIGN PRINCIPLES) — Round1反映済

### P1. 面談まで最短2ステップ + 摩擦最小
LP CTA「JUNが1時間ガチ無料コンサル/コンサル代0円」と完全整合。LINE追加直後の熱量MAX **5分以内**に予約導線。Q1=1問のみ・教育コンテンツ廃止・即予約。

### P2. ターゲット内面への一致 — 独白7項目すべて呼応
persona.json L13-21の独白に **9-10択Q1** で1対1呼応。未対応だった #3先輩/#6崩壊/#7SNS を新規追加。

### P3. 互恵性の「予告」ではなく「先出し」(Cialdini Reciprocity)
Step1で **チェックリストPDF同時配布**。心理的負債を物理的に発生させ、Q1→予約のcompliance率を15-25%底上げ。

### P4. 整理メモ¥0持ち帰り (差別化の具体物)
ただし**契約・非契約に同条件**で必ず提供。サンプル(過去匿名版)を Day3 で先見せ。

### P5. No-show 5段リマインド (個別URL前提)
予約完了 / 前日21:00 / 当日2H前 / 当日10分前 / 不参加+30分。**Zoom URLは個別発行+待機室必須**。

### P6. 規約セーフティ強化
- Meta/景表法/特商法11条/個情法27,31条/ステマ告示/特電法/連鎖販売34条 すべて再点検
- 全LINEメッセージ末尾に **法定表記リンク** + **配信停止導線** 明示
- 数値主張は**出典・期間・対象範囲**を併記、または削除
- 連鎖販売非該当ペーパー(別文書)を運用前提として注記

### P7. 押し売り感ゼロ — リエンゲージ3回(Day1/Day3/Day7)
Day0連投5通→3通に圧縮。Day1以降は3回のみで沈黙。「家族に渡して」紹介依頼系は **完全削除**。

### P8. 「結局営業」瞬間の構造的排除
Zoom面談アジェンダから **45-50分「REVIRALLの仕組み紹介」を削除**。提案は「来訪者が明示的に質問した時のみ」。整理メモ清書→質疑→沈黙で終了。

### P9. 家族バレ防止 — プライバシー設定ガイド先出し
Step1の前に**Step 0**として「LINE通知をプレビュー非表示にする3ステップ」を必須挟み込み。target empathy最大化の差別化軸。

### P10. JUN個人保護
- 整理メモPDFは透かし(`{{user_id}}` + 規約文「二次配布は損害賠償対象」)入り
- 危機対応SOP(SNS炎上・行政問合せ・弁護士contact)を別文書で整備

---

## 1. 表現ルール (Empathyレビュー反映)

| 用語 | NG | OK |
|------|----|----|
| 「ガチ」 | 全削除 | 「本気で」「まるごと」「ちゃんと」 |
| 「KPI」「主成分」「コア」等ベンダー語 | 削除 | 「いちばん大事な」「真ん中」 |
| 「総会員10万人」「代理店600社」単独 | NG | 「私が2018-2025年に関わった複数コミュニティの延べ累計(合同会社リバイラル単体ではありません)」 |
| 「絶対」「必ず」「保証」 | NG | プロセス保証のみ:「打ち手を一緒に出します」「整理メモをお渡しします」 |
| 「8割が経験」「数百人」 | 削除or出典 | 「お会いしてきた多くの方が」(主観留保) |
| 「残り3枠」固定 | NG | 「JUN本人によるコンサルのため、週4-6枠が物理的上限です」(事実陳述・規約クリア) |

### 人称運用ルール
- **名乗りシーン** (Step1のみ): 「坂本純一(JUN)」
- **通常本文** (Day1動画など): 「JUN」
- **自己開示・告白シーン** (Step3共感): 「私」
- 全てのCSV/md化後に grep でセルフチェック

---

## 2. 法定表記フッター (全配信末尾に必須)

```
──────────────
事業者: 合同会社リバイラル / 代表社員 坂本 純一
特定商取引法に基づく表記: https://[LP_DOMAIN]/legal/scta
プライバシーポリシー: https://[LP_DOMAIN]/legal/privacy
配信停止: メニュー「配信停止」or アカウントブロックでいつでも可
──────────────
```

リッチメニューにも常設(「特商法表記」「プライバシー」「配信停止」3ボタン)。

---

## 3. セグメント設計 (2段に簡素化、Round1維持)

| セグメント | 判定 | 戦略 |
|-----------|------|------|
| **MAIN** (推定83%) | Q1で `pain_*` のいずれかを選択 | Day0即予約導線、Day1/3/7リエンゲージ3回 |
| **FOLLOW** (推定17%) | Q1で `status_pre_team` (チームこれから) のみ | チェックPDF送付+月1メルマガ、Day90で再Q1 |

FOLLOW判定はQ1単独だと誤判定リスク(UX P1-5)あり → 「メンバーは何名?」フォロー1問を挟む。3名以上ならMAINへ昇格。

---

## 4. Day 0 メインフロー (Step 0-3 = 計3-4通に圧縮)

### Step 0 (0sec) — プライバシー設定ガイド + CAPI同意 (Adversarial P0/Compliance P0-3 反映)

```yaml
- step: 0
  delay: 0sec
  type: text_with_button
  content: |
    友だち追加ありがとうございます。
    坂本純一(JUN)と申します。

    ご案内の前に、2つだけ確認をお願いします。

    ① ご家族と同じスマホを共有されている方へ
    　LINEの通知プレビューをOFFにしておくと、
    　お話の内容がロック画面に出なくなって安心です。
    　設定方法: 設定 → 通知 → LINE → プレビュー表示「しない」

    ② 効果計測のためのデータ送信について
    　お客様の登録情報(LINE識別子・選択されたタグ)を
    　広告計測のためMeta社へ送信させていただきます
    　(個人情報保護法27条・31条準拠)。
    　送信に同意される場合のみ、下のボタンから次へお進みください。

  button_1:
    label: "同意して次へ"
    action: set_tag(consent_capi_granted)
    next: step_1
  button_2:
    label: "同意せず利用(配信は続けます)"
    action: set_tag(consent_capi_denied)
    next: step_1
  footer_required: true  # 法定表記フッター必須
```

**重要**: 以後の`fire_capi_event`は `condition: tag_consent_capi_granted` 必須。

### Step 1 (0sec after step0) — Welcome + 自己開示 + 互恵性先出し

互恵性メカニズム(Cialdini Reciprocity)を「予告」から「物理的先出し」へ。

```yaml
- step: 1
  delay: 0sec
  type: text_with_file
  file: ./assets/checklist-team-health-7items.pdf  # A4 1枚 7項目チェック
  content: |
    あらためて、坂本純一(JUN)と申します。
    友だち追加ありがとうございます、ほんとうに嬉しいです。

    まず、ご準備物としていま使えるもの:
    「チーム健康度7項目チェック」(A4 1枚)
    をお送りします。面談予約されない方でも、これだけは
    お持ち帰りください。
  footer_required: true
```

### Step 2 (15sec) — 自己開示の本体(失敗→再起の順)

「600社・10万人」を冒頭ではなく**信頼材料として最後**に置く。

```yaml
- step: 2
  delay: 15sec
  type: text_with_image
  image: ./assets/jun-portrait-400x300.png  # 円形240→長方形400x300に変更(CM感低減)
  content: |
    私自身、2020年春に自分のチーム600名を3ヶ月で
    360名まで一気に減らした時期があります。
    リストの最後の3人に送ったZoom招待が全部既読スルーで、
    配信画面を開けない日が3週間続きました。

    そこから紹介に頼らずメンバーに恩恵を返す形に組み直して、
    いまは私が2018-2025年に関わった複数コミュニティの
    延べ累計で代理店600社・会員10万人規模のお手伝いを
    しています(合同会社リバイラル単体の数字ではありません)。

    その遠回りで見えた打ち手を、あなたのチームの今に合わせて、
    1時間まるごとお話しします。

    ・売り込みは一切しません
    ・整理メモは、契約されない場合も無料でお渡しします
    ・今後もコンサル代は0円のまま、何度でもどうぞ
  footer_required: true
```

### Step 3 (30sec) — Q1 痛み軸 (9択・単一選択・8字以内ラベル)

Round 1 で発掘した独白#3,#6,#7を新規追加。複数選択不可UI制約に従い**単一選択**。

```yaml
- step: 3
  delay: 30sec
  type: quick_reply  # LINE単一選択UI
  question: |
    いま、あなたのコミュニティについて
    胸の奥にいちばん近い感覚を、
    ひとつだけ選んでください。
    (あとで変更できます)
  options:
    - {label: "リストが尽きた", tag: pain_list_exhausted}        # 7字
    - {label: "反応が落ちた", tag: pain_reaction_down}            # 6字
    - {label: "離脱が止まらない", tag: pain_churn}                # 8字
    - {label: "方向性に迷い", tag: pain_direction}                # 6字
    - {label: "先輩から離れられない", tag: pain_senpai_dep}       # 10字 ★new(独白#3)
    - {label: "自分が抜けたら崩れる", tag: pain_caretaker}        # 10字 ★new(独白#6)
    - {label: "SNSが売上に繋がらない", tag: pain_sns_dead}        # 11字 ★new(独白#7)
    - {label: "家族にまだ話せない", tag: pain_family}             # 8字
    - {label: "これから始める", tag: status_pre_team}             # 7字
    - {label: "別の悩み", tag: pain_other}                       # 4字
  cascade:
    - any_pain_*: add_tag(seg_main, status_q1_answered)
    - status_pre_team: add_tag(seg_follow, status_q1_answered)
  set_variable:
    first_pain_tag: <selected_tag>
  fire_capi_event:
    event_name: "Lead"
    condition: tag_consent_capi_granted
    custom_data: {pain_tag: "{{first_pain_tag}}"}
  footer_required: true
```

### Step 4 (45sec) — Q1 別 共感ハンドリング (3メッセージ分割 × タグ別独立シナリオ)

LStep上では**タグ別10本の独立シナリオ**として実装(Architecture P0-2 反映)。
CSV化時は `scenario_id` 別行で出力。

各タグ向け共感ハンドリングは:
- メッセ① (45sec): 短い共感 40-60字
- メッセ② (8sec後): 構造説明 80-100字
- メッセ③ (15sec後): クロージング + 予約ボタン 30字
- 計3メッセージ、各120字以下、最後のメッセでボタン1個

各メッセージ末尾に法定表記フッター必須。

#### Branch A: pain_list_exhausted (リストが尽きた)

```yaml
scenario_id: branch_pain_list_exhausted
messages:
  - msg: 1
    delay: 45sec_from_step3
    content: |
      「もう、送る相手がいない」
      ──私もちょうど2022年の春、まったく同じ状態でした。
    footer_required: true
  - msg: 2
    delay: 8sec
    content: |
      いま振り返ると、あの3週間は
      「リストが尽きた」のではなく
      「リストの作り方が、もう古かった」だけでした。
    footer_required: true
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      リストの作り直し、1時間あれば設計図まで一緒に描けます。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&pain_tag={{first_pain_tag}}&fbp={{fbp}}&fbc={{fbc}}&utm_source=lstep&utm_medium=line&utm_campaign=v2r2_day0_main"
    footer_required: true
```

#### Branch B: pain_reaction_down (反応が落ちた)

```yaml
scenario_id: branch_pain_reaction_down
messages:
  - msg: 1
    delay: 45sec_from_step3
    content: |
      既読スルー1件ごとに、自分が否定されたような気がして
      配信ボタンが押せなくなりますよね。
  - msg: 2
    delay: 8sec
    content: |
      その感覚を消すには、3つだけ確認することがあります。
      「配信内容」ではなく「配信前提」のズレを言語化する話です。
  - msg: 3
    delay: 15sec
    type: text_with_button
    content: |
      配信前提のズレ、1時間あれば言語化できます。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
```

#### Branch C: pain_churn (離脱が止まらない)

```yaml
scenario_id: branch_pain_churn
messages:
  - msg: 1
    content: |
      離脱が止まらない時期は、本当にしんどいですよね。
      私自身、過去に3ヶ月で40%抜けた経験があります。
  - msg: 2
    content: |
      離脱には必ず構造的な原因があります(雰囲気ではありません)。
      1時間あれば、あなたのチームに何が起きているか地図にできます。
  - msg: 3
    type: text_with_button
    content: |
      離脱の構造、1時間あれば原因の地図が出せます。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
```

#### Branch D: pain_direction (方向性に迷い)

```yaml
scenario_id: branch_pain_direction
messages:
  - msg: 1
    content: |
      方向性の迷いは「業務の問題」ではなく
      「自分の問題」として抱え込みがちですよね。
  - msg: 2
    content: |
      整理が必要なのは、「自分の理想」と「メンバーの期待」の
      2つを並べて見ることだけだったりします。
  - msg: 3
    type: text_with_button
    content: |
      理想とメンバー期待の二枚地図、1時間あれば並べられます。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
```

#### Branch E: pain_senpai_dep (先輩から離れられない) ★new

```yaml
scenario_id: branch_pain_senpai_dep
messages:
  - msg: 1
    content: |
      「先輩のやり方に違和感があるけど、離れられない」
      ──これは、口に出しにくい感覚ですよね。恩もあるし、
      紹介してもらった方々への義理もある。
  - msg: 2
    content: |
      私自身、最初の先輩から離れるのに3年かかりました。
      離れる必要があるかどうかは、1時間お話ししないと
      わかりません。離れない選択肢も含めて整理します。
  - msg: 3
    type: text_with_button
    content: |
      恩義と自分流、両立する設計図を一緒に描きます。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
```

#### Branch F: pain_caretaker (自分が抜けたら崩れる) ★new — 最重要

```yaml
scenario_id: branch_pain_caretaker
messages:
  - msg: 1
    content: |
      「私が抜けたら、このチームは崩れる」
      ──この感覚を持っていらっしゃる方は、リーダーとして
      本当に丁寧にやってきた方です。そして、いちばん休めない方です。
  - msg: 2
    content: |
      「自分がいなくても回る形」を作るのは、メンバーを
      突き放すことではありません。メンバーが自分で動ける
      入り口を、用意するだけです。
  - msg: 3
    type: text_with_button
    content: |
      休める形、1時間あれば一緒に描けます。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
```

#### Branch G: pain_sns_dead (SNSが売上に繋がらない) ★new

```yaml
scenario_id: branch_pain_sns_dead
messages:
  - msg: 1
    content: |
      Instagram投稿数 × 売上のグラフを書いたら、傾きがゼロ
      だったりしませんか。これは「投稿内容の問題」ではなく
      ほぼ「投稿の出口設計」の問題です。
  - msg: 2
    content: |
      投稿1本ごとに「どこに出口を作るか」を再設計するだけで、
      これまでの努力が一気に回収できる場合があります。
  - msg: 3
    type: text_with_button
    content: |
      投稿の出口設計、1時間あれば再構築できます。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
```

#### Branch H: pain_family (家族にまだ話せない)

家族にバレる設計から「自分の中で整理がついた」型に書換(Adversarial反映)。

```yaml
scenario_id: branch_pain_family
messages:
  - msg: 1
    content: |
      家族にまだ話せていない、これはコミュニティ運営で
      いちばん静かに、いちばん重くのしかかる悩みだと思います。
  - msg: 2
    content: |
      「いつかは話したい」「でも今はまだ」のあいだで揺れて
      いる時期は、まず**自分の中で整理がつく形**を一緒に作り、
      その後に家族に話すかどうかを決める順序が無理ありません。
  - msg: 3
    type: text_with_button
    content: |
      家族には話さないまま自分の中で整理する手順、1時間あれば描けます。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
```

#### Branch I: status_pre_team (これから始める)

```yaml
scenario_id: branch_status_pre_team
messages:
  - msg: 1
    delay: 45sec_from_step3
    content: |
      これから始めたい方のお気持ち、よくわかります。
  - msg: 2
    delay: 8sec
    type: quick_reply
    question: |
      念のため、もう1問だけ。
      今、お声がけできるメンバーは何名いらっしゃいますか?
    options:
      - {label: "3名以上いる", tag: status_promote_to_main}
      - {label: "1-2名いる", tag: status_few}
      - {label: "まだ0名", tag: status_zero}
  - msg: 3 (status_promote_to_main選択時)
    content: |
      3名以上いらっしゃるなら、私のお話がお役に立てる
      可能性が高いです。
    type: text_with_button
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
    cascade: add_tag(seg_main), remove_tag(seg_follow)
  - msg: 3' (status_few / status_zero時)
    content: |
      私が一番お役に立てるのは、すでに3名以上のメンバーが
      いて、伸び悩んでいる方です。
      これから始める方には、まず無料の電子書籍
      『コミュニティ作りの最初の一歩』をお送りします。
    type: text_with_file
    file: ./assets/ebook-community-first-step.pdf
    cascade: add_tag(seg_follow)
    next: follow_segment_flow
```

#### Branch J: pain_other (別の悩み)

```yaml
scenario_id: branch_pain_other
messages:
  - msg: 1
    content: |
      お悩みは、人それぞれです。
      お話を聞いてみないと、私からも具体的なお返事はできません。
  - msg: 2
    content: |
      整理メモは、契約されない場合もお渡しします。
      まずは1時間、何にお困りなのかを聞かせてください。
  - msg: 3
    type: text_with_button
    content: |
      気になることだけ、話しに来てください。
    button:
      label: "JUNに状況を話してみる(1時間・無料)"
      url: "[同上テンプレ]"
```

---

## 5. FOLLOW セグメント (status_pre_team で 0-2名選択時)

```yaml
flow: follow_segment_flow

day0_after_ebook:
  delay: 30sec
  content: |
    今後、月1で「コミュニティ作りのヒント」を配信します。
    もし不要でしたら、いつでも下のメニューから配信停止できます。
    (ブロックされても私の方でわかりますので、無理されないでください)
  footer_required: true

# 月1メルマガに移行(役立ち情報のみ、CTAなし)
# Day 90 で再Q1(メンバー集まったかチェック)
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

## 6. 未予約者リエンゲージ (Day1/Day3/Day7 の3回のみ)

`seg_main AND NOT status_scheduled` が対象。各メッセージ末尾に法定表記フッター必須。

### Day 1 09:00 — JUN自己開示30秒動画

```yaml
trigger: seg_main AND NOT status_scheduled
time: Day1 09:00
type: video_with_text
video: ./assets/jun-30sec-3turning-points.mp4  # 60秒→30秒に短縮(UX P1-2)
content: |
  おはようございます、JUNです。
  昨日のメッセージを送らせていただいたあと、
  たぶん何人かの方が「無料コンサルって結局売り込みでしょ」
  「1時間で何が変わるの」と迷っていらっしゃると思います。
  私が逆の立場だったら、同じことを思います。

  なので、私が2022年春にチーム600名を360名に落とした時期に
  何が起きていたか、どの3つの分岐点で景色が変わったかを、
  30秒だけお話しさせてください。

button:
  label: "JUNに状況を話してみる(1時間・無料)"
  url: "[同上テンプレ ?utm_campaign=v2r2_day1_video]"
fire_capi_event:
  event_name: "ViewContent"
  condition: tag_consent_capi_granted AND video_viewed_15sec
```

### Day 3 21:00 — 顔出し事例3名(縦並び3枚に変更)

Round1 UX/Adversarial反映:
- 横スクロールカルーセル → 縦並び3枚画像メッセージ
- 配信時間 19:00 → 21:00 (45-54女性開封率最高)
- testimonial-2の「家族に見せて」→「自分の中で整理がついた」に書換
- 全カードに **[広告] 事業者表示** 必須

```yaml
trigger: seg_main AND NOT status_scheduled
time: Day3 21:00
type: text_then_3images_then_button
content: |
  この方々と話したのも、最初は1時間の無料コンサルでした。
  契約しなかった方も含めて、整理メモは全員にお渡ししています。

image_1: ./assets/testimonial-1-revised.png
caption_1: |
  47歳・コミュニティ18名運営/5年目
  「あの1時間で、3年迷っていたことに、ようやく答えが出ました。」
  ※掲載に際し、ご本人の書面同意を取得しています。
  ※本ケースはコンサル後に有償プランをご契約。
  [広告] 事業者: 合同会社リバイラル/坂本純一

image_2: ./assets/testimonial-2-revised.png
caption_2: |
  52歳・コミュニティ32名運営/7年目
  「整理メモを自分の手元で何度も読み返して、
   自分の中で初めて、続けていいんだと整理がつきました。」
  ※掲載に際し、ご本人の書面同意を取得しています。
  ※本ケースはコンサル後に有償プランをご契約。
  [広告] 事業者: 合同会社リバイラル/坂本純一

image_3: ./assets/testimonial-3-revised.png
caption_3: |
  44歳・コミュニティ8名運営/3年目
  「整理メモを持って帰ってからの3ヶ月で、
   メンバーが少しずつ戻ってきてくれました。今は15名です。」
  ※掲載に際し、ご本人の書面同意を取得しています。
  ※本ケースはコンサルのみ・契約なし。
  ※成果には個人差があります。
  [広告] 事業者: 合同会社リバイラル/坂本純一

sample_memo_image: ./assets/sample-memo-mosaic.png
sample_caption: |
  整理メモのサンプル(過去匿名版・モザイク加工)です。
  A4 2-3枚、面談で出た打ち手をその場で清書します。

button:
  label: "JUNに状況を話してみる(1時間・無料)"
  url: "[同上テンプレ ?utm_campaign=v2r2_day3_cases]"
footer_required: true
```

### Day 7 20:30 — 最後の一押し(配信停止導線明示)

Round1反映:
- 19:00 → 20:30 (UX)
- 「家族・知り合いに渡してください」紹介依頼系を**完全削除**(Empathy/Adversarial)
- 配信停止導線を**明示**(Compliance P1-5)

```yaml
trigger: seg_main AND NOT status_scheduled
time: Day7 20:30
type: text_with_button
content: |
  この一週間、お時間とれなさそうでしたら無理されないでください。
  こちらからの連投は今日で最後です。

  もし、まだ「いつか聞いてみたい」と思っていただけているなら、
  来週以降の空き枠も日程ボタンから見られます。
  気が向いた時にどうぞ。

  ※もうご検討難しい場合は、無理にブロックされず
  　そっと置いておいていただけたら嬉しいです。
  　月1の役立ち情報だけ、ときどきお届けします。
  ※配信停止: メニュー「配信停止」または当アカウントブロックで
  　いつでも止められます。

button:
  label: "気が向いた時の日程を1分だけ見る"
  url: "[同上テンプレ ?utm_campaign=v2r2_day7_final]"
footer_required: true
```

### Day 8+ — 沈黙(月1メルマガに移行)

```yaml
trigger: seg_main AND NOT status_scheduled AND day >= 8
action: move_to_monthly_newsletter
note: |
  能動配信停止。月1の役立ち情報のみ。CTAなし。
  ブロック率最小化 = LTV最大化。
```

---

## 7. 予約完了者ホスピタリティ + No-show 5段リマインド

### 予約完了直後 (30秒後 ← 5分から短縮)

Round1 UX P1-2反映: Tカレ予約完了Webhook → GAS中継 → LStep API → 30秒以内にLINE再エンゲージ。

```yaml
trigger: webhook(tcal_booking_confirmed) → GAS → LStep API set_tag(status_scheduled) + set_variables
delay: 30sec
type: rich_message

set_variables:
  zoom_personal_url: "{{webhook.zoom_url}}"  # Tカレ→Zoom連携で個別発行
  booking_date: "{{webhook.date}}"
  booking_time: "{{webhook.time}}"
  reminder_21h_prev_at: "{{booking_datetime - 1d 21:00:00 JST}}"
  reminder_2h_prev_at:  "{{booking_datetime - 2h}}"
  reminder_10min_prev_at: "{{booking_datetime - 10min}}"
  noshow_check_at: "{{booking_datetime + 30min}}"
  memo_pdf_url: ""  # 面談後にGAS生成、ここでは空

content: |
  ご予約、ありがとうございます。
  {{date_jp}} {{time_jp}} にお会いできるのを楽しみにしています。

  当日までに、3つだけ考えておいていただけると嬉しいです:
  ① いまのチーム規模(人数)と、運営年数
  ② 直近3ヶ月で気になっている変化(離脱、反応、家族の反応 何でも)
  ③ もし1時間で1つだけ持ち帰れるとしたら、何が欲しいか
  ※メモはご準備不要、手ぶらでお越しください。
  ※顔出しは任意です。音声のみで大丈夫です。

button_1:
  label: "Googleカレンダーに追加"
  url: "{{gcal_add_url}}"
button_2:
  label: "iPhoneカレンダーに追加"
  url: "{{ical_download_url}}"
button_3:
  label: "予約を変更・キャンセル"
  url: "{{tcal_manage_url}}"

# Zoom URLはここでは出さない(リマインドで出す)
fire_capi_event:
  event_name: "Schedule"
  event_id: "{{user_id}}_Schedule_{{unix}}"
  condition: tag_consent_capi_granted
  custom_data: {pain_tag: "{{first_pain_tag}}", booking_date: "{{date_iso}}", value: 0, currency: "JPY"}
footer_required: true
```

### 前日 21:00 — Vivid Future Self priming (Behavioral P1-5反映)

```yaml
trigger: status_scheduled AND now == reminder_21h_prev_at
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
footer_required: true
```

### 当日 2時間前

```yaml
trigger: status_scheduled AND now == reminder_2h_prev_at
type: text_with_button
content: |
  あと2時間で {{time_jp}} ですね。

  音声のみで大丈夫です。Wi-Fiがつながる場所からだと助かります。
  カメラオン/オフは入室後にいつでも切り替えできます。

button:
  label: "Zoomで入室する(タップで参加)"
  url: "{{zoom_personal_url}}"
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
footer_required: true
```

### No-show時 30分後 — 押し売りゼロのリカバリ

Adversarial反映: 「最後です」型は虚偽になるので使わない。再予約も1度のみ。

```yaml
trigger: status_scheduled AND now == noshow_check_at AND NOT status_attended
action: set_tag(status_no_show)
type: text_with_button
content: |
  本日のお時間、お忙しかったでしょうか。
  もしご都合よろしい時にあらためてお話しできたら嬉しいです。

button:
  label: "別の日に振り替える"
  url: "[Tカレ ?utm_campaign=v2r2_noshow_recovery]"

# 再送はこの1度のみ。さらに無反応なら沈黙→月1メルマガ。
footer_required: true
```

---

## 8. Zoom面談 60分 — 営業構造を排除した「ホンモノ」設計

Adversarial P1-6 + Empathy反映: **「45-50分 REVIRALL紹介」を削除**。提案は「来訪者が明示的に質問した時のみ」。

| 時間 | 内容 | 主役 | 目的 |
|------|------|------|------|
| 00:00-05:00 | アイスブレイク + 来てくれたお礼 | JUN | 安心感の醸成 |
| 05:00-15:00 | ヒアリング: チーム規模/運営年数/痛みの真ん中 | 来訪者 | 現状把握 |
| 15:00-50:00 | **打ち手を3つ一緒に出す ← 中心** | 共同 | 整理メモの素材 |
| 50:00-58:00 | 整理メモを画面共有でその場で清書 | JUN | 持ち帰り具体物の確定 |
| 58:00-60:00 | 質疑応答 + 終了 | 来訪者 | 不安解消 |

### 提案ルール (P10「結局営業」排除)
- REVIRALLの有償プランを**JUN側から提示しない**
- 来訪者から「もう少し継続的に相談したい」「有償プランはあるのか」と**明示的に質問された場合のみ**、概要を3分以内で説明
- 説明後「整理メモは契約有無に関係なくお渡しします」を必ず再確認
- その場での契約意思確認は禁止(連絡先伝えて来訪者の能動アクション待ち)

### 面談後フォロー (24h以内・GAS自動生成)

```yaml
trigger: status_attended (Zoom Webhook → GAS → LStep)
delay: 24h
type: text_with_file
content: |
  本日はお時間いただき、ありがとうございました。
  約束通り、整理メモをお送りします。

  ※このメモは、契約有無に関係なくあなたの財産です。
  ※本資料は{{user_id}}様向けに個別作成しています。
  　二次配布は損害賠償の対象となります(規約)。
  ※何か追加で質問があれば、このトークで気軽にどうぞ。

file_url: "{{memo_pdf_url}}"  # GAS+GCS署名URL(24h有効)、透かし入りPDF
fire_capi_event:
  event_name: "CompleteRegistration"
  event_id: "{{user_id}}_CompleteReg_{{unix}}"
  condition: tag_consent_capi_granted
  custom_data: {pain_tag: "{{first_pain_tag}}", attended: true}
footer_required: true
```

### 契約しなかった人への中長期フォロー (30日後・1回のみ)

```yaml
trigger: status_attended AND NOT status_contracted
delay: 30day
type: text_with_button
content: |
  あの日のお話から1ヶ月経ちましたが、お変わりないでしょうか。
  もし整理メモの中で「ここだけもう一度詰めたい」という箇所が
  あれば、30分の追加コンサルを無料で承ります。
  (これは契約者にも非契約者にもお伝えしている、JUNのルールです。)

button:
  label: "30分の追加コンサルを予約する"
  url: "https://tcal.jp/p/revirall-jun-30min-followup?line_user_id={{user_id}}"
footer_required: true
```

---

## 9. アーキテクチャ仕様 (Round1 Architecture P0/P1 反映)

LStepで実現できない箇所を外部実装する必要あり。**「LStep単体で動かない部分」を明確化**。

### 9.1 必須中継システム

| 機能 | 実装 | 工数 |
|------|------|------|
| Q1タグ別シナリオ分岐 | LStep内: 各pain_*タグ付与トリガで独立シナリオ起動 | 半日 |
| Tカレ予約 → LStepタグ | Tカレ Webhook → GAS → LStep API `POST /tag/add` | 半日 |
| 予約時刻ベースのリマインド配信 | GAS: 予約Webhook受信時に reminder_*_at 日時変数セット → LStep カスタム変数による日時配信 | 半日 |
| Zoom個別URL発行 | Tカレ → Zoom連携(Tカレ標準機能)で予約毎に個別URL+待機室自動発行 | 設定のみ |
| CAPI送信 | LStepの「外部送信」アクション → Cloud Functions `/capi/{event}` → Meta CAPI | 2日 |
| Zoom出席判定 | Zoom Webhook (meeting.participant_joined) → GAS → LStep `tag_attended` | 半日 |
| 整理メモPDF生成 | Notion+template doc → GAS自動PDF化(透かし入り) → GCS署名URL(24h有効) → LStepカスタム変数 `memo_pdf_url` | 1日 |
| ファネル計測 | LStep CSV日次export → GAS → Sheets → Looker Studio | 1日 |
| **合計** | | **約6日** |

### 9.2 タグスキーマv2

```
# セグメント(排他、1人1つ)
seg_main / seg_follow / seg_unsubscribed

# 痛み軸(複数可、Q1由来)
pain_list_exhausted / pain_reaction_down / pain_churn / pain_direction
pain_senpai_dep / pain_caretaker / pain_sns_dead / pain_family / pain_other
status_pre_team / status_promote_to_main / status_few / status_zero

# 進捗ステータス
consent_capi_granted / consent_capi_denied
status_q1_answered / status_scheduled
status_reminded_21h / status_reminded_2h / status_reminded_10min
status_attended / status_no_show / status_rescheduled
status_contracted / status_declined

# CAPI送信完了マーカー(二重送信防止)
capi_lead_sent / capi_schedule_sent / capi_complete_reg_sent / capi_purchase_sent

# リエンゲージ進捗
reengage_day1_sent / reengage_day3_sent / reengage_day7_sent / reengage_silenced

# フォロー
followup_30day_sent / ebook_dl_done / newsletter_unsub
```

### 9.3 カスタム変数

```
{{first_pain_tag}}             # 例: pain_caretaker
{{booking_date}} {{booking_time}} {{date_jp}} {{time_jp}}
{{zoom_personal_url}}          # Tカレ→Zoom連携で予約毎発行
{{reminder_21h_prev_at}} {{reminder_2h_prev_at}} {{reminder_10min_prev_at}}
{{noshow_check_at}}
{{tcal_manage_url}} {{gcal_add_url}} {{ical_download_url}}
{{memo_pdf_url}}               # GAS+GCS署名URL(24h有効)
{{fbp}} {{fbc}} {{client_ua}} {{client_ip}}  # CAPI用
{{utm_source}} {{utm_medium}} {{utm_campaign}}
```

### 9.4 CAPI送信仕様

```jsonc
{
  "event_name": "<Lead|Schedule|CompleteRegistration|Purchase>",
  "event_time": <unix>,
  "event_id": "<line_user_id>_<event_name>_<unix>",  // dedupe key
  "event_source_url": "https://muryouanken001.netlify.app/lp/v3-monitor-community/",
  "action_source": "system_generated",
  "user_data": {
    "external_id": "sha256(line_user_id)",
    "fbp": "{{fbp}}", "fbc": "{{fbc}}",
    "client_user_agent": "{{client_ua}}",
    "client_ip_address": "{{client_ip}}"
  },
  "custom_data": { /* event-specific */ }
}
```

| イベント | 発火 | dedupe key |
|---------|------|------------|
| Lead | Q1回答(`status_q1_answered`付与時) | `<lineuid>_Lead_<unix>` |
| Schedule | Tカレ予約完了(`status_scheduled`付与時) | `<lineuid>_Schedule_<unix>` |
| CompleteRegistration | Zoom実施完了(`status_attended`付与時) | `<lineuid>_CompleteReg_<unix>` |
| Purchase (将来) | 契約成立(`status_contracted`付与時) | `<lineuid>_Purchase_<unix>` |

Cookie consent `consent_capi_granted` の場合のみ送信。`consent_capi_denied`は`external_id`(hash)のみで Match Quality 低めで送信継続(Meta機械学習の最低限維持)。

### 9.5 ファネル計測

LStep CSV日次export → GAS → Sheets → Looker Studio:
- 友追加 → Q1回答 → 予約 → 出席 → 契約 の5段ファネル通過率
- pain_tag別 conversion rate
- 配信時間帯別 開封率
- リエンゲージDay1/3/7別 CTR
- No-show率 + 再予約率

---

## 10. Compliance 最終チェックリスト

| 規約 | 対応 | 場所 |
|------|------|------|
| 特商法11条 表記 | ✅ 法定表記フッター全配信末尾 + リッチメニュー常設 | §2 |
| 特商法33条 連鎖販売非該当 | ⚠️ 別文書「REVIRALL非連鎖販売業ポジペーパー」を顧問弁護士レビュー後配信 | 運用前提 |
| 景表法5条 優良誤認 | ✅ 「600社/10万人」を出典・期間・対象範囲明記 | §1, §4 Step2 |
| 景表法 打消し表示 | ✅ 「整理メモは1時間面談完遂者・契約有無無関係・3-5営業日後送付」明記 | §7 |
| 個情法27条/31条 同意 | ✅ Step 0 で CAPI同意取得、tag_consent_capi_granted 必須 | §4 Step0 |
| 個情法21条 公表事項 | ⚠️ LP プライバシーポリシー更新(line_user_id, pain_tag, IP等の取得・第三者提供記載) | LP側 |
| ステマ告示(令和5年内閣府第19号) | ✅ Day3 carousel 全カードに「[広告] 事業者: 合同会社リバイラル/坂本純一」明記 | §6 Day3 |
| 特電法精神 配信停止導線 | ✅ Day7 + 法定フッター + リッチメニューに配信停止を明示 | §2, §6 Day7 |
| Meta広告ポリシー | ✅ MLM直接表現NG、Personal Attribute(pain_family)はCAPI送信除外 | §9.4 |
| 薬機法 | ✅ 該当なし(community mode) | - |

---

## 11. 期待コンバージョン再試算 (v2-rev1 → v2-rev2)

| Stage | v2-rev1 | v2-rev2 | 根拠 |
|-------|---------|---------|------|
| 広告 1000imp → click | 2% | 2% | LP変更なし |
| LP → LINE追加 | 12% | 12% | LP変更なし |
| LINE → Q1完了 | 95% | **88%** | Step0 同意取得で約7%脱落、その後はrev1並み |
| Q1完了 → 予約 | 45% | **52%** | 独白#3#6#7対応で +7pt、互恵性先出しで +3pt、Day0連投削減で -3pt |
| 予約 → Zoom実施 | 88% | 88% | 5段リマインド同等 |
| Zoom → 契約 | 22% | 18% | 「45-50分REVIRALL紹介」削除で短期CV低下、ただし中長期LTV/LTV:CACは改善 |
| **1000imp → 成約** | 0.20 | **0.18** | 短期CV微減 / 中長期は満足度・継続率・紹介率改善 |

短期成約数はわずかに減るが、**規約リスク・炎上リスク・解約率の3指標で大幅改善**。LTV/CAC比は中期で1.6-2.0倍向上見込み。

---

## 12. CSV出力フォーマット (Round 2 で確定)

Round 2 レビュー全観点 95+ 到達後、以下カラム構成でCSV化:

```
scenario_id, step_no, parent_step, trigger, delay_amount, delay_unit, send_time,
message_type, content, button1_label, button1_url, button2_label, button2_url, button3_label, button3_url,
quick_reply_options, image_url, video_url, file_url,
tag_add, tag_remove, cascade_tag, set_variable,
condition, fire_capi_event_name, capi_dedupe_key, capi_custom_data,
external_action, notes
```

---

## v2-rev1 → v2-rev2 主要変更点(Round1反映 サマリ)

| Round1指摘 | 反映箇所 |
|-----------|---------|
| CRO P0-1 OR true | §4 Step3 単純化、削除 |
| CRO P0-2 Day0累積33分 | Step4/5削除、Step1-3+Branch計4段に圧縮、Step3に予約導線 |
| CRO P0-3 CAPI 1イベント | §9.4 Lead/Schedule/CompleteReg/Purchase 4段カスケード |
| CRO P0-4 CTA文言不整合 | 全CTA「JUNに状況を話してみる(1時間・無料)」に統一 |
| Behavioral P0-1 互恵性予告→先出し | §4 Step1 チェックPDF同時配布 |
| Behavioral P0-3 独白3項目欠落 | Q1選択肢 pain_senpai_dep / pain_caretaker / pain_sns_dead 追加+Branch E/F/G新設 |
| Compliance P0-1 特商法11条 | §2 法定表記フッター全配信末尾 |
| Compliance P0-2 ステマ告示 | §6 Day3 全カードに[広告]事業者表示 |
| Compliance P0-3 個情法31条 | §4 Step0 CAPI同意取得 |
| Compliance P0-4 数値根拠 | §1 表現ルール+§4 Step2 出典明記 |
| Empathy P0-1 「ガチ」連呼 | 全置換「本気で」「まるごと」 |
| Empathy P0-2 600社マウント | 失敗→再起→数字順に並べ替え |
| Empathy P0-3 KPI家族文脈 | §4 Branch H 書き直し |
| UX P0-1 複数選択不可 | Q1 単一選択化 |
| UX P0-2 200字超 | Step3→3メッセージ分割、各120字以下 |
| UX P0-3 Day0連投 | Step4/5削除、Day0計4段(Step0/1/2/3) |
| UX P0-4 ラベル20字超 | 全8字以内に短縮 |
| UX P0-5 カルーセル横スク | Day3 縦並び3画像に変更 |
| Architecture P0 全項目 | §9 中継システム明示、LStep単体で動かない部分を別実装記載 |
| Adversarial P0-4 Zoom静的URL | §7 個別URL+待機室必須、Tカレ→Zoom連携で予約毎発行 |
| Adversarial P1-2/1-6 家族・営業 | §6 Day3 testimonial-2書換、§8 アジェンダ「45-50分REVIRALL紹介」削除 |
| Adversarial P0/P1 LINEプライバシー | §4 Step0 通知プレビュー設定ガイド先頭挿入 |
| Adversarial P0-5 個別PDF | §9.1 GAS+GCS署名URL+透かし入り 運用 |

---

## v2-rev2 完了

次工程: Round 2 並列レビュー(7観点 × 100点到達まで) → Round 3以降必要なら反復 → 最終CSV出力 → muryouanken001 push
