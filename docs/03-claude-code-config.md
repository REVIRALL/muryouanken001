# Phase 3/3: Claude Code への MCP サーバー登録

## 前提
- `docs/01` で `YOUR_META_APP_ID` / `YOUR_META_ACCESS_TOKEN` 取得済み
- `docs/02` で `meta-ads-mcp` インストール済み
- Claude Code が一度以上起動済み（`~/.claude.json` 生成済み）

## 設定ファイルの場所

| OS | パス |
|---|---|
| Windows | `%USERPROFILE%\.claude.json` |
| Mac/Linux | `~/.claude.json` |

## 設定構造

`~/.claude.json` はユーザーレベル設定。MCPサーバーはトップレベル `mcpServers` と、プロジェクト別の `projects.<path>.mcpServers` の両方で定義可能。本リポジトリでは**プロジェクト別**（作業ディレクトリ配下だけで有効）に入れる。

## 追加する内容

`config/mcp-server.template.json` を参考に、`projects["<作業ディレクトリ絶対パス>"].mcpServers` の中へ以下を追加:

```json
"meta-ads-local": {
  "type": "stdio",
  "command": "python",
  "args": ["-m", "meta_ads_mcp"],
  "env": {
    "META_APP_ID": "YOUR_META_APP_ID",
    "META_ACCESS_TOKEN": "YOUR_META_ACCESS_TOKEN"
  }
}
```

## 自動設定スクリプト（推奨）

以下をローカルで実行。既存環境を壊さないようバックアップ+setdefaultガード付き:

```python
import json, os, shutil
from datetime import datetime

# ▼ ここ2つだけ自分の値に置換
APP_ID = "YOUR_META_APP_ID"
ACCESS_TOKEN = "YOUR_META_ACCESS_TOKEN"

p = os.path.expanduser('~/.claude.json')
if not os.path.exists(p):
    raise SystemExit(f'~/.claude.json が存在しません。Claude Code を一度起動してください: {p}')

# バックアップ
backup = p + f'.backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
shutil.copy2(p, backup)
print(f'Backup: {backup}')

with open(p, 'r', encoding='utf-8') as f:
    d = json.load(f)

# 現在の作業ディレクトリをプロジェクトキーとする
# Claude Code は既存キーとの一致で判定するため、既に同じパスのキーがあればその形式に合わせる
cwd_raw = os.getcwd()
cwd_fwd = cwd_raw.replace('\\', '/')
existing = list(d.get('projects', {}).keys())
if cwd_raw in existing:
    project_path = cwd_raw
elif cwd_fwd in existing:
    project_path = cwd_fwd
else:
    # 新規キー: 既存キーがフォワードスラッシュ優勢ならそれに合わせる
    use_fwd = sum(1 for k in existing if '/' in k and '\\' not in k) >= sum(1 for k in existing if '\\' in k)
    project_path = cwd_fwd if use_fwd else cwd_raw
print(f'Using project_path: {project_path!r}')

# setdefaultで階層を安全に初期化
(d.setdefault('projects', {})
  .setdefault(project_path, {})
  .setdefault('mcpServers', {}))['meta-ads-local'] = {
    "type": "stdio",
    "command": "python",
    "args": ["-m", "meta_ads_mcp"],
    "env": {
        "META_APP_ID": APP_ID,
        "META_ACCESS_TOKEN": ACCESS_TOKEN,
    }
}

# Atomic write: tempfileに書いてからrename
tmp = p + '.tmp'
with open(tmp, 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
os.replace(tmp, p)

print(f'Added meta-ads-local to project: {project_path}')
```

## 既存 Pipeboard MCP との共存

Pipeboard MCP (`meta-ads`, `google-ads`) が既に登録されている場合:
- **残したままでOK**。ツール名のプレフィックスが `mcp__meta-ads__*` と `mcp__meta-ads-local__*` で重複しない
- 完全に切りたければ `projects.<path>.mcpServers.meta-ads` を削除

## 再起動必須

Claude CodeはMCPサーバーを**起動時のみ**読み込むため、設定変更後は:
1. 現在のClaude Codeセッションを閉じる（プロセス終了）
2. 再起動
3. `mcp__meta-ads-local__get_ad_accounts` 等のツールが使えることを確認

## トラブルシューティング

### MCPサーバーが認識されない
1. `python -m meta_ads_mcp --help` が正常動作するか確認
2. `~/.claude.json` のJSONが壊れていないか: `python -c "import json; json.load(open(r'<path>'))"`
3. `command` が `python` で通らない環境なら `python3` や絶対パス `/usr/bin/python3` に変更

### トークン期限切れ
60日経過後は `META_ACCESS_TOKEN` を新トークンに書き換え → Claude Code再起動。

## セキュリティ

`.claude.json` はトークン平文を含むため:
- Git には**絶対にコミットしない**（`.gitignore` 登録済）
- 画面共有時は注意
- PCを貸すときはユーザー切替

## 次へ
→ `04-lead-event-verification.md` で Pixel Lead イベントの本番発火確認
