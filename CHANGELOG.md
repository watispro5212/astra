# Changelog

All notable changes to Astra are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — v2.0.0

> Major overhaul. Planned features coming in the next release.

### Planned
- XP Leveling & leaderboard system
- Welcome messages with card embeds
- Auto-moderation (anti-spam, link filtering, caps lock)
- Giveaway system
- Temporary voice channels
- Per-user server statistics (`/stats`)
- Advanced poll options (timed auto-close, anonymous voting)
- Thread-based ticket transcripts
- Server backup and restore (config only)
- Multi-guild support improvements

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
