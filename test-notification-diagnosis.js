#!/usr/bin/env node

/**
 * 通知システム診断ツール
 * macOS通知問題の原因を特定するための包括的診断
 */

const { NotificationManager } = require('./dist/notification.js');

async function runDiagnosis() {
  console.log('🔍 通知システム診断開始\n');

  const nm = new NotificationManager();

  try {
    // 診断テスト実行
    const diagnosticResults = await nm.runDiagnosticTest();
    console.log(diagnosticResults);

    console.log('\n=== 追加確認 ===');
    
    // 基本的な通知テスト
    console.log('\n📢 基本通知テスト実行中...');
    const result = await nm.showSimpleNotification('診断完了', '通知システムの診断が完了しました');
    console.log(`結果: ${result}`);

  } catch (error) {
    console.error('❌ 診断中にエラーが発生:', error.message);
  }

  console.log('\n=== システム設定確認のお願い ===');
  console.log('1. システム環境設定 > 通知とフォーカス');
  console.log('2. ターミナル（またはNode.js）の通知許可を確認');
  console.log('3. おやすみモードが無効になっているか確認');
  console.log('4. 画面右上に通知が表示されているか確認');
  console.log('\n通知が表示されない場合:');
  console.log('- システム環境設定で通知を許可してください');
  console.log('- ターミナルを再起動してください');
  console.log('- macOSを再起動してください');
}

runDiagnosis().catch(console.error);

