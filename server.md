# 🏛️ Astra Support Server: Master Architecture & Permission Guide

This document defines the **v2.1 Master Configuration** for the Astra Support Server. It is designed for maximum security, scalability, and ease of management using Category Syncing and Role-Based Access Control (RBAC).

---

## ─── I. ROLE HIERARCHY & PERMISSION MATRIX ───

Roles are ordered from highest to lowest. Emojis must be used in the names for better visibility.

### 👑 Management Roles
| Role | Color | Scope | Key Permissions |
| :--- | :--- | :--- | :--- |
| `👑 Owner` | #E74C3C | Full access | **Administrator** |
| `🔧 Admin` | #C0392B | High-level ops | Administrator (or Manage Server/Channels/Roles/Webhooks) |
| `💻 Developer` | #3498DB | Technical | View Audit Logs, Manage Webhooks, Manage Threads |
| `🛡️ Moderator` | #E67E22 | Security | Timeout, Kick/Ban, Manage Messages, Manage Threads |

### 🛠️ Staff & Community Roles
| Role | Color | Job | Permissions |
| :--- | :--- | :--- | :--- |
| `🚑 Support Lead` | #F39C12 | Head of Tickets | Manage Messages, View All Tickets |
| `🆘 Support Staff` | #F1C40F | Ticket Response | Manage Messages (in Tickets), View Tickets |
| `🎖️ Community Guide`| #1ABC9C | Mentorship | Manage Messages (General only), Move Members |
| `🎉 Event Manager` | #E91E63 | Server Events | Manage Events, Mention @everyone (restricted to events) |

### ⭐ Contributor & Membership Tiers
| Role | Color | Access | Benefit |
| :--- | :--- | :--- | :--- |
| `💎 Elite Patron` | #EB459E | High Supporter | Priority Support, External Stickers, Custom Thread Creation |
| `⭐ Premium` | #F1C40F | Supporter | External Emojis, Embed Links |
| `🧪 Bot Tester` | #9B59B6 | QA Access | Use Application Commands, View Lab Category |
| `📜 Astra Contributor`| #A19D94 | Code/Docs | Attach Files, Create Public Threads |
| `👋 Verified` | #2ECC71 | Base Member | Send Messages, Add Reactions, Use Voice |
| `🔒 Unverified` | #99AAB5 | Entry | **View Channel only** (Welcome/Verify only) |

### 🔔 Notification Roles (Self-Assignable)
- `📢 News Ping`: Pings for major announcements.
- `🚀 Update Ping`: Pings for bot releases/patch notes.
- `🧪 Lab Ping`: Pings for beta testing opportunities.

---

## ─── II. CATEGORY PERMISSION GUIDE ───

*For a clean setup: 1. Configure the Category. 2. Create Channels. 3. Click "Sync to Category".*

### 1. ── WELCOME & ENTRY ──
| Role | View | Send Messages | Use App Commands |
| :--- | :---: | :---: | :---: |
| `@everyone` | ✅ | ❌ | ❌ |
| `Unverified` | ✅ | ❌ | ❌ |
| `Verified` | ❌ | ❌ | ❌ |
*Hide this category from members once they are verified to keep their list clean.*

