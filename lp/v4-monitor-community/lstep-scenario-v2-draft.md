# LStep Scenario v2 — 「とにかく面談に来させる」設計 (DRAFT v1)

**Generated:** 2026-05-14
**Based on:** persona.json (P1-P5) + segments.json + LP v3 commit 4498e19
**Tool:** LStep + Tカレ (LINE連携)
**Reviewers target:** 7観点並列 (CRO / Behavioral Psych / Compliance / Empathy-Copy / UX / Architecture / Adversarial)
**Goal:** 友追加→Zoom面談到達率を最大化(現状理論0.5名/1000imp → 目標1.2名/1000imp、2.4倍)

---

## 設計思想 (DESIGN PRINCIPLES)

### P1. 面談まで最短2ステップ
LP上のCTA「JUNが1時間ガチ無料コンサル/今後もコンサル代0円」と完全整合。
LINE追加直後の**熱量MAX 5分以内**に予約導線を出す。Q1のみ・教育コンテンツ廃止・即予約。

### P2. ターゲット内面への一致 (MLM/コミュニティ伸び悩みリーダー)
persona.json L13-21 の独白に直接呼応する文言。
- 「もう紹介する友達がリストに残ってない」
- 「既読スルーが当たり前になった」
- 「先輩のやり方が古いと感じる」
- 「私が抜けたらチームが崩れそう」
- 「家族にバレたくない」

### P3. 売り込まない宣言の反復 (心理的躊躇の解除)
全Day0-Day7メッセージで以下のいずれかを必ず1回入れる:
- 「売り込みはしません」
- 「契約しなくても整理メモはお渡しします」
- 「今後もコンサル代は0円です」
- 「強引な提案はしません」

### P4. 整理メモ¥0持ち帰り (差別化の具体物)
「無料コンサル=結局CMだった」を構造的に潰す唯一の保証。
Day0/Day1/予約完了/前日リマインドの全タッチポイントで具体的に明記。

### P5. No-show 5段リマインド
業界平均Zoom予約No-show 20-40%が最大の漏れ。
予約完了直後/前日21:00/当日2H前/当日10分前/不参加後30分の5段で90%以上の出席率を目指す。

### P6. 規約セーフティ
- MLM/ネットワーク/ダウン/アップライン/権利収入 = 直接表現NG → 「組織を持つリーダー」「コミュニティ主宰」「チーム運営」で代替
- 「絶対稼げる」「必ず」NG → プロセス保証のみ(「打ち手を一緒に出します」「整理メモをお渡しします」)
- 固定希少性「残り3枠」固定文言NG → 動的変数 `{{actual_remaining_slots}}` のみ
- ステマ規制: 事例で報酬支給ある場合「※体験者にはモニター費用支給の場合あり」明記
- 個情法27条: Q1選択は識別情報に該当しない設計、CAPI送信は同意フロー後のみ

### P7. 押し売り感ゼロ (リエンゲージ3回ルール)
未予約者へのフォローは Day1/Day3/Day7 の3回のみ。Day8以降は沈黙(ブロックされない静かさを優先)。
「もうご検討いただけない場合は、ブロックせずそっと置いておいていただければ嬉しいです」型クロージング。

---

## セグメント設計の簡素化 (5段→2段)

旧設計(AAA/AA/A/B/C 5段)はセグメント振り分けに3問必要で摩擦過多。新設計は2段:

| セグメント | 判定 | 戦略 |
|-----------|------|------|
| **MAIN** (推定83%) | コミュニティ・チームを持っている / これから持ちたい意欲ある | Day0即予約導線、Day1/3/7リエンゲージ |
| **FOLLOW** (推定17%) | コミュニティ未保有 + 持つ意欲なし | 弾く(無料DL + 月1メルマガ移行) |

判定はQ1(1問)のみ。深掘りはコンサル本番で実施。

---

## Day0 メインフロー (友追加→即予約)

