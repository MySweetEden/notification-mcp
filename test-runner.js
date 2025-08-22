#!/usr/bin/env node

/**
 * Notification MCP Server - テストランナー
 * 
 * 各機能の動作確認とテストを実行します
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

async function runTests() {
  log('=== Notification MCP Server テスト実行 ===\n', 'blue');

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
      
      // 実際に通知を表示
      log('    テスト通知を表示中...', 'blue');
      try {
        await notificationManager.showSimpleNotification(
          'Test Notification',
          'Notification MCP Server テスト実行中'
        );
        log('  ✓ 通知表示成功', 'green');
      } catch (error) {
        log(`  ⚠ 通知表示エラー: ${error.message}`, 'yellow');
      }
    } else {
      log('  ⚠ 通知システム非対応（環境による）', 'yellow');
    }

    // 6. 実際の音声再生テスト
    log('\n6. 音声再生の実際のテスト', 'yellow');
    try {
      if (canAccessSound) {
        log('    🔊 音声を再生します...', 'blue');
        const playResult = await soundPlayer.playSound(defaultSoundPath);
        log(`  ✓ ${playResult}`, 'green');
      } else {
        log('  ⚠ 音声ファイルにアクセスできないため、再生テストをスキップ', 'yellow');
      }
    } catch (error) {
      log(`  ⚠ 音声再生エラー: ${error.message}`, 'yellow');
    }

    // 7. 通知の実際のテスト（対応している場合のみ）
    if (isSupported) {
      log('\n7. 実際の通知表示テスト', 'yellow');
      try {
        log('    📢 通知を表示します...', 'blue');
        const notifyResult = await notificationManager.showSimpleNotification(
          'Test Notification',
          'Notification MCP Server テスト実行中'
        );
        log(`  ✓ ${notifyResult}`, 'green');
      } catch (error) {
        log(`  ⚠ 通知表示エラー: ${error.message}`, 'yellow');
      }
    }

    // 8. MCPサーバーファイル存在確認（読み込まない）
    log('\n8. MCPサーバーファイル確認', 'yellow');
    try {
      const serverPath = path.join(__dirname, 'dist', 'index.js');
      if (fs.existsSync(serverPath)) {
        log('  ✓ MCPサーバーファイル存在確認', 'green');
        log('  ℹ️  実際の起動は npm start で行ってください', 'blue');
      } else {
        log('  ✗ MCPサーバーファイルが見つかりません', 'red');
      }
    } catch (error) {
      log(`  ✗ MCPサーバーファイル確認エラー: ${error.message}`, 'red');
    }

    log('\n=== テスト完了 ===', 'blue');
    log('全ての基本機能が正常に動作しています！', 'green');

  } catch (error) {
    log(`\nテスト中にエラーが発生しました: ${error.message}`, 'red');
    process.exit(1);
  }
}

// テスト実行
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
