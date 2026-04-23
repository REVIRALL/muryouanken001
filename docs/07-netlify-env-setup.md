# Netlify 環境変数セットアップ（CAPI 稼働のために必須）

現状 `META_CAPI_TOKEN` / `META_PIXEL_ID` が **未設定のため、CAPI が全リクエストを 500 で失敗させている**。
iOS/Safari ユーザーのコンバージョンが計測からロスト中。**最優先で設定すること**。

---

## 必要な環境変数（3 本）

| キー名 | 値 | 取得元 |
|--------|----|--------|
| `META_PIXEL_ID` | `2450922202046153` | Events Manager の Pixel 設定 |
| `META_CAPI_TOKEN` | System User Access Token | Business Settings → System Users |
| `META_TEST_EVENT_CODE` | （任意・テスト時のみ） `TEST12345` 形式 | Events Manager → Test Events タブ |

---

## 1. System User Access Token の取得手順

1. [Meta Business Suite](https://business.facebook.com/) にログイン
2. **Business Settings** → **Users** → **System Users** → **Add**
3. System User 作成後、**Add Assets** → **Pixels** → 対象 Pixel を選択 → **Manage Pixel** を ON
4. **Generate new token** → Scope: `ads_management` + `business_management` を選択
5. トークンは一度しか表示されないので必ずコピーして保管

---

## 2. Netlify ダッシュボードで環境変数を設定

1. [Netlify ダッシュボード](https://app.netlify.com/) → `dairiten-muryoanken1` サイトを選択
2. **Site settings** → **Environment variables**
3. **Add a variable** → **Add a single variable** を選択し、以下を追加:

   ```
   Key:    META_PIXEL_ID
   Value:  2450922202046153
   Scopes: All scopes (Production + Deploy Previews + Branch deploys)
   ```

   ```
   Key:    META_CAPI_TOKEN
   Value:  （手順1で取得した System User Access Token）
   Scopes: All scopes
   Secret: Yes にチェック（ログにマスク表示される）
   ```

   （任意・テスト中のみ）
   ```
   Key:    META_TEST_EVENT_CODE
   Value:  TEST12345（Events Manager の Test Events タブで表示されるコード）
   Scopes: Deploy Previews のみ
   ```

4. **Save** → **Deploys** タブから **Trigger deploy** → **Clear cache and deploy site** を実行

---

## 3. 設定後の動作確認

### A. Netlify Function ログを確認

1. Netlify ダッシュボード → **Functions** → `capi` を選択
2. **Real-time logs** を開いて LP で CTA をクリック
3. `OK` ログが出力されれば成功。`500 Missing META_CAPI_TOKEN` が出たら env var 設定ミス

### B. Meta Events Manager で受信確認

1. [Events Manager](https://business.facebook.com/events_manager2/list) → 対象 Pixel
2. **Test Events** タブ → LP で CTA クリック
3. `ViewContent` イベントが **Browser** と **Server** の両方から受信され、`Deduplicated` 表示になれば成功

### C. EMQ (Event Match Quality) を確認

1. Events Manager → **Overview** → `ViewContent` の Event Match Quality を確認
2. 現状 `fbc` / `fbp` + `client_user_agent` のみなので **4-6 点** が期待値
3. 将来的に email ハッシュ等を追加すれば 7-9 点まで向上可能

---

## 4. ロールバック手順

トークン漏洩などで env var を無効化したい場合:

1. Netlify ダッシュボード → Environment variables → 該当キーの ⋯ → **Delete**
2. Meta Business Settings → System Users → 該当トークンの **Revoke**
3. 新しいトークンを生成して再設定

---

## 5. よくあるミス

| 症状 | 原因 | 対処 |
|------|------|------|
| CAPI が 500 を返す | `META_CAPI_TOKEN` が未設定 or スペース混入 | Netlify UI で再入力 |
| Meta Events Manager に Server イベントが届かない | `META_PIXEL_ID` が間違っている | Events Manager の Data Source ID と一致確認 |
| Deduplicated にならない | client / server で event_id が一致していない | tracking.js の eventID 送信を確認 |
| トークンが漏洩した疑い | GitHub Public Repo への commit 等 | 即 Revoke → 新規発行 → Netlify で差し替え |

---

## 更新履歴

- 2026-04-23: 初版作成（Lead 空砲撤去・ViewContent 一本化に合わせて）