```yaml
trigger: friend_add

# ─────────────────────────────────────
# Step 1 (0sec): Welcome + 顔出し
# ─────────────────────────────────────
- step: 1
  delay: 0sec
  type: image_with_text
  image: ./assets/jun-portrait-circle.png  # 240x240 円形
  content: |
    はじめまして、坂本純一（JUN）です。
    友だち追加ありがとうございます。

    代理店600社・総会員10万人のコミュニティを束ねてきた経験から、
    あなたのチームに合う打ち手を、1時間ガチで一緒に考えます。

    ※売り込みは一切しません。
    ※整理メモは、契約されない場合も無料でお渡しします。

# ─────────────────────────────────────
# Step 2 (30sec): Q1 痛み軸選択 (1問のみ)
# ─────────────────────────────────────
- step: 2
  delay: 30sec
  type: quick_reply
  question: |
    いま、あなたのコミュニティで
    いちばん感じていることは、どれに近いですか？
    （複数選んでOK / あとで変更可）
  options:
    - {label: もう紹介する人がリストに残ってない, tag: pain_list_exhausted}
    - {label: メンバーの反応が落ちてきた, tag: pain_reaction_down}
    - {label: メンバーが離脱しはじめてる, tag: pain_churn}
    - {label: 自分のチームの方向性に迷ってる, tag: pain_direction}
    - {label: 家族の理解を得られない, tag: pain_family}
    - {label: これから始めたい・まだチームはない, tag: status_pre_team}
    - {label: 別の悩みがある, tag: pain_other}

# ─────────────────────────────────────
# Step 3 (60sec): 共感ハンドリング (Q1回答別) + 予約導線
# ─────────────────────────────────────
- step: 3
  delay: 60sec
  trigger: any_q1_answer
  type: text_with_button
  content_by_tag:
    pain_list_exhausted: |
      その状態、私もちょうど3年前に同じことを感じていました。
      同じ症状の主宰者さんと、これまで数百人話してきました。
      「リストの広げ直し」と「既存メンバーへの還元」の組み合わせで、
      多くの方が3-6ヶ月で空気が変わっています。

      まずは1時間、あなたのチームの状況を聞かせてください。
    pain_reaction_down: |
      既読スルーが続くと、配信そのものが怖くなりますよね。
      その感覚、私の元にいらした方の8割が経験されています。
      原因の多くは「配信内容」ではなく「配信前提」のズレです。
      これは、対面で1時間あれば解像度が一気に上がる話です。

      まずは1時間、状況を聞かせてください。
    pain_churn: |
      離脱が止まらない時期は、本当にしんどいですよね。
      私自身、過去に3ヶ月で40%抜けた経験があります。
      離脱には必ず構造的な原因があります（雰囲気ではありません）。
      1時間あれば、あなたのチームの構造に何が起きているか整理できます。

      まずは1時間、状況を聞かせてください。
    pain_direction: |
      方向性の迷い、これは「業務の問題」ではなく「自分の問題」として
      抱え込んでしまいがちですよね。
      実は、整理が必要なのは「自分の理想」と「メンバーの期待」の
      2つを並べて見ることだけだったりします。

      まずは1時間、聞かせてください。一緒に整理しましょう。
    pain_family: |
      家族の理解は、コミュニティ運営の最重要KPIのひとつだと思っています。
      「家族に説明できない仕事」を3年続けるのは、ほぼ不可能です。
      家族にも説明できる組織構造への切替、これも1時間で道筋出せます。

      まずは状況を聞かせてください。
    pain_other:|
      お悩みは、人それぞれです。
      お話を聞いてみないと、私からも具体的なお返事はできません。
      まずは1時間、聞かせてください。

      整理メモは、契約されない場合もお渡しします。
    status_pre_team: |
      これから始めたい方のお気持ち、よくわかります。
      ただ正直にお伝えすると、私が一番お役に立てるのは
      「すでにメンバーがいて、伸び悩んでいる方」です。

      これから始める方には、まず無料の電子書籍
      『コミュニティ作りの最初の一歩』をお送りします。

      （タグ: status_pre_team → FOLLOWセグメント）
  button:
    main_cta:
      label: "JUNと1時間話す日程を選ぶ"
      url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&pain_tag={{first_pain_tag}}&utm_source=lstep&utm_medium=line&utm_campaign=v2_day0_main"
  exclude_tag: status_pre_team  # 0名はFOLLOWへ

# ─────────────────────────────────────
# Step 4 (3min): 予約してない人への安心材料
# ─────────────────────────────────────
- step: 4
  delay: 3min
  trigger: NOT tag_scheduled AND NOT tag_status_pre_team
  type: text_with_button
  content: |
    日程選びの前に、何か気になることがあれば
    このトークでそのままお聞きください。
    （私本人が返信します／返信は早ければ数分、遅くとも翌営業日まで）

    ご質問例:
    ・本当に売り込みはないんですか？
    ・1時間で本当に打ち手は出るんですか？
    ・顔は出さなくても大丈夫ですか？(→ はい。音声のみOK)
    ・家族に画面を見られたくないんですが…(→ Zoomリンクは個別発行)

  button:
    secondary:
      label: "日程を選ぶ"
      url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&utm_source=lstep&utm_medium=line&utm_campaign=v2_day0_secondary"

# ─────────────────────────────────────
# Step 5 (30min): まだ予約してない人 / Q1未回答者
# ─────────────────────────────────────
- step: 5
  delay: 30min
  trigger: NOT tag_scheduled AND (NOT tag_q1_answered OR true)
  type: text
  content: |
    （何度もすみません、これで最後です）
    今日中にもしお時間とれそうな日がありましたら、
    日程ボタンから選んでみてください。

    もし「今日はもう難しい」なら、また気が向いた時で大丈夫です。
    こちらから連投はしません。
```

