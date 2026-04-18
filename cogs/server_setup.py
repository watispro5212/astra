import discord
import asyncio
from discord import app_commands
from discord.ext import commands
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed

class ServerSetup(commands.Cog):
    """Automated server builder and reset tools."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="setup_server", description="🛰️ SMART SYNC v2.9: Updates/Adds missing Roles, Channels & Permissions (Safe)")
    @app_commands.checks.has_permissions(administrator=True)
    async def setup_server(self, interaction: discord.Interaction):
        """Non-destructive server synchronization. Adds missing components and updates metadata."""
        await interaction.response.defer(ephemeral=True)
        
        status_embed = AstraEmbed(
            title="🛰️ SMART SYNC INITIATED (v2.9.0)",
            description="Starting incremental scan. This process is **safe** and will not delete existing work."
        )
        status_msg = await interaction.followup.send(embed=status_embed, ephemeral=True)

        guild = interaction.guild
        
        # 1. ROLES SYNC (Bottom to Top for Hierarchy)
        status_embed.description = "👥 Syncing Roles..."
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
            role = discord.utils.get(guild.roles, name=name)
            if not role:
                role = await guild.create_role(
                    name=name, 
                    color=discord.Color.from_str(color), 
                    permissions=perms, 
                    hoist=hoist, 
                    mentionable=mention,
                    reason="Astra v2.9 Sync: Missing Role"
                )
            roles[name] = role

        # 2. INFRASTRUCTURE SYNC (Categories & Channels)
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
        updated_count = 0
        
        for cat_name, p_type, channels in structure:
            status_embed.description = f"🏗️ Syncing Category: **{cat_name}**..."
            await status_msg.edit(embed=status_embed)
            
            # Find/Create Category
            category = discord.utils.get(guild.categories, name=cat_name)
            if not category:
                overwrites = { guild.default_role: discord.PermissionOverwrite(view_channel=True, send_messages=False) }
                if p_type == 'public_chat':
                    overwrites[roles["👋 Verified"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                elif p_type == 'restricted':
                    overwrites[guild.default_role] = discord.PermissionOverwrite(view_channel=False)
                    overwrites[roles["🧪 Bot Tester"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                elif p_type == 'staff':
                    overwrites[guild.default_role] = discord.PermissionOverwrite(view_channel=False)
                    overwrites[roles["🛡️ Moderator"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                    overwrites[roles["🆘 Support Staff"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)

                category = await guild.create_category(name=cat_name, overwrites=overwrites)
            
            # Find/Create/Update Channels
            for chan_name, topic in channels:
                channel = discord.utils.get(category.text_channels, name=chan_name)
                if not channel:
                    await guild.create_text_channel(name=chan_name, category=category, topic=topic)
                    created_count += 1
                else:
                    if channel.topic != topic:
                        await channel.edit(topic=topic)
                        updated_count += 1
                await asyncio.sleep(0.3)

        # 3. AUTOMOD SYNC
        from core.database import db
        await db.execute(
            "INSERT INTO automod_configs (guild_id, spam_enabled, link_filter, invite_filter, spam_threshold, spam_window) "
            "VALUES (?, 1, 1, 1, 5, 5) ON CONFLICT(guild_id) DO NOTHING", guild.id
        )

        # 4. FINAL SUCCESS
        final_embed = SuccessEmbed(
            f"🛰️ Smart Sync v2.9.0 Complete!\n\n"
            f"👤 Roles Balanced: **{len(roles)}**\n"
            f"🏗️ Channels Added: **{created_count}**\n"
            f"📝 Topics Updated: **{updated_count}**\n"
            f"🛡️ AutoMod: **Synchronized**\n\n"
            f"*Everything is now aligned with the Astra Blueprint.*"
        )
        await interaction.followup.send(embed=final_embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(ServerSetup(bot))
