from core.database import db
from datetime import datetime, timedelta
from typing import Optional, Dict

class PatronService:
    def __init__(self):
        # Cache for performance, especially for XP multipliers
        self._cache: Dict[int, dict] = {}

    async def get_patron(self, user_id: int) -> Optional[dict]:
        """Fetches patron status for a user, with caching."""
        if user_id in self._cache:
            return self._cache[user_id]

        row = await db.fetch_one("SELECT tier, expires_at FROM patrons WHERE user_id = ?", user_id)
        if not row:
            self._cache[user_id] = None
            return None

        # Check expiration
        if row['expires_at']:
            expires_at = datetime.fromisoformat(row['expires_at'])
            if datetime.now() > expires_at:
                await self.remove_patron(user_id)
                self._cache[user_id] = None
                return None

        data = {"tier": row['tier'], "expires_at": row['expires_at']}
        self._cache[user_id] = data
        return data

    async def set_patron(self, user_id: int, tier: int, days: Optional[int] = None):
        """Sets a user's patron tier with optional duration."""
        expires_at = None
        if days:
            expires_at = (datetime.now() + timedelta(days=days)).isoformat()

        await db.execute(
            "INSERT INTO patrons (user_id, tier, expires_at) VALUES (?, ?, ?) "
            "ON CONFLICT(user_id) DO UPDATE SET tier = ?, expires_at = ?",
            user_id, tier, expires_at, tier, expires_at
        )
        # Clear cache
        if user_id in self._cache:
            del self._cache[user_id]

    async def remove_patron(self, user_id: int):
        """Removes patron status from a user."""
        await db.execute("DELETE FROM patrons WHERE user_id = ?", user_id)
        if user_id in self._cache:
            del self._cache[user_id]

    async def get_multiplier(self, user_id: int) -> float:
        """Returns the XP multiplier based on tier."""
        patron = await self.get_patron(user_id)
        if not patron:
            return 1.0
        
        multipliers = {
            1: 1.5, # Supporter
            2: 2.0, # Patron
            3: 3.0  # Elite
        }
        return multipliers.get(patron['tier'], 1.0)

    # ── ELITE GALLERY LOGIC ───────────────────────────────────────────────────

    async def add_gallery_image(self, user_id: int, url: str) -> bool:
        """Adds an image for an Elite Patron. Limit 5 per user."""
        patron = await self.get_patron(user_id)
        if not patron or patron['tier'] < 3:
            return False # Not elite
            
        # Check count
        count_row = await db.fetch_one("SELECT COUNT(*) as count FROM elite_images WHERE user_id = ?", user_id)
        if count_row['count'] >= 5:
            return False # Limit reached
            
        await db.execute("INSERT INTO elite_images (user_id, image_url) VALUES (?, ?)", user_id, url)
        return True

    async def get_random_gallery_image(self) -> Optional[dict]:
        """Returns a random image record from the gallery."""
        row = await db.fetch_one("SELECT user_id, image_url FROM elite_images ORDER BY RANDOM() LIMIT 1")
        return dict(row) if row else None

    async def get_user_gallery(self, user_id: int):
        """Returns all gallery images for a specific user."""
        return await db.fetch_all("SELECT id, image_url FROM elite_images WHERE user_id = ?", user_id)

    async def delete_gallery_image(self, user_id: int, image_id: int):
        """Deletes a gallery image (must be owned by the user)."""
        await db.execute("DELETE FROM elite_images WHERE id = ? AND user_id = ?", image_id, user_id)

    async def purge_gallery_image(self, image_id: int):
        """Admin-only: Purge any image by ID."""
        await db.execute("DELETE FROM elite_images WHERE id = ?", image_id)

patron_service = PatronService()
