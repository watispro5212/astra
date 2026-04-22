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

    async def _safe_add_column(self, table: str, column: str, definition: str):
        """Adds a column to an existing table if it doesn't already exist."""
        try:
            await self.connection.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
            await self.connection.commit()
            logger.info(f"Migration: added column '{column}' to '{table}'")
        except Exception:
            pass  # Column already exists

    async def initialize_tables(self):
        """Creates all tables if they don't exist, and runs non-destructive migrations."""
        await self.connect()

        # ── GUILD CONFIG ──────────────────────────────────────────────────────
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS guilds (
                guild_id INTEGER PRIMARY KEY,
                log_channel_id INTEGER,
                staff_role_id INTEGER,
                mute_role_id INTEGER
            )
        """)

        # ── MODERATION CASES ──────────────────────────────────────────────────
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
                note TEXT,
                UNIQUE(guild_id, case_number)
            )
        """)
        await self._safe_add_column("moderation_cases", "note", "TEXT")
        await self._safe_add_column("moderation_cases", "is_appealed", "BOOLEAN DEFAULT 0")
        await self._safe_add_column("moderation_cases", "appeal_reason", "TEXT")
        await self._safe_add_column("moderation_cases", "case_status", "TEXT DEFAULT 'active'")

        # ── WARNINGS (V6 MODERATION) ──────────────────────────────────────────
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS warnings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id INTEGER,
                user_id INTEGER,
                moderator_id INTEGER,
                reason TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        """)

        # ── TICKET EVENTS ─────────────────────────────────────────────────────
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS ticket_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channel_id INTEGER NOT NULL,
                guild_id INTEGER NOT NULL,
                staff_id INTEGER,
                event_type TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # ── TICKETS ───────────────────────────────────────────────────────────
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS ticket_configs (
                guild_id INTEGER PRIMARY KEY,
                category_id INTEGER,
                staff_role_id INTEGER,
                log_channel_id INTEGER
            )
        """)
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS tickets (
                channel_id INTEGER PRIMARY KEY,
                guild_id INTEGER,
                user_id INTEGER,
                status TEXT DEFAULT 'open',
                reason TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await self._safe_add_column("tickets", "reason", "TEXT")

        # ── ROLE MENUS ────────────────────────────────────────────────────────
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

        # ── POLLS ─────────────────────────────────────────────────────────────
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS polls (
                message_id INTEGER PRIMARY KEY,
                guild_id INTEGER,
                channel_id INTEGER,
                question TEXT,
                is_closed BOOLEAN DEFAULT 0,
                is_anonymous BOOLEAN DEFAULT 0,
                ends_at DATETIME
            )
        """)
        await self._safe_add_column("polls", "is_anonymous", "BOOLEAN DEFAULT 0")

        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS poll_options (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message_id INTEGER,
                label TEXT,
                vote_count INTEGER DEFAULT 0,
                FOREIGN KEY (message_id) REFERENCES polls (message_id) ON DELETE CASCADE
            )
        """)
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

        # ── REMINDERS ─────────────────────────────────────────────────────────
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id INTEGER,
                channel_id INTEGER,
                user_id INTEGER,
                message TEXT,
                remind_at DATETIME,
                is_recurring BOOLEAN DEFAULT 0,
                interval_seconds INTEGER,
                role_id INTEGER
            )
        """)
        await self._safe_add_column("reminders", "role_id", "INTEGER")

        # ── WELCOME / ONBOARDING ──────────────────────────────────────────────
        await self.connection.execute("""
            CREATE TABLE IF NOT EXISTS welcome_configs (
                guild_id INTEGER PRIMARY KEY,
                channel_id INTEGER,
                message TEXT,
                auto_role_id INTEGER,
                auto_bot_role_id INTEGER,
                farewell_channel_id INTEGER,
                farewell_message TEXT
            )
        """)
        await self._safe_add_column("welcome_configs", "auto_bot_role_id", "INTEGER")

        await self.connection.commit()
        logger.info("Database tables initialized (v6 - Cleaned Up)")

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
