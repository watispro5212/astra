import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { AI_MODELS, AIService } from '../services/aiService';
import { THEME, VERSION } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('🤖 Neural Sentinel Configuration.')
        .addSubcommand(sub => 
            sub.setName('model')
               .setDescription('🛰️ Select your preferred AI intelligence model.')
               .addStringOption(opt => 
                   opt.setName('choice')
                      .setDescription('The neural model to interface with.')
                      .setRequired(true)
                      .addChoices(
                          ...AI_MODELS.map(m => ({ name: m.name, value: m.id }))
                      )
               )
        )
        .addSubcommand(sub =>
            sub.setName('info')
               .setDescription('📊 View details about available neural models.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'model') {
            const modelId = interaction.options.getString('choice')!;
            const success = await AIService.setUserModel(userId, modelId);
            const model = AI_MODELS.find(m => m.id === modelId);

            if (!success) {
                return interaction.reply({ content: '❌ **PROTOCOL ERROR**: Failed to update neural model preference.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('📡 NEURAL MODEL RECALIBRATED')
                .setDescription(`Your AI Sentinel has been successfully synchronized with the **${model?.name}** matrix.`)
                .addFields(
                    { name: '🧠 Model ID', value: `\`${modelId}\``, inline: true },
                    { name: '⚡ Capabilities', value: model?.description || 'N/A', inline: true }
                )
                .setFooter({ text: `Astra Neural Systems • ${VERSION}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } else if (subcommand === 'info') {
            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🤖 ASTRA NEURAL SENTINEL | MODELS')
                .setDescription('The Astra AI Sentinel supports multiple Titan-class models for DM interaction.')
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/3655/3655611.png');

            for (const model of AI_MODELS) {
                embed.addFields({
                    name: model.name,
                    value: `\`ID: ${model.id}\`\n${model.description}`,
                    inline: false
                });
            }

            embed.setFooter({ text: `Astra Neural Systems • v${VERSION}` }).setTimestamp();
            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }
    }
};

export default command;
