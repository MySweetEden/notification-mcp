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

##### **実践的な使用例とベストプラクティス**

**1. 長時間のコード生成・リファクタリング**
```
「大規模なコードリファクタリングを実行してください。
完了したら playSound() と showNotification("リファクタリング完了", "全ファイルの処理が正常に終了しました") を呼んでください」
```

**2. データベース操作・マイグレーション**
```
「データベースマイグレーションを実行してください。
成功時: showNotification("マイグレーション成功", "データベーススキーマが更新されました") + playSound()
失敗時: showNotification("マイグレーション失敗", "エラーログを確認してください")」
```

**3. テスト実行・CI/CD処理**
```
「全テストスイートを実行してください。
結果に応じて通知を送信：
- 成功: showNotification("テスト完了", "全テストが正常に通過しました") + playSound()
- 失敗: showNotification("テスト失敗", "失敗したテスト数: X件")」
```

**4. ファイル処理・バッチ操作**
```
「複数ファイルの一括変換処理を実行してください。
進捗状況を通知：
- 開始時: showNotification("処理開始", "ファイル変換を開始します")
- 完了時: playSound() + showNotification("変換完了", "処理されたファイル数: X件")」
```

**5. API呼び出し・外部サービス連携**
```
「外部APIからデータを取得して処理してください。
完了時に詳細な結果を通知：
showNotification("API処理完了", "取得レコード数: X件、処理時間: Y秒") + playSound()」
```

##### **カスタム音声設定のベストプラクティス**

**推奨音声ファイル:**
- **ファイル形式**: WAV形式（クロスプラットフォーム対応）
- **ファイルサイズ**: 1MB以下（高速再生のため）
- **再生時間**: 1-3秒（短めが理想的）

**macOS用おすすめ音声:**
```bash
# システム標準音声の場所
/System/Library/Sounds/
  - Glass.aiff (デフォルト)
  - Ping.aiff (短い通知音)
  - Pop.aiff (ポップ音)
  - Purr.aiff (柔らかい音)
```

**Windows用おすすめ音声:**
```bash
# システム標準音声の場所
C:\Windows\Media\
  - Windows Notify.wav (デフォルト)
  - Windows Ding.wav (短い通知音)
  - Windows Pop.wav (ポップ音)
```

**カスタム音声の設定例:**
```
「カスタム音声を設定します：
setSoundPath("/Users/username/Music/custom-notification.wav")
設定後に動作確認: playSound()」
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

#### **4.1. 前提条件と事前準備**

##### **システム要件**
- **Node.js**: バージョン 18.0.0 以上
- **npm**: Node.js に付属（または yarn）
- **OS**: macOS 10.15+ または Windows 10+
- **権限**: 通知表示とシステム音声再生の許可

##### **事前確認**
```bash
# Node.jsバージョン確認
node --version  # v18.0.0以上であることを確認

# npm バージョン確認
npm --version

# システム音声確認（macOS）
afplay /System/Library/Sounds/Glass.aiff

# システム音声確認（Windows）
# PowerShellで実行
[System.Media.SystemSounds]::Beep.Play()
```

##### **通知許可設定**
**macOS:**
1. システム環境設定 > 通知とフォーカス
2. ターミナル（またはNode.js）の通知を許可
3. 「おやすみモード」を無効化（テスト時）

**Windows:**
1. 設定 > システム > 通知とアクション
2. 通知の表示を有効化
3. アプリからの通知を許可

#### **4.2. 配布形式と対応環境**

本MCPサーバーは複数の形式で配布され、様々なAIコーディングアシスタントで利用可能です：

##### **対応環境**
- **Claude Desktop**: DXT形式でのワンクリックインストール
- **Cursor**: MCPサーバーとしての手動設定
- **VS Code (Continue拡張)**: MCPサーバーとしての手動設定
- **Windsurf**: DXT形式またはMCPサーバー設定

#### **4.3. DXTパッケージのインストール（Claude Desktop、Windsurf等）**

**🎉 DXTパッケージが利用可能になりました！**

1. **DXTファイルのダウンロード**
   ```bash
   # GitHubリリースページから最新版をダウンロード
   curl -L -o notification-mcp.dxt \
     https://github.com/MySweetEden/notification-mcp/releases/latest/download/notification-mcp.dxt
   ```
   
   または、[リリースページ](https://github.com/MySweetEden/notification-mcp/releases)から直接ダウンロード

2. **ワンクリックインストール**
   - Claude Desktop、Windsurf等の対応AIアプリケーションで`.dxt`ファイルを開く
   - インストールダイアログに従ってインストール実行
   - 自動的に設定ファイルに追加される

3. **インストール確認**
   - AIアシスタントを再起動
   - `getSoundPath()` コマンドでMCPツールが利用可能か確認

4. **自動更新**
   - GitHub Releasesで新バージョンが自動配布されます
   - CI/CDパイプラインによる品質保証済み

#### **4.4. MCPサーバーとしての手動設定（推奨方法）**

##### **4.4.1. パッケージのインストール**

**方法1: NPMパッケージのグローバルインストール（推奨）**
```bash
# グローバルインストール
npm install -g notification-mcp-server

