# LStep Scenario Design - REVIRALL

**Generated:** 2026-05-11
**Based on:** ./segments.json (5 segments)
**Tool:** LStep
**Booking tool:** Tカレ (LINE連携最強、community + 日本市場で第1推奨)
**Total messages:** 約25本（5セグメント分）

---

## セグメント別配信戦略サマリー

| Segment | Strategy | Days | Total messages | CV target |
|---------|----------|------|---------------|-----------|
| AAA (8%)  | immediate_zoom | 2 | 4 | 即予約 |
| AA (22%)  | 7day_education | 7 | 9 | Day5予約 |
| A (28%)   | 30day_nurture | 30 | 14 | Day20 ebook + Day25予約 |
| B (25%)   | 30day_nurture軽量 | 30 | 6 | 長期育成 |
| C (17%)   | exclude | 0 | 1 (welcome+dismiss) | 弾く |

---

## Day0 共通: Welcome + Q1-Q3

```yaml
trigger: friend_add
steps:
  - delay: 5sec
    type: text
    content: |
      はじめまして！REVIRALLです。
      ご登録ありがとうございます。

  - delay: 30sec
    type: text
    content: |
      ご回答内容に応じて、最適な情報をお届けします。
      3つだけ簡単な質問にお答えください。
      ※個人を特定する情報（氏名・電話・住所）は一切お聞きしません。

  - delay: 0sec
    type: quick_reply
    question: |
      Q1: 現在、どのようなお仕事をされていますか？
    options:
      - {label: ビジネスオーナー, tag: occ_owner}
      - {label: 副業中, tag: occ_side}
      - {label: 会社員, tag: occ_employee}
      - {label: 主婦・主夫, tag: occ_homemaker}
      - {label: その他, tag: occ_other}

  - trigger: any_q1_answer
    delay: 5sec
    type: quick_reply
    question: |
      Q2: 現在ご自身のチーム・コミュニティのメンバーは何名くらいですか？
    options:
      - {label: 5名未満, tag: scale_under5}
      - {label: 5-15名, tag: scale_5to15}
      - {label: 15-50名, tag: scale_15to50}
      - {label: 50名以上, tag: scale_50plus}

  - trigger: any_q2_answer
    delay: 5sec
    type: quick_reply
    question: |
      Q3: これまで自己投資（学び・コーチング等）に使ってきた金額は？
    options:
      - {label: 〜3万円, tag: invest_under3}
      - {label: 3-30万円, tag: invest_3to30}
      - {label: 30-100万円, tag: invest_30to100}
      - {label: 100万円以上, tag: invest_100plus}
```

## Q3完了 → セグメント判定

```yaml
trigger: any_q3_answer
condition_matrix:
  - if: scale_50plus OR (scale_15to50 AND invest_100plus)
    then_tag: AAA, then_scenario: ScenarioAAA
  - elseif: scale_5to15 OR scale_15to50, AND (invest_30to100 OR invest_3to30)
    then_tag: AA, then_scenario: ScenarioAA
  - elseif: scale_5to15 AND invest_3to30
    then_tag: A, then_scenario: ScenarioA
  - elseif: scale_under5 OR invest_under3
    then_tag: B, then_scenario: ScenarioB
  - else: occ_other AND scale_under5 AND invest_under3
    then_tag: C, then_scenario: ScenarioC
```

---

## ScenarioAAA: immediate_zoom (Day0-1, 計4通)

```yaml
trigger: tag_AAA_added

day0:
  - delay: 5sec
    content: |
      ご回答ありがとうございます！
      あなたのステージなら、まずは個別Zoomでお話しさせてください。
      30分の無料相談です。
      お好きな時間でお選びください ↓
  - delay: 0sec
    content: |
      [Tカレ予約URL?line_user_id={{user_id}}&segment=AAA]

day1:
  - trigger: tag_AAA AND NOT tag_scheduled
    time: 10:00
    content: |
      昨日のメッセージ、ご確認いただけましたでしょうか。
      ご都合よろしいタイミングで、Zoom予約のご検討お願いします。
      [Tカレ予約URL?line_user_id={{user_id}}]
```

---

## ScenarioAA: 7day_education (Day0-7, 計9通)

