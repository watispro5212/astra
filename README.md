<div align="center">

<img src="assets/images/astra-logo.png" alt="Astra Logo" width="120" height="120" />

# ✨ Astra

**A premium, modular Discord community bot built with `discord.py` 2.x**

[![Version](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)](https://github.com/watispro5212/astra/releases)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![discord.py](https://img.shields.io/badge/discord.py-2.3+-5865F2?style=for-the-badge&logo=discord)](https://discordpy.readthedocs.io/)
[![License](https://img.shields.io/badge/license-Astra%20CL-orange?style=for-the-badge)](LICENSE)

[Features](#features) • [Commands](#commands) • [Setup](#setup) • [Changelog](#changelog) • [License](#license)

</div>

---

## Overview

Astra is a polished, fully modular Discord bot designed to be your server's all-in-one community platform. It handles moderation, engagement, automation, and server management — without being noisy or complicated to configure.

Built for reliability and extensibility, Astra uses a Cog-based architecture, persistent SQLite storage, and Discord-native UI components (Buttons, Modals, Select Menus) throughout.

---

## Features

| Module | Description |
|---|---|
| 🛡️ **Moderation** | `/kick`, `/ban` (with confirmation), `/warn`, `/cases` — all case-tracked and persisted |
| 📋 **Audit Logging** | Join/leave, message edits/deletes, bans — all routed to a configurable log channel |
| 🎭 **Reaction Roles** | Persistent button-based role menus with optional unique-role swapping |
| 📊 **Polls** | Interactive voting with live animated progress bars. Up to 10 options. |
| 🔔 **Reminders** | Set personal reminders with natural duration strings (`1h 30m`, `2d`) |
| ⭐ **Starboard** | Community content highlights with configurable star threshold and media support |
| 🎫 **Tickets** | Full support system — button panels, private channels, staff-only controls |
| ⚙️ **Configuration** | Admin slash commands for all per-guild settings |

---

## Setup

### Requirements
- Python 3.11+
- A Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/watispro5212/astra.git
cd astra

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in your DISCORD_TOKEN and GUILD_ID

# 4. Run the bot
python main.py
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DISCORD_TOKEN` | ✅ | Your Discord bot token |
| `GUILD_ID` | ✅ | Your primary guild ID (for slash command syncing) |
| `BOT_NAME` | ❌ | Custom bot name (default: `Astra`) |
| `BOT_THEME_COLOR` | ❌ | Embed accent color as decimal integer (default: `3448893`) |
| `DATABASE_URL` | ❌ | SQLite path (default: `sqlite:///./data/astra.db`) |

### Required Bot Permissions

- `Manage Channels` (for Tickets)
- `Manage Roles` (for Reaction Roles)
- `Kick Members`, `Ban Members` (for Moderation)
- `View Audit Log`
- `Send Messages`, `Embed Links`, `Attach Files`
- `Add Reactions`

### Required Intents

Enable in the Developer Portal:
- ✅ **Server Members Intent**
- ✅ **Message Content Intent**

---

## Commands

| Command | Description |
|---|---|
| `/ping` | Gateway and REST latency |
| `/about` | Bot information and developer credits |
| `/kick` | Kick a member with an optional reason |
| `/ban` | Ban a member with confirmation dialog |
| `/warn` | Warn a member and log the case |
| `/cases` | View moderation history for a user |
| `/remind` | Set a personal timed reminder |
| `/reminders` | List your active reminders |
| `/poll` | Create a button-based interactive poll |
| `/rolemenu` | Create a persistent role selection menu |
| `/ticket_setup` | Configure ticket category and staff role |
| `/ticket_panel` | Deploy the support ticket panel |
| `/config logging` | Set the audit log channel |
| `/config starboard` | Set the starboard channel |
| `/config threshold` | Set the starboard star threshold |

---

## Project Structure

```
astra/
├── bot.py              # Core AstraBot class & setup_hook
├── main.py             # Entry point
├── core/
│   ├── config.py       # Pydantic configuration model
│   ├── database.py     # Async SQLite database manager
│   └── logger.py       # Structured logging setup
├── cogs/               # Feature modules (Cogs)
│   ├── admin_config.py
│   ├── general.py
│   ├── logging.py
│   ├── moderation.py
│   ├── polls.py
│   ├── reaction_roles.py
│   ├── reminders.py
│   ├── starboard.py
│   └── tickets.py
├── services/           # Business logic layer
│   ├── moderation_service.py
│   ├── poll_service.py
│   ├── reminder_service.py
│   ├── starboard_service.py
│   └── ticket_service.py
├── ui/
│   ├── embeds.py       # Standardised AstraEmbed classes
│   └── views/          # Persistent discord.ui.View components
└── data/               # SQLite database (auto-created)
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a full version history.

**Latest: v1.0.0** — Initial public release. Full moderation, polls, tickets, starboard, reminders, and reaction roles.

---

## License

This project is licensed under the **Astra Community License (ACL)**.  
See [LICENSE](LICENSE) for full terms.

**Summary**: Free to use and self-host for non-commercial purposes. Attribution required. Redistribution and commercial use prohibited without explicit permission from the author.

---

## Author

Made with ❤️ by **watispro1**  
GitHub: [watispro5212](https://github.com/watispro5212)  
Discord: `watispro1`

