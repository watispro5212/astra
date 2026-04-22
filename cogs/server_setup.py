import discord
import asyncio
from discord import app_commands
from discord.ext import commands
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed
from core.database import db
from services.moderation_service import ModerationService

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
            ("� Muted", "#34495E", discord.Permissions(read_message_history=True), False, False),
            ("�🔒 Unverified", "#7F8C8D", discord.Permissions(read_message_history=True), False, False),
            ("🤖 Bot", "#5865F2", discord.Permissions(send_messages=True, read_message_history=True, embed_links=True), True, False),
            ("🤝 Partner", "#3498DB", discord.Permissions(send_messages=True, read_message_history=True, use_external_emojis=True), True, False),
            ("� Supporter", "#E91E63", discord.Permissions(send_messages=True, read_message_history=True, use_external_emojis=True, embed_links=True), True, False),
            ("🔥 Active Member", "#1ABC9C", discord.Permissions(send_messages=True, read_message_history=True, use_application_commands=True, add_reactions=True, attach_files=True), True, False),
            ("�👋 Verified", "#2ECC71", discord.Permissions(send_messages=True, read_message_history=True, use_application_commands=True, add_reactions=True, connect=True), True, False),
            ("📜 Astra Contributor", "#A19D94", discord.Permissions(attach_files=True, create_public_threads=True), True, False),
            ("🧪 Bot Tester", "#9B59B6", discord.Permissions(use_external_emojis=True, use_application_commands=True), True, False),
            ("🎉 Event Manager", "#E91E63", discord.Permissions(manage_events=True, mention_everyone=True), True, True),
            ("🎖️ Community Guide", "#1ABC9C", discord.Permissions(moderate_members=True, mute_members=True, move_members=True), True, True),
            ("🆘 Support Staff", "#F1C40F", discord.Permissions(manage_messages=True, read_message_history=True), True, True),
            ("🛡️ Moderator", "#E67E22", discord.Permissions(manage_messages=True, kick_members=True, ban_members=True, moderate_members=True, manage_threads=True, manage_nicknames=True), True, True),
            ("🎖️ Senior Moderator", "#D35400", discord.Permissions(manage_messages=True, kick_members=True, ban_members=True, moderate_members=True, manage_threads=True, manage_channels=True), True, True),
            ("🚑 Support Lead", "#F39C12", discord.Permissions(manage_messages=True, manage_threads=True, read_message_history=True), True, True),
            ("💻 Developer", "#3498DB", discord.Permissions(manage_webhooks=True, view_audit_log=True, manage_threads=True), True, True),
            ("🔧 Admin", "#C0392B", discord.Permissions.all(), True, True),
            ("🛡️ Head Admin", "#992D22", discord.Permissions.all(), True, True),
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

        # 2. INFRASTRUCTURE SYNC (V6 Core)
        structure = [
            ("🌌 START HERE", "public_read", [
                ("text", "👋-welcome", "Greetings, traveler! Start your journey here in the Astra ecosystem."),
                ("text", "📜-guidelines", "The essential laws of Astra. Knowledge is power—read them well."),
                ("text", "🎭-roles", "Customize your identity and select your notification preferences.")
            ]),
            ("📣 BROADCAST CENTER", "public_read", [
                ("text", "📢-news", "Major announcements and high-level broadcasts."),
                ("text", "🚀-updates", "Official patch notes, version history, and development leaks."),
                ("text", "🗳️-polls", "Cast your vote on the future direction of the community.")
            ]),
            ("🛡️ FOUNDATION", "support", [
                ("text", "🎫-support-tickets", "Secure channel for direct assistance from our specialized staff."),
                ("text", "📋-audit-logs", "INTERNAL USE ONLY. Monitoring nexus for server stability and moderation.")
            ]),
            ("💬 NEXUS LOBBY", "public_chat", [
                ("text", "💬-main-chat", "The pulsating heart of our community. Connect, share, and evolve."),
                ("text", "🤖-commands", "Direct interface for Astra operations and bot interaction."),
                ("text", "📸-media", "Share your captures, designs, and visual data.")
            ]),
            ("🎨 CREATIVE HUB", "public_chat", [
                ("text", "📷-showcase", "Exhibit your server setups and Astra configurations."),
                ("text", "💡-suggestions", "The forge of innovation. Submit your ideas for improvement.")
            ]),
            ("🔊 SONIC NEXUS", "voice", [
                ("voice", "🔊 Lounge", "General voice communication for all members."),
                ("voice", "🎮 Gaming", "Squad up and coordinate your sessions."),
                ("voice", "🎵 Music", "A quiet space for high-fidelity audio streams."),
                ("voice", "🎙️ Town Hall", "Specialized channel for community events and Q&A.")
            ]),
            ("🏆 MILESTONES", "public_read", [
                ("text", "⭐-starboard", "The zenith of our community. Highlights of the best interactions."),
                ("text", "🏅-hall-of-fame", "Recognizing the legends and top contributors of Astra.")
            ]),
            ("🧪 DEVELOPMENT", "staff", [
                ("text", "🧪-lab-updates", "Cutting-edge updates from the development core. Unstable but exciting.")
            ]),
            ("📁 ARCHIVE", "staff", [
                ("text", "📁-old-logs", "Historical data and deprecated communications."),
                ("voice", "💤-afk", "Automatic relocation for inactive users.")
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

        # Orphan Scan
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
                elif p_type == 'staff':
                    overwrites[guild.default_role] = discord.PermissionOverwrite(view_channel=False)
                    overwrites[roles["🛡️ Moderator"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                    overwrites[roles["🆘 Support Staff"]] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
                category = await guild.create_category(name=cat_name, overwrites=overwrites)
            else:
                if category.name != cat_name: await category.edit(name=cat_name)

            # Cleanup Duplicate Channels
            chan_map = {}
            for chan in category.channels:
                norm = self._normalize(chan.name)
                if norm in chan_map:
                    try: await chan.delete(); deleted_count += 1
                    except: pass
                else: chan_map[norm] = chan

            for c_type, name, topic in channels:
                channel = discord.utils.find(lambda c: self._normalize(c.name) == self._normalize(name), category.channels)
                if not channel:
                    if c_type == "text":
                        new_chan = await guild.create_text_channel(name=name, category=category, topic=topic)
                    else:
                        new_chan = await guild.create_voice_channel(name=name, category=category)
                        if "afk" in name.lower():
                            await guild.edit(afk_channel=new_chan, afk_timeout=300)
                    
                    created_count += 1
                    # Save core channels to DB
                    if "welcome" in name:
                        await db.execute("INSERT INTO welcome_configs (guild_id, channel_id) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET channel_id = excluded.channel_id", guild.id, new_chan.id)
                    elif "audit-logs" in name:
                        await ModerationService.update_guild_config(guild.id, log_channel_id=new_chan.id)
                else:
                    if channel.name != name:
                        await channel.edit(name=name)
                    if c_type == "text" and channel.topic != topic:
                        await channel.edit(topic=topic)
                await asyncio.sleep(0.1)

        # 3. SAVE CORE ROLES
        await ModerationService.update_guild_config(guild.id, staff_role_id=roles["🛡️ Moderator"].id)

        # 3.1 AUTO-ASSIGN BOT ROLE
        status_embed.description = "🤖 Calibrating Bot permissions..."
        await status_msg.edit(embed=status_embed)
        bot_role = roles.get("🤖 Bot")
        if bot_role:
            for member in guild.members:
                if member.bot and bot_role not in member.roles:
                    try:
                        await member.add_roles(bot_role, reason="Astra Setup: Auto-provisioning")
                    except: pass

        # 4. FINAL SUCCESS
        final_embed = SuccessEmbed(
            f"🛰️ Deep Clean v2.16.0 Complete!\n\n"
            f"🧹 Duplicates Purged: **{deleted_count}**\n"
            f"🏗️ Missing Items Created: **{created_count}**\n"
            f"👤 Roles Balanced: **{len(roles)}**\n\n"
            f"**Recommended Bots to add:**\n"
            f"• **Astra**: Core moderation, diagnostics, and high-performance automation.\n"
            f"• **Ticket Tool**: Specialized support ticket handling and staff tracking.\n"
            f"• **Carl-bot**: Advanced logging and automated role assignments.\n"
            f"• **Dyno**: Powerful auto-moderation and custom commands.\n\n"
            f"*Your server is now 100% clean and aligned with the blueprint.*"
        )
        await interaction.followup.send(embed=final_embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(ServerSetup(bot))
