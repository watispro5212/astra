import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { THEME, VERSION, PROTOCOL } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('🔗 Obtain sector access codes for Astra.')
        .setDMPermission(false),

    async execute(interaction: ChatInputCommandInteraction) {
        const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;

        const embed = new EmbedBuilder()
            .setTitle('📡 ASTRA SECTOR ACCESS')
            .setColor(THEME.PRIMARY)
            .setDescription('Deploy Astra to your sector to initialize high-performance automation and tactical telemetry.')
            .addFields(
                { name: '🔗 Deployment Link', value: `[Initialize Deployment](${inviteUrl})`, inline: false },
                { name: '🛠️ Support Sector', value: '[Access Support](https://watispro5212.github.io/astra/support.html)', inline: true },
                { name: '📜 Tactical Manual', value: '[Read Docs](https://watispro5212.github.io/astra/docs.html)', inline: true }
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: `Astra ${VERSION} ${PROTOCOL} • High-Performance Automation` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    }
};

export default command;
