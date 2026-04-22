import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    TextChannel
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('🎉 Host and manage community giveaways.')
        .addSubcommand(sub =>
            sub.setName('start')
                .setDescription('Start a new giveaway in this channel.')
                .addStringOption(opt => opt.setName('prize').setDescription('What is being given away?').setRequired(true))
                .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes.').setRequired(true).setMinValue(1).setMaxValue(10080))
                .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners (default 1).').setMinValue(1).setMaxValue(10))
        )
        .addSubcommand(sub =>
            sub.setName('end')
                .setDescription('End a giveaway early and draw winners.')
                .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the giveaway.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('reroll')
                .setDescription('Reroll the winners of a completed giveaway.')
                .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the giveaway.').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'start') {
            const prize = interaction.options.getString('prize')!;
            const duration = interaction.options.getInteger('duration')!;
            const winners = interaction.options.getInteger('winners') ?? 1;
            const endsAt = new Date(Date.now() + duration * 60000);

            const embed = new EmbedBuilder()
                .setColor(0xf1c40f)
                .setTitle('🎉 GIVEAWAY')
                .setDescription(`**Prize:** ${prize}\n\nReact with 🎉 to enter!\n\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(endsAt.getTime() / 1000)}:R>`)
                .setFooter({ text: `Hosted by ${interaction.user.tag} • Astra Giveaway Engine v7.0.0` })
                .setTimestamp(endsAt);

            const channel = interaction.channel as TextChannel;
            const msg = await channel.send({ embeds: [embed] });
            await msg.react('🎉');

            await db.execute(
                'INSERT INTO giveaways (guild_id, channel_id, message_id, host_id, prize, winners, ends_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                interaction.guildId, interaction.channelId, msg.id, interaction.user.id, prize, winners, endsAt.toISOString()
            );

            await interaction.reply({ content: `✅ Giveaway started! [Jump to it](${msg.url})`, ephemeral: true });

        } else if (subcommand === 'end' || subcommand === 'reroll') {
            const messageId = interaction.options.getString('message_id')!;
            await interaction.deferReply({ ephemeral: true });

            const giveaway = await db.fetchOne(
                'SELECT * FROM giveaways WHERE message_id = ? AND guild_id = ?',
                messageId, interaction.guildId
            );
            if (!giveaway) {
                await interaction.editReply({ content: '❌ Giveaway not found in this sector.' });
                return;
            }

            try {
                const channel = await interaction.guild!.channels.fetch(giveaway.channel_id) as TextChannel;
                const message = await channel.messages.fetch(messageId);
                const reaction = message.reactions.cache.get('🎉');

                if (!reaction) {
                    await interaction.editReply({ content: '❌ No reactions found — no entries.' });
                    return;
                }

                const users = await reaction.users.fetch();
                const eligible = [...users.filter(u => !u.bot).values()];

                if (eligible.length === 0) {
                    await interaction.editReply({ content: '❌ No eligible entries after filtering bots.' });
                    return;
                }

                const winnerCount = Math.min(giveaway.winners, eligible.length);
                const shuffled = eligible.sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, winnerCount);
                const mentions = selected.map(w => `<@${w.id}>`).join(', ');

                const resultEmbed = new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle(subcommand === 'reroll' ? '🔄 Giveaway Rerolled' : '🎉 Giveaway Ended')
                    .setDescription(`**Prize:** ${giveaway.prize}\n**Winner(s):** ${mentions}\n\nCongratulations!`)
                    .setFooter({ text: 'Astra Giveaway Engine • v7.0.0' })
                    .setTimestamp();

                await channel.send({ content: mentions, embeds: [resultEmbed] });
                await db.execute(
                    'UPDATE giveaways SET ended = TRUE, winner_ids = ? WHERE message_id = ?',
                    selected.map(w => w.id).join(','), messageId
                );

                await interaction.editReply({ content: `✅ Done! Winners: ${mentions}` });
            } catch (err) {
                await interaction.editReply({ content: `❌ Failed to process giveaway: ${err}` });
            }
        }
    }
};

export default command;
