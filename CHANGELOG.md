# Changelog

All notable changes to Astra are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [7.5.0] — April 26, 2026

### 🪐 Titan Protocol Deployment

A massive aesthetic and structural overhaul. Transitioned the entire Astra ecosystem to the **Titan** design language, featuring high-fidelity glassmorphism, neural grid effects, and an integrated industrial commerce portal.

#### 🎨 Web Portal v2.0 (Titan)

- **UI Engine 2.0** — Complete rewrite of the Astra web portal with premium design tokens.
- **Glassmorphism 2.0** — Implemented multi-layered blur effects and neon-accented borders across all sub-pages.
- **Industrial Hub Integration** — The web portal now directly showcases shop inventory with tactical mockups.
- **Responsive Telemetry** — Added live system status indicators to the Support Hub.
- **Archival Timeline** — Overhauled Mission Logs with a sleek vertical timeline layout.

#### 🏬 Commerce Protocol

- **Shop Synchronization** — The web display is now 1:1 with the `shopService.ts` kernel.
- **Role Integration** — Shop items can now be configured to grant specific server roles upon acquisition.
- **Tactical Inventory** — Added Energy Drinks, Tactical Badges, and Armor to the core marketplace.

#### 🛡️ Moderation & Utility

- **Case Persistence** — Hardened the PostgreSQL case logging for high-concurrency moderation.
- **Command Registry v2** — Updated all tactical protocols with new permission tiers and descriptions.

---

## [7.2.0] — April 26, 2026

### ⚡ Omega Protocol

The most significant economy and status intelligence update to date. Full fiscal overhaul, intelligent status broadcasting, and system diagnostics.

#### 💰 Economy Overhaul (Sector 09)

- **`/economy harvest`** — Collect passive credits accumulated from owned assets.
- **`/economy rob`** — 40% chance heist with 2-hour cooldown and penalty on failure.
- **`/economy gamble`** — Risk-adjusted wager with 45% win rate and 1.8× return.
- **`/economy slots`** — 3-reel slot machine with triple-jackpot rewards.
- **`/economy coinflip`** — Provably fair 50/50 double-or-nothing.
- All economy commands now display **balance after action**.

#### 🛒 Shop Marketplace (Sector 10)

- Items categorized by **type** (Passive Income, Consumable, Role Reward) with custom emoji.
- **`/shop sell`** — Liquidate owned assets at 50% market value.
- **`/shop admin edit`** — In-place modification of any shop item.
- All purchases correctly tracked in `user_inventory` (bug fix).

#### 📡 Status Intelligence (Sector 11)

- Dedicated **status webhook** fires on: boot, heartbeat (30min), health-check (60min), errors, guild join/leave.
- **`/system status`** — Live diagnostics with memory bar, CPU load, shard info.
- **`/system ping`** — WebSocket + API round-trip latency with color-coded health labels.
- **`/system servers`** — Sector deployment overview (Owner Only).
- **`/system update`** — Fully updated patch notes for Omega Protocol.

#### 🐛 Bug Fixes

- Mine could push balance below zero — fixed with `MAX(0, balance + ?)`.
- Shop inventory SQL crash on `si.item_id` — corrected to `si.id`.
- Stray syntax errors in `info.ts` and `utility.ts` — removed.
- `Command.execute` return-type mismatch — widened to `Promise<any>`.

---

## [7.0.0] — April 22, 2026

### 🏢 Enterprise Core Deployment

The "Enterprise" update synchronizes the entire Astra ecosystem to v7.0.0, finalizing the transition to a high-concurrency PostgreSQL architecture and deploying the new Support Ticketing sector.

#### 🎫 Support Ticketing (Sector 07)

- **High-Fidelity Persistence**: Deployed a robust ticketing system with database-backed session state and staff coordination logs.
- **Type-Safe Protocols**: Resolved critical TypeScript build failures in the ticketing logic, ensuring 100% deployment reliability in Docker environments.

#### 📡 Infrastructure & Sync

- **Ecosystem v7**: Unified the versioning standard across the `package.json`, bot kernel, and the Titan Web Portal.
- **Vanguard Reporter**: Hardened the global error interceptor to transmit real-time diagnostic packets during system anomalies.
- **Scale Optimization**: Finalized the asynchronous database manager for enterprise-grade scalability.

---

## [6.3.1] — April 22, 2026

### ☢️ Apex Reconstruction II

The "Titan" experience has been refined for maximum server purity and high-fidelity aesthetics.

#### 🏗️ Nuclear Protocol Expansion

- **Hierarchy Purge**: The `/setup_server` command now purges all legacy roles alongside channels when the **Nuclear** option is enabled.
- **Apex Branding**: Fully synchronized official **Astra Logo** and **Banner** across the bot and web portal.
- **Restored UI**: Fixed a layout failure in the home page and hardened image asset loading.

---

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

_© 2026 watispro5212. Licensed under the [Astra Community License](LICENSE)._
