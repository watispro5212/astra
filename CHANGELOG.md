# Changelog

All notable changes to Astra are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [6.3.0] — April 22, 2026

### 🛰️ The Titan Update

A major expansion bringing community engagement and fiscal systems back into the Astra ecosystem, now optimized for high-performance TypeScript.

#### 📊 Astra Intelligence (Leveling)
- **XP Acquisition**: Integrated a global experience system. Users earn 15-25 XP per message.
- **Level Progression**: Automated level-up logic with non-intrusive high-fidelity notifications.
- **Tactical Ranks**: Added `/rank` for real-time progression analysis of any operative.
- **Anti-Spam**: Implemented a 60-second activity cooldown per user to ensure fair growth.

#### 💰 Astra Fiscal (Economy)
- **Credit Ledger**: Global balance tracking for all users across the Astra network.
- **Daily Allocations**: Claim 500 credits every 24 hours via `/economy daily`.
- **Peer-to-Peer Transfers**: Securely transfer capital to other members with `/economy pay`.
- **Balance Audits**: View current fiscal status with `/economy balance`.

#### 📡 System Improvements
- **Presence Engine**: Added a rotating status rotator cycling through shard health and server counts.
- **Safari Compatibility**: Full CSS vendor-prefix audit for glassmorphism components.
- **TypeScript Core**: Resolved interaction return-type mismatches and expanded database schema.

---

## [6.2.0] — April 22, 2026

### 🚀 Scale & Horizon

Foundation for the future. Transitioning Astra's core identity from a single-instance bot to an enterprise-grade distributed network.

- **PostgreSQL Integration**: Migrated core database engine to PostgreSQL for high-concurrency operations.
- **Async Connection Pooling**: Integrated `databases` library with `asyncpg` for multi-shard access.
- **Enterprise Schema**: Overhauled table definitions with `BIGINT` and `SERIAL` types.
- **Live Terminal**: Integrated a real-time diagnostics dashboard into the website.

---

## [6.1.0] — April 22, 2026

### 🛡️ The TypeScript Migration

A massive philosophy shift towards simplicity, utility, and native Discord features.

- **TypeScript Rewrite**: Rebuilt the entire bot engine in high-performance TypeScript.
- **Clean & Simple**: Removed legacy bloat in favor of a straight-forward, native Discord experience.
- **Patreon Removal**: Fully eradicated all gated features; Astra is now 100% free.
- **Auto-Sharding**: Upgraded the core to utilize native Discord sharding for infinite scalability.

---

*© 2026 watispro5212. Licensed under the [Astra Community License](LICENSE).*
