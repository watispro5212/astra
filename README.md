# Astra v6.0.0 — Clean & Simple

Astra is a high-performance, minimalist Discord bot designed for professional community management, moderation, and support. Built for clarity and speed, Astra eliminates feature bloat to focus on the core essentials every growing server needs.

## 🚀 Core Philosophy
Astra v6 ("The Clean Up") represents a major architectural shift. We've removed complex, underused systems (Economy, Leveling, Fun) to deliver a zero-friction experience.
- **Discord-Native**: Deep integration with slash commands, buttons, modals, and native timeouts.
- **No Bloat**: Every feature has a clear purpose. No unnecessary DMs or complex setup flows.
- **Enterprise Grade**: Auto-sharded architecture with a persistent SQLite core.

## ✨ Key Features
- **Professional Moderation**: Numbered case tracking, native timeouts, conduct history, and CSV/JSON data exports.
- **Guided Onboarding**: Automated server blueprints, welcome flows, and button-based role menus.
- **Support Tickets**: Secure, private support channels with HTML transcripts and staff performance metrics.
- **Server Utility**: Interactive polls, personal reminders, and comprehensive audit logging.

## 🛠️ Getting Started
### Prerequisites
- Python 3.10+
- A Discord Bot Token (via [Discord Developer Portal](https://discord.com/developers/applications))

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/watispro5212/astra.git
   cd astra
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your bot token.
   ```bash
   cp .env.example .env
   ```
4. Run the bot:
   ```bash
   python main.py
   ```

## 📜 Documentation
- **Commands**: View the full command reference at [commands.html](commands.html).
- **Features**: Explore detailed module breakdowns at [features.html](features.html).
- **Changelog**: See the full version history at [CHANGELOG.md](CHANGELOG.md).
- **Security**: Review our security philosophy in [SECURITY.md](SECURITY.md).

## ⚖️ License
Astra is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---
*Developed with ✨ for the Discord community by [watispro1](https://github.com/watispro5212).*
