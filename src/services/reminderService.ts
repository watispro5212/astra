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
                    if (channel) {
                        const embed = new EmbedBuilder()
                            .setColor(0x3498db)
                            .setTitle('🔔 Temporal Reminder Triggered')
                            .setDescription(rem.message)
                            .setFooter({ text: 'Astra Temporal System' })
                            .setTimestamp();
                        
                        await channel.send({ content: `<@${rem.user_id}>`, embeds: [embed] });
                    }
                } catch (err) {
                    logger.error(`Failed to send reminder #${rem.id}: ${err}`);
                } finally {
                    await this.deleteReminder(rem.id);
                }
            }
        }, 30000); // Check every 30 seconds
    }
}
