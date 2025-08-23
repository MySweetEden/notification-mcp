/**
 * 国際化対応モジュール
 * 環境変数 MCP_LANG で言語を切り替え
 */

export type Language = 'ja' | 'en';

export const getLanguage = (): Language => {
  const lang = process.env.MCP_LANG?.toLowerCase();
  return (lang === 'en') ? 'en' : 'ja'; // デフォルトは日本語
};

export const messages = {
  ja: {
    // ツール説明
    playSound: "設定済みの音声ファイルを再生します",
    setSoundPath: "通知音として使用する音声ファイルのパスを設定します",
    getSoundPath: "現在設定されている音声ファイルのパスを取得します",
    resetSoundPath: "音声設定をOS標準のデフォルト音に戻します",
    showNotification: "デスクトップ通知を表示（Claude Desktopでは制限あり）",
    
    // プロパティ説明
    soundPathDesc: "音声ファイルの絶対パス",
    titleDesc: "通知のタイトル",
    messageDesc: "通知のメッセージ",

    
    // レスポンスメッセージ
    soundFileSet: "音声ファイルパスを設定しました",
    soundReset: "音声設定をデフォルトに戻しました",
    currentSoundFile: "現在の音声ファイル",
    
    // 制限メッセージ
    claudeDesktopWarning: "Claude Desktop環境では通知機能に制限があります。音声通知（playSound）の利用を推奨します。",
    claudeDesktopError: "Claude Desktop環境では通知機能に制限があります。\n\n💡 解決策:\n• 音声通知をご利用ください: playSound()\n• 音声通知は確実に動作します\n\n詳細: https://github.com/MySweetEden/notification-mcp#環境別機能制限",
    soundFileError: "指定された音声ファイルにアクセスできません",
    parameterRequired: "パラメータが必要です",
  },
  en: {
    // Tool descriptions
    playSound: "Plays the configured sound file",
    setSoundPath: "Sets the sound file path to use for notifications",
    getSoundPath: "Gets the currently configured sound file path",
    resetSoundPath: "Resets sound settings to OS default sound",
    showNotification: "Displays desktop notification (limited in Claude Desktop)",
    
    // Property descriptions
    soundPathDesc: "Absolute path to the sound file",
    titleDesc: "Notification title",
    messageDesc: "Notification message",

    
    // Response messages
    soundFileSet: "Sound file path has been set",
    soundReset: "Sound settings have been reset to default",
    currentSoundFile: "Current sound file",
    
    // Limitation messages
    claudeDesktopWarning: "Notification functionality is limited in Claude Desktop environment. Sound notifications (playSound) are recommended.",
    claudeDesktopError: "Notification functionality is limited in Claude Desktop environment.\n\n💡 Solution:\n• Please use sound notifications: playSound()\n• Sound notifications work reliably\n\nDetails: https://github.com/MySweetEden/notification-mcp#environment-specific-limitations",
    soundFileError: "Cannot access the specified sound file",
    parameterRequired: "Parameter is required",
  }
};

export const t = (key: keyof typeof messages.ja): string => {
  const lang = getLanguage();
  return messages[lang][key] || messages.ja[key];
};
