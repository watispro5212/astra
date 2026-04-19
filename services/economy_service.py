from core.database import db
from typing import Optional, List, Dict
from datetime import datetime, timedelta

DAILY_AMOUNT = 200
WORK_MIN = 50
WORK_MAX = 150
WORK_COOLDOWN_HOURS = 1

class EconomyService:
    @staticmethod
    async def get_balance(user_id: int, guild_id: int) -> Dict:
        row = await db.fetch_one(
            "SELECT * FROM economy WHERE user_id = ? AND guild_id = ?", user_id, guild_id
        )
        if not row:
            await db.execute(
                "INSERT OR IGNORE INTO economy (user_id, guild_id) VALUES (?, ?)", user_id, guild_id
            )
            return {"balance": 0, "bank": 0, "last_daily": None, "last_work": None, "total_earned": 0}
        return dict(row)

    @staticmethod
    async def add_coins(user_id: int, guild_id: int, amount: int, description: str = ""):
        await db.execute(
            "INSERT OR IGNORE INTO economy (user_id, guild_id) VALUES (?, ?)", user_id, guild_id
        )
        await db.execute(
            "UPDATE economy SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ? AND guild_id = ?",
            amount, max(0, amount), user_id, guild_id
        )
        if description:
            await db.execute(
                "INSERT INTO economy_transactions (guild_id, user_id, amount, type, description) VALUES (?, ?, ?, ?, ?)",
                guild_id, user_id, amount, "credit" if amount > 0 else "debit", description
            )

    @staticmethod
    async def remove_coins(user_id: int, guild_id: int, amount: int) -> bool:
        row = await db.fetch_one(
            "SELECT balance FROM economy WHERE user_id = ? AND guild_id = ?", user_id, guild_id
        )
        if not row or row["balance"] < amount:
            return False
        await db.execute(
            "UPDATE economy SET balance = balance - ? WHERE user_id = ? AND guild_id = ?",
            amount, user_id, guild_id
        )
        return True

    @staticmethod
    async def deposit(user_id: int, guild_id: int, amount: int) -> bool:
        row = await db.fetch_one(
            "SELECT balance FROM economy WHERE user_id = ? AND guild_id = ?", user_id, guild_id
        )
        if not row or row["balance"] < amount or amount <= 0:
            return False
            
        await db.execute(
            "UPDATE economy SET balance = balance - ?, bank = bank + ? WHERE user_id = ? AND guild_id = ?",
            amount, amount, user_id, guild_id
        )
        return True

    @staticmethod
    async def withdraw(user_id: int, guild_id: int, amount: int) -> bool:
        row = await db.fetch_one(
            "SELECT bank FROM economy WHERE user_id = ? AND guild_id = ?", user_id, guild_id
        )
        if not row or row["bank"] < amount or amount <= 0:
            return False
            
        await db.execute(
            "UPDATE economy SET bank = bank - ?, balance = balance + ? WHERE user_id = ? AND guild_id = ?",
            amount, amount, user_id, guild_id
        )
        return True
        """Returns coins awarded or None if on cooldown."""
        row = await db.fetch_one(
            "SELECT last_daily FROM economy WHERE user_id = ? AND guild_id = ?", user_id, guild_id
        )
        now = datetime.utcnow()
        if row and row["last_daily"]:
            last = datetime.fromisoformat(str(row["last_daily"]))
            if (now - last).total_seconds() < 86400:
                return None
        await db.execute(
            "INSERT OR IGNORE INTO economy (user_id, guild_id) VALUES (?, ?)", user_id, guild_id
        )
        await db.execute(
            "UPDATE economy SET balance = balance + ?, total_earned = total_earned + ?, last_daily = ? WHERE user_id = ? AND guild_id = ?",
            DAILY_AMOUNT, DAILY_AMOUNT, now.isoformat(), user_id, guild_id
        )
        return DAILY_AMOUNT

    @staticmethod
    async def claim_work(user_id: int, guild_id: int) -> Optional[int]:
        """Returns coins awarded or None if on cooldown."""
        import random
        row = await db.fetch_one(
            "SELECT last_work FROM economy WHERE user_id = ? AND guild_id = ?", user_id, guild_id
        )
        now = datetime.utcnow()
        if row and row["last_work"]:
            last = datetime.fromisoformat(str(row["last_work"]))
            if (now - last).total_seconds() < WORK_COOLDOWN_HOURS * 3600:
                return None
        earned = random.randint(WORK_MIN, WORK_MAX)
        await db.execute(
            "INSERT OR IGNORE INTO economy (user_id, guild_id) VALUES (?, ?)", user_id, guild_id
        )
        await db.execute(
            "UPDATE economy SET balance = balance + ?, total_earned = total_earned + ?, last_work = ? WHERE user_id = ? AND guild_id = ?",
            earned, earned, now.isoformat(), user_id, guild_id
        )
        return earned

    @staticmethod
    async def transfer(from_id: int, to_id: int, guild_id: int, amount: int) -> bool:
        removed = await EconomyService.remove_coins(from_id, guild_id, amount)
        if not removed:
            return False
        await EconomyService.add_coins(to_id, guild_id, amount, "Transfer received")
        return True

    @staticmethod
    async def get_leaderboard(guild_id: int, limit: int = 10) -> List[Dict]:
        rows = await db.fetch_all(
            "SELECT user_id, balance, bank, total_earned FROM economy WHERE guild_id = ? ORDER BY (balance + bank) DESC LIMIT ?",
            guild_id, limit
        )
        return [dict(r) for r in rows]

    @staticmethod
    async def get_shop(guild_id: int) -> List[Dict]:
        rows = await db.fetch_all(
            "SELECT * FROM shop_items WHERE guild_id = ? AND is_active = 1 ORDER BY price ASC",
            guild_id
        )
        return [dict(r) for r in rows]

    @staticmethod
    async def add_shop_item(guild_id: int, name: str, description: str, price: int, role_id: Optional[int] = None) -> int:
        return await db.execute(
            "INSERT INTO shop_items (guild_id, name, description, price, role_id) VALUES (?, ?, ?, ?, ?)",
            guild_id, name, description, price, role_id
        )

    @staticmethod
    async def remove_shop_item(item_id: int, guild_id: int) -> bool:
        row = await db.fetch_one("SELECT id FROM shop_items WHERE id = ? AND guild_id = ?", item_id, guild_id)
        if not row:
            return False
        await db.execute("UPDATE shop_items SET is_active = 0 WHERE id = ?", item_id)
        return True
