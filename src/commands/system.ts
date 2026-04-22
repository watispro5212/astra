import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    PermissionFlagsBits,
    TextChannel
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import logger from '../core/logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('system')
        .setDescription('⚙️ Core system operations.')
        .addSubcommand(sub =>
            sub.setName('update')
                .setDescription('View the latest Astra intelligence and system updates.')
        )
        .addSubcommand(sub =>
            sub.setName('alert')
                .setDescription('Broadcast a system-wide alert (Owner Only).')
                .addStringOption(opt => opt.setName('message').setDescription('The transmission content.').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'update') {
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🚀 Astra v6.3.0: Titan Update')
                .setDescription('The Titan update introduces global community engagement systems, bridging the gap between utility and member retention.')
                .addFields(
                    { name: '📊 Astra Intelligence', value: '• **Leveling**: Earn XP by chatting and track progression with `/rank`.\n• **Anti-Spam**: Built-in 60s cooldown to ensure authentic engagement.' },
                    { name: '💰 Astra Fiscal', value: '• **Economy**: Global credit system with daily rewards (`/economy daily`).\n• **Transfers**: Peer-to-peer capital exchange with `/economy pay`.' },
                    { name: '📡 Shard Telemetry', value: '• **Status Rotator**: Real-time presence updates showing shard health and server counts.' },
                    { name: '🌐 Web Terminal', value: '[Visit Dashboard](https://astrabot-1n54.onrender.com)' }
                )
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .setFooter({ text: 'Astra Tactical Systems • Release 6.3.0' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'alert') {
            // Owner Check
            if (interaction.user.id !== '1320058519642177668') {
                await interaction.reply({ content: '❌ Access Denied: Administrator clearance required.', ephemeral: true });
                return;
            }

            const message = interaction.options.getString('message')!;
            await interaction.deferReply({ ephemeral: true });

            let successCount = 0;
            const guilds = interaction.client.guilds.cache;

            const alertEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('⚠️ SYSTEM-WIDE ALERT')
                .setDescription(message)
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .setFooter({ text: 'Official Transmission from Astra Core' })
                .setTimestamp();

            // Broadcast to first available channel in each guild (simple approach)
            for (const guild of guilds.values()) {
                try {
                    // Try to find a log channel from our DB first
                    const guildConfig = await db.fetchOne("SELECT log_channel_id FROM guilds WHERE guild_id = ?", guild.id);
                    let channel = null;

                    if (guildConfig?.log_channel_id) {
                        channel = await guild.channels.fetch(guildConfig.log_channel_id).catch(() => null);
                    }

                    if (!channel) {
                        channel = guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild.members.me!).has(PermissionFlagsBits.SendMessages));
                    }

                    if (channel && channel.isTextBased()) {
                        await (channel as any).send({ embeds: [alertEmbed] });
                        successCount++;
                    }
                } catch (err) {
                    logger.error(`Alert failed for guild ${guild.id}: ${err}`);
                }
            }

            await interaction.editReply({ content: `✅ Alert broadcast complete. Reached **${successCount}** sectors (guilds).` });
        }
    }
};

export default command;
