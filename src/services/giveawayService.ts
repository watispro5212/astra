import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { db } from '../core/database';
import logger from '../core/logger';

export class GiveawayService {
    static async startChecker(client: Client) {
        setInterval(async () => {
            const due = await db.fetchAll(
                "SELECT * FROM giveaways WHERE ended = FALSE AND ends_at <= ?",
                new Date().toISOString()
            );

            for (const giveaway of due) {
                try {
                    const guild = await client.guilds.fetch(giveaway.guild_id).catch(() => null);
                    if (!guild) continue;
                    const channel = await guild.channels.fetch(giveaway.channel_id).catch(() => null) as TextChannel | null;
                    if (!channel) continue;
                    const message = await channel.messages.fetch(giveaway.message_id).catch(() => null);
                    if (!message) continue;

                    const reaction = message.reactions.cache.get('🎉');
                    let mentions = 'No eligible entries.';
                    let winnerIds = '';

                    if (reaction) {
                        const users = await reaction.users.fetch();
                        const eligible = [...users.filter(u => !u.bot).values()];
                        if (eligible.length > 0) {
                            const count = Math.min(giveaway.winners, eligible.length);
                            const selected = eligible.sort(() => Math.random() - 0.5).slice(0, count);
                            mentions = selected.map(w => `<@${w.id}>`).join(', ');
                            winnerIds = selected.map(w => w.id).join(',');
                        }
                    }

                    const embed = new EmbedBuilder()
                        .setColor(0x2ecc71)
                        .setTitle('🎉 Giveaway Ended')
                        .setDescription(`**Prize:** ${giveaway.prize}\n**Winner(s):** ${mentions}`)
                        .setFooter({ text: 'Astra Giveaway Engine • v7.0.0' })
                        .setTimestamp();

                    await channel.send({ content: winnerIds ? mentions : undefined, embeds: [embed] });
                    await db.execute(
                        'UPDATE giveaways SET ended = TRUE, winner_ids = ? WHERE id = ?',
                        winnerIds, giveaway.id
                    );
                } catch (err) {
                    logger.error(`Giveaway auto-end failed for ID ${giveaway.id}: ${err}`);
                    await db.execute('UPDATE giveaways SET ended = TRUE WHERE id = ?', giveaway.id);
                }
            }
        }, 60000); // Check every 60 seconds
    }
}
