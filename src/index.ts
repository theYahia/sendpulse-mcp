#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getMailingListsSchema, handleGetMailingLists } from "./tools/mailing-lists.js";
import { sendEmailSchema, handleSendEmail } from "./tools/send-email.js";
import { getStatisticsSchema, handleGetStatistics } from "./tools/statistics.js";

const server = new McpServer({
  name: "sendpulse-mcp",
  version: "1.0.0",
});

server.tool(
  "get_mailing_lists",
  "Списки рассылки SendPulse: ID, название, количество подписчиков.",
  getMailingListsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetMailingLists(params) }],
  }),
);

server.tool(
  "send_email",
  "Создать и отправить email-кампанию по списку рассылки.",
  sendEmailSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleSendEmail(params) }],
  }),
);

server.tool(
  "get_statistics",
  "Статистика кампании: отправлено, открыто, кликов, open rate, click rate.",
  getStatisticsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetStatistics(params) }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[sendpulse-mcp] Сервер запущен. 3 инструмента. Требуется SENDPULSE_ID и SENDPULSE_SECRET.");
}

main().catch((error) => {
  console.error("[sendpulse-mcp] Ошибка запуска:", error);
  process.exit(1);
});
