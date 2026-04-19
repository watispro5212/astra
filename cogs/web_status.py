import discord
from discord.ext import commands
from aiohttp import web
import asyncio
from core.logger import logger
from datetime import datetime

class WebStatus(commands.Cog):
    """Hosts a small JSON API for the website's status page."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.app = web.Application()
        self.app.router.add_get('/api/status', self.handle_status)
        
        # Add CORS headers
        async def on_prepare(request, response):
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        
        self.app.on_response_prepare.append(on_prepare)
        self.runner = None
        self.site = None
        self.bot.loop.create_task(self.start_server())
        
        self.start_time = datetime.utcnow()

    async def handle_status(self, request):
        uptime = datetime.utcnow() - self.start_time
        # dynamically check modules based on loaded cogs
        cogs = self.bot.cogs
        services = {
            "Gateway API": "online" if not self.bot.is_closed() else "offline",
            "Database": "online",
            "Economy": "online" if "Economy" in cogs else "offline",
            "Moderation": "online" if "Moderation" in cogs else "offline",
            "Leveling/XP": "online" if "Leveling" in cogs else "offline",
            "Reputation": "online" if "Reputation" in cogs else "offline",
            "Ticket System": "online" if "Tickets" in cogs else "offline",
            "Anti-Raid": "online" if "AntiRaid" in cogs else "offline",
            "Background Tasks": "online"
        }
        
        data = {
            "status": "online",
            "ping": round(self.bot.latency * 1000),
            "guilds": len(self.bot.guilds),
            "users": sum(g.member_count for g in self.bot.guilds if g.member_count),
            "uptime_seconds": uptime.total_seconds(),
            "services": services
        }
        return web.json_response(data)

    async def start_server(self):
        await self.bot.wait_until_ready()
        self.runner = web.AppRunner(self.app)
        await self.runner.setup()
        
        # Determine port from env or default to 8080
        import os
        port = int(os.getenv("STATUS_PORT", 8080))
        
        try:
            self.site = web.TCPSite(self.runner, '0.0.0.0', port)
            await self.site.start()
            logger.info(f"API Status Web Server started on port {port}")
        except Exception as e:
            logger.error(f"Failed to start API Server on port {port}: {e}")

    async def cog_unload(self):
        if self.runner:
            await self.runner.cleanup()

async def setup(bot: commands.Bot):
    await bot.add_cog(WebStatus(bot))
