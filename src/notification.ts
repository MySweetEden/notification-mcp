/**
 * デスクトップ通知機能
 * node-notifierライブラリを使用してOSネイティブな通知を表示
 */
import notifier from "node-notifier";
import * as os from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface NotificationOptions {
  title: string;
  message: string;
  sound?: boolean;
  wait?: boolean;
}

export class NotificationManager {
  /**
   * macOS用AppleScriptによる通知表示（フォールバック）
   */
  private async showNotificationWithAppleScript(title: string, message: string): Promise<string> {
    try {
      const script = `display notification "${message.replace(/"/g, '\\"')}" with title "${title.replace(/"/g, '\\"')}"`;
      await execAsync(`osascript -e '${script}'`);
      return `AppleScriptで通知を表示しました: ${title} - ${message}`;
    } catch (error) {
      throw new Error(`AppleScript通知エラー: ${error}`);
    }
  }

  /**
   * terminal-notifierによる通知表示（macOS推奨）
   */
  private async showNotificationWithTerminalNotifier(title: string, message: string): Promise<string> {
    try {
      // ターミナルのBundle IDを指定して確実に許可を得る
      await execAsync(`terminal-notifier -message "${message.replace(/"/g, '\\"')}" -title "${title.replace(/"/g, '\\"')}" -sender com.apple.Terminal -timeout 10`);
      return `terminal-notifierで通知を表示しました: ${title} - ${message}`;
    } catch (error) {
      throw new Error(`terminal-notifier通知エラー: ${error}`);
    }
  }

  /**
   * デスクトップ通知を表示（複数手法でフォールバック）
   */
  async showNotification(options: NotificationOptions): Promise<string> {
    const { title, message } = options;
    console.error(`通知送信開始: ${title} - ${message}`);

    // macOSの場合、複数の方法を試行
    if (os.platform() === 'darwin') {
      // 方法1: terminal-notifier（最も確実）
      try {
        const result = await this.showNotificationWithTerminalNotifier(title, message);
        console.error(`✅ terminal-notifier成功: ${result}`);
        return result;
      } catch (error) {
        console.error(`⚠️ terminal-notifier失敗:`, error);
      }

      // 方法2: AppleScript（フォールバック）
      try {
        const result = await this.showNotificationWithAppleScript(title, message);
        console.error(`✅ AppleScript成功: ${result}`);
        return result;
      } catch (error) {
        console.error(`⚠️ AppleScript失敗:`, error);
      }
    }

    // 方法3: node-notifier（最終フォールバック）
    try {
      return await this.showNotificationWithNodeNotifier(options);
    } catch (error) {
      console.error(`⚠️ node-notifier失敗:`, error);
      throw new Error(`全ての通知方法が失敗しました。システム設定を確認してください。`);
    }
  }

