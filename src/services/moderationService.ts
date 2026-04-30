import { Client, EmbedBuilder } from 'discord.js';
import { db } from '../core/database';
import logger from '../core/logger';

export class ModerationService {
    static async createCase(guildId: string, targetId: string, moderatorId: string, type: string, reason: string, duration?: string) {
        const row = await db.fetchOne(
            'SELECT MAX(case_number) as last_case FROM moderation_cases WHERE guild_id = ?',
            guildId
        );
        const nextCase = (Number(row?.last_case) || 0) + 1;

        await db.execute(
            'INSERT INTO moderation_cases (guild_id, case_number, target_id, moderator_id, type, reason, duration) VALUES (?, ?, ?, ?, ?, ?, ?)',
            guildId, nextCase, targetId, moderatorId, type, reason, duration ?? null
        );

        return nextCase;
    }

    static async getCase(guildId: string, caseNumber: number) {
        return db.fetchOne('SELECT * FROM moderation_cases WHERE guild_id = ? AND case_number = ?', guildId, caseNumber);
    }

    static async getUserHistory(guildId: string, userId: string) {
        return db.fetchAll('SELECT * FROM moderation_cases WHERE guild_id = ? AND target_id = ? ORDER BY case_number DESC', guildId, userId);
    }

    static async closeCase(guildId: string, caseNumber: number, note?: string) {
        await db.execute(
            'UPDATE moderation_cases SET case_status = ?, note = COALESCE(?, note) WHERE guild_id = ? AND case_number = ?',
            'closed', note ?? null, guildId, caseNumber
        );
    }

    static async addNote(guildId: string, caseNumber: number, note: string) {
        await db.execute(
            'UPDATE moderation_cases SET note = ? WHERE guild_id = ? AND case_number = ?',
            note, guildId, caseNumber
        );
    }

    static async getGuildConfig(guildId: string) {
        return db.fetchOne('SELECT * FROM guilds WHERE guild_id = ?', guildId);
    }

    static async setLogChannel(guildId: string, channelId: string) {
        const exists = await db.fetchOne('SELECT 1 FROM guilds WHERE guild_id = ?', guildId);
        if (exists) {
            await db.execute('UPDATE guilds SET log_channel_id = ? WHERE guild_id = ?', channelId, guildId);
        } else {
            await db.execute('INSERT INTO guilds (guild_id, log_channel_id) VALUES (?, ?)', guildId, channelId);
        }
    }

    // Post a formatted mod action to the guild's configured log channel
    static async sendLog(client: Client, guildId: string, embed: EmbedBuilder): Promise<void> {
        try {
            const config = await db.fetchOne('SELECT log_channel_id FROM guilds WHERE guild_id = ?', guildId);
            if (!config?.log_channel_id) return;

            const channel: any = await client.channels.fetch(config.log_channel_id).catch(() => null);
            if (!channel?.isTextBased()) return;

            await channel.send({ embeds: [embed] });
        } catch (err) {
            logger.warn(`Mod log send failed for guild ${guildId}: ${err}`);
        }
    }
}
