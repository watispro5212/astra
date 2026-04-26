# 🛰️ Astra Tactical Bot (v7.0.0 Nova)

Astra is an enterprise-grade Discord moderation, community engagement, and utility bot, rebuilt in high-performance TypeScript. The v7.0.0 **Nova Update** introduces a full ticket system, giveaway engine, and advanced onboarding modules.

**Official Website**: [https://watispro5212.github.io/astra/](https://watispro5212.github.io/astra/)

## 🚀 Quick Start (Local Development)

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Environment**:
   Create a `.env` file based on `.env.example` and fill in your Discord credentials.
3. **Run in Development**:
   ```bash
   npm run dev
   ```

---

## 💎 v6.3.0 Titan Features
- **📊 Global Leveling**: Track user engagement with message-based XP and tactical rank lookup (`/rank`).
- **💰 Integrated Economy**: Claim daily rewards and transfer credits between operatives (`/economy`).
- **🛡️ Hardened Moderation**: Professional-grade ejection and blacklist systems with hierarchy protection.
- **📡 Shard Telemetry**: Real-time system diagnostics and rotating status engine.

---

## ☁️ Deployment (Railway & Render)

### 1. Bot Hosting (Railway)
Astra is optimized for **Railway**. Simply link your repository and add your environment variables (`DISCORD_TOKEN`, `CLIENT_ID`, etc.). The bot will automatically handle global command synchronization on startup.

### 2. Website Hosting (Render)
The Astra dashboard is designed for **Render Static Sites**. It includes full Safari compatibility and a live tactical terminal dashboard.

---

## 🛠️ Tech Stack
- **Core**: TypeScript & Node.js 20
- **Library**: [discord.js v14](https://discord.js.org/)
- **Database**: SQLite (local) or PostgreSQL (production)
- **Deployment**: Docker-ready (Railway/Render/HuggingFace)

---

## ⚖️ Legal & Security
- **Privacy**: We store minimal user data (User ID, XP, Balance) strictly for feature functionality.
- **Security**: Hardened against SQL injection and permission escalation.
