import { db } from '../core/database';
import logger from '../core/logger';

export class PassiveIncomeService {
    public static async processYields() {
        try {
            // Fetch all inventory items with a production rate > 0
            const inventory = await db.fetchAll(`
                SELECT ui.id, ui.user_id, ui.last_harvest, si.production_rate 
                FROM user_inventory ui
                JOIN shop_items si ON ui.item_id = si.id
                WHERE si.production_rate > 0
            `);

            const now = new Date();

            for (const record of inventory) {
                const lastHarvest = new Date(record.last_harvest);
                const timeDiff = now.getTime() - lastHarvest.getTime();
                
                // Calculate yield (production_rate is per hour)
                const hoursPassed = timeDiff / (1000 * 60 * 60);
                const yieldAmount = Math.floor(hoursPassed * record.production_rate);

                if (yieldAmount > 0) {
                    // Update user balance and reset last_harvest
                    await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', yieldAmount, record.user_id);
                    await db.execute('UPDATE user_inventory SET last_harvest = ? WHERE id = ?', now.toISOString(), record.id);
                    
                    logger.info(`Industrial Yield: ${yieldAmount} credits delivered to operative ${record.user_id}.`);
                }
            }
        } catch (err) {
            logger.error(`Industrial Yield Failure: ${err}`);
        }
    }

    public static startService() {
        // Process yields every 5 minutes
        setInterval(() => {
            this.processYields();
        }, 5 * 60 * 1000);
        
        logger.info('Industrial Yield Engine: INITIALIZED');
    }
}
