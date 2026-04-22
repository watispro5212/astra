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

        # 2. INFRASTRUCTURE SYNC (V6 Core)
        structure = [
            ("─── WELCOME ZONE ───", "public_read", [
                ("👋 welcome", "Official greetings for new Astra members."),
                ("📜 rules", "The law of the land. Read carefully."),
                ("📢 announcements", "Major news and broadcasts.")
            ]),
            ("─── SUPPORT 🆘 ───", "support", [
                ("🎫 open-a-ticket", "Need help? Open a ticket here."),
                ("📋 staff-logs", "Internal audit logs and incident tracking.")
            ]),
            ("─── COMMUNITY 💬 ───", "public_chat", [
                ("💬 general", "The main lobby for community chat."),
                ("🤖 bot-commands", "The place to interact with Astra."),
                ("🎭 role-menu", "Pick your roles here!")
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
            for chan in category.text_channels:
                norm = self._normalize(chan.name)
                if norm in chan_map:
                    try: await chan.delete(); deleted_count += 1
                    except: pass
                else: chan_map[norm] = chan

            for name, topic in channels:
                channel = discord.utils.find(lambda c: self._normalize(c.name) == self._normalize(name), category.text_channels)
                if not channel:
                    new_chan = await guild.create_text_channel(name=name, category=category, topic=topic)
                    created_count += 1
                    # Save core channels to DB
                    if "welcome" in name:
                        await db.execute("INSERT INTO welcome_configs (guild_id, channel_id) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET channel_id = excluded.channel_id", guild.id, new_chan.id)
                    elif "staff-logs" in name:
                        await ModerationService.update_guild_config(guild.id, log_channel_id=new_chan.id)
                else:
                    if channel.name != name or channel.topic != topic:
                        await channel.edit(name=name, topic=topic)
                await asyncio.sleep(0.1)

        # 3. SAVE CORE ROLES
        await ModerationService.update_guild_config(guild.id, staff_role_id=roles["🛡️ Moderator"].id)

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
