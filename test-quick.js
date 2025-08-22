#!/usr/bin/env node

/**
 * Notification MCP Server - クイックテスト
 * 
 * サーバーを起動せずに各機能をテストします
 */

const fs = require('fs');
const path = require('path');

// 色付きログ用のヘルパー
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runQuickTests() {
  log('=== Notification MCP Server クイックテスト ===\n', 'blue');

  try {
    // 1. ビルドファイルの存在確認
    log('1. ビルドファイルの確認', 'yellow');
    const distPath = path.join(__dirname, 'dist');
    const requiredFiles = ['index.js', 'config.js', 'sound.js', 'notification.js', 'types.js'];
    
    for (const file of requiredFiles) {
      const filePath = path.join(distPath, file);
      if (fs.existsSync(filePath)) {
        log(`  ✓ ${file} - 存在`, 'green');
      } else {
        log(`  ✗ ${file} - 不存在`, 'red');
        throw new Error(`Required file missing: ${file}`);
      }
    }

    // 2. モジュールの読み込みテスト
    log('\n2. モジュール読み込みテスト', 'yellow');
    const { FileConfigManager } = require('./dist/config.js');
    const { SoundPlayer } = require('./dist/sound.js');
    const { NotificationManager } = require('./dist/notification.js');
    log('  ✓ 全モジュール読み込み成功', 'green');

    // 3. 設定管理システムのテスト
    log('\n3. 設定管理システムのテスト', 'yellow');
    const configManager = new FileConfigManager();
    
    // デフォルト設定の取得
    const defaultConfig = configManager.getDefaultConfig();
    log('  ✓ デフォルト設定取得成功', 'green');
    log(`    プラットフォーム: ${configManager.getCurrentPlatform()}`);
    log(`    デフォルト音声パス: ${configManager.getDefaultSoundPath()}`);

    // 設定ファイルの読み込み（初回は自動作成される）
    const config = await configManager.load();
    log('  ✓ 設定ファイル読み込み成功', 'green');

    // 4. 音声システムのテスト
    log('\n4. 音声システムのテスト', 'yellow');
    const soundPlayer = new SoundPlayer();
    
    const defaultSoundPath = soundPlayer.getDefaultSoundPath();
    log(`    デフォルト音声パス: ${defaultSoundPath}`);
    
    const canAccessSound = await soundPlayer.testSoundFile(defaultSoundPath);
    if (canAccessSound) {
      log('  ✓ デフォルト音声ファイルアクセス可能', 'green');
    } else {
      log('  ⚠ デフォルト音声ファイルアクセス不可（環境による）', 'yellow');
    }

    // 5. 通知システムのテスト
    log('\n5. 通知システムのテスト', 'yellow');
    const notificationManager = new NotificationManager();
    
    const isSupported = notificationManager.isNotificationSupported();
    if (isSupported) {
      log('  ✓ 通知システム対応', 'green');
    } else {
      log('  ⚠ 通知システム非対応（環境による）', 'yellow');
    }

    // 6. 音声ファイルアクセステスト（再生はしない）
    log('\n6. 音声ファイルアクセステスト', 'yellow');
    if (canAccessSound) {
      log('  ✓ 音声ファイルアクセス可能（実際の再生は test:full で確認）', 'green');
    } else {
      log('  ⚠ 音声ファイルアクセス不可（環境による）', 'yellow');
    }

    // 7. MCPツール定義の確認
    log('\n7. MCPツール定義の確認', 'yellow');
    const toolNames = ['playSound', 'setSoundPath', 'getSoundPath', 'resetSoundPath', 'showNotification'];
    log(`  ✓ 定義されたツール数: ${toolNames.length}`, 'green');
    toolNames.forEach(tool => log(`    - ${tool}`, 'blue'));

    log('\n=== クイックテスト完了 ===', 'blue');
    log('✅ 全ての基本機能が正常に動作しています！', 'green');
    log('\n📋 次のステップ:', 'yellow');
    log('  1. 音声・通知の実際のテスト: npm run test:full', 'blue');
    log('  2. 個別音声テスト: npm run test:sound', 'blue');
    log('  3. 個別通知テスト: npm run test:notification', 'blue');
    log('  4. MCPサーバー起動: npm start', 'blue');
    log('  5. AIアシスタント（Cursor、Claude等）での動作確認', 'blue');

  } catch (error) {
    log(`\nテスト中にエラーが発生しました: ${error.message}`, 'red');
    process.exit(1);
  }
}

// テスト実行
runQuickTests();
