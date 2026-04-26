import { Pool, PoolClient } from 'pg';
import sqlite3 from 'sqlite3';
import { config } from './config';
import logger from './logger';
import * as fs from 'fs';
import * as path from 'path';

class DatabaseManager {
    private pool: Pool | null = null;
    private sqliteDb: any | null = null;
    private isPostgres: boolean;

    constructor() {
        // Automatically detect if we should use Postgres (Supabase) or SQLite
        this.isPostgres = config.databaseUrl.startsWith('postgresql') || config.databaseUrl.startsWith('postgres');
    }

    async connect() {
        if (this.isPostgres) {
            try {
                this.pool = new Pool({
                    connectionString: config.databaseUrl,
                    max: 20,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 2000,
                });
                
                // Test connection
                const client = await this.pool.connect();
                logger.info('📡 Astra Intelligence: Established link with Supabase/PostgreSQL Network.');
                client.release();
            } catch (error) {
                logger.error(`🚨 Critical Database Link Failure (Supabase): ${error}`);
                throw error;
            }
        } else {
            const pathStr = config.databaseUrl.replace('sqlite:///', '');
            const dir = path.dirname(path.join(process.cwd(), pathStr));
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                logger.info(`📁 Created database directory: ${dir}`);
            }

            this.sqliteDb = new sqlite3.Database(pathStr);
            logger.info(`💾 Connected to Local SQLite Vault: ${pathStr}`);
        }
    }

    async initializeTables() {
        await this.connect();

        // Data Type Shims
        const PK = this.isPostgres ? "SERIAL PRIMARY KEY" : "INTEGER PRIMARY KEY AUTOINCREMENT";
        const TS = this.isPostgres ? "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" : "DATETIME DEFAULT CURRENT_TIMESTAMP";
        const INT = this.isPostgres ? "BIGINT" : "INTEGER";
        const TEXT = "TEXT";
        const BOOL = "BOOLEAN";

        const queries = [
            // GULDS & SECTOR CONFIG
            `CREATE TABLE IF NOT EXISTS guilds (
                guild_id ${TEXT} PRIMARY KEY,
                prefix ${TEXT} DEFAULT '-',
                log_channel_id ${TEXT},
                staff_role_id ${TEXT},
                mute_role_id ${TEXT},
                automod_anti_spam ${BOOL} DEFAULT FALSE,
                automod_anti_invite ${BOOL} DEFAULT FALSE,
                automod_anti_link ${BOOL} DEFAULT FALSE,
                automod_spam_threshold ${INT} DEFAULT 5
            )`,
            // USERS & FISCAL RECORDS
            `CREATE TABLE IF NOT EXISTS users (
                user_id ${TEXT} PRIMARY KEY,
                xp ${INT} DEFAULT 0,
                level ${INT} DEFAULT 0,
                balance ${INT} DEFAULT 0,
                bank_balance ${INT} DEFAULT 0,
                total_earned ${INT} DEFAULT 0,
                daily_streak ${INT} DEFAULT 0,
                last_daily ${TEXT},
                last_work ${TEXT},
                last_mine ${TEXT},
                last_rob ${TEXT},
                blacklisted ${BOOL} DEFAULT FALSE
            )`,
            // MODERATION LOGS
            `CREATE TABLE IF NOT EXISTS moderation_cases (
                id ${PK},
                guild_id ${TEXT},
                case_number ${INT},
                target_id ${TEXT},
                moderator_id ${TEXT},
                type ${TEXT},
                reason ${TEXT},
                timestamp ${TS},
                duration ${TEXT},
                note ${TEXT},
                is_appealed ${BOOL} DEFAULT FALSE,
                appeal_reason ${TEXT},
                case_status ${TEXT} DEFAULT 'active',
                UNIQUE(guild_id, case_number)
            )`,
            // TICKETING SYSTEM
            `CREATE TABLE IF NOT EXISTS ticket_configs (
                guild_id ${TEXT} PRIMARY KEY,
                category_id ${TEXT},
                staff_role_id ${TEXT},
                log_channel_id ${TEXT}
            )`,
            `CREATE TABLE IF NOT EXISTS tickets (
                channel_id ${TEXT} PRIMARY KEY,
                guild_id ${TEXT},
                user_id ${TEXT},
                status ${TEXT} DEFAULT 'open',
                reason ${TEXT},
                created_at ${TS}
            )`,
            // WELCOME & FAREWELL
            `CREATE TABLE IF NOT EXISTS welcome_configs (
                guild_id ${TEXT} PRIMARY KEY,
                channel_id ${TEXT},
                message ${TEXT},
                auto_role_id ${TEXT},
                auto_bot_role_id ${TEXT},
                farewell_channel_id ${TEXT},
                farewell_message ${TEXT}
            )`,
            // GIVEAWAYS & EVENTS
            `CREATE TABLE IF NOT EXISTS giveaways (
                id ${PK},
                guild_id ${TEXT},
                channel_id ${TEXT},
                message_id ${TEXT},
                host_id ${TEXT},
                prize ${TEXT},
                winners ${INT} DEFAULT 1,
                ends_at ${TEXT},
                ended ${BOOL} DEFAULT FALSE,
                winner_ids ${TEXT}
            )`,
            // INDUSTRIAL COMMERCE
            `CREATE TABLE IF NOT EXISTS shop_items (
                id ${PK},
                guild_id ${TEXT},
                name ${TEXT},
                description ${TEXT},
                price ${INT},
                stock ${INT} DEFAULT -1,
                production_rate ${INT} DEFAULT 0,
                item_type ${TEXT} DEFAULT 'consumable',
                emoji ${TEXT} DEFAULT '📦',
                role_id ${TEXT}
            )`,
            `CREATE TABLE IF NOT EXISTS user_inventory (
                id ${PK},
                user_id ${TEXT},
                item_id ${INT},
                quantity ${INT} DEFAULT 1,
                last_harvest ${TEXT}
            )`,
            // STOCK MARKET
            `CREATE TABLE IF NOT EXISTS user_stocks (
                user_id ${TEXT},
                stock_symbol ${TEXT},
                shares ${INT} DEFAULT 0,
                invested_amount ${INT} DEFAULT 0,
                PRIMARY KEY (user_id, stock_symbol)
            )`,
            // CONFIGS
            `CREATE TABLE IF NOT EXISTS leveling_configs (
                guild_id ${TEXT} PRIMARY KEY,
                announcement_channel_id ${TEXT}
            )`,
            `CREATE TABLE IF NOT EXISTS level_roles (
                id ${PK},
                guild_id ${TEXT},
                level ${INT},
                role_id ${TEXT},
                UNIQUE(guild_id, level)
            )`,
            // SYSTEM META (Version tracking, etc)
            `CREATE TABLE IF NOT EXISTS system_meta (
                key ${TEXT} PRIMARY KEY,
                value ${TEXT}
            )`,
            // AI SETTINGS
            `CREATE TABLE IF NOT EXISTS user_ai_settings (
                user_id ${TEXT} PRIMARY KEY,
                selected_model ${TEXT} DEFAULT 'gemini-1.5-flash',
                system_prompt ${TEXT},
                usage_count ${INT} DEFAULT 0,
                last_used ${TEXT}
            )`,
            // TEMPORAL REMINDERS
            `CREATE TABLE IF NOT EXISTS reminders (
                id ${PK},
                guild_id ${TEXT},
                channel_id ${TEXT},
                user_id ${TEXT},
                message ${TEXT},
                remind_at ${TEXT}
            )`
        ];

        for (const query of queries) {
            try {
                await this.execute(query);
            } catch (err) {
                logger.error(`Query Execution Failure: ${err}`);
            }
        }

        logger.info("📡 Astra Database Infrastructure: Online & Synchronized (Titan v7.5.0)");
    }

    async execute(query: string, ...params: any[]): Promise<{ rows: any[], count: number }> {
        const q = this.convertQuery(query);
        if (this.isPostgres) {
            const res = await this.pool!.query(q, params);
            return { rows: res.rows, count: res.rowCount || 0 };
        } else {
            return new Promise((resolve, reject) => {
                this.sqliteDb!.run(q, params, function(this: any, err: any) {
                    if (err) reject(err);
                    else resolve({ rows: [], count: this.changes });
                });
            });
        }
    }

    async fetchOne(query: string, ...params: any[]): Promise<any> {
        const q = this.convertQuery(query);
        if (this.isPostgres) {
            const res = await this.pool!.query(q, params);
            return res.rows[0] || null;
        } else {
            return new Promise((resolve, reject) => {
                this.sqliteDb!.get(q, params, (err: any, row: any) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    }

    async fetchAll(query: string, ...params: any[]): Promise<any[]> {
        const q = this.convertQuery(query);
        if (this.isPostgres) {
            const res = await this.pool!.query(q, params);
            return res.rows;
        } else {
            return new Promise((resolve, reject) => {
                this.sqliteDb!.all(q, params, (err: any, rows: any[]) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                });
            });
        }
    }

    private convertQuery(query: string): string {
        if (this.isPostgres) {
            // Convert ? to $1, $2, etc.
            let i = 1;
            return query.replace(/\?/g, () => `$${i++}`);
        }
        return query;
    }
}

export const db = new DatabaseManager();
