# REVIRALL Meta広告 自動化リポジトリ

- **対象**: Meta広告運用者（Claude Code 経験あり、MCPセルフホストは初めてでOK）
- **できること**: セルフホストMCPで Meta Ads API を Claude Code から直接操作（Pipeboard無料プラン制限を回避）
- **初回セットアップ所要時間**: 45〜75分（Meta App作成・2FA・TOS承諾・LPデプロイ含む。トラブル吸収で最大90分）

---

## 構成

```
revirall-meta-ads-automation/
├── README.md                              ← 全体概要（この文書）
├── docs/
│   ├── 01-meta-app-setup.md               ← Setup Phase 1/3
│   ├── 02-mcp-server-install.md           ← Setup Phase 2/3
│   ├── 03-claude-code-config.md           ← Setup Phase 3/3
│   ├── 04-lead-event-verification.md      ← 運用: Pixel発火確認
│   ├── 05-benchmark-analysis.md           ← 運用: 相場ベンチマーク
│   └── 06-netlify-deploy.md               ← 運用: LPデプロイ
├── lp/                                    ← ランディングページ本体
│   ├── index.html
│   ├── privacy/index.html
│   ├── _headers
│   └── assets/
├── logs/                                  ← セッション記録（参考、必読ではない）
│   └── 2026-04-18-session.md
├── scripts/
│   ├── install-windows.ps1
│   └── install-mac-linux.sh
└── config/
    └── mcp-server.template.json
```

### ドキュメントの読む順番

- **セットアップ Phase（初回のみ）**: `docs/01` → `docs/02` → `docs/03`
- **運用 Phase**: `docs/04`（計測検証） / `docs/05`（ベンチ分析） / `docs/06`（デプロイ）
- **参考**: `logs/` に過去セッションの判断理由と実績が時系列で残る

---

## クイックスタート

### 1. 前提確認
- Python 3.10+ がインストール済み（`python --version` または `py --version`）
- Claude Code が一度以上起動済み（`~/.claude.json` 生成済み、Windowsは `%USERPROFILE%\.claude.json`）
- Meta Business Manager に管理者権限でアクセスできる
- **Windows**: PowerShell 実行ポリシーが `RemoteSigned` 以上（初回のみ管理者PowerShellで `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`）

### 2. meta-ads-mcp インストール
Windows:
```powershell
./scripts/install-windows.ps1
```
Mac/Linux:
```bash
bash scripts/install-mac-linux.sh
```

### 3. Meta App 作成 & 長期トークン発行
→ `docs/01-meta-app-setup.md`

### 4. Claude Code MCP 設定
→ `docs/03-claude-code-config.md`

`config/mcp-server.template.json` をコピーして `YOUR_META_APP_ID` / `YOUR_META_ACCESS_TOKEN` を置換し、`~/.claude.json` の `projects.<作業ディレクトリ>.mcpServers` の中へ追加。

### 5. Claude Code 再起動
MCPサーバーは起動時のみ読み込まれる。プロセス終了 → 再起動で `mcp__meta-ads-local__*` ツール群が有効化。

### 6. LP デプロイ
→ `docs/06-netlify-deploy.md`

### 7. Lead 発火確認
→ `docs/04-lead-event-verification.md`

---

## 既存Pipeboard MCPとの関係

このリポジトリは**Pipeboardを前提としない**。既に `~/.claude.json` にPipeboard MCPが登録されている場合:
- **削除不要**。セルフホスト版 `meta-ads-local` と並列稼働可能（ツール名が `mcp__meta-ads__*` と `mcp__meta-ads-local__*` で分離される）
- Pipeboardが不要なら `projects.<path>.mcpServers.meta-ads` を削除してOK

---

## 現在の広告アカウント状態（2026-04-19時点）

| 項目 | 値 |
|---|---|
| アカウント | REVIRALL (act_1215978840164411) |
| 累計消化 | ¥93,549 |
| 残高 | ¥2,143 |
| キャンペーン | 無料案件代理店001 (120242015802140634) [PAUSED] |
| Pixel | REVIRALL_Pixel (2450922202046153) |
| Page | クローズドasp運営事務局 (1119702451216065) |
| Instant Form | 代理店001_InstantForm_v1 (952326073949935) [未適用] |

## 勝ちパターン（2026-04-18分析結果）

- **メリット訴求v2（静止画）**: CPM ¥1,036 / LPV cost ¥243 / link→LPV 90%
- **Facebook Feed 配置**: LPV cost ¥553（主戦場）
- **25-34女性**: LPV cost ¥289（最安セグメント）
- **Instagram Reels**: LPV cost ¥2,266 → 除外済

## 既知の課題

- [ ] LP Lead event 本番発火未確認（2日分データでLead action=0）
- [ ] spend_cap ¥100,000 で自動停止（再開前に増額判断）
- [ ] Instagramビジネスアカウント未連携
- [ ] 独自ドメイン未取得（Netlifyサブドメインのみ）
- [ ] CAPI (Conversion API) 未実装
- [ ] カスタムオーディエンスTOS未承諾
- [ ] Lead Gen TOS未承諾

詳細は `logs/2026-04-18-session.md` 参照。

---

## ライセンス・取り扱い

**private リポジトリ推奨**。

機密トークンは `.gitignore` で除外済みだが、以下は**ビジネス戦略情報**として扱う:
- 広告アカウント階層（act_ID, Campaign ID, AdSet ID, Ad ID, Pixel ID, Page ID）
- CPM/CPC/LPV cost/CPAの実績値
- 勝ちクリエイティブの特定情報
- `logs/2026-04-18-session.md` の作業履歴

**publicリポジトリで公開する場合の最低限の対応**:
1. `logs/` を `.gitignore` に追加して非公開化
2. README の「現在の広告アカウント状態」「勝ちパターン」セクションをマスク
3. `exiftool -all= lp/assets/*.jpg` で画像メタデータ剥離
4. `lp/assets/cr001.mp4` も `ffmpeg -map_metadata -1 -c copy` でメタデータ剥離

トークン漏洩リスクは実質ゼロだが、競合への戦略露出を避けるためprivate推奨。
