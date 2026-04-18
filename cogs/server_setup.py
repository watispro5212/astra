import discord
import asyncio
from discord import app_commands
from discord.ext import commands
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed

class ServerSetup(commands.Cog):
    """Automated server builder and reset tools."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="setup_server", description="🚀 ULTRA-SETUP v2.3: Configures Roles, Permissions, and detailed Channels.")
    @app_commands.checks.has_permissions(administrator=True)
    async def setup_server(self, interaction: discord.Interaction):
        """Full server construction. Creates roles, permissions, and channels with descriptions."""
        await interaction.response.defer(ephemeral=True)
        
        status_embed = AstraEmbed(
            title="🏗️ Astra Server Setup v2.3",
            description="Starting full server reconstruction. Sit tight..."
        )
        status_msg = await interaction.followup.send(embed=status_embed, ephemeral=True)

        guild = interaction.guild
        
        # 1. DELETE EXISTING STRUCTURE (Protecting current channel)
        status_embed.description = "🗑️ Resetting channels (Keeping current channel safe)..."
        await status_msg.edit(embed=status_embed)
        
        for channel in guild.channels:
            if channel.id == interaction.channel_id:
                continue
            try:
                await channel.delete(reason="Astra Setup: Reset")
            except:
                pass

        # 2. CREATE ROLES
        status_embed.description = "👥 Generating role hierarchy and permissions..."
        await status_msg.edit(embed=status_embed)
        
        role_data = [
            ("👑 Owner", discord.Color.from_str("#E74C3C"), discord.Permissions.all()),
            ("🔧 Admin", discord.Color.from_str("#C0392B"), discord.Permissions.all()),
            ("🛡️ Moderator", discord.Color.from_str("#E67E22"), discord.Permissions(manage_messages=True, kick_members=True, ban_members=True, moderate_members=True, manage_threads=True, manage_nicknames=True)),
            ("💻 Developer", discord.Color.from_str("#3498DB"), discord.Permissions(manage_webhooks=True, view_audit_log=True, manage_threads=True)),
            ("🚑 Support Lead", discord.Color.from_str("#F39C12"), discord.Permissions(manage_messages=True, manage_threads=True, read_message_history=True)),
            ("🆘 Support Staff", discord.Color.from_str("#F1C40F"), discord.Permissions(manage_messages=True, read_message_history=True)),
            ("🎖️ Community Guide", discord.Color.from_str("#1ABC9C"), discord.Permissions(moderate_members=True, mute_members=True, move_members=True)),
            ("🎉 Event Manager", discord.Color.from_str("#E91E63"), discord.Permissions(manage_events=True, mention_everyone=True)),
            ("💎 Elite Patron", discord.Color.from_str("#EB459E"), discord.Permissions(use_external_emojis=True, use_external_stickers=True, create_public_threads=True)),
            ("⭐ Premium", discord.Color.from_str("#F1C40F"), discord.Permissions(use_external_emojis=True, embed_links=True)),
            ("🧪 Bot Tester", discord.Color.from_str("#9B59B6"), discord.Permissions(use_external_emojis=True, use_application_commands=True)),
            ("📜 Astra Contributor", discord.Color.from_str("#A19D94"), discord.Permissions(attach_files=True, create_public_threads=True)),
            ("👋 Verified", discord.Color.from_str("#2ECC71"), discord.Permissions(send_messages=True, read_message_history=True, use_application_commands=True, add_reactions=True, connect=True)),
            ("🔒 Unverified", discord.Color.from_str("#99AAB5"), discord.Permissions(read_message_history=True)),
            ("📢 News Ping", discord.Color.light_grey(), discord.Permissions.none()),
            ("🚀 Update Ping", discord.Color.light_grey(), discord.Permissions.none()),
            ("🧪 Lab Ping", discord.Color.light_grey(), discord.Permissions.none())
        ]
        
        roles = {}
        for name, color, perms in role_data:
            role = discord.utils.get(guild.roles, name=name)
            if not role:
                role = await guild.create_role(name=name, color=color, permissions=perms, reason="Astra Setup")
            roles[name] = role

        # 3. DEFINE STRUCTURE (Categories -> Channels with Topics)
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

        # 4. BUILD CATEGORIES & CHANNELS
        created_channels = 0
        for cat_name, p_type, channels in structure:
            status_embed.description = f"🏗️ Building Category: **{cat_name}**..."
            await status_msg.edit(embed=status_embed)
            
            # Category Permissions
            overwrites = {
                guild.default_role: discord.PermissionOverwrite(view_channel=True, send_messages=False)
            }
            
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

        # 5. FINAL SUCCESS
        final_embed = SuccessEmbed(
            f"Server v2.3 Build Complete!\n\n"
            f"👤 Created/Synced **{len(roles)}** Roles\n"
            f"📁 Created **{len(structure)}** Categories\n"
            f"💬 Created **{created_channels}** Channels with Topics"
        )
        await interaction.followup.send(embed=final_embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(ServerSetup(bot))
