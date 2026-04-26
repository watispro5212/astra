# 🛰️ Astra Tactical Bot (v7.5.0 'Titan')

Astra is an enterprise-grade Discord moderation, community engagement, and utility bot, rebuilt in high-performance TypeScript. The v7.5.0 **'Titan'** update is a proprietary release featuring a massive high-fidelity web overhaul, Glassmorphism 2.0 components, and the new Industrial Hub (Tactical Shop) integration.

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

## 💎 v7.5.0 'Titan' Features
- **🎨 Titan Design Language**: Total web overhaul with high-fidelity glassmorphism and neural grid effects.
- **🏬 Industrial Hub**: Integrated tactical shop display with automated role granting and inventory sync.
- **📊 Global Leveling**: Re-engineered XP tracking with tactical rank progression (`/rank`).
- **💰 Dynamic Economy**: High-stakes credit system with market liquidation and rob protocols (`/economy`).
- **🛡️ Hardened Moderation**: Enterprise-grade ban/kick systems with multi-layered AutoMod protection.
- **📡 Nova Telemetry**: Live system diagnostics, memory monitoring, and WebSocket health checks (`/system status`).
- **🎫 Support Desk**: Integrated private ticket threads for technical assistance.

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
- **Proprietary Status**: Astra is **NOT open source**. This software is private property of the author. Redistribution, selling, or re-hosting without permission is strictly prohibited.
- **Privacy**: We store minimal user data (User ID, XP, Balance) strictly for feature functionality.
- **Security**: Hardened against SQL injection and permission escalation.
