import discord
import asyncio
from discord import app_commands
from discord.ext import commands
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed

class ServerSetup(commands.Cog):
    """Automated server builder and reset tools."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="setup_server", description="🚀 ULTRA-SETUP: Resets and builds the server structure from server.md")
    @app_commands.checks.has_permissions(administrator=True)
    async def setup_server(self, interaction: discord.Interaction):
        """Builds the entire server structure. WARNING: Deletes all existing channels."""
        await interaction.response.defer(ephemeral=True)
        
        # 0. Safety confirmation (Wait, for now we just do it as requested since they said 'delete everything')
        # We'll send a status embed first.
        status_embed = AstraEmbed(
            title="🏗️ Astra Server Setup Initiated",
            description="Processing server reset and construction... This will take a moment."
        )
        status_msg = await interaction.followup.send(embed=status_embed, ephemeral=True)

        guild = interaction.guild
        
        # 1. Delete everything (except the current interaction channel if needed, but Discord requires at least one channel)
        # We'll delete all categories and their channels.
        status_embed.description = "🗑️ Cleaning up existing structure..."
        await status_msg.edit(embed=status_embed)
        
        for channel in guild.channels:
            try:
                await channel.delete(reason="Astra Server Setup: Full Reset")
            except discord.Forbidden:
                pass
            except discord.HTTPException:
                pass

        # 2. Define Structure
        # Format: (Category Name, Permissions_Type, [Channels])
        # Perm Types: 'public_read', 'public_chat', 'support', 'restricted', 'staff'
        structure = [
            ("─── WELCOME ZONE ───", "public_read", [
                "👋 welcome", "📜 rules", "✅ verify", "📢 server-guide"
            ]),
            ("─── SUPPORT DESK 🆘 ───", "support", [
                "❓ support-faq", "🎫 open-a-ticket", "🆘 community-help", "🐞 bug-reports", "💡 feature-requests"
            ]),
            ("─── UPDATES CENTER 🚀 ───", "public_read", [
                "📢 announcements", "🚀 updates", "📝 changelog", "📌 useful-links"
            ]),
            ("─── COMMUNITY HUB 💬 ───", "public_chat", [
                "💬 general", "🤖 bot-commands", "🎉 introductions", "📷 server-showcase", "🗣️ off-topic"
            ]),
            ("─── THE LABORATORY 🧪 ───", "restricted", [
                "🧪 bot-testing", "🔍 feature-preview"
            ]),
            ("─── STAFF OFFICE 🏢 ───", "staff", [
                "🛡️ mod-chat", "📋 mod-logs", "🗂️ support-tickets"
            ]),
            ("─── SOCIAL MEDIA ───", "public_read", [
                "🎨 astra-gallery", "🐦 twitter-feed", "🎥 video-highlights", "🌐 official-socials"
            ]),
            ("─── PARTNERS & GROWTH ───", "public_read", [
                "🤝 partner-info", "⭐ affiliate-showcase", "📈 server-growth"
            ])
        ]

        # 3. Create Structure
        created_channels = 0
        for cat_name, p_type, channels in structure:
            status_embed.description = f"🏗️ Creating Category: **{cat_name}**..."
            await status_msg.edit(embed=status_embed)
            
            # Setup Overwrites
            overwrites = {
                guild.default_role: discord.PermissionOverwrite(view_channel=True, send_messages=False)
            }
            
            if p_type == 'public_chat':
                overwrites[guild.default_role] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
            elif p_type == 'restricted' or p_type == 'staff':
                overwrites[guild.default_role] = discord.PermissionOverwrite(view_channel=False)
            
            # Create Category
            category = await guild.create_category(name=cat_name, overwrites=overwrites)
            
            for chan_name in channels:
                await guild.create_text_channel(name=chan_name, category=category)
                created_channels += 1
                await asyncio.sleep(0.5) # Prevent rate limits

        # 4. Final Success
        final_embed = SuccessEmbed(
            f"Server setup complete!\nCreated **{len(structure)}** categories and **{created_channels}** channels."
        )
        final_embed.set_footer(text="Astra v2.1 | All channels synced to categories.")
        await interaction.followup.send(embed=final_embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(ServerSetup(bot))
