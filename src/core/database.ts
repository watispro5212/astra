import sqlite3 from 'sqlite3';
import { Client } from 'pg';
import { config } from './config';
import logger from './logger';
import * as fs from 'fs';
import * as path from 'path';

class DatabaseManager {
    private db: any;
    private isPostgres: boolean;

    constructor() {
        this.isPostgres = config.databaseUrl.startsWith('postgresql');
    }

    async connect() {
        if (this.isPostgres) {
            this.db = new Client({ connectionString: config.databaseUrl });
            await this.db.connect();
            logger.info('Connected to PostgreSQL database');
        } else {
            const pathStr = config.databaseUrl.replace('sqlite:///', '');
            const dir = path.dirname(path.join(process.cwd(), pathStr));
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                logger.info(`Created database directory: ${dir}`);
            }

            this.db = new sqlite3.Database(pathStr);
            logger.info(`Connected to SQLite database: ${pathStr}`);
        }
    }

    async initializeTables() {
        await this.connect();

        const PK = this.isPostgres ? "SERIAL PRIMARY KEY" : "INTEGER PRIMARY KEY AUTOINCREMENT";
        const TS = this.isPostgres ? "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" : "DATETIME DEFAULT CURRENT_TIMESTAMP";
        const INT = this.isPostgres ? "BIGINT" : "INTEGER";
        const TEXT = "TEXT";
        const BOOL = "BOOLEAN";

        const queries = [
            `CREATE TABLE IF NOT EXISTS guilds (
                guild_id ${INT} PRIMARY KEY,
                log_channel_id ${INT},
                staff_role_id ${INT},
                mute_role_id ${INT},
                automod_anti_spam ${BOOL} DEFAULT FALSE,
                automod_anti_invite ${BOOL} DEFAULT FALSE,
                automod_anti_link ${BOOL} DEFAULT FALSE,
                automod_spam_threshold ${INT} DEFAULT 5
            )`,
            `CREATE TABLE IF NOT EXISTS moderation_cases (
                id ${PK},
                guild_id ${INT},
                case_number ${INT},
                target_id ${INT},
                moderator_id ${INT},
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
            `CREATE TABLE IF NOT EXISTS ticket_configs (
                guild_id ${INT} PRIMARY KEY,
                category_id ${INT},
                staff_role_id ${INT},
                log_channel_id ${INT}
            )`,
            `CREATE TABLE IF NOT EXISTS tickets (
                channel_id ${INT} PRIMARY KEY,
                guild_id ${INT},
                user_id ${INT},
                status ${TEXT} DEFAULT 'open',
                reason ${TEXT},
                created_at ${TS}
            )`,
            `CREATE TABLE IF NOT EXISTS welcome_configs (
                guild_id ${INT} PRIMARY KEY,
                channel_id ${INT},
                message ${TEXT},
                auto_role_id ${INT},
                auto_bot_role_id ${INT},
                farewell_channel_id ${INT},
                farewell_message ${TEXT}
            )`,
            `CREATE TABLE IF NOT EXISTS reminders (
                id ${PK},
                guild_id ${INT},
                channel_id ${INT},
                user_id ${INT},
                message ${TEXT},
                remind_at ${TEXT}
            )`,
            `CREATE TABLE IF NOT EXISTS users (
                user_id ${INT} PRIMARY KEY,
                xp ${INT} DEFAULT 0,
                level ${INT} DEFAULT 0,
                balance ${INT} DEFAULT 0,
                last_daily ${TEXT},
                last_work ${TEXT},
                last_mine ${TEXT},
                blacklisted ${BOOL} DEFAULT FALSE
            )`,
            `CREATE TABLE IF NOT EXISTS giveaways (
                id ${PK},
                guild_id ${INT},
                channel_id ${INT},
                message_id ${INT},
                host_id ${INT},
                prize ${TEXT},
                winners ${INT} DEFAULT 1,
                ends_at ${TEXT},
                ended ${BOOL} DEFAULT FALSE,
                winner_ids ${TEXT}
            )`,
            `CREATE TABLE IF NOT EXISTS shop_items (
                id ${PK},
                guild_id ${INT},
                name ${TEXT},
                description ${TEXT},
                price ${INT},
                stock ${INT} DEFAULT -1,
                production_rate ${INT} DEFAULT 0
            )`,
            `CREATE TABLE IF NOT EXISTS user_inventory (
                id ${PK},
                user_id ${INT},
                item_id ${INT},
                quantity ${INT} DEFAULT 1,
                last_harvest ${TEXT}
            )`,
            `CREATE TABLE IF NOT EXISTS leveling_configs (
                guild_id ${INT} PRIMARY KEY,
                announcement_channel_id ${INT}
            )`,
            `CREATE TABLE IF NOT EXISTS level_roles (
                id ${PK},
                guild_id ${INT},
                level ${INT},
                role_id ${INT},
                UNIQUE(guild_id, level)
            )`,
            `CREATE TABLE IF NOT EXISTS user_stocks (
                user_id ${INT} PRIMARY KEY,
                shares ${INT} DEFAULT 0,
                invested_amount ${INT} DEFAULT 0
            )`
        ];

        for (const query of queries) {
            await this.execute(query);
        }

        // v7.0 migrations — safe to run on existing databases
        const migrations = [
            `ALTER TABLE users ADD COLUMN last_work ${TEXT}`,
            `ALTER TABLE users ADD COLUMN last_mine ${TEXT}`,
            `ALTER TABLE guilds ADD COLUMN automod_anti_spam ${BOOL} DEFAULT FALSE`,
            `ALTER TABLE guilds ADD COLUMN automod_anti_invite ${BOOL} DEFAULT FALSE`,
            `ALTER TABLE guilds ADD COLUMN automod_anti_link ${BOOL} DEFAULT FALSE`,
            `ALTER TABLE guilds ADD COLUMN automod_spam_threshold ${INT} DEFAULT 5`,
            `CREATE TABLE IF NOT EXISTS leveling_configs (guild_id ${INT} PRIMARY KEY, announcement_channel_id ${INT})`,
            `CREATE TABLE IF NOT EXISTS level_roles (id ${PK}, guild_id ${INT}, level ${INT}, role_id ${INT}, UNIQUE(guild_id, level))`,
            `CREATE TABLE IF NOT EXISTS user_inventory (id ${PK}, user_id ${INT}, item_id ${INT}, quantity ${INT} DEFAULT 1, last_harvest ${TEXT})`,
            `CREATE TABLE IF NOT EXISTS user_stocks (user_id ${INT} PRIMARY KEY, shares ${INT} DEFAULT 0, invested_amount ${INT} DEFAULT 0)`
        ];
        for (const migration of migrations) {
            try {
                await this.execute(migration);
            } catch (_) {
                // Column already exists on existing databases — expected
            }
        }

        logger.info("Database infrastructure initialized (v7.0.0 - Nova)");
    }

    async execute(query: string, ...params: any[]): Promise<any> {
        const q = this.convertQuery(query);
        if (this.isPostgres) {
            return (await this.db.query(q, params)).rows;
        } else {
            return new Promise((resolve, reject) => {
                this.db.run(q, params, function(this: any, err: any) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
        }
    }

    async fetchOne(query: string, ...params: any[]): Promise<any> {
        const q = this.convertQuery(query);
        if (this.isPostgres) {
            const res = await this.db.query(q, params);
            return res.rows[0] || null;
        } else {
            return new Promise((resolve, reject) => {
                this.db.get(q, params, (err: any, row: any) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    }

    async fetchAll(query: string, ...params: any[]): Promise<any[]> {
        const q = this.convertQuery(query);
        if (this.isPostgres) {
            const res = await this.db.query(q, params);
            return res.rows;
        } else {
            return new Promise((resolve, reject) => {
                this.db.all(q, params, (err: any, rows: any[]) => {
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
