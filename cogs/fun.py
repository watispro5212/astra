import discord
from discord import app_commands
from discord.ext import commands
from ui.embeds import AstraEmbed
import random

EIGHT_BALL_RESPONSES = [
    # Positive
    "It is certain.", "It is decidedly so.", "Without a doubt.",
    "Yes, definitely.", "You may rely on it.", "As I see it, yes.",
    "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.",
    # Neutral
    "Reply hazy, try again.", "Ask again later.",
    "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.",
    # Negative
    "Don't count on it.", "My reply is no.", "My sources say no.",
    "Outlook not so good.", "Very doubtful.",
]

ROASTS = [
    "You're the reason shampoo has instructions.",
    "I'd agree with you, but then we'd both be wrong.",
    "You have your entire life to be an idiot. Take the day off.",
    "If you were any less intelligent, we'd have to water you.",
    "Some day you'll go far — and I hope you stay there.",
    "I'd call you a tool, but even tools are useful.",
    "Brains aren't everything. In your case, they're nothing.",
    "You bring everyone so much joy when you leave the room.",
    "I'd challenge you to a battle of wits, but you seem unarmed.",
    "You're not stupid; you just have bad luck thinking.",
]

TRIVIA = [
    {"q": "What is the capital of France?", "a": "Paris"},
    {"q": "What planet is known as the Red Planet?", "a": "Mars"},
    {"q": "How many sides does a hexagon have?", "a": "6"},
    {"q": "What is the largest ocean on Earth?", "a": "Pacific"},
    {"q": "Who wrote Romeo and Juliet?", "a": "Shakespeare"},
    {"q": "What is the chemical symbol for gold?", "a": "Au"},
    {"q": "How many continents are on Earth?", "a": "7"},
    {"q": "What is the fastest land animal?", "a": "Cheetah"},
    {"q": "In what year did the Titanic sink?", "a": "1912"},
    {"q": "What is the smallest planet in our solar system?", "a": "Mercury"},
]

class Fun(commands.Cog):
    """Fun commands — games, humor, and randomness."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self._trivia_sessions: dict = {}

    @app_commands.command(name="8ball", description="Ask the magic 8-ball a question.")
    @app_commands.describe(question="Your question.")
    async def eightball(self, interaction: discord.Interaction, question: str):
        response = random.choice(EIGHT_BALL_RESPONSES)
        embed = AstraEmbed(title="🎱 Magic 8-Ball")
        embed.add_field(name="Question", value=question, inline=False)
        embed.add_field(name="Answer", value=f"*{response}*", inline=False)
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="coinflip", description="Flip a coin.")
    async def coinflip(self, interaction: discord.Interaction):
        result = random.choice(["Heads", "Tails"])
        emoji = "🪙"
        embed = AstraEmbed(title=f"{emoji} Coin Flip")
        embed.description = f"The coin landed on **{result}**!"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="roll", description="Roll a dice.")
    @app_commands.describe(sides="Number of sides (default 6).")
    async def roll(self, interaction: discord.Interaction, sides: int = 6):
        if sides < 2:
            return await interaction.response.send_message("Dice must have at least 2 sides!", ephemeral=True)
        result = random.randint(1, sides)
        embed = AstraEmbed(title=f"🎲 Dice Roll (d{sides})")
        embed.description = f"You rolled a **{result}**!"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="roast", description="Roast a member (all in good fun).")
    @app_commands.describe(member="Who to roast.")
    async def roast(self, interaction: discord.Interaction, member: discord.Member):
        if member.id == self.bot.user.id:
            return await interaction.response.send_message("Nice try. I don't roast myself.", ephemeral=True)
        roast = random.choice(ROASTS)
        embed = AstraEmbed(title=f"🔥 Roast — {member.display_name}")
        embed.description = f"{member.mention}, {roast}"
        embed.color = discord.Color.orange()
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="trivia", description="Answer a random trivia question.")
    async def trivia(self, interaction: discord.Interaction):
        channel_id = interaction.channel_id
        if channel_id in self._trivia_sessions:
            return await interaction.response.send_message("A trivia question is already active in this channel!", ephemeral=True)

        q = random.choice(TRIVIA)
        self._trivia_sessions[channel_id] = q["a"].lower()

        embed = AstraEmbed(title="🧠 Trivia Time!")
        embed.description = q["q"]
        embed.set_footer(text="Type your answer in this channel. You have 20 seconds!")
        await interaction.response.send_message(embed=embed)

        def check(m: discord.Message):
            return m.channel.id == channel_id and not m.author.bot

        import asyncio
        try:
            msg = await self.bot.wait_for("message", check=check, timeout=20.0)
            correct = self._trivia_sessions.pop(channel_id, None)
            if correct and msg.content.strip().lower() == correct:
                await msg.reply(f"🎉 Correct! The answer was **{q['a']}**.")
            else:
                await msg.reply(f"❌ Wrong! The correct answer was **{q['a']}**.")
        except asyncio.TimeoutError:
            self._trivia_sessions.pop(channel_id, None)
            await interaction.channel.send(f"⏰ Time's up! The answer was **{q['a']}**.")

    @app_commands.command(name="choose", description="Have Astra choose between options.")
    @app_commands.describe(options="Options separated by commas (e.g. pizza, tacos, sushi).")
    async def choose(self, interaction: discord.Interaction, options: str):
        choices = [o.strip() for o in options.split(",") if o.strip()]
        if len(choices) < 2:
            return await interaction.response.send_message("Provide at least 2 options separated by commas.", ephemeral=True)
        result = random.choice(choices)
        embed = AstraEmbed(title="🤔 Astra Chooses...")
        embed.description = f"**{result}**"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="rps", description="Play Rock, Paper, Scissors against Astra.")
    @app_commands.choices(choice=[
        app_commands.Choice(name="Rock", value="rock"),
        app_commands.Choice(name="Paper", value="paper"),
        app_commands.Choice(name="Scissors", value="scissors"),
    ])
    async def rps(self, interaction: discord.Interaction, choice: str):
        options = ["rock", "paper", "scissors"]
        bot_choice = random.choice(options)
        emojis = {"rock": "🪨", "paper": "📄", "scissors": "✂️"}

        if choice == bot_choice:
            result = "It's a tie!"
            color = discord.Color.gold()
        elif (choice == "rock" and bot_choice == "scissors") or \
             (choice == "paper" and bot_choice == "rock") or \
             (choice == "scissors" and bot_choice == "paper"):
            result = "You win! 🎉"
            color = discord.Color.green()
        else:
            result = "Astra wins! 🤖"
            color = discord.Color.red()

        embed = AstraEmbed(title="✊ Rock Paper Scissors")
        embed.add_field(name="Your Choice", value=f"{emojis[choice]} {choice.title()}", inline=True)
        embed.add_field(name="Astra's Choice", value=f"{emojis[bot_choice]} {bot_choice.title()}", inline=True)
        embed.add_field(name="Result", value=result, inline=False)
        embed.color = color
        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Fun(bot))