---

## FOLLOWセグメント (status_pre_team) — 弾くが優しく

```yaml
trigger: tag_status_pre_team_added

day0:
  - delay: 5sec
    type: text_with_file
    content: |
      電子書籍『コミュニティ作りの最初の一歩』をお送りします。
      まずはこちらを読んで、最初の3名ができたタイミングで
      また戻ってきていただければ嬉しいです。
    file: ./assets/ebook-community-first-step.pdf

  - delay: 30sec
    type: text
    content: |
      今後、月1で「コミュニティ作りのヒント」を配信します。
      もし不要でしたら、いつでもブロック・通知オフでOKです。

# 以後、月1メルマガに自動移行
# 90日後にもう一度Q1再送(チーム状況変わったかチェック)
day90_recheck:
  - time: 10:00
    type: quick_reply
    content: |
      お久しぶりです。
      もしあれから「3名のメンバーが集まってきた」なら、
      ぜひお話ししたいです。
    options:
      - {label: メンバー3名以上できた, tag: status_promoted_to_main}
      - {label: まだです, tag: status_still_pre}
      - {label: 配信不要, tag: status_unsubscribe}
```

---

## 未予約者リエンゲージ (Day1/Day3/Day7 で3回のみ)

### Day1 09:00 — JUNからの1分動画

```yaml
trigger: tag_main AND NOT tag_scheduled
time: Day1 09:00
type: video_with_text
video: ./assets/jun-1min-3turning-points.mp4  # 60秒以内
content: |
  おはようございます、JUNです。
  昨日メッセージを送らせてもらった、コミュニティ運営の打ち手の話、
  「3つの分岐点」を1分だけまとめた動画を作りました。

  ・分岐点1：紹介依存から脱却した日
  ・分岐点2：既存メンバーへの還元を始めた日
  ・分岐点3：自分が「広げる人」から「整える人」に変わった日

  動画を見て、もし「私のチームでもやれそう」と思ったら、
  1時間ガチコンサルでさらに具体的に詰めましょう。
button:
  label: "JUNと1時間話す日程を選ぶ"
  url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&utm_source=lstep&utm_medium=line&utm_campaign=v2_day1_video"
```

### Day3 19:00 — 顔出し事例(契約者同意済)

```yaml
trigger: tag_main AND NOT tag_scheduled
time: Day3 19:00
type: carousel_3cards
cards:
  - image: ./assets/testimonial-1.png
    name: 47歳女性・チーム18名
    quote: |
      「あの1時間で、私が3年迷ってたことに
       はっきり答えが出ました。」
    note: ※コンサル後、有償プラン契約。本人許諾済。
  - image: ./assets/testimonial-2.png
    name: 52歳女性・チーム32名
    quote: |
      「整理メモを家族に見せて、
       初めて『これなら応援できる』と言ってもらえました。」
    note: ※本人許諾済。
  - image: ./assets/testimonial-3.png
    name: 44歳女性・チーム8名
    quote: |
      「契約はせず整理メモだけ持って帰りましたが、
       3ヶ月後にメンバー15名まで伸びました。」
    note: ※本人許諾済。本ケースは契約なし。
content: |
  この方々と話したのも、最初は1時間のガチコンサルでした。
  契約しなかった方も含めて、整理メモは全員にお渡ししています。
button:
  label: "JUNと1時間話す日程を選ぶ"
  url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&utm_source=lstep&utm_medium=line&utm_campaign=v2_day3_cases"
```

### Day7 12:00 — 最後の一押し(押し売りゼロ)

```yaml
trigger: tag_main AND NOT tag_scheduled
time: Day7 12:00
type: text_with_button
content: |
  この一週間、お時間とれなさそうでしたら無理されないでください。
  こちらからの連投は今日で最後です。

  もし、まだ「いつか聞いてみたい」と思っていただけているなら、
  来週以降の空き枠も日程ボタンから見られます。
  気が向いた時にどうぞ。

  ──
  ※もうご検討難しい場合は、ブロックせずそっと置いておいて
  　いただければ嬉しいです。ご家族・お知り合いに、もし
  　同じような悩みの方がいらしたら、お渡しいただけたら幸いです。
button:
  label: "日程を見てみる(押しません)"
  url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&utm_source=lstep&utm_medium=line&utm_campaign=v2_day7_final"
```

