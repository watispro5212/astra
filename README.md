# Astra

**The ultimate all-in-one Discord community bot — built with `discord.py` 2.x**

[![Version](https://img.shields.io/badge/version-3.0.0-blueviolet?style=for-the-badge)](https://github.com/watispro5212/astra/releases)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![discord.py](https://img.shields.io/badge/discord.py-2.3+-5865F2?style=for-the-badge&logo=discord)](https://discordpy.readthedocs.io/)
[![License](https://img.shields.io/badge/license-Astra%20CL%20v2-orange?style=for-the-badge)](LICENSE)

[Features](#features) • [Commands](#commands) • [Setup](#setup) • [Changelog](#changelog) • [License](#license)

---

## Overview

Astra v3 is the most complete version yet — a fully modular Discord bot covering moderation, economy, leveling, anti-raid protection, community features, fun commands, and server management in one clean package.

**v3.0**: Adds 10 new modules (economy, warnings, AFK, birthdays, suggestions, anti-raid, invite tracker, fun commands, server backup), a fully redesigned website with status page and command search, and updated legal docs.

---

## Features

| Module | Description |
| --- | --- |
| **Moderation Suite** | Kick, ban, mute, warn, lock channels — full case tracking with appeals and export |
| **Anti-Raid** | Real-time mass-join detection with automatic server lockdown |
| **Economy System** | Coins, daily/work rewards, server shop with role rewards, leaderboard |
| **Warning System** | Formal warnings with history, individual removal, and DM notifications |
| **AFK System** | Set AFK status, auto-reply on mention, auto-remove on activity |
| **Birthdays** | Auto announcements, birthday roles, upcoming calendar |
| **Suggestions** | Community idea submission with staff approve/deny workflow |
| **Invite Tracker** | Track who invited who, invite leaderboard, fake/leave detection |
| **Fun Commands** | 8ball, trivia, RPS, roast, dice, coin flip, chooser |
| **XP & Leveling** | Configurable XP system with role rewards and level-up announcements |
| **Giveaways** | Button-based persistent giveaways with automated winner selection |
| **Polls** | Timed and anonymous voting with live progress bars |
| **Starboard** | Community highlights with configurable threshold |
| **Ticket System** | Private support channels with HTML transcripts |
| **Reaction Roles** | Persistent button/dropdown menus with unique-role mode |
| **Server Backup** | Export/import full server configuration as JSON |
| **Welcome System** | Custom join/farewell messages and auto-role assignment |
| **Temp Voice** | Join-to-Create hubs for private voice channels |
| **Audit Logging** | Detailed event tracking for all server actions |
| **Reminders** | Flexible personal reminders with DM fallback |

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
# Edit .env and fill in your DISCORD_TOKEN and optionally GUILD_ID

# 4. Run the bot
python main.py
```

### Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DISCORD_TOKEN` | Yes | Your bot token from the Developer Portal |
| `GUILD_ID` | Optional | Dev server ID — syncs slash commands instantly |
| `OWNER_ID` | Optional | Your Discord user ID for owner-only commands |
| `DATABASE_URL` | Optional | SQLite path (default: `sqlite:///./data/astra.db`) |

### Required Privileged Intents

Enable all three in the [Developer Portal](https://discord.com/developers/applications) under your bot's settings:

- **Server Members Intent** — Required for welcome, leveling, invite tracking
- **Message Content Intent** — Required for automod, leveling, AFK, trivia
- **Presence Intent** — Required for member stats

---

## Commands

| Command | Description |
| --- | --- |
| `/mod kick/ban/mute/unmute` | Core moderation with case tracking |
| `/warn` / `/warnings` / `/clearwarns` | Warning system |
| `/lock` / `/unlock` | Channel lock/unlock |
| `/economy balance/daily/work/pay` | Economy system |
| `/economy shop/buy/additem` | Shop management |
| `/antiraid config/unlock/status` | Anti-raid controls |
| `/birthday set/check/upcoming` | Birthday system |
| `/suggest` / `/suggestion approve/deny` | Suggestions |
| `/invites check/leaderboard/whoinvited` | Invite tracker |
| `/8ball` / `/trivia` / `/rps` / `/roast` | Fun commands |
| `/backup export/import` | Config backup |
| `/afk` | Set AFK status |
| `/rank` / `/leaderboard` | XP system |
| `/giveaway` / `/poll` | Engagement tools |
| `/config` / `/ticket_setup` | Server configuration |

See the [full command reference](https://watispro5212.github.io/astra/commands.html) for all 50+ commands.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

**Latest: v3.0.0** — 10 new modules, redesigned website with status page and command search, updated legal docs.

---

## License

Licensed under the **Astra Community License v2 (ACL v2)**.
See [LICENSE](LICENSE) for full terms.

**Summary**: Free for non-commercial self-hosting with attribution. No redistribution or commercial use without permission.

---

## Author

Made with love by **watispro5212**
Discord: `watispro1`
Support Server: <https://discord.gg/NZ5Gr7eqE8>
