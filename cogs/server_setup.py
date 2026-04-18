import discord
import asyncio
from discord import app_commands
from discord.ext import commands
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed

class ServerSetup(commands.Cog):
    """Automated server builder and reset tools."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="setup_server", description="🏰 MASTER SETUP v2.5: Full Server Reconstruction (Roles, Permissions, Channels)")
    @app_commands.checks.has_permissions(administrator=True)
    async def setup_server(self, interaction: discord.Interaction):
        """Full server construction. WARNING: Deletes all existing channels and roles."""
        await interaction.response.defer(ephemeral=True)
        
        status_embed = AstraEmbed(
            title="⚠️ MASTER SETUP INITIATED (v2.5.0)",
            description="**WARNING**: This will delete ALL existing channels and roles (except integrations).\n\n"
                        "Starting in **10 seconds**... You can dismiss this message to cancel (process will stop if bot is stopped)."
        )
        status_msg = await interaction.followup.send(embed=status_embed, ephemeral=True)
        await asyncio.sleep(10)

        guild = interaction.guild
        
        # 1. DELETE EXISTING CHANNELS
        status_embed.description = "🗑️ Wiping existing channels..."
        await status_msg.edit(embed=status_embed)
        for channel in guild.channels:
            if channel.id == interaction.channel_id: continue
            try: await channel.delete()
            except: pass

        # 2. DELETE EXISTING ROLES (Skip @everyone and Integrations)
        status_embed.description = "👤 Wiping existing roles..."
        await status_msg.edit(embed=status_embed)
        managed_roles = [r for r in guild.roles if not r.managed and r != guild.default_role]
        for role in managed_roles:
            try: await role.delete()
            except: pass

        # 3. DEFINE & CREATE ROLES (Created from Bottom to Top for Hierarchy)
        status_embed.description = "👥 Creating Role Hierarchy & Hoisting..."
        await status_msg.edit(embed=status_embed)
        
        # Order: Bottom to Top (Last one created is on top)
        role_data = [
            # Notification Roles (No Hoist, No Mention)
            ("🧪 Lab Ping", "#99AAB5", discord.Permissions.none(), False, False),
            ("🚀 Update Ping", "#99AAB5", discord.Permissions.none(), False, False),
            ("📢 News Ping", "#99AAB5", discord.Permissions.none(), False, False),
            # Member Roles
            ("🔒 Unverified", "#99AAB5", discord.Permissions(read_message_history=True), False, False),
            ("👋 Verified", "#2ECC71", discord.Permissions(send_messages=True, read_message_history=True, use_application_commands=True, add_reactions=True, connect=True), True, False),
            ("📜 Astra Contributor", "#A19D94", discord.Permissions(attach_files=True, create_public_threads=True), True, False),
            ("🧪 Bot Tester", "#9B59B6", discord.Permissions(use_external_emojis=True, use_application_commands=True), True, False),
            ("⭐ Premium", "#F1C40F", discord.Permissions(use_external_emojis=True, embed_links=True), True, False),
            ("💎 Elite Patron", "#EB459E", discord.Permissions(use_external_emojis=True, use_external_stickers=True, create_public_threads=True), True, False),
            # Staff Roles
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
            role = await guild.create_role(
                name=name, 
                color=discord.Color.from_str(color), 
                permissions=perms, 
                hoist=hoist, 
                mentionable=mention,
                reason="Astra v2.5 Setup"
            )
            roles[name] = role
            await asyncio.sleep(0.5)

        # 4. DEFINE STRUCTURE
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

        # 5. BUILD CATEGORIES & CHANNELS
        created_channels = 0
        for cat_name, p_type, channels in structure:
            status_embed.description = f"🏗️ Building Category: **{cat_name}**..."
            await status_msg.edit(embed=status_embed)
            
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
            for name, topic in channels:
                await guild.create_text_channel(name=name, category=category, topic=topic)
                created_channels += 1
                await asyncio.sleep(0.3)

        # 6. FINAL SUCCESS
        final_embed = SuccessEmbed(
            f"🏰 Master Build v2.5.0 Complete!\n\n"
            f"👤 Roles Rebuilt: **{len(roles)}** (Hoisted & Ordered)\n"
            f"📁 Categories: **{len(structure)}**\n"
            f"💬 Channels: **{created_channels}**\n\n"
            f"**Action Required**: Roles have been reset. Please re-assign yourself the `👑 Owner` role."
        )
        await interaction.followup.send(embed=final_embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(ServerSetup(bot))
