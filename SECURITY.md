# Astra Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 6.1.x   | :white_check_mark: |
| < 6.1   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Astra, please do not disclose it publicly.
Instead, report it directly to the developer/owner via direct message or email. 

## Security Philosophy (V6)

Astra is designed to be safe, clean, and secure for all communities:
- **Staff Commands are Private:** Administrative commands and destructive actions (ban, kick, purge) are restricted by Discord's default role integrations and are invisible to regular members.
- **Minimal Data Collection:** We only log what is absolutely necessary for the functioning of core modules (moderation logs, tickets, and leveling).
- **Clean Interactions:** We avoid intrusive DMs unless specifically required by a feature the user initiated (like Reminders or Ticket Transcripts).
- **Sharded Stability:** The bot is built on an Auto-Sharded architecture to prevent cascading failures or cross-server slowdowns.
