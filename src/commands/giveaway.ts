import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    TextChannel,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME, footerText } from '../core/constants';

function formatDuration(minutes: number): string {
    if (minutes < 60)    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    if (minutes < 1440)  return `${Math.round(minutes / 60)} hour${Math.round(minutes / 60) !== 1 ? 's' : ''}`;
    return `${Math.round(minutes / 1440)} day${Math.round(minutes / 1440) !== 1 ? 's' : ''}`;
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('🎉 Start and manage giveaways for your server.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('start')
               .setDescription('Start a new giveaway in this channel.')
               .addStringOption(opt =>
                   opt.setName('prize').setDescription('What is being given away?').setRequired(true)
               )
               .addIntegerOption(opt =>
                   opt.setName('duration').setDescription('Duration in minutes (max 7 days = 10080).').setRequired(true).setMinValue(1).setMaxValue(10080)
               )
               .addIntegerOption(opt =>
                   opt.setName('winners').setDescription('Number of winners (default 1, max 10).').setMinValue(1).setMaxValue(10)
               )
        )
        .addSubcommand(sub =>
            sub.setName('end')
               .setDescription('End a giveaway early and immediately draw winners.')
               .addStringOption(opt =>
                   opt.setName('message_id').setDescription('The message ID of the giveaway.').setRequired(true)
               )
        )
        .addSubcommand(sub =>
            sub.setName('reroll')
               .setDescription('Re-pick new winners from an ended giveaway.')
               .addStringOption(opt =>
                   opt.setName('message_id').setDescription('The message ID of the ended giveaway.').setRequired(true)
               )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

    async execute(interaction: ChatInputCommandInteraction) {
        const sub = interaction.options.getSubcommand();

        // ── START ─────────────────────────────────────────────────────────
        if (sub === 'start') {
            const prize    = interaction.options.getString('prize')!;
            const duration = interaction.options.getInteger('duration')!;
            const winners  = interaction.options.getInteger('winners') ?? 1;
            const endsAt   = new Date(Date.now() + duration * 60000);
            const endsTs   = Math.floor(endsAt.getTime() / 1000);

            const embed = new EmbedBuilder()
                .setColor(0xf1c40f)
                .setTitle('🎉 Giveaway!')
                .setDescription(
                    `> **${prize}**\n\n` +
                    `React with 🎉 below to enter.\n\n` +
                    `**⏰ Ends** <t:${endsTs}:R> · <t:${endsTs}:F>\n` +
                    `**🏆 Winners** ${winners}\n` +
                    `**🎗️ Hosted by** ${interaction.user}`
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: footerText('Giveaway') })
                .setTimestamp(endsAt);

            const channel = interaction.channel as TextChannel;
            const msg = await channel.send({ embeds: [embed] });
            await msg.react('🎉');

            await db.execute(
                'INSERT INTO giveaways (guild_id, channel_id, message_id, host_id, prize, winners, ends_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                interaction.guildId, interaction.channelId, msg.id, interaction.user.id, prize, winners, endsAt.toISOString()
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(THEME.SUCCESS)
                        .setTitle('✅ Giveaway Started!')
                        .setDescription(`Your giveaway for **${prize}** is now live.\n[Jump to it](${msg.url})`)
                        .addFields(
                            { name: '⏰ Duration',  value: formatDuration(duration), inline: true },
                            { name: '🏆 Winners',   value: `${winners}`,             inline: true },
                        )
                        .setFooter({ text: footerText('Giveaway') })
                        .setTimestamp()
                ],
                flags: [MessageFlags.Ephemeral]
            });

        // ── END / REROLL ──────────────────────────────────────────────────
        } else if (sub === 'end' || sub === 'reroll') {
            const messageId = interaction.options.getString('message_id')!;
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            const giveaway = await db.fetchOne(
                'SELECT * FROM giveaways WHERE message_id = ? AND guild_id = ?',
                messageId, interaction.guildId
            );
            if (!giveaway) {
                return interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(THEME.DANGER)
                        .setTitle('❌ Not Found')
                        .setDescription('No giveaway with that message ID was found in this server.')
                        .setFooter({ text: footerText('Giveaway') })]
                });
            }

            try {
                const channel  = await interaction.guild!.channels.fetch(giveaway.channel_id) as TextChannel;
                const message  = await channel.messages.fetch(messageId);
                const reaction = message.reactions.cache.get('🎉');

                if (!reaction) {
                    return interaction.editReply({ content: '❌ No 🎉 reactions found — nobody entered.' });
                }

                const users    = await reaction.users.fetch();
                const eligible = [...users.filter(u => !u.bot).values()];

                if (eligible.length === 0) {
                    return interaction.editReply({ content: '❌ No eligible entries after filtering bots.' });
                }

                const winnerCount = Math.min(giveaway.winners, eligible.length);

                // Fisher-Yates shuffle for true randomness
                for (let i = eligible.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
                }

                const selected  = eligible.slice(0, winnerCount);
                const mentions  = selected.map(w => `<@${w.id}>`).join(', ');
                const isReroll  = sub === 'reroll';

                const resultEmbed = new EmbedBuilder()
                    .setColor(isReroll ? THEME.WARNING : THEME.SUCCESS)
                    .setTitle(isReroll ? '🔄 Giveaway Rerolled' : '🎉 Giveaway Ended!')
                    .setDescription(
                        `> **${giveaway.prize}**\n\n` +
                        `🏆 **Winner${winnerCount !== 1 ? 's' : ''}:** ${mentions}\n\n` +
                        `Congratulations${winnerCount !== 1 ? ' to all winners' : ''}! 🎊`
                    )
                    .addFields(
                        { name: '📊 Entries', value: `${eligible.length}`, inline: true },
                        { name: '🏆 Winners', value: `${winnerCount}`,     inline: true },
                    )
                    .setFooter({ text: footerText(isReroll ? 'Giveaway Reroll' : 'Giveaway') })
                    .setTimestamp();

                await channel.send({ content: `🎉 Congratulations ${mentions}!`, embeds: [resultEmbed] });

                if (!isReroll) {
                    await db.execute(
                        'UPDATE giveaways SET ended = TRUE, winner_ids = ? WHERE message_id = ?',
                        selected.map(w => w.id).join(','), messageId
                    );
                }

                await interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(THEME.SUCCESS)
                        .setTitle('✅ Done')
                        .setDescription(`Winner${winnerCount !== 1 ? 's' : ''}: ${mentions}`)
                        .setFooter({ text: footerText('Giveaway') })]
                });

            } catch (err) {
                await interaction.editReply({ content: `❌ Failed to process giveaway: ${err}` });
            }
        }
    }
};

export default command;
