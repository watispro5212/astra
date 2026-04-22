import { db } from '../core/database';

export class ModerationService {
    static async createCase(guildId: string, targetId: string, moderatorId: string, type: string, reason: string, duration?: string) {
        // Get next case number
        const row = await db.fetchOne(
            "SELECT MAX(case_number) as last_case FROM moderation_cases WHERE guild_id = ?",
            guildId
        );
        
        const nextCase = (row?.last_case || 0) + 1;
        
        await db.execute(
            "INSERT INTO moderation_cases (guild_id, case_number, target_id, moderator_id, type, reason, duration) VALUES (?, ?, ?, ?, ?, ?, ?)",
            guildId, nextCase, targetId, moderatorId, type, reason, duration || null
        );
        
        return nextCase;
    }

    static async getCase(guildId: string, caseNumber: number) {
        return await db.fetchOne(
            "SELECT * FROM moderation_cases WHERE guild_id = ? AND case_number = ?",
            guildId, caseNumber
        );
    }

    static async getUserHistory(guildId: string, userId: string) {
        return await db.fetchAll(
            "SELECT * FROM moderation_cases WHERE guild_id = ? AND target_id = ? ORDER BY case_number DESC",
            guildId, userId
        );
    }

    static async getGuildConfig(guildId: string) {
        return await db.fetchOne("SELECT * FROM guilds WHERE guild_id = ?", guildId);
    }

    static async updateGuildConfig(guildId: string, data: { log_channel_id?: string, staff_role_id?: string, mute_role_id?: string }) {
        const exists = await db.fetchOne("SELECT 1 FROM guilds WHERE guild_id = ?", guildId);
        
        if (exists) {
            const keys = Object.keys(data);
            const setClause = keys.map(k => `${k} = ?`).join(', ');
            const params = [...Object.values(data), guildId];
            await db.execute(`UPDATE guilds SET ${setClause} WHERE guild_id = ?`, ...params);
        } else {
            const keys = ['guild_id', ...Object.keys(data)];
            const placeholders = keys.map(() => '?').join(', ');
            const params = [guildId, ...Object.values(data)];
            await db.execute(`INSERT INTO guilds (${keys.join(', ')}) VALUES (${placeholders})`, ...params);
        }
    }
}