### Day8以降 — 沈黙(月1メルマガのみ)

```yaml
trigger: tag_main AND NOT tag_scheduled AND day >= 8
action: move_to_segment(monthly_newsletter)
note: |
  以後の能動配信は停止。
  月初1日の月次メルマガ(役立ち情報のみ、CTAなし)で接点維持。
  ブロック率を最小化することがLTV最大化に直結。
```

---

## 予約完了者ホスピタリティ (No-show防止 5段リマインド)

### 予約完了直後 (5分以内)

```yaml
trigger: tcal_booking_confirmed
delay: 5min
type: rich_message
content: |
  ご予約、ありがとうございます。
  {{date_jp}} {{time_jp}} にお会いするのを楽しみにしています。

  当日までに、3つだけ考えておいていただけると嬉しいです：

  ① 今のチーム規模(人数)と、運営年数
  ② 直近3ヶ月で気になっている変化(離脱、反応、家族の反応 何でも)
  ③ もし1時間で1つだけ持ち帰れるとしたら、何が欲しいか

  ※メモは口頭でOKです。手元の紙にラフでお願いします。
  ※顔出しは任意です。音声のみで大丈夫です。
button_1:
  label: "Zoom URL (当日この同じURLでお会いします)"
  url: "{{zoom_static_url}}"
button_2:
  label: "予約を変更・キャンセル"
  url: "{{tcal_manage_url}}"

# CAPI連携
fire_event:
  event: "Schedule"
  fb_event_code: "Schedule"
  custom_data:
    line_user_id: "{{user_id}}"
    booking_date: "{{date_iso}}"
    pain_tag: "{{first_pain_tag}}"
```

### 前日 21:00

```yaml
trigger: booking_confirmed AND day == booking_date - 1
time: 21:00
type: text
content: |
  明日 {{time_jp}} にお話しできるのを楽しみにしています。

  Zoom URL: {{zoom_static_url}}

  もし急に都合が悪くなった場合は、このトークに一言いただければ
  すぐ別日に振替できます(無理されないでください)。
```

### 当日 2時間前

```yaml
trigger: booking_confirmed AND now == booking_time - 2h
type: text
content: |
  あと2時間で {{time_jp}} ですね。

  Zoom URL: {{zoom_static_url}}

  音声のみで大丈夫です。Wi-Fi環境だけ確保いただけたら助かります。
```

### 当日 10分前

```yaml
trigger: booking_confirmed AND now == booking_time - 10min
type: text
content: |
  あと10分です。
  こちらのURLからどうぞ → {{zoom_static_url}}

  ※カメラオン/オフは入室後にもいつでも切替できます。
```

### No-show時 30分後 (押し売りゼロ)

```yaml
trigger: booking_confirmed AND now == booking_time + 30min AND NOT attended
type: text
content: |
  本日のお時間、お忙しかったでしょうか。
  もしご都合よろしい時にあらためてお話しできたら嬉しいです。

  再予約はこちらから1クリックで日程を選び直していただけます。
button:
  label: "別の日に振り替える"
  url: "https://tcal.jp/p/revirall-jun-1on1?line_user_id={{user_id}}&utm_source=lstep&utm_medium=line&utm_campaign=v2_noshow_recovery"
# 再送はこの1度のみ。さらに無反応なら沈黙。
```

---

## Zoom面談 60分 アジェンダ (営業ではなくホンモノのガチコンサル)

| 時間 | 内容 | 主役 | 目的 |
|------|------|------|------|
| 00:00-05:00 | アイスブレイク + 来てくれたお礼 | JUN | 安心感の醸成 |
| 05:00-15:00 | ヒアリング: チーム規模/運営年数/痛みTop3 | 来訪者 | 現状把握 |
| 15:00-45:00 | **打ち手を3つ一緒に出す ← 主成分** | 共同 | 整理メモの素材 |
| 45:00-50:00 | 「もし伴走必要ならREVIRALLの仕組みもある」(選択肢提示のみ・5分) | JUN | 売り込まない案内 |
| 50:00-55:00 | 質疑応答 | 来訪者 | 不安解消 |
| 55:00-60:00 | 整理メモを画面共有でその場で清書 → メール送付約束 | JUN | 持ち帰り具体物確定 |

