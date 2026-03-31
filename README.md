# @theyahia/sendpulse-mcp

Production-grade MCP server for SendPulse API — mailing lists, campaigns, templates, SMTP, push notifications. OAuth2 auth.

[![npm](https://img.shields.io/npm/v/@theyahia/sendpulse-mcp)](https://www.npmjs.com/package/@theyahia/sendpulse-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

### Claude Desktop

```json
{
  "mcpServers": {
    "sendpulse": {
      "command": "npx",
      "args": ["-y", "@theyahia/sendpulse-mcp"],
      "env": {
        "SENDPULSE_ID": "your_client_id",
        "SENDPULSE_SECRET": "your_client_secret"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add sendpulse -e SENDPULSE_ID=id -e SENDPULSE_SECRET=secret -- npx -y @theyahia/sendpulse-mcp
```

### Smithery

[![smithery badge](https://smithery.ai/badge/@theyahia/sendpulse-mcp)](https://smithery.ai/server/@theyahia/sendpulse-mcp)

```bash
npx -y @smithery/cli install @theyahia/sendpulse-mcp --client claude
```

### Streamable HTTP (remote / multi-client)

```bash
npx @theyahia/sendpulse-mcp --http
# Listening on port 3000 (override with PORT env)
# POST /mcp — MCP endpoint
# GET /health — health check
```

## Auth

OAuth 2.0 client credentials flow. Set `SENDPULSE_ID` and `SENDPULSE_SECRET` from your [SendPulse account settings](https://login.sendpulse.com/settings/#api).

Token endpoint: `POST https://api.sendpulse.com/oauth/access_token` with `grant_type=client_credentials`.

Tokens are cached and auto-refreshed.

## Tools (11)

### Mailing Lists
| Tool | Description |
|------|-------------|
| `get_mailing_lists` | List all mailing lists (address books) with subscriber counts |

### Campaigns
| Tool | Description |
|------|-------------|
| `send_email` | Create and send an email campaign to a mailing list |
| `list_campaigns` | List email campaigns with pagination |
| `get_campaign_statistics` | Campaign stats: sent, opens, clicks, open rate, click rate |

### Templates
| Tool | Description |
|------|-------------|
| `list_templates` | List email templates (own or SendPulse system templates) |
| `get_template` | Get template details by ID |

### SMTP
| Tool | Description |
|------|-------------|
| `smtp_send_email` | Send a transactional email via SMTP service |
| `smtp_list_emails` | List sent SMTP emails with pagination |

### Push Notifications
| Tool | Description |
|------|-------------|
| `list_push_websites` | List websites with push subscriptions |
| `get_push_statistics` | Push notification statistics for a website |
| `create_push_task` | Create a push notification for a website |

## Skills

| Skill | Trigger |
|-------|---------|
| `skill-send-email` | "Отправь email через SendPulse" |
| `skill-list-stats` | "Статистика подписчиков" |

## Development

```bash
npm install
npm run build
npm test
```

## Example Prompts

```
Show all mailing lists
Send an email to list 12345
What are the stats for my last campaign?
List my email templates
Send a transactional email to user@example.com
Show push notification websites
```

## License

MIT