# インストール確認
notification-mcp-server --version
which notification-mcp-server
```

**方法2: ソースからのビルド（開発者向け）**
```bash
# リポジトリクローン
git clone https://github.com/MySweetEden/notification-mcp.git
cd notification-mcp

# 依存関係インストール
npm install

# TypeScriptビルド
npm run build

# 動作確認
npm run test

# インストールパス確認
pwd  # この場所を設定ファイルで使用
```

**方法3: ローカルインストール**
```bash
# プロジェクトディレクトリで実行
mkdir ~/mcp-servers
cd ~/mcp-servers
npm init -y
npm install notification-mcp-server

# インストール先確認
ls node_modules/.bin/notification-mcp-server
```

##### **4.4.2. Cursor での設定**

**🚀 自動セットアップ（推奨）**

プロジェクトをクローンした場合、ワンコマンドでセットアップできます：

```bash
# macOS/Linux
npm run cursor:setup

# Windows
npm run cursor:setup:windows
```

このコマンドは以下を自動実行します：
- プロジェクトのビルド
- 既存設定のバックアップ
- グローバルCursor設定への追加
- 設定の確認

**⚙️ 手動設定**

**設定ファイルの場所:**
- macOS: `~/.cursor/mcp.json`
- Windows: `%APPDATA%\Cursor\User\mcp.json`

**1. プロジェクト開発者向け（推奨）**

プロジェクト内の `.cursor/mcp.json` を参考に設定：

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

**2. グローバルインストール版の設定**
```json
{
  "mcpServers": {
    "notification-mcp": {
      "command": "notification-mcp-server",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**3. プロジェクト内設定ファイル**

このプロジェクトには `.cursor/mcp.json` が含まれており、プロジェクトを開いた際の設定例として利用できます：

```json
{
  "mcpServers": {
    "notification-mcp": {
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**🧪 設定後の確認手順:**

1. **Cursorを再起動**
2. **新しいチャットを開始**
3. **テストコマンドを実行:**
   ```
   getSoundPath()
   ```
   ```
   playSound()
   ```
   ```
   showNotification("テスト", "Cursor設定完了")
   ```

**📝 テストスクリプト**

プロジェクト内の `cursor-test.js` を実行すると、詳細なテスト手順が表示されます：

```bash
node cursor-test.js
```

**🔧 トラブルシューティング:**
- MCPツールが認識されない → Cursorを完全に再起動
- エラーが発生する → `npm run build` を実行
- 設定を確認 → `cat ~/.cursor/mcp.json`

##### **4.4.3. VS Code（Continue拡張）での設定**

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

##### **4.4.4. 設定の確認**

設定後、AIアシスタントを再起動し、以下のコマンドで動作確認：
```
getSoundPath()を呼んで設定状況を確認してください
```

#### **4.5. AIアシスタントでの使用方法**

インストール後、AIに以下のように指示してください：

**基本的な使用例:**
```
長時間の処理を開始する前に：
「完了したらplaySound()を呼んでください」

特定のメッセージを表示したい場合：
「完了したらshowNotification("データベース更新が完了しました")を呼んでください」
```

#### **4.6. 開発者向け：ソースからのビルド**

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
   
   # DXT manifest の検証
   npm run dxt:validate
   
   # DXTパッケージのビルド
   npm run dxt:build
   
   # NPMパッケージの作成
   npm pack
   
   # NPMレジストリへの公開（メンテナー用）
   npm publish
   
   # DXTファイルのクリーンアップ
   npm run dxt:clean
   ```

#### **4.7. 設定管理**

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

### **7. トラブルシューティング**

#### **7.1 インストール・セットアップ関連**

**Q: `npm install -g notification-mcp-server` でエラーが発生する**
```bash
# 解決方法
sudo npm install -g notification-mcp-server  # macOS/Linux
# または
npm config set prefix ~/.npm-global  # グローバルインストール先変更
export PATH=~/.npm-global/bin:$PATH
npm install -g notification-mcp-server
```

**Q: TypeScriptビルドエラーが発生する**
```bash
# 解決方法
npm run clean    # dist/ ディレクトリをクリア
npm install      # 依存関係を再インストール
npm run build    # 再ビルド実行
```

**Q: MCPサーバーが認識されない（Cursor/VS Code）**
- 設定ファイルのパスが正しいか確認
- `dist/index.js` が存在するか確認
- Node.jsのバージョンが18.0.0以上か確認

#### **7.2 音声再生関連**

**Q: 音声が再生されない（macOS）**
```bash
# 原因確認
ls -la /System/Library/Sounds/Glass.aiff  # デフォルト音声ファイル存在確認
afplay /System/Library/Sounds/Glass.aiff  # 手動再生テスト

# 解決方法
getSoundPath()  # 現在の設定確認
resetSoundPath()  # デフォルト設定に戻す
```

**Q: 音声が再生されない（Windows）**
- システム音量がミュートになっていないか確認
- Windows Media Player が正常に動作するか確認
- PowerShell実行ポリシーを確認: `Get-ExecutionPolicy`

**Q: カスタム音声ファイルが再生されない**
```bash
# ファイル形式確認（対応形式）
# macOS: .aiff, .wav, .mp3, .m4a
# Windows: .wav, .mp3

# ファイルパス確認
setSoundPath("/full/path/to/soundfile.wav")  # 絶対パス使用
getSoundPath()  # 設定確認
```

#### **7.3 通知表示関連**

**Q: デスクトップ通知が表示されない（macOS）**
1. システム環境設定 > 通知とフォーカス
2. ターミナル（またはNode.js）の通知許可を確認
3. 「おやすみモード」が無効になっているか確認

**Q: 通知が表示されない（Windows）**
1. 設定 > システム > 通知とアクション
2. 通知の表示が有効になっているか確認
3. アプリからの通知が許可されているか確認

**Q: 通知がすぐに消える**
- これは正常動作です（10秒後に自動消去）
- より長時間表示したい場合は設定ファイルで調整可能

#### **7.4 設定ファイル関連**

**Q: 設定ファイルが見つからない・破損した**
```bash
# 設定ファイル場所確認
ls -la ~/.mcp-sound-config.json

# 設定リセット（ファイル削除後、自動再作成）
rm ~/.mcp-sound-config.json
# 次回MCPツール実行時に自動作成される
```

**Q: 設定変更が反映されない**
```bash
# 設定確認
getSoundPath()

# 強制リセット
resetSoundPath()
setSoundPath("/new/path/to/sound.wav")
```

#### **7.5 AIアシスタント連携関連**

**Q: AIがMCPツールを認識しない**
1. MCPサーバーが正常に起動しているか確認
2. AIアシスタントを再起動
3. 設定ファイルの構文エラーがないか確認

**Q: ツール実行時にエラーが発生**
```bash
# デバッグ用テスト実行
npm run test      # 基本テスト
npm run test:full # 完全テスト（音声・通知あり）
```

#### **7.6 パフォーマンス・その他**

**Q: 音声再生が遅い**
- 大きなファイルサイズの音声ファイルを使用している可能性
- より小さなファイル（1MB以下推奨）に変更

**Q: 複数回通知が表示される**
- 正常動作です（AIが複数回ツールを呼び出した場合）
- 必要に応じてAIへの指示を調整

### **8. 将来の拡張予定**

  * **音声ファイルのカスタマイズ**: ユーザー指定の音声ファイル対応
  * **通知の詳細設定**: 表示時間、位置等の設定機能
  * **ログ機能**: 通知履歴の記録機能
  * **Linux対応**: Ubuntu等のLinuxディストリビューション対応

-----

### **9. 参考資料・リンク**

#### **9.1 公式ドキュメント・SDK**
- **[Model Context Protocol Python SDK](https://github.com/modelcontextprotocol/python-sdk?tab=readme-ov-file)**
  - MCPサーバー開発のためのPython公式SDK
  - サーバー実装の基本的なパターンとベストプラクティス
  - ツール定義やエラーハンドリングの参考実装

#### **9.2 パッケージング・配布**
- **[Anthropic DXT](https://github.com/anthropics/dxt)**
  - DXTパッケージ作成のための公式ツール
  - ワンクリックインストール対応パッケージの作成方法
  - manifest.json の詳細仕様とパッケージング手順

#### **9.3 実装例・参考プロジェクト**
- **[Sound Notification MCP](https://github.com/ks0318-p/sound-notification-mcp)**
  - 本プロジェクトと類似の機能を持つ実装例
  - TypeScript/Node.js での音声通知MCPサーバーの実装
  - macOS/Windows対応の実装パターン

#### **9.4 トラブルシューティング時の参考**
上記のリンクは以下の場面で特に有用です：

**開発・実装時:**
- Python SDK: サーバー実装の基本構造
- DXT: パッケージング時のmanifest設定
- Sound Notification MCP: 音声再生の実装パターン

**問題解決時:**
- 各リポジトリのIssues/Discussionsセクション
- 公式ドキュメントのトラブルシューティングガイド
- コミュニティでの類似問題の解決例