### 2. ── SUPPORT DESK 🆘 ──
| Role | View | Send Messages | Use App Commands |
| :--- | :---: | :---: | :---: |
| `@everyone` | ✅ | ❌ | ❌ |
| `Verified` | ✅ | ❌ | ❌ |
| `Support Seeker`| ✅ | ✅ (In #🆘) | ✅ |
*Permissions for `#🎫 open-a-ticket` must be Read-Only for everyone.*

### 3. ── COMMUNITY 💬 ──
| Role | View | Send | Embed/Files |
| :--- | :---: | :---: | :---: |
| `@everyone` | ❌ | ❌ | ❌ |
| `Verified` | ✅ | ✅ | ❌ (Global Default) |
| `Patron/Contrib`| ✅ | ✅ | ✅ |

### 4. ── THE LABORATORY 🧪 ──
| Role | View | Send | Use App Commands |
| :--- | :---: | :---: | :---: |
| `Bot Tester` | ✅ | ✅ | ✅ |
| `Developer` | ✅ | ✅ | ✅ |
| `Verified` | ❌ | ❌ | ❌ |

### 5. ── STAFF OFFICE 🏢 ──
| Role | View | Send | Manage Messages |
| :--- | :---: | :---: | :---: |
| `@everyone` | ❌ | ❌ | ❌ |
| `Support Staff` | ✅ | ✅ | ✅ |
| `Moderator` | ✅ | ✅ | ✅ |

---

## ─── III. EXPANDED CHANNEL LISTING ───

### Category: INFO & UPDATES
- `#📢 announcements`: (News Ping)
- `#🚀 updates`: (Update Ping)
- `#📝 changelog`: Automated from GitHub
- `#📌 important-links`: Invite link, Website, Vote links
- `#📜 developer-roadmap`: Trello/GitHub Project embeds

### Category: SUPPORT
- `#❓ support-faq`: Searchable forum channel or message list
- `#🎫 open-a-ticket`: Button panel only
- `#🆘 community-help`: Peer-to-peer chat support
- `#🐞 bug-reports`: Thread-based reports
- `#💡 feature-requests`: Upvote system channel

### Category: DEVELOPER CORNER
- `#🛠️ api-discussion`: Technical chat for bot integrators
- `#🧠 brainstorm`: Ideas for the next version
- `#🧾 documentation-drafts`: Reviewing new `Astra` docs
- `#📊 bot-health`: Uptime robot/Grafana status updates

### Category: COMMUNITY HUB 
- `#💬 general`: Standard chat
- `#🤖 bot-commands`: Command usage only
- `#🎉 introductions`: New member intros
- `#📷 server-showcase`: Media-only channel for bot setups
- `#🗣️ off-topic`: Relaxed chat
- `#🔊 lounge-1`: Voice channel
- `#🎮 gaming-hub`: Voice channel

---

## ─── IV. MASTER PERMISSION MATRIX (DETAILED) ───

Detailed toggle setup for the **`Verified`** role (Baseline):
- **View Channels**: ✅
- **Send Messages**: ✅
- **Create Public Threads**: ❌ (Restricted to Contributors)
- **Create Private Threads**: ❌
- **Embed Links**: ❌ (Prevents spam, allowed via Patron/Premium)
- **Attach Files**: ❌ (Restricted to Contributor+)
- **Add Reactions**: ✅
- **Use External Emojis/Stickers**: ❌ (Patron/Premium benefit)
- **Mention @everyone/@here**: ❌ (Admin Only)
- **Mention All Roles**: ❌
- **Manage Messages**: ❌
- **Read Message History**: ✅
- **Use Application Commands**: ✅ (Essential for Astra)

---

## ─── V. LAUNCH STEPS (PERFORM IN ORDER) ───

1.  **Safety First**: Set `@everyone` baseline permissions to **View Channels: OFF** globally.
2.  **Role Setup**: Create roles from bottom-to-top (Verified -> Patron -> staff...).
3.  **Category Mapping**: Create categories and set the permissions as defined in Section II.
4.  **Channel Creation**: Create channels inside and click **"Sync Permissions"**.
5.  **Astra Bot Setup**:
    - Invite Astra with `Administrator` temporarily to sync commands.
    - Set logging channel to `#📋 mod-logs`.
    - Setup Reaction Role for `#✅ verify` to grant `Verified` and remove `Unverified`.
    - Setup Ticket Panel in `#🎫 open-a-ticket` with transcripts going to `#🗂️ support-tickets`.
6.  **Discord Onboarding**: Enable Community, then setup the "Onboarding" tab with the questions from Section III.

### Category: ─── SOCIAL MEDIA ───
- `#🎨 astra-gallery`: Creative fan art or bot setup screenshots
- `#🐦 twitter-feed`: Automated bot for @AstraBot news
- `#🎥 video-highlights`: Youtube/TikTok community content
- `#🌐 official-socials`: Master list of links

### Category: ─── PARTNERS & GROWTH ───
- `#🤝 partner-info`: Requirements and benefits
- `#⭐ affiliate-showcase`: Featured partner servers
- `#📈 server-growth`: Insights for server owners using Astra
- `#📣 community-promo`: Ad-hoc partner announcements

### Category: ─── MISCELLANEOUS ───
- `#🗳️ community-polls`: Public server decisions
- `#🔔 reminder-logs`: Public bot reminder notifications (if configured)
- `#⭐ hall-of-fame`: Synced Starboard highlights

---
*Blueprint Version: 2.3.0 (Mega-Server Extension)*
