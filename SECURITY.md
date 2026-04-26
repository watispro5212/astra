# Astra Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 6.3.x   | :white_check_mark: |
| 6.2.x   | :white_check_mark: |
| < 6.2   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Astra, please do not disclose it publicly.
Instead, report it directly to the developer/owner via the [Support Server](https://discord.gg/NZ5Gr7eqE8) or through GitHub. 

## Security Philosophy (v7.0.0 Nova)

Astra is designed to be safe, clean, and secure for all communities:
- **Staff Commands are Private:** Administrative commands and destructive actions (ban, kick, purge) are restricted by Discord's default role integrations and are invisible to regular members.
- **Minimal Data Collection:** We only log what is absolutely necessary for the functioning of core modules (moderation logs, tickets, and tactical progression).
- **Hardened Economy:** Fiscal systems are protected against race conditions and unauthorized credit manipulation.
- **Clean Interactions:** We avoid intrusive DMs unless specifically required by a feature the user initiated (like Reminders or Ticket Transcripts).
- **Stability:** The bot is built on a high-performance TypeScript architecture with automated sharding support.
