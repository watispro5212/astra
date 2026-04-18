import discord
from discord import app_commands
from discord.ext import commands
from core.database import db
from ui.embeds import AstraEmbed, SuccessEmbed
from datetime import datetime

class AFK(commands.Cog):
    """AFK system — set your status and get auto-replies on mention."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="afk", description="Set your AFK status. Astra will reply when you're mentioned.")
    @app_commands.describe(reason="Why you're going AFK (optional).")
    async def afk(self, interaction: discord.Interaction, reason: str = "AFK"):
        await db.execute(
            "INSERT OR REPLACE INTO afk (user_id, guild_id, reason, set_at) VALUES (?, ?, ?, ?)",
            interaction.user.id, interaction.guild_id, reason, datetime.utcnow().isoformat()
        )
        embed = AstraEmbed(title="💤 AFK Set")
        embed.description = f"You are now AFK: **{reason}**\nAstra will let others know when they mention you."
        embed.color = discord.Color.greyple()
        await interaction.response.send_message(embed=embed)

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        if not message.guild or message.author.bot:
            return

        # Check if the message author is AFK — remove their status on activity
        row = await db.fetch_one(
            "SELECT reason, set_at FROM afk WHERE user_id = ? AND guild_id = ?",
            message.author.id, message.guild.id
        )
        if row:
            await db.execute(
                "DELETE FROM afk WHERE user_id = ? AND guild_id = ?",
                message.author.id, message.guild.id
            )
            set_at = datetime.fromisoformat(str(row["set_at"]))
            duration = datetime.utcnow() - set_at
            hours, rem = divmod(int(duration.total_seconds()), 3600)
            minutes = rem // 60
            time_str = f"{hours}h {minutes}m" if hours else f"{minutes}m"
            try:
                await message.channel.send(
                    f"Welcome back, {message.author.mention}! I removed your AFK. *(Away for {time_str})*",
                    delete_after=10
                )
            except Exception:
                pass
            return

        # Check mentioned users for AFK status
        for user in message.mentions:
            if user.bot or user.id == message.author.id:
                continue
            afk_row = await db.fetch_one(
                "SELECT reason, set_at FROM afk WHERE user_id = ? AND guild_id = ?",
                user.id, message.guild.id
            )
            if afk_row:
                set_at = datetime.fromisoformat(str(afk_row["set_at"]))
                duration = datetime.utcnow() - set_at
                hours, rem = divmod(int(duration.total_seconds()), 3600)
                minutes = rem // 60
                time_str = f"{hours}h {minutes}m" if hours else f"{minutes}m"
                try:
                    await message.channel.send(
                        f"💤 **{user.display_name}** is AFK: *{afk_row['reason']}* — {time_str} ago",
                        delete_after=15
                    )
                except Exception:
                    pass

async def setup(bot: commands.Bot):
    await bot.add_cog(AFK(bot))
