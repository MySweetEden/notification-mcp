#!/usr/bin/env node

/**
 * Cursor MCP Server テスト
 * 
 * Cursorからnotification-mcpサーバーが正常に動作するかテストします
 */

console.log('🧪 Cursor MCP Server テスト開始\n');

console.log('📋 テスト手順:');
console.log('1. Cursorを再起動してください');
console.log('2. 新しいチャットを開始してください');
console.log('3. 以下のコマンドを順番に実行してください:\n');

console.log('🔧 基本動作確認:');
console.log('   getSoundPath() を実行して現在の設定を確認してください');
console.log('');

console.log('🔊 音声テスト:');
console.log('   playSound() を実行して音声が再生されるか確認してください');
console.log('');

console.log('📢 通知テスト:');
console.log('   showNotification("テスト", "Cursorからの通知テストです") を実行してください');
console.log('');

console.log('⚙️ 設定変更テスト:');
console.log('   setSoundPath("/System/Library/Sounds/Ping.aiff") でカスタム音声を設定してください');
console.log('   getSoundPath() で設定が変更されたか確認してください');
console.log('   playSound() で新しい音声が再生されるか確認してください');
console.log('   resetSoundPath() でデフォルトに戻してください');
console.log('');

console.log('✅ 全てのテストが成功すれば、Cursor連携は正常に動作しています！');
console.log('');

console.log('📝 設定ファイル場所:');
console.log('   ~/.cursor/mcp.json');
console.log('');

console.log('🔧 現在の設定:');
console.log('   サーバーパス: /Users/kai/Documents/Learn/25_GenAI/test_mcp/notification-mcp/dist/index.js');
console.log('   Node.js環境: production');
console.log('');

console.log('⚠️ トラブルシューティング:');
console.log('   - MCPツールが認識されない場合はCursorを完全に再起動してください');
console.log('   - エラーが発生する場合は npm run build を実行してください');
console.log('   - 設定ファイルの構文エラーがないか確認してください');

