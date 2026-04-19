# Phase 2/3: meta-ads-mcp インストール

セルフホスト版の Meta Ads MCP サーバーをローカルで動かす。

## 前提

- Python 3.10+ インストール済み
- pip が使える
- `docs/01` でトークン取得済み（または並行作業中）

## 1. インストール

```bash
pip install meta-ads-mcp
```

期待される出力（末尾）:
```
Successfully installed meta-ads-mcp-1.0.86 ...
```

### ポイント
- PEP 668（Ubuntu 23.04+ / macOS Homebrew Python）で `externally-managed-environment` エラーが出る場合は venv を使用:
  ```bash
  python -m venv .venv
  source .venv/bin/activate    # Windows: .venv\Scripts\activate
  pip install meta-ads-mcp
  ```
- 仮想環境を使う場合、Claude Code の MCP設定の `command` は venv内の Python のフルパスに変更する必要あり

## 2. インストール確認（動作テスト）

```bash
python -m meta_ads_mcp --help
```

期待される出力に `Meta Ads MCP Server - Model Context Protocol server for Meta Ads API` が含まれればOK。`META_APP_ID environment variable is not set.` WARNINGは正常（まだ環境変数未設定のため）。

## 3. 環境変数テスト（手動起動）

トークン取得後、以下でMCPサーバー単体起動を確認:

### Windows PowerShell
```powershell
$env:META_APP_ID = "YOUR_META_APP_ID"
$env:META_ACCESS_TOKEN = "YOUR_META_ACCESS_TOKEN"
python -m meta_ads_mcp --transport stdio
```

### Mac/Linux
```bash
export META_APP_ID="YOUR_META_APP_ID"
export META_ACCESS_TOKEN="YOUR_META_ACCESS_TOKEN"
python -m meta_ads_mcp --transport stdio
```

stdin 待機状態になれば正常（`Ctrl+C` で抜ける）。エラーログが流れたら環境変数かトークン問題。

## 4. Graph API 疎通確認（トークン単体）

```bash
curl "https://graph.facebook.com/v24.0/me/adaccounts?fields=name,account_id,currency&access_token=YOUR_META_ACCESS_TOKEN"
```

期待される出力:
```json
{
  "data": [
    {
      "name": "<あなたのアカウント名>",
      "account_id": "<数字>",
      "currency": "JPY",
      "id": "act_<数字>"
    }
  ]
}
```

エラーの場合:
- `Invalid OAuth access token` → トークン無効・期限切れ（`docs/01` で再発行）
- 権限エラー → 権限が不足（`ads_read` 等を追加して再発行）

## 5. よくあるエラー

### `ModuleNotFoundError: No module named 'meta_ads_mcp'`
pipでインストールしたPythonと実行中のPythonが異なる。`python -m pip install meta-ads-mcp` で同じPythonに明示的に入れ直す。

### `Invalid OAuth access token`
- トークン60日期限切れ → `docs/01` で再発行
- アプリモードがDevelopmentなのにトークンが別アプリ・別BM所属のアセット用

### `(#100) Application does not have permission for this action`
権限不足。`docs/01` ステップ5で必要権限を追加した上で再発行。

### `externally-managed-environment`
PEP 668 対応の新しい環境。上記§1の venv 手順に切替え。

## 次へ
→ `03-claude-code-config.md` で Claude Code に MCP サーバーを登録
