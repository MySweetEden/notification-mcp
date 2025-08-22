@echo off
setlocal enabledelayedexpansion

REM Cursor MCP Server セットアップスクリプト (Windows版)
REM notification-mcp を Cursor で使用するための自動セットアップ

echo 🚀 Cursor MCP Server セットアップ開始
echo.

REM 現在のディレクトリを取得
set "CURRENT_DIR=%CD%"
set "CURSOR_CONFIG_DIR=%APPDATA%\Cursor\User"
set "CURSOR_MCP_CONFIG=%CURSOR_CONFIG_DIR%\mcp.json"
set "PROJECT_CURSOR_CONFIG=.cursor\mcp.json"

REM プロジェクトのビルドを確認
if not exist "dist" (
    echo 📦 プロジェクトをビルド中...
    npm run build
)

REM Cursor設定ディレクトリを作成
if not exist "%CURSOR_CONFIG_DIR%" mkdir "%CURSOR_CONFIG_DIR%"

REM 既存の設定ファイルをバックアップ
if exist "%CURSOR_MCP_CONFIG%" (
    echo 💾 既存の設定をバックアップ中...
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do set "DATE=%%c%%a%%b"
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set "TIME=%%a%%b"
    copy "%CURSOR_MCP_CONFIG%" "%CURSOR_MCP_CONFIG%.backup.%DATE%_%TIME%"
)

REM 新しい設定を作成
echo 📝 Cursor MCP設定を作成中...
(
echo {
echo   "mcpServers": {
echo     "notification-mcp": {
echo       "command": "node",
echo       "args": ["%CURRENT_DIR:\=/%/dist/index.js"],
echo       "env": {
echo         "NODE_ENV": "production"
echo       }
echo     }
echo   }
echo }
) > "%CURSOR_MCP_CONFIG%"

echo.
echo ✅ セットアップ完了！
echo.
echo 📋 次の手順:
echo 1. Cursorを再起動してください
echo 2. 新しいチャットを開始してください
echo 3. テストコマンドを実行してください:
echo    - getSoundPath()
echo    - playSound()
echo    - showNotification("テスト", "セットアップ完了")
echo.
echo 📁 設定ファイル場所:
echo    - グローバル設定: %CURSOR_MCP_CONFIG%
echo    - プロジェクト設定: %PROJECT_CURSOR_CONFIG%
echo.
echo 🔧 トラブルシューティング:
echo    - 問題が発生した場合: npm run build ^&^& scripts\setup-cursor.bat
echo    - 設定を確認: type "%CURSOR_MCP_CONFIG%"

pause
