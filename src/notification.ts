/**
 * デスクトップ通知機能
 * node-notifierライブラリを使用してOSネイティブな通知を表示
 */

import notifier from "node-notifier";

export interface NotificationOptions {
  title: string;
  message: string;
  sound?: boolean;
  wait?: boolean;
}

export class NotificationManager {
  /**
   * デスクトップ通知を表示
   */
  async showNotification(options: NotificationOptions): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const notificationOptions = {
          title: options.title,
          message: options.message,
          sound: options.sound ?? false,
          wait: options.wait ?? false,
          timeout: 10, // 10秒後に自動で消える
          // macOS固有の設定
          subtitle: `${Date.now()}`, // ユニークにするためのタイムスタンプ
          contentImage: undefined, // 画像なし
          open: undefined, // クリック時のアクション無効
          // より確実に表示するための設定
          sticky: false, // 自動で消える
          hint: 'int:transient:1', // 一時的な通知として扱う
        };

        console.error(`通知送信中: ${options.title} - ${options.message}`);
        
        notifier.notify(
          notificationOptions,
          (error, response) => {
            if (error) {
              console.error(`通知エラー詳細:`, error);
              reject(new Error(`通知の表示に失敗しました: ${error.message}`));
            } else {
              console.error(`通知レスポンス:`, response);
              resolve(`通知を表示しました: ${options.title} - ${options.message}`);
            }
          }
        );
      });
    } catch (error) {
      console.error(`通知システムエラー詳細:`, error);
      throw new Error(`通知システムエラー: ${error}`);
    }
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
