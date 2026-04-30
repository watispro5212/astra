import { db } from '../core/database';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import logger from '../core/logger';

export class ReminderService {
    static async createReminder(guildId: string | null, channelId: string, userId: string, message: string, remindAt: Date) {
        await db.execute(
            "INSERT INTO reminders (guild_id, channel_id, user_id, message, remind_at) VALUES (?, ?, ?, ?, ?)",
            guildId, channelId, userId, message, remindAt.toISOString()
        );
    }

    static async getActiveReminders() {
        return await db.fetchAll("SELECT * FROM reminders WHERE remind_at <= ?", new Date().toISOString());
    }

    static async deleteReminder(id: number) {
        await db.execute("DELETE FROM reminders WHERE id = ?", id);
    }

    static async startChecker(client: Client) {
        setInterval(async () => {
            const due = await this.getActiveReminders();
            for (const rem of due) {
                try {
                    const channel = await client.channels.fetch(rem.channel_id) as TextChannel;
                    if (channel?.isTextBased()) {
                        const embed = new EmbedBuilder()
                            .setColor(0x3498db)
                            .setTitle('🔔 Reminder!')
                            .setDescription(rem.message)
                            .setFooter({ text: 'Astra Reminders' })
                            .setTimestamp();
                        await channel.send({ content: `<@${rem.user_id}>`, embeds: [embed] });
                    }
                    // Delete only after a successful send (or if channel is gone)
                    await this.deleteReminder(rem.id);
                } catch (err) {
                    logger.error(`Reminder #${rem.id} failed: ${err}`);
                    // Still delete so it doesn't retry forever on a broken channel
                    await this.deleteReminder(rem.id).catch(() => {});
                }
            }
        }, 30000); // Check every 30 seconds
    }
}
