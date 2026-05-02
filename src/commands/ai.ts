import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { AI_MODELS, DEFAULT_AI_MODEL, AIService } from '../services/aiService';
import { THEME, footerText } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('🤖 Manage your AI settings, model, and prompt.')
        .setDMPermission(true)
        .addSubcommand(sub =>
            sub.setName('customize')
               .setDescription('Update your AI model and/or custom prompt.')
               .addStringOption(opt =>
                   opt.setName('model')
                      .setDescription('Choose the AI model you want to use.')
                      .setRequired(false)
                      .addChoices(
                          ...AI_MODELS.map(m => ({ name: m.name, value: m.id }))
                      )
               )
               .addStringOption(opt =>
                   opt.setName('prompt')
                      .setDescription('Set a custom system prompt for the AI.')
                      .setRequired(false)
                      .setMaxLength(2000)
               )
               .addBooleanOption(opt =>
                   opt.setName('reset')
                      .setDescription('Reset your AI settings back to defaults.')
                      .setRequired(false)
               )
        )
        .addSubcommand(sub =>
            sub.setName('settings')
               .setDescription('View your current AI configuration.')
        )
        .addSubcommand(sub =>
            sub.setName('info')
               .setDescription('📊 See info about the AI models available.')
        )
        .addSubcommand(sub =>
            sub.setName('status')
               .setDescription('📡 Check the health of the AI service keys.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'customize') {
            const modelId = interaction.options.getString('model');
            const customPrompt = interaction.options.getString('prompt');
            const reset = interaction.options.getBoolean('reset');

            if (!modelId && !customPrompt && !reset) {
                return interaction.reply({
                    content: '❌ You must choose at least one option: `model`, `prompt`, or `reset`.',
                    flags: [MessageFlags.Ephemeral]
                });
            }

            if (reset) {
                await AIService.resetUserSettings(userId);
                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('♻️ AI SETTINGS RESET')
                    .setDescription('Your AI settings have been restored to the default model and prompt.')
                    .setFooter({ text: footerText('AI') })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            }

            if (modelId) {
                const success = await AIService.setUserModel(userId, modelId);
                if (!success) {
                    return interaction.reply({ content: '❌ Invalid model choice.', flags: [MessageFlags.Ephemeral] });
                }
            }

            if (customPrompt) {
                await AIService.setCustomSystemPrompt(userId, customPrompt);
            }

            const fields = [];
            if (modelId) {
                const model = AI_MODELS.find(m => m.id === modelId);
                fields.push(
                    { name: '🧠 Model Selected', value: `**${model?.name ?? modelId}**`, inline: true },
                    { name: '⚙️ Model ID', value: `\`${modelId}\``, inline: true }
                );
            }
            if (customPrompt) {
                fields.push({ name: '📝 Prompt Preview', value: customPrompt.substring(0, 1024), inline: false });
            }

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('🤖 AI CUSTOMIZATION UPDATED')
                .setDescription('Your AI settings were updated successfully.')
                .addFields(fields)
                .setFooter({ text: footerText('AI') })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } else if (subcommand === 'settings') {
            const settings = await AIService.getUserSettings(userId);
            const selectedModelId = settings?.selected_model || DEFAULT_AI_MODEL;
            const model = AI_MODELS.find(m => m.id === selectedModelId);

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🤖 YOUR AI SETTINGS')
                .addFields(
                    { name: '🧠 Selected Model', value: `**${model?.name ?? selectedModelId}**`, inline: false },
                    { name: '⚙️ Model ID', value: `\`${selectedModelId}\``, inline: false },
                    { name: '📝 System Prompt', value: settings?.system_prompt ? settings.system_prompt.substring(0, 1024) : 'Using the default AI prompt.', inline: false }
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
                .setDescription('Current status of the AI service keys.')
                .setTimestamp();

            for (const res of results) {
                const icon = res.status === 'ACTIVE' ? '✅' : res.status === 'QUOTA' ? '⚠️' : '❌';
                embed.addFields({
                    name: `${icon} System ${res.index}`,
                    value: `**Status**: ${res.status}\n**Report**: \`${res.message.substring(0, 100)}\``,
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [embed] });
        }
    }
};

export default command;
