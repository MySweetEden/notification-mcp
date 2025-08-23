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
   * macOS用AppleScriptによる通知表示（確実版）
   */
  private async showNotificationWithAppleScript(title: string, message: string, withSound: boolean = true): Promise<string> {
    try {
      // エスケープ処理を強化
      const escapedTitle = title.replace(/['"\\]/g, '\\$&');
      const escapedMessage = message.replace(/['"\\]/g, '\\$&');
      
      // 音付きまたは音なしで通知表示
      const soundPart = withSound ? ' sound name "Glass"' : '';
      const script = `display notification "${escapedMessage}" with title "${escapedTitle}"${soundPart}`;
      
      console.error(`🔧 AppleScript実行: ${script}`);
      await execAsync(`osascript -e '${script}'`);
      console.error(`✅ AppleScript成功: ${title} - ${message}`);
      return `AppleScript${withSound ? '（音付き）' : ''}で通知を表示しました: ${title} - ${message}`;
    } catch (error: any) {
      console.error(`❌ AppleScript失敗: ${error.message || error}`);
      throw new Error(`AppleScript通知エラー: ${error.message || error}`);
    }
  }

  /**
   * terminal-notifierによる通知表示（macOS推奨）
   */
  private async showNotificationWithTerminalNotifier(title: string, message: string): Promise<string> {
    try {
      console.error(`🔧 terminal-notifier実行中: ${title} - ${message}`);
      
      // Claude Desktop環境かどうかを判定
      const isClaude = process.env.CLAUDE_DESKTOP || process.env.npm_lifecycle_event?.includes('claude');
      
      let command: string;
      if (isClaude) {
        // Claude Desktop用のBundle ID（正しいBundle ID）
        command = `terminal-notifier -message "${message.replace(/"/g, '\\"')}" -title "${title.replace(/"/g, '\\"')}" -sender com.anthropic.claudefordesktop -timeout 10 -activate com.anthropic.claudefordesktop`;
      } else {
        // 通常のターミナル用
        command = `terminal-notifier -message "${message.replace(/"/g, '\\"')}" -title "${title.replace(/"/g, '\\"')}" -sender com.apple.Terminal -timeout 10`;
      }
      
      console.error(`🔧 実行コマンド: ${command}`);
      await execAsync(command);
      console.error(`✅ terminal-notifier成功: ${title} - ${message}`);
      return `terminal-notifierで通知を表示しました: ${title} - ${message}`;
    } catch (error) {
      console.error(`❌ terminal-notifier失敗: ${error}`);
      throw new Error(`terminal-notifier通知エラー: ${error}`);
    }
  }





  /**
   * デスクトップ通知を表示（改良版フォールバック）
   */
  async showNotification(options: NotificationOptions): Promise<string> {
    const { title, message } = options;
    console.error(`📱 通知送信開始: ${title} - ${message}`);

    // Claude Desktop環境かどうかを判定
    const isClaude = process.env.CLAUDE_DESKTOP === 'true';

    // macOSの場合、環境に応じて最適な順序で試行
    if (os.platform() === 'darwin') {
      
      if (isClaude) {
        // Claude Desktop環境: AppleScriptを最優先
        try {
          const result = await this.showNotificationWithAppleScript(title, message, true);
          console.error(`✅ AppleScript成功: ${result}`);
          return result;
        } catch (error: any) {
          console.error(`⚠️ AppleScript失敗:`, error.message || error);
        }

        // 方法2: terminal-notifier（フォールバック）
        try {
          const result = await this.showNotificationWithTerminalNotifier(title, message);
          console.error(`✅ terminal-notifier成功: ${result}`);
          return result;
        } catch (error: any) {
          console.error(`⚠️ terminal-notifier失敗:`, error.message || error);
        }
      } else {
        // 通常環境（Cursor等）: terminal-notifierを最優先
        try {
          const result = await this.showNotificationWithTerminalNotifier(title, message);
          console.error(`✅ terminal-notifier成功: ${result}`);
          return result;
        } catch (error: any) {
          console.error(`⚠️ terminal-notifier失敗:`, error.message || error);
        }

        // フォールバック: AppleScript
        try {
          const result = await this.showNotificationWithAppleScript(title, message, true);
          console.error(`✅ AppleScript成功: ${result}`);
          return result;
        } catch (error: any) {
          console.error(`⚠️ AppleScript失敗:`, error.message || error);
        }
      }

      // 共通フォールバック: node-notifier（最後の手段）
      try {
        const result = await this.showNotificationWithNodeNotifier(title, message);
        console.error(`✅ node-notifier成功: ${result}`);
        return result;
      } catch (error) {
        console.error(`⚠️ node-notifier失敗:`, error);
      }
    }

    // 全プラットフォーム共通: 全ての方法が失敗した場合のエラー
    throw new Error(`全ての通知方法が失敗しました。以下を確認してください:\n1. システム環境設定で通知許可\n2. アプリケーションの通知許可\n3. OSの再起動`);
  }

  /**
   * node-notifierによる通知表示
   */
  private async showNotificationWithNodeNotifier(title: string, message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // シンプルな設定で確実性を重視
      const notificationOptions = {
        title: title,
        message: message,
        sound: false,
        wait: false,
        timeout: 15, // より長めのタイムアウト
        // 問題を起こす可能性のある設定を削除
        // subtitle: undefined,
        // contentImage: undefined,
        // open: undefined,
        // sticky: false,
        // hint: undefined,
      };
      
      console.error(`node-notifier実行中: ${title} - ${message}`);
      
      notifier.notify(
        notificationOptions,
        (error, response) => {
          if (error) {
            console.error(`node-notifierエラー詳細:`, error);
            reject(new Error(`node-notifier通知失敗: ${error.message}`));
          } else {
            console.error(`node-notifierレスポンス:`, response);
            resolve(`node-notifierで通知を表示しました: ${title} - ${message}`);
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
        await this.showNotificationWithAppleScript(testTitle, testMessage, true);
        results.push("✅ AppleScript: 成功");
      } catch (error) {
        results.push(`❌ AppleScript: 失敗 - ${error}`);
      }
    }

    // node-notifierテスト
    try {
      await this.showNotificationWithNodeNotifier(testTitle, testMessage);
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