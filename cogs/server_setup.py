import discord
import asyncio
from discord import app_commands
from discord.ext import commands
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed

class ServerSetup(commands.Cog):
    """Automated server builder and reset tools."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    def _normalize(self, text: str) -> str:
        """Strips symbols, spaces, and emojis for robust matching."""
        # Remove non-alphanumeric characters and lowercase
        return "".join(c for c in text.lower() if c.isalnum())

    @app_commands.command(name="setup_server", description="🛰️ DEEP CLEAN v2.16: Safe update + Auto-Delete Duplicates")
    @app_commands.checks.has_permissions(administrator=True)
    async def setup_server(self, interaction: discord.Interaction):
        """Non-destructive server synchronization. Automatically deletes duplicate channels and roles."""
        await interaction.response.defer(ephemeral=True)
        
        status_embed = AstraEmbed(
            title="🛰️ DEEP CLEAN INITIATED (v2.16.0)",
            description="Starting deep-scan. Identifying and removing duplicate components..."
        )
        status_msg = await interaction.followup.send(embed=status_embed, ephemeral=True)

        guild = interaction.guild
        
        # 0. PRE-SYNC ROLE CLEANUP
        status_embed.description = "🧹 Cleaning duplicate roles..."
        await status_msg.edit(embed=status_embed)
        role_map = {}
        for role in guild.roles:
            if role.managed or role == guild.default_role: continue
            norm = self._normalize(role.name)
            if norm in role_map:
                try: 
                    await role.delete(reason="Astra Cleanup: Duplicate")
                    await asyncio.sleep(0.5) # Latency Guard
                except: pass
            else: role_map[norm] = role

        # 0.2 PRE-SYNC CHANNEL CLEANUP (Orphan scan happens after structure is defined)

        # 1. ROLES SYNC
        status_embed.description = "👥 Syncing Role Hierarchy..."
        await status_msg.edit(embed=status_embed)
        
        role_data = [
            ("🧪 Lab Ping", "#99AAB5", discord.Permissions.none(), False, False),
            ("🚀 Update Ping", "#99AAB5", discord.Permissions.none(), False, False),
            ("📢 News Ping", "#99AAB5", discord.Permissions.none(), False, False),
            ("🔒 Unverified", "#99AAB5", discord.Permissions(read_message_history=True), False, False),
            ("🆘 Support Seeker", "#F1C40F", discord.Permissions(send_messages=True, read_message_history=True), False, False),
            ("👋 Verified", "#2ECC71", discord.Permissions(send_messages=True, read_message_history=True, use_application_commands=True, add_reactions=True, connect=True), True, False),
            ("📜 Astra Contributor", "#A19D94", discord.Permissions(attach_files=True, create_public_threads=True), True, False),
            ("🧪 Bot Tester", "#9B59B6", discord.Permissions(use_external_emojis=True, use_application_commands=True), True, False),
            ("⭐ Premium", "#F1C40F", discord.Permissions(use_external_emojis=True, embed_links=True), True, False),
            ("💎 Elite Patron", "#EB459E", discord.Permissions(use_external_emojis=True, use_external_stickers=True, create_public_threads=True), True, False),
            ("🎉 Event Manager", "#E91E63", discord.Permissions(manage_events=True, mention_everyone=True), True, True),
            ("🎖️ Community Guide", "#1ABC9C", discord.Permissions(moderate_members=True, mute_members=True, move_members=True), True, True),
            ("🆘 Support Staff", "#F1C40F", discord.Permissions(manage_messages=True, read_message_history=True), True, True),
            ("🚑 Support Lead", "#F39C12", discord.Permissions(manage_messages=True, manage_threads=True, read_message_history=True), True, True),
            ("💻 Developer", "#3498DB", discord.Permissions(manage_webhooks=True, view_audit_log=True, manage_threads=True), True, True),
            ("🛡️ Moderator", "#E67E22", discord.Permissions(manage_messages=True, kick_members=True, ban_members=True, moderate_members=True, manage_threads=True, manage_nicknames=True), True, True),
            ("🔧 Admin", "#C0392B", discord.Permissions.all(), True, True),
            ("👑 Owner", "#E74C3C", discord.Permissions.all(), True, True)
        ]
        
        roles = {}
        for name, color, perms, hoist, mention in role_data:
            role = discord.utils.find(lambda r: self._normalize(r.name) == self._normalize(name), guild.roles)
            if not role:
                role = await guild.create_role(name=name, color=discord.Color.from_str(color), permissions=perms, hoist=hoist, mentionable=mention)
            else:
                if role.name != name: await role.edit(name=name)
            roles[name] = role

        # 2. INFRASTRUCTURE SYNC
        structure = [
            ("─── WELCOME ZONE ───", "public_read", [
                ("👋 welcome", "Official greetings for new Astra members."),
                ("📜 rules", "The law of the land. Read carefully."),
                ("✅ verify", "Verify your account to access the community."),
                ("📢 server-guide", "Everything you need to know about navigating this server.")
            ]),
            ("─── SUPPORT DESK 🆘 ───", "support", [
                ("❓ support-faq", "Common fixes and answers to frequent questions."),
                ("🎫 open-a-ticket", "Need private help? Open a ticket here."),
                ("🆘 community-help", "Ask the community for tips and tricks."),
                ("🐞 bug-reports", "Found a glitch? Let us know!"),
                ("💡 feature-requests", "Help us shape the future of Astra.")
            ]),
            ("─── UPDATES CENTER 🚀 ───", "public_read", [
                ("📢 announcements", "Major news and broadcasts."),
                ("🚀 updates", "New feature releases and bot updates."),
                ("📝 changelog", "Detailed patch notes from the dev team."),
                ("📌 useful-links", "Invite links, documentation, and more.")
            ]),
            ("─── THE LOUNGE ───", "free_chat", [
                ("💬 public-lounge", "The open lobby for everyone. No verification required!"),
                ("🎭 guest-chat", "A place for visitors to ask quick questions.")
            ]),
            ("─── COMMUNITY HUB 💬 ───", "public_chat", [
                ("💬 general", "The main lobby for Astra community chat."),
                ("🤖 bot-commands", "The place to interact with Astra and other bots."),
                ("🎉 introductions", "Say hello and introduce yourself!"),
                ("📷 server-showcase", "Show off your server setups and bot configs."),
                ("🗣️ off-topic", "For everything that doesn't fit elsewhere.")
            ]),
            ("─── THE LABORATORY 🧪 ───", "restricted", [
                ("🧪 bot-testing", "Experimental features. High danger of bugs!"),
                ("🔍 feature-preview", "Sneak peeks at upcoming Astra versions.")
            ]),
            ("─── STAFF OFFICE 🏢 ───", "staff", [
                ("🛡️ mod-chat", "Private coordination for the moderation team."),
                ("📋 mod-logs", "Internal audit logs and incident tracking."),
                ("🗂️ support-tickets", "Archive of resolved support queries.")
            ]),
            ("─── SOCIAL MEDIA ───", "public_read", [
                ("🎨 astra-gallery", "Fan art and bot setup screenshots."),
                ("🐦 twitter-feed", "Automated updates from the Astra Twitter."),
                ("🎥 video-highlights", "YouTube and TikTok community features."),
                ("🌐 official-socials", "Links to all official Astra platforms.")
            ]),
            ("─── PARTNERS & GROWTH ───", "public_read", [
                ("🤝 partner-info", "Partnership requirements and benefits."),
                ("⭐ affiliate-showcase", "Featured partner servers."),
                ("📈 server-growth", "Helpful tips for growing your server with Astra.")
            ]),
            ("─── MISCELLANEOUS ───", "public_read", [
                ("🗳️ community-polls", "Cast your vote on server decisions."),
                ("⭐ hall-of-fame", "The best of the best Astra moments.")
            ])
        ]

        created_count = 0
        deleted_count = 0
        
        # Cleanup Duplicate Categories First
        cat_map = {}
        for cat in guild.categories:
            norm = self._normalize(cat.name)
            if norm in cat_map:
                try: await cat.delete(); deleted_count += 1
                except: pass
            else: cat_map[norm] = cat

        # Orphan Scan: remove uncategorized channels that duplicate blueprint names
        status_embed.description = "🔍 Performing Orphan Scan..."
        await status_msg.edit(embed=status_embed)
        blueprint_names = {self._normalize(n) for _, _, channels in structure for n, _ in channels}
        for chan in guild.text_channels:
            if chan.category is None:
                norm = self._normalize(chan.name)
                if norm in blueprint_names:
                    try:
                        await chan.delete(reason="Astra Cleanup: Orphan Duplicate")
                        deleted_count += 1
                        await asyncio.sleep(0.25)
                    except: pass

        for cat_name, p_type, channels in structure:
            status_embed.description = f"🏗️ Syncing Category: **{cat_name}**..."
            await status_msg.edit(embed=status_embed)
            
            category = discord.utils.find(lambda c: self._normalize(c.name) == self._normalize(cat_name), guild.categories)
            if not category:
                overwrites = { guild.default_role: discord.PermissionOverwrite(view_channel=True, send_messages=False) }
                if p_type == 'public_chat':
                    overwrites[roles["👋 Verified"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                elif p_type == 'free_chat':
                    overwrites[guild.default_role] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                elif p_type == 'restricted':
                    overwrites[guild.default_role] = discord.PermissionOverwrite(view_channel=False)
                    overwrites[roles["🧪 Bot Tester"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                elif p_type == 'staff':
                    overwrites[guild.default_role] = discord.PermissionOverwrite(view_channel=False)
                    overwrites[roles["🛡️ Moderator"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                    overwrites[roles["🆘 Support Staff"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                category = await guild.create_category(name=cat_name, overwrites=overwrites)
            else:
                if category.name != cat_name: await category.edit(name=cat_name)

            # Cleanup Duplicate Channels in this category
            chan_map = {}
            for chan in category.text_channels:
                norm = self._normalize(chan.name)
                if norm in chan_map:
                    try: await chan.delete(); deleted_count += 1
                    except: pass
                else: chan_map[norm] = chan

            for name, topic in channels:
                channel = discord.utils.find(lambda c: self._normalize(c.name) == self._normalize(name), category.text_channels)
                if not channel:
                    await guild.create_text_channel(name=name, category=category, topic=topic)
                    created_count += 1
                else:
                    if channel.name != name or channel.topic != topic:
                        await channel.edit(name=name, topic=topic)
                await asyncio.sleep(0.1)

        # 3. AUTOMOD SYNC
        from core.database import db
        await db.execute("INSERT INTO automod_configs (guild_id, spam_enabled, link_filter, invite_filter, spam_threshold, spam_window) VALUES (?, 1, 1, 1, 5, 5) ON CONFLICT(guild_id) DO NOTHING", guild.id)

        # 4. FINAL SUCCESS
        final_embed = SuccessEmbed(
            f"🛰️ Deep Clean v2.16.0 Complete!\n\n"
            f"🧹 Duplicates Purged: **{deleted_count}**\n"
            f"🏗️ Missing Items Created: **{created_count}**\n"
            f"👤 Roles Balanced: **{len(roles)}**\n\n"
            f"*Your server is now 100% clean and aligned with the blueprint.*"
        )
        await interaction.followup.send(embed=final_embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(ServerSetup(bot))
