/**
 * デスクトップ通知機能
 * node-notifierライブラリを使用してOSネイティブな通知を表示
 */

import * as notifier from "node-notifier";

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
        notifier.notify(
          {
            title: options.title,
            message: options.message,
            sound: options.sound ?? false, // デフォルトは音なし（別途音声再生を使用）
            wait: options.wait ?? false,
            timeout: 5, // 5秒後に自動で消える
          },
          (error, _response) => {
            if (error) {
              reject(new Error(`通知の表示に失敗しました: ${error.message}`));
            } else {
              resolve(`通知を表示しました: ${options.title} - ${options.message}`);
            }
          }
        );
      });
    } catch (error) {
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
