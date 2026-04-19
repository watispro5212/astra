import discord
from discord import app_commands
from discord.ext import commands
from services.reputation_service import ReputationService
from services.economy_service import EconomyService
from core.database import db
from ui.embeds import AstraEmbed, SuccessEmbed, ErrorEmbed

class Reputation(commands.Cog):
    """Karma and Reputation System."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    rep = app_commands.Group(name="rep", description="User reputation commands.")

    @rep.command(name="check", description="Check your or another user's reputation.")
    @app_commands.describe(user="The user to check.")
    async def check(self, interaction: discord.Interaction, user: discord.Member = None):
        target = user or interaction.user
        rep_score = await ReputationService.get_reputation(target.id, interaction.guild_id)
        
        embed = AstraEmbed(
            title=f"🌟 {target.display_name}'s Reputation",
            description=f"Current Reputation: **{rep_score}**"
        )
        embed.set_thumbnail(url=target.display_avatar.url)
        await interaction.response.send_message(embed=embed)

    @rep.command(name="give", description="Give +1 reputation to someone.")
    @app_commands.describe(user="The user to give reputation to.")
    async def give(self, interaction: discord.Interaction, user: discord.Member):
        if user.id == interaction.user.id:
            return await interaction.response.send_message(
                embed=ErrorEmbed("You cannot give reputation to yourself!"), 
                ephemeral=True
            )
        if user.bot:
            return await interaction.response.send_message(
                embed=ErrorEmbed("Bots do not need your pity reputation."), 
                ephemeral=True
            )
            
        cooldown = await ReputationService.get_cooldown_remaining(interaction.user.id, interaction.guild_id)
        if cooldown:
            return await interaction.response.send_message(
                embed=ErrorEmbed(f"You're on cooldown! You can give reputation again in **{cooldown}**."),
                ephemeral=True
            )
            
        # Give rep
        success = await ReputationService.give_reputation(interaction.user.id, user.id, interaction.guild_id)
        if not success:
            return await interaction.response.send_message(
                embed=ErrorEmbed("An error occurred processing your reputation request."),
                ephemeral=True
            )
            
        # Issue Rewards to the receiver (+150 coins, +50 XP)
        try:
            await EconomyService.add_coins(user.id, interaction.guild_id, 150, "Received Reputation")
            
            # Add XP raw
            await db.execute(
                """
                INSERT INTO user_xp (user_id, guild_id, xp, level, last_message_at)
                VALUES (?, ?, 50, 0, CURRENT_TIMESTAMP)
                ON CONFLICT(user_id, guild_id) DO UPDATE SET xp = xp + 50
                """,
                user.id, interaction.guild_id
            )
        except Exception as e:
            # Let it slide if economy or xp fails slightly for some edge case
            pass

        embed = SuccessEmbed(
            f"You gave **+1 Reputation** to {user.mention}! 🌟\n"
            f"> They received **+150 Coins** and **+50 XP** as a bonus."
        )
        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Reputation(bot))
