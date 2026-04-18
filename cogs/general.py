import discord
from discord import app_commands
from discord.ext import commands
from core.config import config
import time

class General(commands.Cog):
    """General utility commands."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="ping", description="Check the bot's latency.")
    async def ping(self, interaction: discord.Interaction):
        """Checks the bot's latency and response time."""
        start_time = time.time()
        
        embed = discord.Embed(
            title="🏓 Pong!",
            color=config.bot_theme_color
        )
        embed.add_field(name="Gateway Latency", value={f"{round(self.bot.latency * 1000)}ms"})
        
        # Initial response
        await interaction.response.send_message(embed=embed)
        
        # Calculate REST latency
        end_time = time.time()
        rest_latency = round((end_time - start_time) * 1000)
        
        embed.add_field(name="REST Latency", value={f"{rest_latency}ms"})
        await interaction.edit_original_response(embed=embed)

    @app_commands.command(name="about", description="Information about Astra.")
    async def about(self, interaction: discord.Interaction):
        """Displays information about the bot."""
        embed = discord.Embed(
            title=f"✨ About {config.bot_name}",
            description=(
                f"{config.bot_name} is a polished utility and community assistant designed to make "
                "server management easy and interactive.\n\n"
                "Built with modular features and performance in mind."
            ),
            color=config.bot_theme_color
        )
        
        embed.add_field(name="Framework", value="`discord.py` 2.3+", inline=True)
        embed.add_field(name="Commands", value="Slash commands enabled", inline=True)
        embed.add_field(name="Developer", value="watispro1", inline=True)
        embed.add_field(name="GitHub", value="[watispro5212](https://github.com/watispro5212)", inline=True)
        
        # Use a premium-looking footer
        embed.set_footer(text="Astra • Built by watispro1", icon_url=self.bot.user.display_avatar.url if self.bot.user else None)
        
        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(General(bot))
