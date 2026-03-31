# @theyahia/sendpulse-mcp

MCP-сервер для API SendPulse — списки рассылки, отправка email, статистика. OAuth2-авторизация.

[![npm](https://img.shields.io/npm/v/@theyahia/sendpulse-mcp)](https://www.npmjs.com/package/@theyahia/sendpulse-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "sendpulse": {
      "command": "npx",
      "args": ["-y", "@theyahia/sendpulse-mcp"],
      "env": {
        "SENDPULSE_ID": "ваш_client_id",
        "SENDPULSE_SECRET": "ваш_client_secret"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add sendpulse -e SENDPULSE_ID=id -e SENDPULSE_SECRET=secret -- npx -y @theyahia/sendpulse-mcp
```

## Авторизация

`SENDPULSE_ID` и `SENDPULSE_SECRET` — OAuth2-ключи из настроек SendPulse.

## Инструменты (3)

| Инструмент | Описание |
|------------|----------|
| `get_mailing_lists` | Списки рассылки |
| `send_email` | Создать и отправить кампанию |
| `get_statistics` | Статистика кампании |

## Примеры запросов

```
Покажи все списки рассылки
Отправь письмо по списку 12345
Какая статистика у последней рассылки?
```

## Лицензия

MIT
