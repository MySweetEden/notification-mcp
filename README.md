## **AIコーディングアシスタント向けサウンド通知MCPサーバー仕様書**

### **1. 概要**

このプロジェクトは、主要なAIコーディングアシスタント（**Claude Desktop**、**Cursor**、**VS Code**、**Windsurf**など）と連携する**Model Context Protocol（MCP）サーバー**です。主な目的は、AIの長時間処理が完了した際に、**音声通知とデスクトップ通知**を介してユーザーにフィードバックを提供することです。これにより、開発者はAIの進捗状況をリアルタイムに把握し、作業効率を向上させることができます。

本サーバーは複数の配布形式に対応しており、使用環境に応じて最適なインストール方法を選択できます：
- **DXT形式**: Claude Desktop、Windsurf等でのワンクリックインストール
- **NPMパッケージ**: Cursor、VS Code等での標準的なMCPサーバー設定
- **ソースコード**: 開発者向けカスタムビルド

-----

### **2. 機能仕様**

#### **2.1 MCPツール**
本サーバーは以下の5つのMCPツールを提供します：

##### **音声関連ツール**
  * **`playSound`ツール**:
      * **引数**: なし
      * **動作**: 設定済みの音声ファイルを再生
      * **音量**: OSの現在のシステム音量設定を使用
  
  * **`setSoundPath`ツール**:
      * **引数**: `soundPath` (string) - 音声ファイルの絶対パス
      * **動作**: 通知音として使用する音声ファイルを設定し、設定ファイルに保存
      * **戻り値**: 設定成功可否とメッセージ
  
  * **`getSoundPath`ツール**:
      * **引数**: なし
      * **動作**: 現在設定されている音声ファイルのパスを取得
      * **戻り値**: 現在の音声ファイルパス
  
  * **`resetSoundPath`ツール**:
      * **引数**: なし
      * **動作**: 音声設定をOS標準のデフォルト音に戻す
      * **戻り値**: リセット完了メッセージ

##### **通知関連ツール**
  * **`showNotification`ツール**:
      * **引数**: 
          * `title` (string) - 通知のタイトル
          * `message` (string) - 通知のメッセージ
      * **動作**: OSのネイティブなデスクトップ通知を表示
      * **戻り値**: 通知表示成功可否

#### **2.2 使用方法**
AIに以下のように指示することで通知機能を利用できます：

##### **基本的な通知**
```
長時間処理完了時:
「完了したらplaySound()を呼んでください」

デスクトップ通知:
「完了したらshowNotification("処理完了", "データベース更新が正常に完了しました")を呼んでください」
```

##### **設定変更**
```
音声ファイルの変更:
「setSoundPath("/path/to/custom/sound.wav")で通知音を変更してください」

現在の設定確認:
「getSoundPath()で現在の音声設定を教えてください」

デフォルトに戻す:
「resetSoundPath()でデフォルト音に戻してください」
```

#### **2.3 設定管理システム**

##### **設定ファイル構造**
```json
{
  "sound": {
    "customPath": "/path/to/custom/sound.wav",
    "useDefault": false,
    "defaultPaths": {
      "darwin": "/System/Library/Sounds/Glass.aiff",
      "win32": "C:\\Windows\\Media\\Windows Notify.wav"
    }
  },
  "notification": {
    "enabled": true,
    "defaultTitle": "AI通知"
  }
}
```

##### **設定の永続化**
  * **保存場所**: ユーザーホームディレクトリ (`~/.mcp-sound-config.json`)
  * **自動作成**: 初回起動時にデフォルト設定で作成
  * **即座反映**: MCPツール経由での設定変更は即座に設定ファイルに保存
  * **バックアップ**: 設定変更前に自動バックアップを作成

-----

### **3. 技術仕様**

  * **開発言語**: TypeScript
  * **実行環境**: Node.js
  * **配布形式**: 
      * **DXT形式**: Claude Desktop、Windsurf等でのワンクリックインストール
      * **NPMパッケージ**: Cursor、VS Code等での手動設定
      * **ソースコード**: 開発者向けビルド
  * **依存ライブラリ**:
      * **MCPサーバー**: `@modelcontextprotocol/sdk`
      * **サウンド再生**: OSのコマンド（`child_process`モジュール経由で実行）
      * **デスクトップ通知**: `node-notifier`
      * **ビルド**: `npm`または`yarn`
  * **対応OS**:
      * macOS (Darwin)
      * Windows (Win32)

#### **3.1 MCPツール定義**

