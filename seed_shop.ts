import { db } from './src/core/database';
import { config } from './src/core/config';

async function seed() {
    console.log('🛰️ INITIALIZING DATABASE ENGINE...');
    await db.initializeTables();
    
    console.log('🛰️ SEEDING APEX MARKETPLACE...');
    
    const items = [
        {
            name: 'Apex Windmill',
            description: 'A high-tech kinetic energy generator that converts sector winds into credits. Built with titanium blades and neon-core gears.',
            price: 5000,
            production_rate: 50,
            role_id: null
        },
        {
            name: 'Solar Array',
            description: 'Advanced photovoltaic panels designed for deep-space energy harvesting. Provides a consistent power grid for your sector.',
            price: 15000,
            production_rate: 150,
            role_id: null
        },
        {
            name: 'Quantum Miner',
            description: 'A sub-atomic extraction device that harvests credits from quantum fluctuations in the local space-time fabric.',
            price: 50000,
            production_rate: 500,
            role_id: null
        },
        {
            name: 'Elite Operative License',
            description: 'Official certification granting permanent high-clearance access and the Elite operative status within the sector.',
            price: 100000,
            production_rate: 0,
            role_id: 'ROLE_ID_PLACEHOLDER' // Note: This would need to be updated with the actual ELITE role ID after setup
        }
    ];

    for (const item of items) {
        // Insert for the current guild if available, otherwise a generic record (or we'd need to handle this in setup)
        // For now, we'll insert them without a specific guild_id so they show up everywhere, 
        // or just use the GUILD_ID from config.
        const guildId = config.guildId || 'GLOBAL';
        
        await db.execute(
            'INSERT INTO shop_items (guild_id, name, description, role_id, price, production_rate) VALUES (?, ?, ?, ?, ?, ?)',
            guildId, item.name, item.description, item.role_id, item.price, item.production_rate
        );
    }

    console.log('✅ PROVISIONING COMPLETE: 4 items logged to the warehouse.');
    process.exit(0);
}

seed();
