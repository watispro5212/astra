import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { THEME, VERSION } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('🔍 Access the interactive command list.'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const embed = new EmbedBuilder()
            .setColor(THEME.PRIMARY)
            .setTitle('📡 ASTRA HELP CENTER')
            .setDescription('Select a category below to see its commands. This menu will expire in 60 seconds.')
            .setThumbnail(interaction.client.user?.displayAvatarURL()!)
            .setFooter({ text: `Astra Help` });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category_select')
            .setPlaceholder('Select a category...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Core & Admin')
                    .setDescription('Server setup and basic settings')
                    .setEmoji('⚙️')
                    .setValue('core'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Economy')
                    .setDescription('Money, games, and shop')
                    .setEmoji('💎')
                    .setValue('eco'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Moderation')
                    .setDescription('Bans, warnings, and cleaning')
                    .setEmoji('🛡️')
                    .setValue('mod'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Utility')
                    .setDescription('Tickets, giveaways, and levels')
                    .setEmoji('🛠️')
                    .setValue('util')
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        const response = await interaction.editReply({ embeds: [embed], components: [row] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

        collector.on('collect', async i => {
            const val = i.values[0];
            const newEmbed = new EmbedBuilder().setColor(THEME.ACCENT).setTitle('📡 ASTRA CORE').setThumbnail(interaction.client.user?.displayAvatarURL()!);

            if (val === 'core') {
                newEmbed.setTitle('⚙️ Core & Admin');
                newEmbed.addFields(
                    { name: '`/setup`', value: 'Set up the server structure.' },
                    { name: '`/system`', value: 'Check bot settings and logs.' },
                    { name: '`/dev`', value: 'Developer-only commands.' },
                    { name: '`/ai`', value: 'Change AI settings.' }
                );
            } else if (val === 'eco') {
                newEmbed.setTitle('💎 Economy');
                newEmbed.addFields(
                    { name: '`/economy`', value: 'Work, mine, rob, daily, and games.' },
                    { name: '`/syndicate`', value: 'Start a group and share money.' },
                    { name: '`/shop`', value: 'Buy items and boosts.' },
                    { name: '`/stockmarket`', value: 'Invest your money in stocks.' }
                );
            } else if (val === 'mod') {
                newEmbed.setTitle('🛡️ Moderation');
                newEmbed.addFields(
                    { name: '`/moderation warn`', value: 'Warn a member.' },
                    { name: '`/moderation lock`', value: 'Lock down a channel.' },
                    { name: '`/moderation sweep`', value: 'Clean up messages.' }
                );
            } else if (val === 'util') {
                newEmbed.setTitle('🛠️ Utility');
                newEmbed.addFields(
                    { name: '`/info`', value: 'View bot information and stats.' },
                    { name: '`/ticket`', value: 'Open a help ticket.' },
                    { name: '`/giveaway`', value: 'Host a giveaway.' },
                    { name: '`/leveling`', value: 'Check your level and rank.' }
                );
            }

            await i.update({ embeds: [newEmbed], components: [row] });
        });

        collector.on('end', () => {
            selectMenu.setDisabled(true);
            interaction.editReply({ components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)] }).catch(() => {});
        });
    }
};

export default command;
