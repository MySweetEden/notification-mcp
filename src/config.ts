/**
 * 設定管理システム
 * ユーザーホームディレクトリに設定ファイルを保存・読み込み
 */

import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { Config, ConfigManager, SupportedPlatform } from "./types.js";

export class FileConfigManager implements ConfigManager {
  private readonly configPath: string;
  private readonly backupPath: string;

  constructor() {
    const homeDir = os.homedir();
    this.configPath = path.join(homeDir, ".mcp-sound-config.json");
    this.backupPath = path.join(homeDir, ".mcp-sound-config.backup.json");
  }

  /**
   * デフォルト設定を取得
   */
  getDefaultConfig(): Config {
    return {
      sound: {
        useDefault: true,
        defaultPaths: {
          darwin: "/System/Library/Sounds/Glass.aiff",
          win32: "C:\\Windows\\Media\\Windows Notify.wav",
        },
      },
      notification: {
        enabled: true,
        defaultTitle: "AI通知",
      },
    };
  }

  /**
   * 設定ファイルを読み込み
   */
  async load(): Promise<Config> {
    try {
      const data = await fs.readFile(this.configPath, "utf-8");
      const config = JSON.parse(data) as Config;
      
      // デフォルト設定とマージして不足項目を補完
      const defaultConfig = this.getDefaultConfig();
      return this.mergeConfig(defaultConfig, config);
    } catch (error) {
      // ファイルが存在しない場合はデフォルト設定で初期化
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.error("Config file not found, creating with defaults");
        const defaultConfig = this.getDefaultConfig();
        await this.save(defaultConfig);
        return defaultConfig;
      }
      throw new Error(`Failed to load config: ${error}`);
    }
  }

  /**
   * 設定をファイルに保存
   */
  async save(config: Config): Promise<void> {
    try {
      // バックアップを作成
      await this.backup();
      
      // 設定を保存
      const configData = JSON.stringify(config, null, 2);
      await fs.writeFile(this.configPath, configData, "utf-8");
      console.error("Config saved successfully");
    } catch (error) {
      throw new Error(`Failed to save config: ${error}`);
    }
  }

  /**
   * 設定ファイルのバックアップを作成
   */
  async backup(): Promise<void> {
    try {
      // 既存の設定ファイルが存在する場合のみバックアップ
      await fs.access(this.configPath);
      await fs.copyFile(this.configPath, this.backupPath);
      console.error("Config backup created");
    } catch (error) {
      // ファイルが存在しない場合は無視
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error(`Failed to create backup: ${error}`);
      }
    }
  }

  /**
   * 設定をマージ（デフォルト設定に新しい設定を上書き）
   */
  private mergeConfig(defaultConfig: Config, userConfig: Partial<Config>): Config {
    return {
      sound: {
        ...defaultConfig.sound,
        ...userConfig.sound,
      },
      notification: {
        ...defaultConfig.notification,
        ...userConfig.notification,
      },
    };
  }

  /**
   * 現在のプラットフォームを取得
   */
  getCurrentPlatform(): SupportedPlatform {
    const platform = os.platform();
    if (platform === "darwin" || platform === "win32") {
      return platform;
    }
    throw new Error(`Unsupported platform: ${platform}`);
  }

  /**
   * 現在のプラットフォームのデフォルト音声パスを取得
   */
  getDefaultSoundPath(): string {
    const config = this.getDefaultConfig();
    const platform = this.getCurrentPlatform();
    return config.sound.defaultPaths[platform];
  }
}
