/**
 * 設定管理システムの型定義
 */

export interface SoundConfig {
  customPath?: string;
  useDefault: boolean;
  defaultPaths: {
    darwin: string;
    win32: string;
  };
}

export interface NotificationConfig {
  enabled: boolean;
  defaultTitle: string;
}

export interface Config {
  sound: SoundConfig;
  notification: NotificationConfig;
}

export type SupportedPlatform = "darwin" | "win32";

export interface ConfigManager {
  load(): Promise<Config>;
  save(config: Config): Promise<void>;
  getDefaultConfig(): Config;
  backup(): Promise<void>;
}
