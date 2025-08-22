#!/bin/bash

# Cursor MCP Server セットアップスクリプト
# notification-mcp を Cursor で使用するための自動セットアップ

set -e

echo "🚀 Cursor MCP Server セットアップ開始"
echo ""

# 現在のディレクトリを取得
CURRENT_DIR="$(pwd)"
CURSOR_CONFIG_DIR="$HOME/.cursor"
CURSOR_MCP_CONFIG="$CURSOR_CONFIG_DIR/mcp.json"
PROJECT_CURSOR_CONFIG=".cursor/mcp.json"

# プロジェクトのビルドを確認
if [ ! -d "dist" ]; then
    echo "📦 プロジェクトをビルド中..."
    npm run build
fi

# Cursor設定ディレクトリを作成
mkdir -p "$CURSOR_CONFIG_DIR"

# 既存の設定ファイルをバックアップ
if [ -f "$CURSOR_MCP_CONFIG" ]; then
    echo "💾 既存の設定をバックアップ中..."
    cp "$CURSOR_MCP_CONFIG" "$CURSOR_MCP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
fi

# 新しい設定を作成または既存設定にマージ
if [ ! -f "$CURSOR_MCP_CONFIG" ]; then
    echo "📝 新しいCursor MCP設定を作成中..."
    cat > "$CURSOR_MCP_CONFIG" << EOF
{
  "mcpServers": {
    "notification-mcp": {
      "command": "node",
      "args": ["$CURRENT_DIR/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
EOF
else
    echo "🔧 既存の設定にnotification-mcpを追加中..."
    # JSONを更新（簡易版、本格的にはjqを使用）
    python3 -c "
import json
import sys

try:
    with open('$CURSOR_MCP_CONFIG', 'r') as f:
        config = json.load(f)
except:
    config = {}

if 'mcpServers' not in config:
    config['mcpServers'] = {}

config['mcpServers']['notification-mcp'] = {
    'command': 'node',
    'args': ['$CURRENT_DIR/dist/index.js'],
    'env': {
        'NODE_ENV': 'production'
    }
}

with open('$CURSOR_MCP_CONFIG', 'w') as f:
    json.dump(config, f, indent=2)

print('設定を更新しました')
" 2>/dev/null || {
    echo "⚠️  Python3が利用できません。手動で設定を確認してください。"
    echo "設定ファイル: $CURSOR_MCP_CONFIG"
    echo "追加する内容:"
    echo "  \"notification-mcp\": {"
    echo "    \"command\": \"node\","
    echo "    \"args\": [\"$CURRENT_DIR/dist/index.js\"],"
    echo "    \"env\": {"
    echo "      \"NODE_ENV\": \"production\""
    echo "    }"
    echo "  }"
}
fi

echo ""
echo "✅ セットアップ完了！"
echo ""
echo "📋 次の手順:"
echo "1. Cursorを再起動してください"
echo "2. 新しいチャットを開始してください"
echo "3. テストコマンドを実行してください:"
echo "   - getSoundPath()"
echo "   - playSound()"
echo "   - showNotification(\"テスト\", \"セットアップ完了\")"
echo ""
echo "📁 設定ファイル場所:"
echo "   - グローバル設定: $CURSOR_MCP_CONFIG"
echo "   - プロジェクト設定: $PROJECT_CURSOR_CONFIG"
echo ""
echo "🔧 トラブルシューティング:"
echo "   - 問題が発生した場合: npm run build && ./scripts/setup-cursor.sh"
echo "   - 設定を確認: cat $CURSOR_MCP_CONFIG"
