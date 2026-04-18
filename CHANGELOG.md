# Changelog

All notable changes to Astra are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