```yaml
trigger: tag_AA_added

day0:
  - delay: 5sec
    content: |
      ご回答ありがとうございます！
      まずは「勧誘トークだけが限界な本当の理由」をお話しした60秒の動画をご覧ください。
  - delay: 3sec
    type: video_link
    content: |
      [YouTube限定公開URL Day0動画]

day1:
  - time: 10:00
    content: |
      昨日の動画はいかがでしたか？
      今日は「メンバー還元型モニター案件マッチングとは」を90秒でご紹介します。
  - delay: 3sec
    type: video_link

day3:
  - time: 19:00
    content: |
      今日は実際にこの仕組みを使ったメンバーさんのインタビューをお届けします。
      （顔出し・3名）
      ※体験者にはモニター費用または受講料割引が支給されている場合があります。
  - delay: 3sec
    type: video_link

day5:
  - time: 19:00
    content: |
      ここまで動画をご覧いただき、ありがとうございました。
      30分の無料Zoom相談、よろしければご検討ください。
      [Tカレ予約URL?line_user_id={{user_id}}]

day7:
  - trigger: tag_AA AND NOT tag_scheduled
    time: 12:00
    content: |
      今週の無料Zoom相談の空き枠、よろしければご確認ください。
      無理のない時間でお選びいただけます。
      [Tカレ予約URL?line_user_id={{user_id}}]
  # 補足: 実残数を出す場合は {{actual_remaining_slots}} カスタム変数で動的差込
  # 固定文言「残り3枠」等は規約NG
```

---

## ScenarioA: 30day_nurture (Day0-30, 計14通)

```yaml
trigger: tag_A_added

day0-7: AA同等（動画3本＋Day5予約案内）

day10:
  - time: 19:00
    content: |
      [追加事例: 35歳女性・チーム8名 → 月¥30k還元実現]

day15:
  - time: 19:00
    content: |
      [業界トレンド解説: コミュニティビジネスの最新動向]

day20:
  - time: 19:00
    content: |
      [Mid-funnel offer: 電子書籍¥9,800
      『勧誘ゼロでチームが広がる7つの仕組み』]
      実際のメンバーさんから「これがあれば最初から助かった」と
      言われた内容を1冊にまとめました。
  # 購入後タグ: ebook_buyer → A→AA昇格パスへ (R2 nice-to-have)
  - on_purchase:
      add_tag: ebook_buyer
      promote_tag: AA  # ScenarioAAへ追加投入

day25:
  - time: 19:00
    content: |
      [Zoom予約再案内]

day30:
  - content: |
      ステップ配信は今日で終了です。
      引き続き月1のメルマガでお役立ち情報をお届けします。
```

---

## ScenarioB: 30day_nurture軽量 (Day0/Day10/Day20/Day30, 計6通)

- 配信頻度週1
- Mid-funnel offer なし
- Day30 後はメルマガに自動移行

---

## ScenarioC: exclude (Day0のみ計1通)

```yaml
trigger: tag_C_added
steps:
  - delay: 5sec
    content: |
      ご回答ありがとうございます。
      今のステージなら、まずはコミュニティの土台作りからの方が
      お役に立ちそうです。
  - delay: 3sec
    content: |
      無料の電子書籍「コミュニティ作りの最初の一歩」をプレゼントします。
      [DLリンク]
  - delay: 5sec
    content: |
      LINEでの追加配信は控えますが、ブロックせずに置いておいて頂けたら
      嬉しいです。何かあった時にすぐご相談いただけます。
# 以後の配信なし
```

---

## 規約セーフリストチェック (v1.0.2 EXCLUDE_FIELDSルール準拠)

NG語 grep を `disqualification_signals` 等を除外して実行:
- Meta NG語: 0件 ✓
- LINE NG (今すぐ.../残り◯枠 等): 0件 ✓
- 薬機法 NG: 0件 ✓ (community modeのため非該当)

ステマ規制: Day3 受講生インタビューに「※体験者にはモニター費用支給の場合あり」明記 ✓
特商法: Block 12 + 決済画面で 8項目フル対応 ✓
個情法27条: cookie consent + Meta CAPI同意フロー実装 ✓

---

## 期待コンバージョン（コホート1000人想定）

| Stage | Conversion% | 人数 |
|-------|-------------|------|
| 広告 1000imp → click | 2% | 20 |
| LP click → visit | 100% | 20 |
| LP→LINE (Block CTA 4面) | 12% | 2.4 |
| LINE→Q3完了 | 70% | 1.7 |
| Q3完了→Schedule予約 (AAA即/AA Day5/A Day25) | 30% | 0.5 |
| Schedule→Zoom実施 (リマインダー前日21+当日2H前) | 65% | 0.33 |
| Zoom→契約 (スタンダード) | 20% | 0.07 |

→ 1000imp → 0.07成約 = ¥80,000 LTV/月 × 12ヶ月 × 0.07 = ¥67,200 / 1000imp
→ Meta CPM ¥6,000 → 1000imp = ¥6,000
→ ROAS = ¥67,200 / ¥6,000 = **11.2x** (理論値)

実運用は Pixel/CAPI ロス・No-show・解約率込みで 3-5x が現実的。