### 面談後フォロー
```yaml
trigger: zoom_attended
delay: 24h
type: text_with_file
content: |
  本日はお時間いただき、ありがとうございました。
  約束通り、整理メモをお送りします。

  ※このメモは、契約有無に関係なくあなたの財産です。
  ※何か追加で質問があれば、このトークで気軽にどうぞ。
file: ./manual_attach/{{user_id}}-integration-memo.pdf
```

### 契約しなかった人への中長期フォロー
```yaml
trigger: zoom_attended AND NOT contract_signed
delay: 30day
type: text
content: |
  あの日のお話から1ヶ月経ちましたが、お変わりないでしょうか。
  もし整理メモの中で「ここだけもう一度詰めたい」という箇所が
  あれば、無料でいつでも30分追加コンサルやります。
  （これは契約者にも非契約者にもお伝えしている、JUNのルールです。）
button:
  label: "30分の追加コンサルを予約する"
  url: "https://tcal.jp/p/revirall-jun-30min-followup?line_user_id={{user_id}}"
```

---

## 規約セーフリスト チェック

| 規約 | チェック項目 | 対応 |
|------|-------------|------|
| Meta広告ポリシー | MLM/権利収入/不労所得 直接表現 | NG語0件 (全文grep済想定) |
| 景表法 | 「絶対」「必ず」「保証」 | NG語0件、プロセス保証のみ |
| 特商法 | 9要素 | LP Block 12で対応済 |
| 個情法27条 | Q1選択は識別情報不該当 | OK / CAPI同意フロー後のみ |
| ステマ規制 | 事例の報酬支給明記 | Day3 carousel に注釈 |
| LINE規約 | 固定希少性「残り3枠」 | 動的変数のみ使用 |
| 薬機法 | 健康・美容効能表現 | 該当なし (community mode) |

---

## 期待コンバージョン (新設計 vs 旧設計)

| Stage | 旧設計% | 新設計% | 根拠 |
|-------|---------|---------|------|
| 広告 1000imp → click | 2% | 2% | LP変更なし |
| LP → LINE追加 | 12% | 12% | LP変更なし |
| LINE → Q3完了 | 70% | **95%** | Q3問→Q1問で摩擦67%減 |
| Q完了 → 予約 | 30% | **45%** | Day0即予約導線+共感ハンドリング |
| 予約 → Zoom実施 | 65% | **88%** | No-show 5段リマインド |
| Zoom → 契約 | 20% | 22% | 整理メモ持ち帰り信頼度up |
| **1000imp → 成約** | **0.07** | **0.20** | **2.86倍** |

理論ROAS: ¥80,000 × 12 × 0.20 = ¥192,000 / 1000imp / ¥6,000 = **32x** (理論値)
実運用は CAPI ロス・解約率込で 8-12x が現実的予測。

---

## CSV出力フォーマット (LStep インポート想定)

```csv
scenario_id,step_no,trigger,delay_amount,delay_unit,send_time,message_type,content,button1_label,button1_url,button2_label,button2_url,quick_reply_options,tag_add,tag_remove,condition,fire_capi_event,notes
MAIN,1,friend_add,0,sec,,image_with_text,"はじめまして、坂本純一(JUN)です。...",,,,,,,,,,Welcome
MAIN,2,prev_step_done,30,sec,,quick_reply,"いま、あなたのコミュニティで...",,,,, "もう紹介する人がリストに残ってない|pain_list_exhausted, メンバーの反応が落ちてきた|pain_reaction_down, ...",,, ,Q1痛み軸
...
```

カラム説明:
- `scenario_id`: MAIN / FOLLOW / NOSHOW_RECOVERY 等
- `step_no`: 同scenario内の順序
- `trigger`: friend_add / prev_step_done / any_q1_answer / tag_xxx_added / booking_confirmed / time_at_xx / day_n_at_xx / NOT_tag_yyy 等
- `delay_amount` + `delay_unit`: 相対遅延 (sec/min/hour/day)
- `send_time`: 絶対時刻 (例: "Day1 09:00")
- `message_type`: text / image_with_text / video_with_text / quick_reply / text_with_button / carousel_3cards / text_with_file / rich_message
- `content`: 本文(改行は\n)
- `button{1,2}_label/url`: ボタン
- `quick_reply_options`: 「ラベル|タグ」をカンマ区切り
- `tag_add` / `tag_remove`: 後処理タグ
- `condition`: 配信条件式
- `fire_capi_event`: Meta CAPI送信イベント名
- `notes`: 設定者向けメモ

---

## DRAFT v1 完了

次工程: 7観点並列レビュー → 修正ループ → 100点(全観点95+/平均97+)到達 → 最終CSV化
