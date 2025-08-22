/**
 * 音声再生機能
 * OS標準の音声再生コマンドを使用して音声ファイルを再生
 */

import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as os from "os";
import { SupportedPlatform } from "./types.js";

const execAsync = promisify(exec);

export class SoundPlayer {
  /**
   * 音声ファイルを再生
   */
  async playSound(soundPath: string): Promise<string> {
    try {
      // ファイルの存在確認
      await this.validateSoundFile(soundPath);
      
      const platform = this.getCurrentPlatform();
      const command = this.getPlayCommand(platform, soundPath);
      
      // 非同期で音声再生を実行
      await execAsync(command);
      return `音声を再生しました: ${soundPath}`;
    } catch (error) {
      throw new Error(`音声再生に失敗しました: ${error}`);
    }
  }

  /**
   * 音声ファイルの存在とアクセス可能性を確認
   */
  async validateSoundFile(soundPath: string): Promise<void> {
    try {
      await fs.access(soundPath, fs.constants.R_OK);
    } catch (error) {
      throw new Error(`音声ファイルにアクセスできません: ${soundPath}`);
    }
  }

  /**
   * プラットフォーム別の再生コマンドを取得
   */
  private getPlayCommand(platform: SupportedPlatform, soundPath: string): string {
    switch (platform) {
      case "darwin":
        // macOS用: afplayコマンドを使用
        return `afplay "${soundPath}"`;
      
      case "win32":
        // Windows用: PowerShellのSoundPlayerを使用
        return `powershell -c "(New-Object Media.SoundPlayer '${soundPath}').PlaySync()"`;
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * 現在のプラットフォームを取得
   */
  private getCurrentPlatform(): SupportedPlatform {
    const platform = os.platform();
    if (platform === "darwin" || platform === "win32") {
      return platform;
    }
    throw new Error(`Unsupported platform: ${platform}`);
  }

  /**
   * デフォルト音声ファイルのパスを取得
   */
  getDefaultSoundPath(): string {
    const platform = this.getCurrentPlatform();
    
    const defaultPaths = {
      darwin: "/System/Library/Sounds/Glass.aiff",
      win32: "C:\\Windows\\Media\\Windows Notify.wav",
    };

    return defaultPaths[platform];
  }

  /**
   * 音声ファイルが再生可能かテスト
   */
  async testSoundFile(soundPath: string): Promise<boolean> {
    try {
      await this.validateSoundFile(soundPath);
      return true;
    } catch {
      return false;
    }
  }
}