  /**
   * node-notifierによる通知表示
   */
  private async showNotificationWithNodeNotifier(options: NotificationOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      // シンプルな設定で確実性を重視
      const notificationOptions = {
        title: options.title,
        message: options.message,
        sound: options.sound ?? false,
        wait: options.wait ?? false,
        timeout: 15, // より長めのタイムアウト
        // 問題を起こす可能性のある設定を削除
        // subtitle: undefined,
        // contentImage: undefined,
        // open: undefined,
        // sticky: false,
        // hint: undefined,
      };
      
      console.error(`node-notifier実行中: ${options.title} - ${options.message}`);
      
      notifier.notify(
        notificationOptions,
        (error, response) => {
          if (error) {
            console.error(`node-notifierエラー詳細:`, error);
            reject(new Error(`node-notifier通知失敗: ${error.message}`));
          } else {
            console.error(`node-notifierレスポンス:`, response);
            resolve(`node-notifierで通知を表示しました: ${options.title} - ${options.message}`);
          }
        }
      );
    });
  }

  /**
   * 通知機能が利用可能かチェック
   */
  isNotificationSupported(): boolean {
    try {
      // node-notifierが利用可能かチェック
      return typeof notifier.notify === "function";
    } catch {
      return false;
    }
  }

  /**
   * 通知システムの診断情報を取得
   */
  async getDiagnostics(): Promise<string> {
    const diagnostics: string[] = [];
    diagnostics.push(`OS: ${os.platform()} ${os.release()}`);
    diagnostics.push(`Node.js: ${process.version}`);
    diagnostics.push(`node-notifier: 利用可能=${this.isNotificationSupported()}`);

    if (os.platform() === 'darwin') {
      // terminal-notifierの確認
      try {
        await execAsync('which terminal-notifier');
        diagnostics.push(`terminal-notifier: ✅ インストール済み`);
      } catch {
        diagnostics.push(`terminal-notifier: ❌ 未インストール`);
      }

      // AppleScriptの確認
      try {
        await execAsync('which osascript');
        diagnostics.push(`AppleScript: ✅ 利用可能`);
      } catch {
        diagnostics.push(`AppleScript: ❌ 利用不可`);
      }
    }

    return diagnostics.join('\n');
  }

  /**
   * 通知許可をリクエスト（macOS）
   */
  async requestNotificationPermission(): Promise<string> {
    if (os.platform() !== 'darwin') {
      return 'macOS以外では許可リクエストは不要です';
    }

    const results: string[] = [];
    
    try {
      // 1. AppleScriptで許可リクエスト
      await execAsync(`osascript -e 'display notification "通知許可のテストです" with title "Permission Request"'`);
      results.push('✅ AppleScript通知許可: 成功');
    } catch (error) {
      results.push(`❌ AppleScript通知許可: 失敗 - ${error}`);
    }

    try {
      // 2. terminal-notifierで許可リクエスト
      await execAsync(`terminal-notifier -message "通知許可のテストです" -title "Permission Request" -sender com.apple.Terminal`);
      results.push('✅ terminal-notifier通知許可: 成功');
    } catch (error) {
      results.push(`❌ terminal-notifier通知許可: 失敗 - ${error}`);
    }

    results.push('');
    results.push('📋 次の手順:');
    results.push('1. システム環境設定 > 通知とフォーカス を開く');
    results.push('2. 左側のリストで「ターミナル」を探して選択');
    results.push('3. 「通知を許可」をオンにする');
    results.push('4. 通知スタイルを「バナー」または「アラート」に設定');
    results.push('5. macOSを再起動（推奨）');

    return results.join('\n');
  }

  /**
   * 通知システムのフル診断テスト
   */
  async runDiagnosticTest(): Promise<string> {
    const results: string[] = [];
    const testTitle = "診断テスト";
    const testMessage = `テスト実行時刻: ${new Date().toLocaleTimeString()}`;

    results.push("=== 通知システム診断テスト ===");
    results.push(await this.getDiagnostics());
    results.push("");

    if (os.platform() === 'darwin') {
      // terminal-notifierテスト
      try {
        await this.showNotificationWithTerminalNotifier(testTitle, testMessage);
        results.push("✅ terminal-notifier: 成功");
      } catch (error) {
        results.push(`❌ terminal-notifier: 失敗 - ${error}`);
      }

      // AppleScriptテスト
      try {
        await this.showNotificationWithAppleScript(testTitle, testMessage);
        results.push("✅ AppleScript: 成功");
      } catch (error) {
        results.push(`❌ AppleScript: 失敗 - ${error}`);
      }
    }

    // node-notifierテスト
    try {
      await this.showNotificationWithNodeNotifier({ title: testTitle, message: testMessage });
      results.push("✅ node-notifier: 成功");
    } catch (error) {
      results.push(`❌ node-notifier: 失敗 - ${error}`);
    }

    return results.join('\n');
  }

  /**
   * 簡単な通知を表示（タイトルとメッセージのみ）
   */
  async showSimpleNotification(title: string, message: string): Promise<string> {
    return this.showNotification({
      title,
      message,
    });
  }

  /**
   * エラー通知を表示
   */
  async showErrorNotification(message: string): Promise<string> {
    return this.showNotification({
      title: "エラー",
      message,
    });
  }

  /**
   * 成功通知を表示
   */
  async showSuccessNotification(message: string): Promise<string> {
    return this.showNotification({
      title: "完了",
      message,
    });
  }
}