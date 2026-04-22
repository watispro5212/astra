import sqlite3 from 'sqlite3';
import { Client } from 'pg';
import { config } from './config';
import logger from './logger';
import { promisify } from 'util';
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
                mute_role_id ${INT}
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
            )`
        ];

        for (const query of queries) {
            await this.execute(query);
        }

        logger.info("Database infrastructure initialized (v6.2.0 - TypeScript)");
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
