# Changelog

All notable changes to Astra are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [6.0.0] — April 22, 2026

### 🚀 The Clean Up

A massive philosophy shift towards simplicity, utility, and native Discord features. Bloat removed, essentials perfected.

#### 🌟 Core Philosophy Shift
- **Clean & Simple**: Removed overly complex and bloated systems (Economy, Starboard, Automod, Levels, Birthdays, Suggestions, Starboard, Backup, etc.) in favor of straight-forward, native discord experiences.
- **Patreon Removal**: Fully eradicated all Patreon integrations, links, and gated features. Astra is now 100% free with zero paywalls.
- **Guided Onboarding**: Implemented a flawless new member flow focusing on rules, verification, and role menus.
- **Organized Setup**: Simplified the server setup flow for administrators, utilizing sensible defaults and preview panes.
- **Auto-Sharded**: Upgraded the bot core to utilize native Auto-Sharding for infinite scalability across thousands of guilds.
- **Web Sunset**: Safely sunset the complex React web dashboard to focus exclusively on delivering the ultimate in-app Discord experience.

---

## [3.0.0] — April 18, 2026

The biggest Astra release to date. Ten new bot modules, a fully redesigned website, updated legal docs, and non-destructive database migrations for clean upgrades from v2.

### Added

#### Economy System

- `/economy balance` — View your coin balance
- `/economy daily` — Claim 200 coins every 24 hours
- `/economy work` — Earn 50–150 coins every hour
- `/economy pay` — Transfer coins to another member
- `/economy leaderboard` — Top earners in the server
- `/economy shop` — Browse purchasable items
- `/economy buy` — Purchase a shop item
- `/economy additem` / `/economy removeitem` — Staff shop management
- In-bot economy has no real-world value; balances are per-server

#### Warning System

- `/warn` — Issue a formal warning with DM notification and running count
- `/warnings` — View a user's full warning history
- `/delwarn` — Remove a specific warning by ID
- `/clearwarns` — Wipe all warnings for a user

#### AFK System

- `/afk` — Set an AFK message; bot auto-replies when you are mentioned
- Auto-removes AFK status on next message; reports how long you were away

#### Birthday System

- `/birthday set` — Register your birthday (month/day)
- `/birthday remove` — Remove your birthday
- `/birthday check` — Check anyone's registered birthday
- `/birthday upcoming` — Next 10 birthdays in the server
- `/birthday config` — Set announcement channel and birthday role
- Automatic 9 AM UTC daily check with announcements and role assignment

#### Suggestions

- `/suggest` — Submit a community suggestion; posted as embed with reactions
- `/suggestion config` — Set the suggestions channel
- `/suggestion approve` / `/suggestion deny` / `/suggestion implement` — Staff review workflow with embed status update and DM to author

#### Anti-Raid Protection

- Real-time mass-join detection using configurable join-rate thresholds
- Automatic server lockdown on raid detection (overrides `@everyone` send permissions)
- Configurable auto-kick or auto-ban of raiders during lockdown
- Alert embed sent to a configured channel on lockdown trigger
- `/antiraid config` — Set threshold, window, action type, and alert channel
- `/antiraid unlock` — Manually lift a lockdown
- `/antiraid status` — View current config and lockdown state

#### Invite Tracker

- Tracks which invite code each member used when joining
- Records fake invites (left members) and net invite count
- Invite cache rebuilt automatically on ready and on guild join
- `/invites check` — View stats for a member (invited, left, fake)
- `/invites leaderboard` — Top inviters in the server
- `/invites whoinvited` — Who invited a specific member

#### Fun Commands

- `/8ball` — Magic 8-ball with 20 responses
- `/coinflip` — Heads or tails
- `/roll` — Roll a die with configurable sides
- `/roast` — Roast a target member
- `/trivia` — Live in-channel trivia with 20-second timer; tracked per-channel to prevent overlap
- `/choose` — Pick randomly from a list of options
- `/rps` — Rock, paper, scissors against the bot

#### Server Backup

- `/backup export` — Serializes server config (9 tables) to a downloadable JSON file
- `/backup import` — Restores config from an uploaded JSON file; upserts rows non-destructively
- `/backup info` — Shows metadata from a backup file before importing

#### Channel Lock / Unlock

- `/lock` — Deny `send_messages` for `@everyone` in the current channel
- `/unlock` — Restore default `send_messages` permission

### Website

- Fully redesigned site with glassmorphism design system and dark theme
- **Command search** (`commands.html`) — Live filter across 50+ commands by name or description
- **FAQ page** (`faq.html`) — 11 accordion items covering setup, moderation, tickets, and self-hosting
- Social footer links
- All inline styles replaced with semantic CSS classes (linter-clean)

### Legal & Docs

