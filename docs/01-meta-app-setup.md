# Phase 1/3: Meta App 作成 & 長期アクセストークン発行

所要時間: 10〜15分

このPhaseでは、Meta for Developers で新規アプリを作成し、Marketing API 経由で長期（60日有効）の User Access Token を取得する。

## 前提
- Meta Business Manager（BM）に管理者権限でアクセスできること
- ログイン用Facebookアカウントがあること
- 2要素認証がセットアップ済みであること

## ステップ1: アプリ作成

1. https://developers.facebook.com/apps/ へアクセス
2. 「**アプリを作成**」クリック
3. 用途: **「その他」** → 次へ
4. アプリタイプ: **「ビジネス」** → 次へ
5. アプリ名（例 `REVIRALL Ads MCP`）、連絡先メール、BMを選択 → 作成
6. 2要素認証を求められたら通過

## ステップ2: ユースケース選択

ユースケース選択画面が表示される場合:
- 左フィルターで **「広告と収益化」** を選択
- **「広告キャンペーンの管理」** 相当のユースケースを選ぶ
- 該当がなければ、最下部の **「他の」**（This option is going away soon）でも可

## ステップ3: マーケティングAPI 追加

1. アプリダッシュボード「**製品を追加**」
2. **「マーケティングAPI」** の「設定」をクリック

## ステップ4: App ID 確認

1. 左メニュー「**アプリの設定 → ベーシック**」
2. 画面上部に表示される **アプリID**（15〜16桁の数字）をメモ
3. 期待される例: `1234567890123456`
4. このID が `YOUR_META_APP_ID` になる

## ステップ5: 短期トークン発行

1. 左メニュー「**マーケティングAPI → ツール**」
2. **「アクセストークンを取得」** セクション
3. 権限（Permissions）で以下を最低限チェック:
   - ✅ `ads_read`
   - ✅ `ads_management`
   - ✅ `read_insights`
4. Instant Form / Lead Gen を使う場合は追加で:
   - ✅ `pages_manage_ads`
   - ✅ `pages_read_engagement`
   - ✅ `business_management`
   - ✅ `leads_retrieval`
5. **「トークンを取得」** クリック
6. 承認ダイアログで「続ける」
7. 発行された `EAA` で始まる長い文字列をコピー（約2時間有効の短期トークン）

## ステップ6: 60日長期トークン化

1. 別タブで https://developers.facebook.com/tools/debug/accesstoken/ を開く
2. 短期トークンを貼り付け → 「**デバッグ**」
3. 表示された情報の下の **「Extend Access Token」** クリック
4. 新しいトークン（60日有効）が発行される
5. このトークンが `YOUR_META_ACCESS_TOKEN` になる

### トークン有効性チェック

```bash
curl "https://graph.facebook.com/v24.0/me/adaccounts?fields=name,account_id,currency&access_token=YOUR_META_ACCESS_TOKEN"
```

期待される出力（JSON）:
```json
{
  "data": [
    {"name": "REVIRALL", "account_id": "...", "currency": "JPY", "id": "act_..."}
  ]
}
```

## Q&A

**Q: 有効期限60日後どうなる？**
A: ステップ5-6を再実行して再発行。恒久化したい場合は System User Access Token（BM管理画面から別途発行）を検討。

**Q: アプリを Publish / ライブモードにする必要は？**
A: 不要。自BM所属アカウント/ページの操作だけなら Development モードで動く。

**Q: `ads_management` 等の権限で「高度なアクセス」審査は必要？**
A: 開発モードの自BM所属アセットに対してなら「標準アクセス」で動作、審査不要。

**Q: アプリシークレットは必要？**
A: 本ワークフローでは不要（OAuth Code Flowを使わず既発行トークンを直接使用）。

## 次へ
→ `02-mcp-server-install.md` で meta-ads-mcp をローカルにインストール
