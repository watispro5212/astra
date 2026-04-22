import os
from databases import Database
from core.logger import logger
from core.config import config
from typing import Optional, List, Dict, Any, Union
import sqlalchemy

class DatabaseManager:
    def __init__(self):
        self.url = config.database_url
        self.database: Optional[Database] = None
        self.is_postgresql = self.url.startswith("postgresql")

    async def connect(self):
        """Establishes a connection pool to the database."""
        if not self.database:
            self.database = Database(self.url)
            await self.database.connect()
            logger.info(f"Connected to database pool: {self.url.split('@')[-1] if '@' in self.url else self.url}")

    async def disconnect(self):
        """Closes the database connection pool."""
        if self.database:
            await self.database.disconnect()
            self.database = None
            logger.info("Disconnected from database pool")

    def _convert_query(self, query: str) -> str:
        """Converts SQLite '?' syntax to named ':p1, :p2' syntax for consistent parameter binding."""
        if '?' not in query:
            return query
            
        parts = query.split('?')
        new_query = ""
        for i, part in enumerate(parts[:-1]):
            new_query += f"{part}:p{i+1}"
        new_query += parts[-1]
        return new_query

    def _get_params(self, args: tuple) -> dict:
        """Converts positional args to a dictionary for named parameters."""
        return {f"p{i+1}": arg for i, arg in enumerate(args)}

    async def initialize_tables(self):
        """Creates all tables if they don't exist. Optimized for both SQLite and PostgreSQL."""
        await self.connect()

        # Type mapping
        PK = "SERIAL PRIMARY KEY" if self.is_postgresql else "INTEGER PRIMARY KEY AUTOINCREMENT"
        TS = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" if self.is_postgresql else "DATETIME DEFAULT CURRENT_TIMESTAMP"
        TEXT = "TEXT"
        INT = "BIGINT" if self.is_postgresql else "INTEGER"
        BOOL = "BOOLEAN"

        # ── GUILD CONFIG ──────────────────────────────────────────────────────
        await self.database.execute(f"""
            CREATE TABLE IF NOT EXISTS guilds (
                guild_id {INT} PRIMARY KEY,
                log_channel_id {INT},
                staff_role_id {INT},
                mute_role_id {INT}
            )
        """)

        # ── MODERATION ────────────────────────────────────────────────────────
        await self.database.execute(f"""
            CREATE TABLE IF NOT EXISTS moderation_cases (
                id {PK},
                guild_id {INT},
                case_number {INT},
                target_id {INT},
                moderator_id {INT},
                type {TEXT},
                reason {TEXT},
                timestamp {TS},
                duration {TEXT},
                note {TEXT},
                is_appealed {BOOL} DEFAULT FALSE,
                appeal_reason {TEXT},
                case_status {TEXT} DEFAULT 'active',
                UNIQUE(guild_id, case_number)
            )
        """)

        # ── TICKETS ───────────────────────────────────────────────────────────
        await self.database.execute(f"""
            CREATE TABLE IF NOT EXISTS ticket_configs (
                guild_id {INT} PRIMARY KEY,
                category_id {INT},
                staff_role_id {INT},
                log_channel_id {INT}
            )
        """)
        await self.database.execute(f"""
            CREATE TABLE IF NOT EXISTS tickets (
                channel_id {INT} PRIMARY KEY,
                guild_id {INT},
                user_id {INT},
                status {TEXT} DEFAULT 'open',
                reason {TEXT},
                created_at {TS}
            )
        """)

        # ── WELCOME ───────────────────────────────────────────────────────────
        await self.database.execute(f"""
            CREATE TABLE IF NOT EXISTS welcome_configs (
                guild_id {INT} PRIMARY KEY,
                channel_id {INT},
                message {TEXT},
                auto_role_id {INT},
                auto_bot_role_id {INT},
                farewell_channel_id {INT},
                farewell_message {TEXT}
            )
        """)

        logger.info("Database infrastructure initialized (v6.2.0 - Scalable)")

    async def execute(self, query: str, *args):
        """Executes a non-returning query with automatic parameter binding conversion."""
        q = self._convert_query(query)
        params = self._get_params(args)
        return await self.database.execute(query=q, values=params)

    async def fetch_one(self, query: str, *args) -> Optional[dict]:
        """Fetches a single row and returns it as a dictionary."""
        q = self._convert_query(query)
        params = self._get_params(args)
        row = await self.database.fetch_one(query=q, values=params)
        return dict(row) if row else None

    async def fetch_all(self, query: str, *args) -> List[dict]:
        """Fetches all rows and returns them as a list of dictionaries."""
        q = self._convert_query(query)
        params = self._get_params(args)
        rows = await self.database.fetch_all(query=q, values=params)
        return [dict(row) for row in rows]

# Global database instance
db = DatabaseManager()