- **LICENSE** updated to ACL v2.0 — added Section 6 (Data & Privacy), updated contact URLs
- **Privacy Policy** updated for v3 data types (economy, warnings, AFK, birthdays, invites, anti-raid logs)
- **Terms of Service** updated with economy disclaimer and anti-raid liability clause
- **README** rewritten for v3 with full feature table, env vars, required intents, and commands table

### Database

- 13 new tables: `economy`, `shop_items`, `economy_transactions`, `warnings`, `afk`, `birthdays`, `birthday_configs`, `suggestions`, `suggestion_configs`, `invite_tracking`, `invite_counts`, `antiraid_configs`, `antiraid_logs`
- Non-destructive migrations via `_safe_add_column()` — safe to upgrade from v2 without data loss

---

## [2.1.0] — April 18, 2026

### ✨ Branding & UI Overhaul
- **New Design System**: Transitioned to a "Premium Glass" aesthetic with Outfit & Inter typography.
- **Enhanced Glassmorphism**: Refined backdrop blur, vibrant color tokens, and subtle internal glows for cards and buttons.
- **Improved Navigation**: Added "Changelog" to the global navbar and overhauled all 8 website pages.
- **Responsive Layouts**: Optimized grid systems for better mobile and tablet viewing.
- **Performance**: Improved animation smoothness using cubic-bezier transitions.

---

## [2.0.0] — April 18, 2026

Major feature expansion and core system refactor. Astra is now a complete community management platform.

### Added

#### 🏆 Engagement & Leveling
- **XP/Leveling System**: Earn XP by chatting. Features configurable role rewards and level-up announcements.
- **Giveaways**: Button-based persistent giveaways with automated winner selection and reroll capabilities.
- **Leaderboards**: View the top members in your server with `/leaderboard`.

#### 🛡️ Advanced Security
- **Auto-Moderation**: Automated filters for spam, link invites, excessive caps, and more.
- **Timeout Management**: Integrated `/mute` and `/unmute` using Discord's native timeout system.
- **Mass Removal**: `/purge` and `/slowmode` tools for managing high-activity channels.

#### ⚙️ Automation & Tools
- **Temporary Voice**: "Join-to-Create" hubs that automatically create and delete member voice channels.
- **Welcome System**: Automated join/leave messages and auto-role assignment for new members.
- **Server Stats**: Real-time dashboards showing member growth and activity.

#### 🎫 Ticket System v2
- **Transcripts**: Automated HTML transcripts for closed tickets, sent to staff logs.
- **Categorized Tickets**: Support for multiple ticket types (Support, Report, Inquiry).
- **Audit Logs**: Enhanced logging for all ticket operations.

### Improved
- **Error Handling**: Standardized recovery for database locks and permission errors.
- **Database**: Implemented non-destructive schema migrations for easier updates.
- **UI Components**: Updated all embeds to use `AstraEmbed` for brand consistency.

---

## [1.0.0] — April 18, 2026

Initial public release of Astra.

### Added

#### 🛡️ Moderation
- `/kick` — Kick a member with an optional reason
- `/ban` — Ban a member with a confirmation dialog (Button UI)
- `/warn` — Warn a member and persist the case to the database
- `/cases` — View paginated moderation history for any user

#### 📋 Audit Logging
- Automatic logging for member joins and leaves
- Automatic logging for message edits and deletions
- Automatic logging for bans and unbans
- `/config logging` — Set the audit log channel

#### 🎭 Reaction Roles
- Persistent button-based role menus that survive bot restarts
- Unique-role mode (swaps roles within a menu)
- `/rolemenu` — Create and configure role menus

#### 📊 Polls
- `/poll` — Create interactive polls with up to 10 options
- Real-time animated progress bar results (▉▉▉░░░)
- One-vote-per-user integrity enforcement

#### 🔔 Reminders
- `/remind` — Set personal reminders using flexible durations (`1h 30m`, `2d`, `45s`)
- `/reminders` — List and manage your pending reminders
- Background scheduler that survives bot restarts

#### ⭐ Starboard
- Automatic community Starboard with configurable threshold
- Self-star filtering (author stars don't count)
- Media and image attachments included in Starboard cards
- Live count updates as reactions are added or removed
- `/config starboard` & `/config threshold` — Channel and threshold configuration

#### 🎫 Tickets
- `/ticket_setup` — Configure ticket category and staff role
- `/ticket_panel` — Deploy a persistent "Open Ticket" button panel
- Automated private channel creation with correct permission overwrites
- In-channel staff controls (Close Ticket button)

#### ⚙️ General & Infrastructure
- `/ping` — Gateway and REST latency display
- `/about` — Bot info, developer credits, and GitHub link
- Persistent SQLite database with migrations
- Modular Cog-based architecture
- Structured logging system
- Global error handler with friendly user feedback

---

*© 2026 watispro5212. Licensed under the [Astra Community License](LICENSE).*
