import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { ModerationService } from '../services/moderationService';
import { config } from '../core/config';

export default {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Tactical moderation operations.')
        .addSubcommand(sub =>
            sub.setName('kick')
                .setDescription('Eject a member from the server.')
                .addUserOption(opt => opt.setName('member').setDescription('The member to eject.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ejection.'))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'kick') {
            const member = interaction.options.getMember('member') as any;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!member) return interaction.reply({ content: '❌ Member not found.', ephemeral: true });

            if (member.roles.highest.position >= (interaction.member as any).roles.highest.position) {
                return interaction.reply({ content: '❌ Insufficient Authority: Cannot eject a member with superior or equal rank.', ephemeral: true });
            }

            try {
                await member.kick(reason);
                const caseId = await ModerationService.createCase(
                    interaction.guildId!,
                    member.id,
                    interaction.user.id,
                    'kick',
                    reason
                );

                const embed = new EmbedBuilder()
                    .setTitle('✅ Ejection Complete')
                    .setDescription(`Ejected **${member.user.tag}** (Case #${caseId})`)
                    .setColor(0x2ecc71)
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                await interaction.reply({ content: `❌ Ejection Failed: ${error}`, ephemeral: true });
            }
        }
    }
};
