import discord
from discord import app_commands
from discord.ext import commands
from services.economy_service import EconomyService
from ui.embeds import AstraEmbed, SuccessEmbed, ErrorEmbed
from typing import Optional
from datetime import datetime, timedelta

WORK_RESPONSES = [
    "You worked as a delivery driver", "You did some freelance coding",
    "You helped move furniture", "You sold handmade crafts online",
    "You worked a shift at the café", "You fixed someone's computer",
    "You walked dogs in the neighborhood", "You tutored a student",
]

class Economy(commands.Cog):
    """Server economy system — earn, spend, and trade coins."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    economy = app_commands.Group(name="economy", description="Economy commands.")

    @economy.command(name="balance", description="Check your or another user's balance.")
    @app_commands.describe(user="The user to check (defaults to yourself).")
    async def balance(self, interaction: discord.Interaction, user: Optional[discord.Member] = None):
        target = user or interaction.user
        data = await EconomyService.get_balance(target.id, interaction.guild_id)
        embed = AstraEmbed(title=f"💰 {target.display_name}'s Balance")
        embed.add_field(name="Wallet", value=f"**{data['balance']:,}** coins", inline=True)
        embed.add_field(name="Bank", value=f"**{data['bank']:,}** coins", inline=True)
        embed.add_field(name="Total Earned", value=f"**{data['total_earned']:,}** coins", inline=True)
        embed.set_thumbnail(url=target.display_avatar.url)
        await interaction.response.send_message(embed=embed)

    @economy.command(name="daily", description="Claim your daily coin reward.")
    async def daily(self, interaction: discord.Interaction):
        result = await EconomyService.claim_daily(interaction.user.id, interaction.guild_id)
        if result is None:
            data = await EconomyService.get_balance(interaction.user.id, interaction.guild_id)
            if data["last_daily"]:
                last = datetime.fromisoformat(str(data["last_daily"]))
                next_claim = last + timedelta(days=1)
                remaining = next_claim - datetime.utcnow()
                hours, rem = divmod(int(remaining.total_seconds()), 3600)
                minutes = rem // 60
                return await interaction.response.send_message(
                    embed=ErrorEmbed(f"You already claimed your daily! Come back in **{hours}h {minutes}m**."),
                    ephemeral=True
                )
        embed = SuccessEmbed(f"You claimed your daily reward of **{result:,}** coins!")
        await interaction.response.send_message(embed=embed)

    @economy.command(name="work", description="Work to earn some coins (1h cooldown).")
    async def work(self, interaction: discord.Interaction):
        import random
        result = await EconomyService.claim_work(interaction.user.id, interaction.guild_id)
        if result is None:
            return await interaction.response.send_message(
                embed=ErrorEmbed("You're tired from working! Come back in an hour."),
                ephemeral=True
            )
        job = random.choice(WORK_RESPONSES)
        embed = SuccessEmbed(f"{job} and earned **{result:,}** coins!")
        await interaction.response.send_message(embed=embed)

    @economy.command(name="pay", description="Send coins to another member.")
    @app_commands.describe(user="Who to pay.", amount="Amount to send.")
    async def pay(self, interaction: discord.Interaction, user: discord.Member, amount: int):
        if user.id == interaction.user.id:
            return await interaction.response.send_message(embed=ErrorEmbed("You can't pay yourself."), ephemeral=True)
        if amount <= 0:
            return await interaction.response.send_message(embed=ErrorEmbed("Amount must be positive."), ephemeral=True)
        success = await EconomyService.transfer(interaction.user.id, user.id, interaction.guild_id, amount)
        if not success:
            return await interaction.response.send_message(embed=ErrorEmbed("You don't have enough coins."), ephemeral=True)
        await interaction.response.send_message(
            embed=SuccessEmbed(f"Sent **{amount:,}** coins to {user.mention}.")
        )

    @economy.command(name="leaderboard", description="View the richest members in the server.")
    async def leaderboard(self, interaction: discord.Interaction):
        await interaction.response.defer()
        rows = await EconomyService.get_leaderboard(interaction.guild_id, 10)
        if not rows:
            return await interaction.followup.send(embed=ErrorEmbed("No economy data yet."))
        embed = AstraEmbed(title=f"💰 Economy Leaderboard — {interaction.guild.name}")
        medals = ["🥇", "🥈", "🥉"]
        lines = []
        for i, row in enumerate(rows):
            member = interaction.guild.get_member(row["user_id"])
            name = member.display_name if member else f"User {row['user_id']}"
            medal = medals[i] if i < 3 else f"`{i+1}.`"
            total = row["balance"] + row["bank"]
            lines.append(f"{medal} **{name}** — {total:,} coins")
        embed.description = "\n".join(lines)
        await interaction.followup.send(embed=embed)

    @economy.command(name="shop", description="Browse the server shop.")
    async def shop(self, interaction: discord.Interaction):
        items = await EconomyService.get_shop(interaction.guild_id)
        if not items:
            return await interaction.response.send_message(embed=ErrorEmbed("The shop is empty! An admin can add items with `/economy additem`."), ephemeral=True)
        embed = AstraEmbed(title=f"🛒 {interaction.guild.name} Shop")
        for item in items:
            role_text = f" → <@&{item['role_id']}>" if item["role_id"] else ""
            embed.add_field(
                name=f"`{item['id']}` {item['name']} — {item['price']:,} coins",
                value=f"{item['description']}{role_text}",
                inline=False
            )
        embed.set_footer(text="Use /economy buy <id> to purchase an item.")
        await interaction.response.send_message(embed=embed)

    @economy.command(name="buy", description="Purchase an item from the shop.")
    @app_commands.describe(item_id="The ID of the item to buy.")
    async def buy(self, interaction: discord.Interaction, item_id: int):
        items = await EconomyService.get_shop(interaction.guild_id)
        item = next((i for i in items if i["id"] == item_id), None)
        if not item:
            return await interaction.response.send_message(embed=ErrorEmbed("Item not found."), ephemeral=True)
        success = await EconomyService.remove_coins(interaction.user.id, interaction.guild_id, item["price"])
        if not success:
            return await interaction.response.send_message(embed=ErrorEmbed(f"You need **{item['price']:,}** coins to buy this."), ephemeral=True)
        if item["role_id"]:
            role = interaction.guild.get_role(item["role_id"])
            if role:
                try:
                    await interaction.user.add_roles(role, reason="Economy shop purchase")
                except Exception:
                    pass
        await interaction.response.send_message(embed=SuccessEmbed(f"You purchased **{item['name']}**!"))

    @economy.command(name="additem", description="Add an item to the shop.")
    @app_commands.describe(name="Item name.", description="Item description.", price="Price in coins.", role="Role reward (optional).")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def additem(self, interaction: discord.Interaction, name: str, description: str, price: int, role: Optional[discord.Role] = None):
        role_id = role.id if role else None
        item_id = await EconomyService.add_shop_item(interaction.guild_id, name, description, price, role_id)
        await interaction.response.send_message(embed=SuccessEmbed(f"Added **{name}** to the shop (ID: `{item_id}`)."))

    @economy.command(name="removeitem", description="Remove an item from the shop.")
    @app_commands.describe(item_id="The ID of the item to remove.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def removeitem(self, interaction: discord.Interaction, item_id: int):
        success = await EconomyService.remove_shop_item(item_id, interaction.guild_id)
        if not success:
            return await interaction.response.send_message(embed=ErrorEmbed("Item not found."), ephemeral=True)
        await interaction.response.send_message(embed=SuccessEmbed(f"Removed item `{item_id}` from the shop."))

    @economy.command(name="give", description="[Admin] Give coins to a member.")
    @app_commands.describe(user="The member to give coins to.", amount="Amount to give.")
    @app_commands.checks.has_permissions(administrator=True)
    async def give(self, interaction: discord.Interaction, user: discord.Member, amount: int):
        await EconomyService.add_coins(user.id, interaction.guild_id, amount, "Admin grant")
        await interaction.response.send_message(embed=SuccessEmbed(f"Gave **{amount:,}** coins to {user.mention}."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Economy(bot))
