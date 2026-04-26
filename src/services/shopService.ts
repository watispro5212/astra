import { db } from '../core/database';
import logger from '../core/logger';

export class ShopService {
    /**
     * Seeds the guild shop with standard tactical inventory upon initialization.
     * This fulfills the Astra Omega Protocol 'Starter Kit' directive.
     */
    static async seedGuildShop(guildId: string) {
        logger.info(`[SHOP] Seeding tactical inventory for Sector: ${guildId}`);

        const starterItems = [
            {
                name: 'Energy Drink',
                description: 'Restores stamina for deployment. (Consumable)',
                price: 500,
                type: 'consumable',
                roleId: null
            },
            {
                name: 'Tactical Badge',
                description: 'Increases passive income yield by +50 cr/hr.',
                price: 2500,
                type: 'passive',
                roleId: null
            },
            {
                name: 'Standard Armor',
                description: 'Basic defensive plating for field operations.',
                price: 1500,
                type: 'passive',
                roleId: null
            },
            {
                name: 'Adrenaline Shot',
                description: 'Instantly resets work cooldown. (Consumable)',
                price: 1200,
                type: 'consumable',
                roleId: null
            },
            {
                name: 'Sector Citizen',
                description: 'Grant yourself the basic Citizen role within this guild.',
                price: 5000,
                type: 'role',
                roleId: 'PENDING' // Admins must update this manually via /shop admin edit
            }
        ];

        try {
            for (const item of starterItems) {
                // Check if item already exists to avoid duplicates
                const exists = await db.fetchOne(
                    'SELECT id FROM shop_items WHERE guild_id = ? AND name = ?',
                    guildId, item.name
                );

                if (!exists) {
                    await db.execute(
                        'INSERT INTO shop_items (guild_id, name, description, price, item_type, role_id) VALUES (?, ?, ?, ?, ?, ?)',
                        guildId, item.name, item.description, item.price, item.type, item.roleId
                    );
                }
            }
            logger.info(`[SHOP] Successfully deployed ${starterItems.length} items to Sector: ${guildId}`);
        } catch (error) {
            logger.error(`[SHOP] Seeding failure for ${guildId}: ${error}`);
        }
    }
}