```json
{
  "tools": [
    {
      "name": "playSound",
      "description": "設定済みの音声ファイルを再生します",
      "inputSchema": {
        "type": "object",
        "properties": {},
        "additionalProperties": false
      }
    },
    {
      "name": "setSoundPath",
      "description": "通知音として使用する音声ファイルのパスを設定します",
      "inputSchema": {
        "type": "object",
        "properties": {
          "soundPath": {
            "type": "string",
            "description": "音声ファイルの絶対パス"
          }
        },
        "required": ["soundPath"],
        "additionalProperties": false
      }
    },
    {
      "name": "getSoundPath",
      "description": "現在設定されている音声ファイルのパスを取得します",
      "inputSchema": {
        "type": "object",
        "properties": {},
        "additionalProperties": false
      }
    },
    {
      "name": "resetSoundPath",
      "description": "音声設定をOS標準のデフォルト音に戻します",
      "inputSchema": {
        "type": "object",
        "properties": {},
        "additionalProperties": false
      }
    },
    {
      "name": "showNotification",
      "description": "デスクトップ通知を表示します",
      "inputSchema": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "通知のタイトル"
          },
          "message": {
            "type": "string",
            "description": "通知のメッセージ"
          }
        },
        "required": ["title", "message"],
        "additionalProperties": false
      }
    }
  ]
}
```

-----

### **4. セットアップと使用方法**

#### **4.1. 配布形式と対応環境**

本MCPサーバーは複数の形式で配布され、様々なAIコーディングアシスタントで利用可能です：

##### **対応環境**
- **Claude Desktop**: DXT形式でのワンクリックインストール
- **Cursor**: MCPサーバーとしての手動設定
- **VS Code (Continue拡張)**: MCPサーバーとしての手動設定
- **Windsurf**: DXT形式またはMCPサーバー設定

#### **4.2. DXTパッケージのインストール（Claude Desktop、Windsurf等）**

1. **DXTファイルのダウンロード**
   - GitHubリリースページから最新の`.dxt`ファイルをダウンロード

2. **ワンクリックインストール**
   - Claude Desktop、Windsurf等の対応AIアプリケーションで`.dxt`ファイルを開く
   - インストールダイアログに従ってインストール実行

#### **4.3. MCPサーバーとしての手動設定（Cursor、VS Code等）**

##### **4.3.1. パッケージのインストール**

1. **NPMパッケージのグローバルインストール**
   ```bash
   npm install -g notification-mcp-server
   ```

2. **またはソースからのビルド**
   ```bash
   git clone https://github.com/[username]/notification-mcp.git
   cd notification-mcp
   npm install
   npm run build
   ```

##### **4.3.2. Cursor での設定**

Cursor の設定ファイル（`~/.cursor/mcp_settings.json`）に以下を追加：

