import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('📡 Generate an invite link for Astra Omega.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;
        
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('🛰️ ASTRA MISSION CONTROL')
            .setDescription('Ready to deploy Astra to your sector? Use the protocols below.')
            .addFields(
                { name: '🔌 Bot Invite', value: `[Authorize Astra](${inviteUrl})`, inline: true },
                { name: '🌐 Official Website', value: '[Astra Hub](https://watispro5212.github.io/astra/)', inline: true },
                { name: '📜 Documentation', value: '[Technical Manual](https://watispro5212.github.io/astra/docs.html)', inline: true }
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: 'Astra v7.3.0 Omega • High-Performance Automation' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

export default command;
