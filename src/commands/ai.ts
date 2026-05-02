import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { AI_MODELS, AIService } from '../services/aiService';
import { THEME, VERSION, footerText } from '../core/constants';
import { config } from '../core/config';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('🤖 AI Settings: Choose your AI model.')
        .setDMPermission(true)
        .addSubcommand(sub => 
            sub.setName('model')
               .setDescription('🤖 Choose which AI you want to talk to.')
               .addStringOption(opt => 
                   opt.setName('choice')
                      .setDescription('The AI model to use.')
                      .setRequired(true)
                      .addChoices(
                          ...AI_MODELS.map(m => ({ name: m.name, value: m.id }))
                      )
               )
        )
        .addSubcommand(sub =>
            sub.setName('info')
               .setDescription('📊 See info about the different AI models.')
        )
        .addSubcommand(sub =>
            sub.setName('status')
               .setDescription('📡 Check if the AI is working.')
        )
        .addSubcommand(sub =>
            sub.setName('owner')
               .setDescription('👑 Owner-only: Set a custom system prompt (DM only).')
               .addStringOption(opt =>
                   opt.setName('prompt')
                      .setDescription('Custom system prompt for your AI.')
                      .setRequired(true)
                      .setMaxLength(2000)
               )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'model') {
            const modelId = interaction.options.getString('choice')!;
            const success = await AIService.setUserModel(userId, modelId);
            const model = AI_MODELS.find(m => m.id === modelId);

            if (!success) {
                return interaction.reply({ content: '❌ **Error**: Failed to update your AI model choice.', flags: [MessageFlags.Ephemeral] });
            }

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('🤖 AI MODEL UPDATED')
                .setDescription(`Your AI is now using **${model?.name}**.`)
                .addFields(
                    { name: '🧠 Model ID', value: `\`${modelId}\``, inline: true },
                    { name: '⚡ What it does', value: model?.description || 'N/A', inline: true }
                )
                .setFooter({ text: footerText('AI') })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } else if (subcommand === 'info') {
            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🤖 ASTRA AI MODELS')
                .setDescription('Astra supports multiple AI models for you to talk to.')
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/3655/3655611.png');

            for (const model of AI_MODELS) {
                embed.addFields({
                    name: model.name,
                    value: `\`ID: ${model.id}\`\n${model.description}`,
                    inline: false
                });
            }

            embed.setFooter({ text: footerText('AI') }).setTimestamp();
            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } else if (subcommand === 'status') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            const results = await AIService.checkKeys();
            
            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('📡 AI SYSTEM STATUS')
                .setDescription(`Current status of our AI systems.`)
                .setTimestamp();

            for (const res of results) {
                const icon = res.status === 'ACTIVE' ? '✅' : res.status === 'QUOTA' ? '⚠️' : '❌';
                embed.addFields({
                    name: `${icon} System ${res.index}`,
                    value: `**Status**: ${res.status}\n**Key**: \`${config.aiApiKeys[res.index].substring(0, 8)}...***\n**Report**: \`${res.message.substring(0, 100)}\``,
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [embed] });
        } else if (subcommand === 'owner') {
            // Owner-only feature - DM only
            if (userId !== config.ownerId) {
                return interaction.reply({ 
                    content: '❌ **This command is owner-only.**', 
                    flags: [MessageFlags.Ephemeral] 
                });
            }

            if (!interaction.inRawGuild()) {
                return interaction.reply({ 
                    content: '❌ **Owner commands only work in DMs.** Open a DM with me and try again.', 
                    flags: [MessageFlags.Ephemeral] 
                });
            }

            const customPrompt = interaction.options.getString('prompt')!;
            await AIService.setCustomSystemPrompt(userId, customPrompt);

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('👑 CUSTOM AI PROMPT SET')
                .setDescription('Your AI will now use your custom system prompt.')
                .addFields(
                    { name: '📝 Prompt Preview', value: customPrompt.substring(0, 1024), inline: false }
                )
                .setFooter({ text: footerText('AI') })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }
    }
};

export default command;
