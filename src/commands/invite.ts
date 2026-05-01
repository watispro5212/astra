import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import { THEME, VERSION, CODENAME, footerText } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('🔗 Get the links to add Astra to your server or profile.')
        .setDMPermission(true),

    async execute(interaction: ChatInputCommandInteraction) {
        const clientId = interaction.client.user.id;
        const serverInvite  = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot+applications.commands`;
        const profileInvite = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&integration_type=1&scope=applications.commands`;

        const embed = new EmbedBuilder()
            .setColor(THEME.PRIMARY)
            .setAuthor({ name: `Astra ${VERSION} ${CODENAME}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTitle('🚀 Add Astra to Your Server')
            .setDescription(
                `Bring moderation, economy, leveling, AI, giveaways, and a stock market to your community — **completely free.**\n\n` +
                `Choose the option that fits you best:`
            )
            .addFields(
                {
                    name: '🏠 Server Install',
                    value: 'Adds Astra to a server you manage. All commands become available to everyone in that server.',
                    inline: false
                },
                {
                    name: '👤 Profile Install',
                    value: 'Adds Astra to your personal account. Use economy, AI, and utility commands in any server or DM — no server install needed.',
                    inline: false
                },
                {
                    name: '📚 Resources',
                    value: '[Website](https://watispro5212.github.io/astra/) • [Commands](https://watispro5212.github.io/astra/commands.html) • [Docs](https://watispro5212.github.io/astra/docs.html) • [Support](https://watispro5212.github.io/astra/support.html)',
                    inline: false
                }
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: footerText('Invite') })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Add to Server')
                .setStyle(ButtonStyle.Link)
                .setEmoji('🏠')
                .setURL(serverInvite),
            new ButtonBuilder()
                .setLabel('Add to Profile')
                .setStyle(ButtonStyle.Link)
                .setEmoji('👤')
                .setURL(profileInvite),
            new ButtonBuilder()
                .setLabel('Website')
                .setStyle(ButtonStyle.Link)
                .setEmoji('🌐')
                .setURL('https://watispro5212.github.io/astra/')
        );

        await interaction.reply({ embeds: [embed], components: [row], flags: [MessageFlags.Ephemeral] });
    }
};

export default command;
