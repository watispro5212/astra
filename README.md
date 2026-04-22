# 🛰️ Astra Tactical Bot (TypeScript)

Astra is an enterprise-grade Discord moderation and utility bot, now rebuilt in high-performance TypeScript.

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

## ☁️ Deployment (Truly Free & No Credit Card)

We recommend **Hugging Face Spaces** for hosting. It is completely free and does not require a credit card for signup.

### 1. Create your Space
- Visit [Hugging Face](https://huggingface.co/) and create a free account.
- Click **"New Space"**.
- **Name**: `Astra-Bot` (or anything you like).
- **SDK**: Select **Docker**.
- **Template**: Choose **Blank**.
- **Visibility**: Public or Private.

### 2. Configure Secrets
Your bot needs its credentials to run. **Do not upload your `.env` file to Hugging Face.**
- In your Space, go to the **Settings** tab.
- Find **"Variables and secrets"**.
- Add the following **Secrets**:
    - `DISCORD_TOKEN`: Your bot token.
    - `DISCORD_CLIENT_ID`: Your bot's application ID.
    - `GUILD_ID`: (Optional) Your development server ID for instant command updates.
    - `DATABASE_URL`: Set to `sqlite:///./data/astra.db`.

### 3. Upload and Deploy
- Upload the following files/folders to your Space (using the "Files" tab or via Git):
    - `src/`
    - `package.json`
    - `tsconfig.json`
    - `Dockerfile`
- Hugging Face will automatically detect the `Dockerfile` and begin the build.
- Once the status changes to **"Running"**, your bot is live!

### 📡 Health Checks (Keep-Alive)
This bot includes a built-in HTTP server on port `8080` to respond to Hugging Face health checks. This ensures the bot stays awake and 24/7 online.

---

## 🛠️ Tech Stack
- **Core**: TypeScript & Node.js
- **Library**: [discord.js v14](https://discord.js.org/)
- **Database**: SQLite (local) or PostgreSQL (production)
- **Validation**: Zod
- **Logging**: Winston
