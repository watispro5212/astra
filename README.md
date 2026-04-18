<div align="center">

<img src="assets/images/astra-logo.png" alt="Astra Logo" width="120" height="120" />

# ✨ Astra

**A premium, modular Discord community bot built with `discord.py` 2.x**

[![Version](https://img.shields.io/badge/version-2.1.0-blueviolet?style=for-the-badge)](https://github.com/watispro5212/astra/releases)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![discord.py](https://img.shields.io/badge/discord.py-2.3+-5865F2?style=for-the-badge&logo=discord)](https://discordpy.readthedocs.io/)
[![License](https://img.shields.io/badge/license-Astra%20CL-orange?style=for-the-badge)](LICENSE)

[Features](#features) • [Commands](#commands) • [Setup](#setup) • [Changelog](#changelog) • [License](#license)

</div>

---

## Overview

Astra is a polished, fully modular Discord bot designed to be your server's all-in-one community platform. It handles moderation, engagement, automation, and server management — without being noisy or complicated to configure.

**v2.1 Update**: Now features a premium design system, advanced auto-moderation, and a comprehensive engagement suite.

---

## Features

| Module | Description |
|---|---|
| 🛡️ **Advanced Moderation** | Auto-moderation filters, `/mute`, `/purge`, and case-tracked history |
| 🏆 **Engagement Suite** | XP & Leveling system with leaderboard, rewards, and giveaways |
| 📋 **Audit Logging** | Detailed event tracking for channels, members, and messages |
| 🎭 **Reaction Roles** | Persistent button-based menus with unique-role swapping |
| 📊 **Interactive Polls** | Timed and anonymous voting with live animated progress bars |
| ⚙️ **Automation** | Join-to-Create temporary voice hubs and welcome systems |
| ⭐ **Starboard** | Community highlights with media support and star thresholds |
| 🎫 **Ticket System v2** | Categorized support channels with automated transcripts |

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

### Required Intents

Enable all three Privileged Gateway Intents in the Developer Portal:
- ✅ **Server Members Intent**
- ✅ **Message Content Intent**
- ✅ **Presence Intent** (Required for Member Stats & XP tracking)

---

## Commands

| Command | Description |
|---|---|
| `/ping` | Gateway and REST latency |
| `/rank` | View your current XP and progression |
| `/leaderboard` | Top 10 members in the server |
| `/mute` | Timeout a member for a duration |
| `/automod_config` | Setup specialized moderation filters |
| `/giveaway` | Start a persistent, button-based giveaway |
| `/voice hub` | Setup Join-to-Create voice channels |
| `/stats guild/user` | View detailed server or member metrics |
| `/purge` | Clear up to 100 messages at once |
| `/ticket_setup` | Configure categories and log channels |
| `/config view` | Review current server settings |

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a full version history.

**Latest: v2.1.0** — Massive visual overhaul with "Premium Glass" design system and synchronization of the v2.0 feature engine.

---

## License

This project is licensed under the **Astra Community License (ACL)**.  
See [LICENSE](LICENSE) for full terms.

**Summary**: Free to use and self-host for non-commercial purposes. Attribution required. Redistribution and commercial use prohibited.

---

## Author

Made with ❤️ by **watispro5212**  
GitHub: [watispro5212](https://github.com/watispro5212)  
Discord: `watispro1`
