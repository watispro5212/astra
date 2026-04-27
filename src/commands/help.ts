import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { THEME, VERSION } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('🔍 Access the interactive V8 command registry.'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const embed = new EmbedBuilder()
            .setColor(THEME.PRIMARY)
            .setTitle('📡 ASTRA V8 INTERACTIVE SECRECY')
            .setDescription('Select a Sector below to view its specific active commands. This secure terminal will power down after 60 seconds of inactivity.')
            .setThumbnail(interaction.client.user?.displayAvatarURL()!)
            .setFooter({ text: `Astra Quantum Engine • v${VERSION}` });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category_select')
            .setPlaceholder('Select a Tactical Sector...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Core & Admin')
                    .setDescription('System setup and critical architecture')
                    .setEmoji('⚙️')
                    .setValue('core'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Industrial Economy')
                    .setDescription('Credits, mining, syndicates, and shop')
                    .setEmoji('💎')
                    .setValue('eco'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Network Moderation')
                    .setDescription('Bans, warnings, sweeps, filtering')
                    .setEmoji('🛡️')
                    .setValue('mod'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Utility & Fun')
                    .setDescription('Tickets, giveaways, user stats')
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
                newEmbed.setTitle('⚙️ Core & Admin Protocol');
                newEmbed.addFields(
                    { name: '`/setup`', value: 'Initialize the guild structure.' },
                    { name: '`/system`', value: 'Control backend modules and logging.' },
                    { name: '`/dev`', value: 'High-level deployment commands.' },
                    { name: '`/ai`', value: 'Configure the Neural Sentinel Model.' }
                );
            } else if (val === 'eco') {
                newEmbed.setTitle('💎 Industrial Economy Protocol');
                newEmbed.addFields(
                    { name: '`/economy`', value: 'Work, mine, rob, daily, slots, and stats.' },
                    { name: '`/syndicate`', value: 'Found a syndicate and pool your resources.' },
                    { name: '`/shop`', value: 'Purchase upgrades and boosts.' },
                    { name: '`/stockmarket`', value: 'Invest in dynamic universal stocks.' }
                );
            } else if (val === 'mod') {
                newEmbed.setTitle('🛡️ Network Moderation Protocol');
                newEmbed.addFields(
                    { name: '`/moderation warn`', value: 'Warn a rogue operative.' },
                    { name: '`/moderation lock`', value: 'Lock down a channel.' },
                    { name: '`/moderation sweep`', value: 'Purge messages instantly.' }
                );
            } else if (val === 'util') {
                newEmbed.setTitle('🛠️ Utility & Fun Protocol');
                newEmbed.addFields(
                    { name: '`/info`', value: 'View sector diagnostics and stats.' },
                    { name: '`/ticket`', value: 'Deploy private support panels.' },
                    { name: '`/giveaway`', value: 'Host secure airdrops and giveaways.' },
                    { name: '`/leveling`', value: 'Check your progression rank.' }
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
