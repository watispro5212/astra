import discord
from core.config import config
from datetime import datetime
from typing import Optional

class AstraEmbed(discord.Embed):
    """Base embed for Astra with consistent styling and Patron recognition."""
    def __init__(self, **kwargs):
        patron_data = kwargs.pop("patron", None)
        
        # Use custom premium color if available
        if patron_data and patron_data.get("premium_color"):
            try:
                kwargs["color"] = int(patron_data["premium_color"].replace("#", ""), 16)
            except:
                kwargs["color"] = config.bot_theme_color
        elif "color" not in kwargs:
            kwargs["color"] = config.bot_theme_color
            
        super().__init__(**kwargs)
        
        footer_text = f"{config.bot_name} Assistant"
        if patron_data:
            footer_text += " | Astra Supporter 💎"
            
        self.set_footer(text=footer_text)
        self.timestamp = datetime.now()

class ModerationEmbed(AstraEmbed):
    """Embed specifically for moderation logs."""
    def __init__(self, action: str, target: discord.User, moderator: discord.User, reason: str, case_id: Optional[int] = None, **kwargs):
        super().__init__(**kwargs)
        self.title = f"Moderation Action: {action.title()}"
        if case_id:
            self.title += f" | Case #{case_id}"
            
        self.add_field(name="Target", value=f"{target.mention} ({target.id})", inline=True)
        self.add_field(name="Moderator", value=f"{moderator.mention}", inline=True)
        self.add_field(name="Reason", value=reason, inline=False)
        
        # Set thumbnail to target's avatar if available
        if target.display_avatar:
            self.set_thumbnail(url=target.display_avatar.url)

class SuccessEmbed(AstraEmbed):
    """Embed for successful command execution."""
    def __init__(self, description: str, **kwargs):
        kwargs["color"] = discord.Color.green()
        super().__init__(description=f"✅ {description}", **kwargs)

class InfoEmbed(AstraEmbed):
    """Embed for informational messages."""
    def __init__(self, description: str, **kwargs):
        kwargs["color"] = discord.Color.blue()
        super().__init__(description=f"ℹ️ {description}", **kwargs)

class WarnEmbed(AstraEmbed):
    """Embed for warning messages."""
    def __init__(self, title: str, description: str, **kwargs):
        kwargs["color"] = discord.Color.gold()
        super().__init__(title=f"⚠️ {title}", description=description, **kwargs)

class DangerEmbed(AstraEmbed):
    """Embed for critical errors or dangerous actions."""
    def __init__(self, title: str, description: str, **kwargs):
        kwargs["color"] = discord.Color.red()
        super().__init__(title=f"🚨 {title}", description=description, **kwargs)

class ErrorEmbed(AstraEmbed):
    """Embed for failed command execution."""
    def __init__(self, description: str, **kwargs):
        kwargs["color"] = discord.Color.red()
        super().__init__(description=f"❌ {description}", **kwargs)
