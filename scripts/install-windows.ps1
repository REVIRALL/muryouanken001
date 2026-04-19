# Meta Ads MCP セットアップスクリプト (Windows)
# 使い方: PowerShellで ./scripts/install-windows.ps1
#
# ※初回実行で ExecutionPolicy エラーが出る場合:
#   管理者PowerShellで: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

$ErrorActionPreference = 'Stop'

Write-Host "=== Meta Ads MCP Setup (Windows) ===" -ForegroundColor Cyan

# Python コマンドを検出 (python / py / python3)
$pyCmd = $null
foreach ($candidate in @('python', 'py', 'python3')) {
    if (Get-Command $candidate -ErrorAction SilentlyContinue) {
        $pyCmd = $candidate
        break
    }
}

if (-not $pyCmd) {
    Write-Host "[ERROR] Python not found. Install Python 3.10+ from https://python.org/" -ForegroundColor Red
    Write-Host "After install, make sure 'Add Python to PATH' was checked." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Python command: $pyCmd" -ForegroundColor Green

# バージョンチェック (3.10+)
$verOutput = & $pyCmd --version 2>&1
$verStr = ($verOutput -replace 'Python ', '').Trim()
$verParts = $verStr.Split('.')
$major = [int]$verParts[0]
$minor = [int]$verParts[1]

if ($major -lt 3 -or ($major -eq 3 -and $minor -lt 10)) {
    Write-Host "[ERROR] Python $verStr detected. Requires Python 3.10+." -ForegroundColor Red
    Write-Host "Install a newer version from https://python.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Python $verStr" -ForegroundColor Green

# pip インストール
Write-Host "Installing meta-ads-mcp ..." -ForegroundColor Cyan
& $pyCmd -m pip install --upgrade meta-ads-mcp
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] pip install failed. See above output." -ForegroundColor Red
    Write-Host "If you see 'externally-managed-environment', try venv:" -ForegroundColor Yellow
    Write-Host "  $pyCmd -m venv .venv; .\.venv\Scripts\activate; pip install meta-ads-mcp" -ForegroundColor Yellow
    exit 1
}

# 動作確認
Write-Host "`nVerifying installation ..." -ForegroundColor Cyan
$helpOut = & $pyCmd -m meta_ads_mcp --help 2>&1
if ($helpOut -match "Meta Ads MCP Server") {
    Write-Host "[OK] meta-ads-mcp installed and importable" -ForegroundColor Green
} else {
    Write-Host "[WARN] --help output doesn't match expected. Inspect manually:" -ForegroundColor Yellow
    Write-Host $helpOut
}

Write-Host "`n=== Installation Complete ===" -ForegroundColor Green
Write-Host @"

Next steps:
1. docs/01-meta-app-setup.md を読んで Meta App を作成、トークン発行
2. docs/03-claude-code-config.md を読んで ~/.claude.json (%USERPROFILE%\.claude.json) を編集
3. Claude Code を再起動して meta-ads-local MCP を有効化

Python command used for this setup: $pyCmd
If docs/03 の自動スクリプトで `python` が見つからない場合、
~/.claude.json の `command` フィールドを "$pyCmd" に変更してください。

"@ -ForegroundColor Yellow
