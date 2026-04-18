# 🛰️ Astra Server Identity & Assets (v2.8.0)

## 🏆 Server Identity
*Use these in your Server Settings -> Overview.*

- **Server Name**: `Astra HQ | Official Support & Community`
- **Server Description**: 
  > The official central hub for Astra—the next-generation Discord automation engine. Connect with the architects, get precision support, and join the laboratory for future features. Explore the power of Astra.

---

## 1. 📜 THE MASTER RULES
*Post these in `#📜 rules` as a single, clean message.*

> ### 🛑 Server Rules & Guidelines
> 
> **1. Respect Above All**
> Treat everyone with kindness. Harassment, hate speech, or discrimination of any kind will result in an immediate and permanent ban.
> 
> **2. No Spamming or Self-Promotion**
> Avoid excessive pings, emoji spam, or flooding. Do not advertise other servers or services without explicit staff permission.
> 
> **3. Support Channels Only**
> Only ask for bot help in the **Support Desk** category. This keeps general chat clean for general discussion.
> 
> **4. Keep it Professional**
> Astra is a community-focused bot. All content should be Safe For Work (SFW) and professional in nature.
> 
> **5. No Malicious Content**
> Do not share links to phishing sites, malware, or illegal content. We have zero tolerance for security risks.
> 
> **6. Staff Authority**
> The decision of a Moderator or Admin is final. If you have a dispute, open a ticket for a private appeal.
> 
> **7. English Language**
> To ensure our staff can provide consistent support, we ask that all public conversations remain in English.
> 
> **8. No Impersonation**
> Do not impersonate Astra staff, other bots, or members. 
> 
> **9. Follow Discord ToS**
> You must adhere to the [Discord Terms of Service](https://discord.com/terms) at all times.
> 
> **10. Privacy & Safety**
> Do not share private transcripts, personal info (doxing), or staff-only logs.

---

## 2. 👋 THE WELCOME SIGN
*Stylized message for `#👋 welcome`.*

> ### ✨ Welcome to Astra, {user}!
> You've just landed in the official laboratory and support hub for the **Astra Bot**. 
> 
> **Your Next Steps:**
> 1. ✅ **Verification**: Finish the onboarding flow or head to `#✅ verify`.
> 2. 🧭 **Navigation**: Check `#📢 server-guide` to see what's happening.
> 3. 🚀 **Updates**: Get the `Announcement Ping` role in `#🧩 choose-roles` to stay in the loop.
> 
> **Need the Bot?**
> [Invite Astra to your server](https://astra-bot.com/invite) | [Read the Documentation](https://astra-bot.com/docs)
> 
> *Welcome to the collective!*

---

## 🧭 3. THE NAVIGATOR (SERVER GUIDE)
*Post this in `#📢 server-guide` to help people find their way.*

> ### 🛰️ How to Navigate Astra Support
> 
> **🆘 Need Help?**
> - Read `#❓ support-faq` first for instant fixes.
> - Open a private thread in `#🎫 open-a-ticket` for technical issues.
> - Chat with other users in `#🆘 community-help`.
> 
> **📢 Stay Informed**
> - `#📢 announcements`: Critical news only.
> - `#🚀 updates`: Every new feature and patch.
> - `#📝 changelog`: Raw technical logs.
> 
> **🧪 Get Involved**
> - Become a `Bot Tester` to access `#🧪 bot-testing`.
> - Report glitches in `#🐞 bug-reports`.
> - Share your setup in `#📷 server-showcase`.

---

## 🧩 4. ONBOARDING SCHEMATIC
*Use these settings in: Server Settings -> Onboarding.*

### Question 1: What brings you here today?
*Goal: Assign access roles.*
- **Option 1**: 🆘 "I need help with the Astra bot."
  - **Action**: Assign `Support Seeker` role.
- **Option 2**: 🚀 "I want to stay updated on new features."
  - **Action**: Assign `News Ping` role.
- **Option 3**: 🧪 "I want to help test new experimental versions."
  - **Action**: Assign `Bot Tester` role + Show `The Laboratory` category.
- **Option 4**: 💬 "I just want to hang out with the community."
  - **Action**: Assign `Verified` role.

### Question 2: Which notifications would you like?
*Goal: Assign ping roles.*
- **Option 1**: 🔔 "Major Project Announcements" -> `News Ping`
- **Option 2**: 🛠️ "Developer & Hackathon News" -> `Update Ping`
- **Option 3**: 🧪 "Beta Testing Alerts" -> `Lab Ping`

---

## 🎭 5. THE STATUS KEY
*A guide to the staff you might see around the server.*

- `👑 Owner / 🔧 Admin`: The lead architects of Astra.
- `💻 Developer`: The wizards writing the code.
- `🛡️ Moderator`: Keeping the server safe and clean.
- `🆘 Support Staff`: Your go-to team for bot questions.
- `🎖️ Community Guide`: Experienced users here to help you get started.

### 🆕 NEW MEMBER TASKS (The Checklist)
*Configure these in Discord Onboarding -> To-do list.*

**Task 1: 🧪 Join the Laboratory**
- **Description**: Become an official Astra Bot Tester.
- **Action**: Follow instructions in `#🧪 bot-testing`.
- **Goal**: Get the `Bot Tester` role and explore the Lab.

**Task 2: 🎭 Set your Identity**
- **Description**: Customize your mention preferences and community rank.
- **Action**: Return to the `Onboarding` tab or visit `#🧩 choose-roles`.
- **Goal**: Select your notification pings.

**Task 3: 🧭 Complete the Orientation**
- **Description**: Learn how to navigate the Astra Support Desk.
- **Action**: Read the orientation guide in `#📢 server-guide`.
- **Goal**: Understand how to open tickets and find FAQs.

**Task 4: 👋 Break the Ice**
- **Description**: Say hello to the Astra community.
- **Action**: Introduce yourself in `#🎉 introductions`.
- **Goal**: Post your first message in the hub.

---

## 🛡️ 6. AUTOMOD DEFENSE MATRIX
*These layers are automatically configured by the `/setup_server` command.*

### Layer 1: Discord Native Protection
- **Anti-Spam Filter**: Blocks messages containing repetitive text or excessive emojis.
- **Phishing Protection**: Automatically blocks known malicious links from the Discord global database.

### Layer 2: Astra Custom Filters
- **Spam Threshold**: 5 messages per 5 seconds. Violations result in a 1-hour timeout.
- **Link Blocker**: Only `Premium` and `Astra Contributor` roles can post links in general chat.
- **Invite Blocker**: Disallows posting invites to other Discord servers.

### Layer 3: The "Laboratory" Lockdown
- Only `Bot Tester` and above can upload files or post links in the Laboratory category.

---

## ✅ POST-SETUP CHECKLIST
*Complete these tasks after running the `/setup_server` command.*

### 🛠️ Administrative Cleanup
- [ ] **Restore Sovereignty**: Re-assign yourself the `👑 Owner` role (the setup bot may have deleted the old one).
- [ ] **Hierarchy Check**: Verify that `👑 Owner` is at the very top of the roles list in Server Settings.

### 🧩 Community & Onboarding
- [ ] **Enable Community**: Go to `Server Settings -> Community -> Enable Community`.
- [ ] **Setup Onboarding**: Follow the **Section 4** schematics to configure your native Discord onboarding questions.
- [ ] **Rules Agreement**: Enable "Member Screening" and paste the rules from **Section 1**.

### 💬 Channel Population
- [ ] **Welcome Sign**: Copy-paste the **Section 2** template into `#👋 welcome`.
- [ ] **Server Guide**: Copy-paste the **Section 3** template into `#📢 server-guide`.
- [ ] **The Rules**: Post the full rule set from **Section 1** in `#📜 rules` and pin it.

### 🛡️ Security Audit
- [ ] **Verify AutoMod**: Check `Server Settings -> Safety Setup -> AutoMod` to ensure the Astra shields are active.
- [ ] **Permissions Check**: Ensure that `@everyone` cannot send messages in the categories marked `public_read`.

---
*Blueprint Version: 2.10.0 (Launch Ready)*
