#!/usr/bin/env node

/**
 * Notification MCP Server
 * 
 * AI コーディングアシスタント向けサウンド通知MCPサーバー
 * 音声通知とデスクトップ通知を提供します
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// サーバー情報
const SERVER_INFO = {
  name: "notification-mcp",
  version: "1.0.0",
  description: "AI コーディングアシスタント向けサウンド通知MCPサーバー",
};

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
      case "playSound":
        return {
          content: [
            {
              type: "text",
              text: "音声再生機能は実装中です",
            },
          ],
        };

      case "setSoundPath":
        return {
          content: [
            {
              type: "text",
              text: `音声パス設定機能は実装中です: ${args?.soundPath}`,
            },
          ],
        };

      case "getSoundPath":
        return {
          content: [
            {
              type: "text",
              text: "音声パス取得機能は実装中です",
            },
          ],
        };

      case "resetSoundPath":
        return {
          content: [
            {
              type: "text",
              text: "音声パスリセット機能は実装中です",
            },
          ],
        };

      case "showNotification":
        return {
          content: [
            {
              type: "text",
              text: `通知表示機能は実装中です: ${args?.title} - ${args?.message}`,
            },
          ],
        };

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool ${name}: ${error}`
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
