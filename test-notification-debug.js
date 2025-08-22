#!/usr/bin/env node

/**
 * 通知デバッグテスト
 * 異なるメッセージで通知をテストする
 */

const { NotificationManager } = require('./dist/notification.js');

async function testNotifications() {
  const nm = new NotificationManager();
  
  console.log('=== 通知デバッグテスト ===\n');
  
  try {
    // 1. 基本テスト
    console.log('1. 基本通知テスト');
    const result1 = await nm.showSimpleNotification('基本テスト', `テスト実行時刻: ${new Date().toLocaleTimeString()}`);
    console.log(`✓ ${result1}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
    
    // 2. 異なるタイトルでテスト
    console.log('\n2. 異なるタイトルでテスト');
    const result2 = await nm.showSimpleNotification('別のテスト', `現在時刻: ${new Date().toLocaleTimeString()}`);
    console.log(`✓ ${result2}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
    
    // 3. 詳細オプション付きテスト
    console.log('\n3. 詳細オプション付きテスト');
    const result3 = await nm.showNotification({
      title: 'オプション付きテスト',
      message: `タイムスタンプ: ${Date.now()}`,
      sound: true, // 音付き
      wait: false
    });
    console.log(`✓ ${result3}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
    
    // 4. 成功通知テスト
    console.log('\n4. 成功通知テスト');
    const result4 = await nm.showSuccessNotification(`処理完了 - ${new Date().toLocaleString()}`);
    console.log(`✓ ${result4}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
    
    // 5. エラー通知テスト
    console.log('\n5. エラー通知テスト');
    const result5 = await nm.showErrorNotification(`エラーテスト - ${new Date().toLocaleString()}`);
    console.log(`✓ ${result5}`);
    
    console.log('\n=== 通知デバッグテスト完了 ===');
    console.log('macOSの通知センターまたは画面右上を確認してください');
    
  } catch (error) {
    console.error(`通知エラー: ${error.message}`);
  }
}

testNotifications();