```json
{
  "mcpServers": {
    "notification-mcp": {
      "command": "node",
      "args": ["/path/to/notification-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

または、グローバルインストールした場合：
```json
{
  "mcpServers": {
    "notification-mcp": {
      "command": "notification-mcp-server"
    }
  }
}
```

##### **4.3.3. VS Code（Continue拡張）での設定**

VS Code の Continue 拡張の設定ファイル（`~/.continue/config.json`）に以下を追加：

```json
{
  "models": [...],
  "mcpServers": [
    {
      "name": "notification-mcp",
      "command": "node",
      "args": ["/path/to/notification-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
```

##### **4.3.4. 設定の確認**

設定後、AIアシスタントを再起動し、以下のコマンドで動作確認：
```
getSoundPath()を呼んで設定状況を確認してください
```

#### **4.4. AIアシスタントでの使用方法**

インストール後、AIに以下のように指示してください：

**基本的な使用例:**
```
長時間の処理を開始する前に：
「完了したらplaySound()を呼んでください」

特定のメッセージを表示したい場合：
「完了したらshowNotification("データベース更新が完了しました")を呼んでください」
```

#### **4.5. 開発者向け：ソースからのビルド**

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/[username]/notification-mcp.git
   cd notification-mcp
   ```

2. **依存パッケージのインストール**
   ```bash
   npm install
   ```

3. **ビルドとパッケージング**
   ```bash
   # 開発用ビルド
   npm run build
   
   # DXTパッケージのビルド
   npx @anthropic-ai/dxt pack
   
   # NPMパッケージの作成
   npm pack
   
   # NPMレジストリへの公開（メンテナー用）
   npm publish
   ```

#### **4.6. 設定管理**

##### **設定ファイルの場所**
- **自動生成**: `~/.mcp-sound-config.json`
- **初回起動時**: デフォルト設定で自動作成
- **手動編集**: ファイルを直接編集することも可能

##### **設定の変更方法**

**1. MCPツール経由（推奨）**
```bash
# AIに以下のように指示
setSoundPath("/Users/username/Music/notification.wav")
getSoundPath()  # 設定確認
resetSoundPath()  # デフォルトに戻す
```

**2. 設定ファイル直接編集**
```json
{
  "sound": {
    "customPath": "/Users/username/Music/notification.wav",
    "useDefault": false,
    "defaultPaths": {
      "darwin": "/System/Library/Sounds/Glass.aiff",
      "win32": "C:\\Windows\\Media\\Windows Notify.wav"
    }
  },
  "notification": {
    "enabled": true,
    "defaultTitle": "AI通知"
  }
}
```

-----

### **5. DXT Manifest仕様**

本プロジェクトのDXTパッケージ用`manifest.json`の構造：

```json
{
  "version": "1.0.0",
  "name": "notification-mcp",
  "displayName": "AI通知サーバー",
  "description": "AIの処理完了時に音声とデスクトップ通知を提供するMCPサーバー",
  "author": "Your Name",
  "server": {
    "command": "node",
    "args": ["dist/index.js"],
    "env": {
      "NODE_ENV": "production"
    }
  },
  "mcp": {
    "tools": [
      {
        "name": "playSound",
        "description": "設定済みの音声ファイルを再生"
      },
      {
        "name": "setSoundPath",
        "description": "通知音の音声ファイルパスを設定"
      },
      {
        "name": "getSoundPath",
        "description": "現在の音声ファイルパスを取得"
      },
      {
        "name": "resetSoundPath",
        "description": "音声設定をデフォルトに戻す"
      },
      {
        "name": "showNotification", 
        "description": "デスクトップ通知を表示"
      }
    ]
  },
  "platforms": ["darwin", "win32"],
  "icon": "icon.png"
}
```

### **6. 実装上の考慮事項**

  * **エラーハンドリング**: 基本的なエラーは catch して適切なレスポンスを返す
  * **セキュリティ**: 個人利用を前提とし、厳格なサンドボックス化は不要
  * **パフォーマンス**: 音声再生は非同期実行でメインプロセスをブロックしない
  * **互換性**: macOS 10.15+ および Windows 10+ をサポート
  * **クロスプラットフォーム配布**: 
      * DXT形式でのワンクリックインストール対応
      * NPMパッケージでの標準的なMCPサーバー配布
      * 異なるAIアシスタント間でのツール定義の統一

### **7. 将来の拡張予定**

  * **音声ファイルのカスタマイズ**: ユーザー指定の音声ファイル対応
  * **通知の詳細設定**: 表示時間、位置等の設定機能
  * **ログ機能**: 通知履歴の記録機能
  * **Linux対応**: Ubuntu等のLinuxディストリビューション対応

-----

### **8. 参考資料・リンク**

#### **8.1 公式ドキュメント・SDK**
- **[Model Context Protocol Python SDK](https://github.com/modelcontextprotocol/python-sdk?tab=readme-ov-file)**
  - MCPサーバー開発のためのPython公式SDK
  - サーバー実装の基本的なパターンとベストプラクティス
  - ツール定義やエラーハンドリングの参考実装

#### **8.2 パッケージング・配布**
- **[Anthropic DXT](https://github.com/anthropics/dxt)**
  - DXTパッケージ作成のための公式ツール
  - ワンクリックインストール対応パッケージの作成方法
  - manifest.json の詳細仕様とパッケージング手順

#### **8.3 実装例・参考プロジェクト**
- **[Sound Notification MCP](https://github.com/ks0318-p/sound-notification-mcp)**
  - 本プロジェクトと類似の機能を持つ実装例
  - TypeScript/Node.js での音声通知MCPサーバーの実装
  - macOS/Windows対応の実装パターン

#### **8.4 トラブルシューティング時の参考**
上記のリンクは以下の場面で特に有用です：

**開発・実装時:**
- Python SDK: サーバー実装の基本構造
- DXT: パッケージング時のmanifest設定
- Sound Notification MCP: 音声再生の実装パターン

**問題解決時:**
- 各リポジトリのIssues/Discussionsセクション
- 公式ドキュメントのトラブルシューティングガイド
- コミュニティでの類似問題の解決例