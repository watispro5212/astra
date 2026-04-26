import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
    DISCORD_TOKEN: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    GUILD_ID: z.string().optional(),
    OWNER_ID: z.string().default('1320058519642177668'),
    BOT_NAME: z.string().default('Astra'),
    BOT_THEME_COLOR: z.string().transform((val) => parseInt(val.replace('#', ''), 16)).default('3498db'),
    DATABASE_URL: z.string().default('sqlite:///./data/astra.db'),
    STATUS_WEBHOOK_URL: z.string().optional(),
    UPDATES_WEBHOOK_URL: z.string().optional(),
    AI_API_KEYS: z.string().default(''),
});

const env = configSchema.parse({
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    GUILD_ID: process.env.GUILD_ID,
    OWNER_ID: process.env.OWNER_ID,
    BOT_NAME: process.env.BOT_NAME,
    BOT_THEME_COLOR: process.env.BOT_THEME_COLOR,
    DATABASE_URL: process.env.DATABASE_URL,
    STATUS_WEBHOOK_URL: process.env.STATUS_WEBHOOK_URL,
    UPDATES_WEBHOOK_URL: process.env.UPDATES_WEBHOOK_URL,
    AI_API_KEYS: process.env.AI_API_KEYS,
});

export const config = {
    token: env.DISCORD_TOKEN,
    clientId: env.DISCORD_CLIENT_ID,
    guildId: env.GUILD_ID,
    ownerId: env.OWNER_ID,
    botName: env.BOT_NAME,
    themeColor: env.BOT_THEME_COLOR,
    databaseUrl: env.DATABASE_URL,
    statusWebhookUrl: env.STATUS_WEBHOOK_URL,
    updatesWebhookUrl: env.UPDATES_WEBHOOK_URL,
    aiApiKeys: env.AI_API_KEYS.split(',').map(k => k.trim()).filter(k => k.length > 0),
};
