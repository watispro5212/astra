import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { AstraClient } from '../bot';
import { Command } from '../types';

const command: Command = {
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription('🛠️ Administrator Tactical Utilities.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('sync')
                .setDescription('Synchronize application commands.')
                .addStringOption(opt =>
                    opt.setName('scope')
                        .setDescription('The synchronization scope.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Guild (Fast)', value: 'guild' },
                            { name: 'Global (Delayed)', value: 'global' },
                            { name: 'Clear All', value: 'clear' }
                        )
                )
        )
        .addSubcommand(sub =>
            sub.setName('ping')
                .setDescription('Check system latency.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const client = interaction.client as AstraClient;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'sync') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const scope = interaction.options.getString('scope') as 'global' | 'guild' | 'clear';

            try {
                const count = await client.syncCommands(scope);
                
                const embed = new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('✅ Synchronization Complete')
                    .setDescription(`Scope: \`${scope}\`\nCommands Processed: \`${count}\``)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (err) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('❌ Synchronization Failed')
                    .setDescription(`\`\`\`${err}\`\`\``);
                
                await interaction.editReply({ embeds: [errorEmbed] });
            }
        } else if (subcommand === 'ping') {
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🛰️ System Latency')
                .addFields(
                    { name: 'API Latency', value: `\`${client.ws.ping}ms\``, inline: true },
                    { name: 'Uptime', value: `<t:${Math.floor((Date.now() - client.uptime!) / 1000)}:R>`, inline: true }
                );
            
            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }
    }
};

export default command;
