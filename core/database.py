import aiosqlite
import os
from core.logger import logger
from core.config import config
from typing import Optional, List, Dict, Any

class DatabaseManager:
    def __init__(self):
        # Strip sqlite:/// prefix if present
        self.db_path = config.database_url.replace("sqlite:///", "")
        self.connection: Optional[aiosqlite.Connection] = None

    async def connect(self):
        """Establishes connection to the SQLite database."""
        if not self.connection:
            self.connection = await aiosqlite.connect(self.db_path)
            self.connection.row_factory = aiosqlite.Row
            logger.info(f"Connected to database at {self.db_path}")

    async def disconnect(self):
        """Closes the database connection."""
        if self.connection:
            await self.connection.close()
            self.connection = None
            logger.info("Disconnected from database")

    async def initialize_tables(self):
        """Creates initial tables if they don't exist."""
        await self.connect()
        
        # Guild Config Table
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS guilds (
                guild_id INTEGER PRIMARY KEY,
                log_channel_id INTEGER,
                welcome_channel_id INTEGER,
                starboard_channel_id INTEGER,
                starboard_threshold INTEGER DEFAULT 3,
                mute_role_id INTEGER
            )
        """)

        # Moderation Cases Table
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS moderation_cases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id INTEGER,
                case_number INTEGER,
                target_id INTEGER,
                moderator_id INTEGER,
                type TEXT,
                reason TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                duration TEXT,
                UNIQUE(guild_id, case_number)
            )
        """)

        # Role Menus Table
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS role_menus (
                message_id INTEGER PRIMARY KEY,
                guild_id INTEGER,
                channel_id INTEGER,
                title TEXT,
                type TEXT,
                unique_roles BOOLEAN DEFAULT 0
            )
        """)

        # Role Options Table
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS role_options (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message_id INTEGER,
                role_id INTEGER,
                label TEXT,
                emoji TEXT,
                FOREIGN KEY (message_id) REFERENCES role_menus (message_id) ON DELETE CASCADE
            )
        """)

        # Polls Table
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS polls (
                message_id INTEGER PRIMARY KEY,
                guild_id INTEGER,
                channel_id INTEGER,
                question TEXT,
                is_closed BOOLEAN DEFAULT 0,
                ends_at DATETIME
            )
        """)

        # Poll Options Table
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS poll_options (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message_id INTEGER,
                label TEXT,
                vote_count INTEGER DEFAULT 0,
                FOREIGN KEY (message_id) REFERENCES polls (message_id) ON DELETE CASCADE
            )
        """)

        # Poll Votes Table
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS poll_votes (
                message_id INTEGER,
                user_id INTEGER,
                option_id INTEGER,
                PRIMARY KEY (message_id, user_id),
                FOREIGN KEY (message_id) REFERENCES polls (message_id) ON DELETE CASCADE,
                FOREIGN KEY (option_id) REFERENCES poll_options (id) ON DELETE CASCADE
            )
        """)

        await self.connection.commit()
        logger.info("Database tables initialized")

    async def execute(self, query: str, *args):
        """Executes a non-returning query."""
        async with self.connection.execute(query, args) as cursor:
            await self.connection.commit()
            return cursor.lastrowid

    async def fetch_one(self, query: str, *args) -> Optional[aiosqlite.Row]:
        """Fetches a single row."""
        async with self.connection.execute(query, args) as cursor:
            return await cursor.fetchone()

    async def fetch_all(self, query: str, *args) -> List[aiosqlite.Row]:
        """Fetches all rows matching the query."""
        async with self.connection.execute(query, args) as cursor:
            return await cursor.fetchall()

# Global database instance
db = DatabaseManager()
