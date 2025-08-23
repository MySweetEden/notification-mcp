#!/usr/bin/env node

/**
 * Notification MCP Server
 * 
 * 音声通知とデスクトップ通知機能を提供するMCPサーバー
 * AIアプリケーションでの長時間処理完了時などに通知を送信します
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { FileConfigManager } from "./config.js";
import { SoundPlayer } from "./sound.js";
import { NotificationManager } from "./notification.js";

// サーバー情報
const SERVER_INFO = {
  name: "notification-mcp",
  version: "1.0.1",
  description: "音声通知とデスクトップ通知機能を提供するMCPサーバー",
};

// サービスインスタンスを作成
const configManager = new FileConfigManager();
const soundPlayer = new SoundPlayer();
const notificationManager = new NotificationManager();

// MCPサーバーインスタンスを作成
const server = new Server(SERVER_INFO, {
  capabilities: {
    tools: {},
  },
});

// ツール一覧を返すハンドラー
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "playSound",
        description: "設定済みの音声ファイルを再生します",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: "setSoundPath",
        description: "通知音として使用する音声ファイルのパスを設定します",
        inputSchema: {
          type: "object",
          properties: {
            soundPath: {
              type: "string",
              description: "音声ファイルの絶対パス",
            },
          },
          required: ["soundPath"],
          additionalProperties: false,
        },
      },
      {
        name: "getSoundPath",
        description: "現在設定されている音声ファイルのパスを取得します",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: "resetSoundPath",
        description: "音声設定をOS標準のデフォルト音に戻します",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: "showNotification",
        description: "デスクトップ通知を表示します",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "通知のタイトル",
            },
            message: {
              type: "string",
              description: "通知のメッセージ",
            },
          },
          required: ["title", "message"],
          additionalProperties: false,
        },
      },

    ],
  };
});

// ツール呼び出しハンドラー
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "playSound": {
        const config = await configManager.load();
        let soundPath: string;

        if (config.sound.useDefault) {
          soundPath = configManager.getDefaultSoundPath();
        } else if (config.sound.customPath) {
          soundPath = config.sound.customPath;
        } else {
          soundPath = configManager.getDefaultSoundPath();
        }

        const result = await soundPlayer.playSound(soundPath);
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      case "setSoundPath": {
        const soundPath = args?.soundPath as string;
        if (!soundPath) {
          throw new Error("soundPath parameter is required");
        }

        // 音声ファイルの存在確認
        const isValid = await soundPlayer.testSoundFile(soundPath);
        if (!isValid) {
          throw new Error(`指定された音声ファイルにアクセスできません: ${soundPath}`);
        }

        // 設定を更新
        const config = await configManager.load();
        config.sound.customPath = soundPath;
        config.sound.useDefault = false;
        await configManager.save(config);

        return {
          content: [
            {
              type: "text",
              text: `音声ファイルパスを設定しました: ${soundPath}`,
            },
          ],
        };
      }

      case "getSoundPath": {
        const config = await configManager.load();
        let currentPath: string;
        let pathType: string;

        if (config.sound.useDefault) {
          currentPath = configManager.getDefaultSoundPath();
          pathType = "デフォルト";
        } else if (config.sound.customPath) {
          currentPath = config.sound.customPath;
          pathType = "カスタム";
        } else {
          currentPath = configManager.getDefaultSoundPath();
          pathType = "デフォルト（フォールバック）";
        }

        return {
          content: [
            {
              type: "text",
              text: `現在の音声ファイル（${pathType}）: ${currentPath}`,
            },
          ],
        };
      }

      case "resetSoundPath": {
        const config = await configManager.load();
        config.sound.useDefault = true;
        delete config.sound.customPath;
        await configManager.save(config);

        const defaultPath = configManager.getDefaultSoundPath();
        return {
          content: [
            {
              type: "text",
              text: `音声設定をデフォルトに戻しました: ${defaultPath}`,
            },
          ],
        };
      }

      case "showNotification": {
        const title = args?.title as string;
        const message = args?.message as string;

        if (!title || !message) {
          throw new Error("title and message parameters are required");
        }

        const result = await notificationManager.showSimpleNotification(title, message);
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool ${name}: ${errorMessage}`
    );
  }
});

// サーバー起動処理
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Notification MCP Server running on stdio");
}

// エラーハンドリング
process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await server.close();
  process.exit(0);
});

// サーバー開始
main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});