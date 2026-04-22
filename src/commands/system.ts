import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    PermissionFlagsBits,
    TextChannel
} from 'discord.js';
import { Command } from '../types';
import { config } from '../core/config';
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
                .setTitle('🚀 Astra v7.0.0: Nova Update')
                .setDescription('Nova is the most comprehensive Astra release to date — introducing ticketing, giveaways, welcome systems, expanded moderation, and a full economy overhaul.')
                .addFields(
                    { name: '🎫 Ticket System', value: '• `/ticket create` — Open a private support ticket with staff.\n• `/ticket close/add/remove` — Full ticket lifecycle management.' },
                    { name: '🎉 Giveaway Engine', value: '• `/giveaway start` — Host timed giveaways with reaction entry.\n• `/giveaway end/reroll` — Draw or redraw winners at any time.' },
                    { name: '👋 Welcome System', value: '• `/welcome set-channel/set-message/set-role` — Fully configurable welcome & auto-role.\n• `/welcome test` — Preview your configuration instantly.' },
                    { name: '🛡️ Moderation+', value: '• `/mod warn/unban` — New warn and unban protocols.\n• `/mod case/history` — Full case management per operative.' },
                    { name: '💰 Economy+', value: '• `/economy leaderboard` — Top 10 richest operatives.\n• `/economy work` — Hourly credit generation protocol.' },
                    { name: '📊 Leveling+', value: '• `/leveling leaderboard` — Global intelligence ranking.\n• Visual progress bars in `/leveling rank`.' },
                    { name: '🌐 Web Terminal', value: '[Visit Dashboard](https://astrabot-1n54.onrender.com)' }
                )
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .setFooter({ text: 'Astra Tactical Systems • Nova Release 7.0.0' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'alert') {
            // Owner Check
            if (interaction.user.id !== config.ownerId) {
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
