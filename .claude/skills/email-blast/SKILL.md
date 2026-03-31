---
name: email-blast
description: "Отправка email через SendPulse"
argument-hint: <mailing list name or id>
allowed-tools:
  - Bash
  - Read
---

# /email-blast

1. Call get_mailing_lists to find target list
2. Call send_email with content
3. Call get_statistics to check delivery
