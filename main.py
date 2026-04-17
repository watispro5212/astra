import asyncio
from bot import AstraBot
from core.logger import logger
from core.config import config

async def main():
    """Main entry point for Astra."""
    bot = AstraBot()
    
    async with bot:
        try:
            await bot.start(config.discord_token)
        except Exception as e:
            logger.critical(f"Bot failed to start: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
