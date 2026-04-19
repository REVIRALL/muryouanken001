#!/usr/bin/env bash
# Meta Ads MCP セットアップスクリプト (Mac/Linux)
# 使い方: bash scripts/install-mac-linux.sh

set -e

echo "=== Meta Ads MCP Setup (Mac/Linux) ==="

# Python 存在確認
if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "[ERROR] Python not found. Install Python 3.10+:"
  echo "  macOS: brew install python@3.12"
  echo "  Linux: apt install python3"
  exit 1
fi

# バージョンチェック (3.10+)
VER=$($PY -c 'import sys; print("{}.{}".format(sys.version_info[0], sys.version_info[1]))')
MAJOR=$(echo "$VER" | cut -d. -f1)
MINOR=$(echo "$VER" | cut -d. -f2)

if [ "$MAJOR" -lt 3 ] || { [ "$MAJOR" -eq 3 ] && [ "$MINOR" -lt 10 ]; }; then
  echo "[ERROR] Python $VER detected. Requires Python 3.10+."
  exit 1
fi

echo "[OK] Python $VER ($PY)"

# PEP 668 対応: --user or venv を検討
echo "Installing meta-ads-mcp ..."
if ! $PY -m pip install --upgrade meta-ads-mcp 2>&1; then
  echo ""
  echo "[WARN] pip install failed. If 'externally-managed-environment' error, try:"
  echo "  1) $PY -m pip install --user meta-ads-mcp"
  echo "  2) Or create a venv:"
  echo "     $PY -m venv .venv && source .venv/bin/activate && pip install meta-ads-mcp"
  exit 1
fi

# 動作確認
echo ""
echo "Verifying installation ..."
$PY -m meta_ads_mcp --help | grep -q "Meta Ads MCP Server" && echo "[OK] installed"

echo ""
echo "=== Installation Complete ==="
echo ""
echo "Next steps:"
echo "1. docs/01-meta-app-setup.md を読んで Meta App を作成、トークン発行"
echo "2. docs/03-claude-code-config.md を読んで ~/.claude.json を編集"
echo "3. Claude Code を再起動して meta-ads-local MCP を有効化"
