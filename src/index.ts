#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";

import { getMailingListsSchema, handleGetMailingLists } from "./tools/mailing-lists.js";
import { sendEmailSchema, handleSendEmail } from "./tools/send-email.js";
import { getStatisticsSchema, handleGetStatistics } from "./tools/statistics.js";
import { listCampaignsSchema, handleListCampaigns } from "./tools/campaigns.js";
import { listTemplatesSchema, handleListTemplates, getTemplateSchema, handleGetTemplate } from "./tools/templates.js";
import { smtpSendSchema, handleSmtpSend, smtpListEmailsSchema, handleSmtpListEmails } from "./tools/smtp.js";
import { listPushWebsitesSchema, handleListPushWebsites, getPushStatisticsSchema, handleGetPushStatistics, createPushTaskSchema, handleCreatePushTask } from "./tools/push.js";

const VERSION = "1.1.0";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "sendpulse-mcp",
    version: VERSION,
  });

  // --- Mailing Lists ---
  server.tool(
    "get_mailing_lists",
    "Списки рассылки SendPulse: ID, название, количество подписчиков.",
    getMailingListsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetMailingLists(params) }],
    }),
  );

  // --- Campaigns ---
  server.tool(
    "send_email",
    "Создать и отправить email-кампанию по списку рассылки.",
    sendEmailSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleSendEmail(params) }],
    }),
  );

  server.tool(
    "list_campaigns",
    "Список email-кампаний с пагинацией.",
    listCampaignsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleListCampaigns(params) }],
    }),
  );

  server.tool(
    "get_campaign_statistics",
    "Статистика кампании: отправлено, открыто, кликов, open rate, click rate.",
    getStatisticsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetStatistics(params) }],
    }),
  );

  // --- Templates ---
  server.tool(
    "list_templates",
    "Список email-шаблонов (свои или системные SendPulse).",
    listTemplatesSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleListTemplates(params) }],
    }),
  );

  server.tool(
    "get_template",
    "Получить детали email-шаблона по ID.",
    getTemplateSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetTemplate(params) }],
    }),
  );

  // --- SMTP ---
  server.tool(
    "smtp_send_email",
    "Отправить транзакционное email через SMTP сервис SendPulse.",
    smtpSendSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleSmtpSend(params) }],
    }),
  );

  server.tool(
    "smtp_list_emails",
    "Список отправленных SMTP-писем с пагинацией.",
    smtpListEmailsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleSmtpListEmails(params) }],
    }),
  );

  // --- Push Notifications ---
  server.tool(
    "list_push_websites",
    "Список сайтов с push-подпиской.",
    listPushWebsitesSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleListPushWebsites(params) }],
    }),
  );

  server.tool(
    "get_push_statistics",
    "Статистика push-уведомлений для сайта.",
    getPushStatisticsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetPushStatistics(params) }],
    }),
  );

  server.tool(
    "create_push_task",
    "Создать push-уведомление для сайта.",
    createPushTaskSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleCreatePushTask(params) }],
    }),
  );

  return server;
}

async function main() {
  const useHttp = process.argv.includes("--http");
  const server = createMcpServer();

  if (useHttp) {
    const port = parseInt(process.env.PORT ?? "3000", 10);
    const httpServer = createServer(async (req, res) => {
      if (req.method === "POST" && req.url === "/mcp") {
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() });
        await server.connect(transport);
        await transport.handleRequest(req, res);
      } else if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", version: VERSION, tools: 11 }));
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    });
    httpServer.listen(port, () => {
      console.error(`[sendpulse-mcp] HTTP server on port ${port}. POST /mcp for MCP, GET /health for status.`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`[sendpulse-mcp] Server started. 11 tools. Requires SENDPULSE_ID + SENDPULSE_SECRET.`);
  }
}

main().catch((error) => {
  console.error("[sendpulse-mcp] Startup error:", error);
  process.exit(1);
});
