import discord
from discord import app_commands
from discord.ext import commands
from discord.ext import tasks
from core.database import db
from ui.embeds import AstraEmbed, SuccessEmbed, ErrorEmbed
from typing import Optional
from datetime import datetime

MONTHS = {
    "January": 1, "February": 2, "March": 3, "April": 4,
    "May": 5, "June": 6, "July": 7, "August": 8,
    "September": 9, "October": 10, "November": 11, "December": 12
}
MONTH_CHOICES = [app_commands.Choice(name=m, value=v) for m, v in MONTHS.items()]

class Birthdays(commands.Cog):
    """Birthday system — set your birthday and get celebrated!"""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.birthday_check.start()

    def cog_unload(self):
        self.birthday_check.cancel()

    birthdays = app_commands.Group(name="birthday", description="Birthday commands.")

    @birthdays.command(name="set", description="Set your birthday.")
    @app_commands.describe(month="Your birth month.", day="Your birth day (1–31).")
    @app_commands.choices(month=MONTH_CHOICES)
    async def set_birthday(self, interaction: discord.Interaction, month: int, day: int):
        if day < 1 or day > 31:
            return await interaction.response.send_message(embed=ErrorEmbed("Day must be between 1 and 31."), ephemeral=True)
        await db.execute(
            "INSERT OR REPLACE INTO birthdays (user_id, guild_id, birth_month, birth_day) VALUES (?, ?, ?, ?)",
            interaction.user.id, interaction.guild_id, month, day
        )
        month_name = next(m for m, v in MONTHS.items() if v == month)
        await interaction.response.send_message(
            embed=SuccessEmbed(f"Birthday set to **{month_name} {day}**!"), ephemeral=True
        )

    @birthdays.command(name="remove", description="Remove your birthday from this server.")
    async def remove_birthday(self, interaction: discord.Interaction):
        await db.execute(
            "DELETE FROM birthdays WHERE user_id = ? AND guild_id = ?",
            interaction.user.id, interaction.guild_id
        )
        await interaction.response.send_message(embed=SuccessEmbed("Your birthday has been removed."), ephemeral=True)

    @birthdays.command(name="check", description="Check a member's birthday.")
    @app_commands.describe(member="The member to check.")
    async def check_birthday(self, interaction: discord.Interaction, member: Optional[discord.Member] = None):
        target = member or interaction.user
        row = await db.fetch_one(
            "SELECT birth_month, birth_day FROM birthdays WHERE user_id = ? AND guild_id = ?",
            target.id, interaction.guild_id
        )
        if not row:
            return await interaction.response.send_message(
                embed=ErrorEmbed(f"{target.display_name} hasn't set their birthday."), ephemeral=True
            )
        month_name = next(m for m, v in MONTHS.items() if v == row["birth_month"])
        embed = AstraEmbed(title=f"🎂 {target.display_name}'s Birthday")
        embed.description = f"**{month_name} {row['birth_day']}**"
        embed.set_thumbnail(url=target.display_avatar.url)
        await interaction.response.send_message(embed=embed)

    @birthdays.command(name="upcoming", description="View upcoming birthdays in this server.")
    async def upcoming(self, interaction: discord.Interaction):
        await interaction.response.defer()
        now = datetime.utcnow()
        rows = await db.fetch_all(
            "SELECT user_id, birth_month, birth_day FROM birthdays WHERE guild_id = ? ORDER BY birth_month, birth_day",
            interaction.guild_id
        )
        if not rows:
            return await interaction.followup.send(embed=ErrorEmbed("No birthdays set in this server."))

        upcoming = []
        for r in rows:
            member = interaction.guild.get_member(r["user_id"])
            if not member:
                continue
            bday = datetime(now.year, r["birth_month"], r["birth_day"])
            if bday < now.replace(hour=0, minute=0, second=0, microsecond=0):
                bday = bday.replace(year=now.year + 1)
            upcoming.append((bday, member, r["birth_month"], r["birth_day"]))

        upcoming.sort(key=lambda x: x[0])
        embed = AstraEmbed(title=f"🎂 Upcoming Birthdays — {interaction.guild.name}")
        for bday, member, month, day in upcoming[:10]:
            month_name = next(m for m, v in MONTHS.items() if v == month)
            days_until = (bday - now).days
            until_str = "Today! 🎉" if days_until == 0 else f"in {days_until} day(s)"
            embed.add_field(name=member.display_name, value=f"{month_name} {day} — {until_str}", inline=True)

        await interaction.followup.send(embed=embed)

    @birthdays.command(name="config", description="Configure birthday announcements.")
    @app_commands.describe(channel="Channel for birthday announcements.", role="Role to give on someone's birthday.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def config(self, interaction: discord.Interaction, channel: Optional[discord.TextChannel] = None, role: Optional[discord.Role] = None):
        await db.execute(
            "INSERT OR REPLACE INTO birthday_configs (guild_id, channel_id, role_id) VALUES (?, ?, ?)",
            interaction.guild_id,
            channel.id if channel else None,
            role.id if role else None
        )
        parts = []
        if channel:
            parts.append(f"Announcements → {channel.mention}")
        if role:
            parts.append(f"Birthday role → {role.mention}")
        await interaction.response.send_message(
            embed=SuccessEmbed("Birthday config updated!\n" + "\n".join(parts) if parts else "Birthday config cleared.")
        )

    @tasks.loop(hours=1)
    async def birthday_check(self):
        """Check for birthdays every hour."""
        now = datetime.utcnow()
        if now.hour != 9:
            return

        rows = await db.fetch_all(
            "SELECT b.user_id, b.guild_id, bc.channel_id, bc.role_id, bc.message "
            "FROM birthdays b JOIN birthday_configs bc ON b.guild_id = bc.guild_id "
            "WHERE b.birth_month = ? AND b.birth_day = ? AND bc.channel_id IS NOT NULL",
            now.month, now.day
        )
        for row in rows:
            guild = self.bot.get_guild(row["guild_id"])
            if not guild:
                continue
            member = guild.get_member(row["user_id"])
            if not member:
                continue
            channel = guild.get_channel(row["channel_id"])
            if not channel:
                continue
            msg = (row["message"] or "🎈 **Plenary Alignment Detected:** Happy Birthday {user}! 🎂 We hope your journey around the sun this year is astronomical!").replace("{user}", member.mention)
            try:
                await channel.send(msg)
                if row["role_id"]:
                    role = guild.get_role(row["role_id"])
                    if role:
                        await member.add_roles(role, reason="Birthday role")
            except Exception:
                pass

    @birthday_check.before_loop
    async def before_birthday_check(self):
        await self.bot.wait_until_ready()

async def setup(bot: commands.Bot):
    await bot.add_cog(Birthdays(bot))
