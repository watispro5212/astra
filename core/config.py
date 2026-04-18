import os
from typing import Optional
from dotenv import load_dotenv
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

class Config(BaseSettings):
    """Configuration model for Astra Discord Bot."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    discord_token: str
    guild_id: Optional[int] = None
    owner_id: int = 1320058519642177668
    
    bot_name: str = "Astra"
    bot_theme_color: int = 0x3498db
    
    database_url: str = "sqlite:///./data/astra.db"

    @field_validator("guild_id", mode="before")
    @classmethod
    def parse_guild_id(cls, v):
        if v == "" or v is None:
            return None
        try:
            return int(v)
        except (ValueError, TypeError):
            return None

# Global config instance
config = Config()
