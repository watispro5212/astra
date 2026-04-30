import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    ChannelType,
    MessageFlags 
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leveling_config')
        .setDescription('⚙️ Manage the Astra Intelligence Matrix configuration.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub.setName('channel')
                .setDescription('🛰️ Set the official frequency for Level-Up transmissions.')
                .addChannelOption(opt => opt.setName('channel').setDescription('Target channel.').addChannelTypes(ChannelType.GuildText).setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('reward')
                .setDescription('🎖️ Bind a role milestone to a specific intelligence level.')
                .addIntegerOption(opt => opt.setName('level').setDescription('Target Level.').setRequired(true))
                .addRoleOption(opt => opt.setName('role').setDescription('Role to grant.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('remove_reward')
                .setDescription('❌ Purge a role milestone from the intelligence matrix.')
                .addIntegerOption(opt => opt.setName('level').setDescription('Level milestone to remove.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('📊 Analyze current intelligence matrix configuration.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'channel') {
            const channel = interaction.options.getChannel('channel')!;
            
            await db.execute('INSERT INTO leveling_configs (guild_id, announcement_channel_id) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET announcement_channel_id = ?', 
                guild.id, channel.id, channel.id);

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('📡 TRANSMISSION FREQUENCY UPDATED')
                .setDescription(`Level-Up reports will now be synchronized to <#${channel.id}>.`)
                .setFooter({ text: 'Astra Matrix Core' });

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } else if (subcommand === 'reward') {
            const level = interaction.options.getInteger('level')!;
            const role = interaction.options.getRole('role')!;

            await db.execute('INSERT INTO level_roles (guild_id, level, role_id) VALUES (?, ?, ?) ON CONFLICT(guild_id, level) DO UPDATE SET role_id = ?', 
                guild.id, level, role.id, role.id);

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('🎖️ MILESTONE BIND SUCCESS')
                .setDescription(`Members reaching **Level ${level}** will now be authorized for the <@&${role.id}> role.`)
                .setFooter({ text: 'Astra Intelligence Matrix' });

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } else if (subcommand === 'remove_reward') {
            const level = interaction.options.getInteger('level')!;

            await db.execute('DELETE FROM level_roles WHERE guild_id = ? AND level = ?', guild.id, level);

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle('❌ MILESTONE DECOMMISSIONED')
                .setDescription(`The reward for **Level ${level}** has been purged from the matrix.`)
                .setFooter({ text: 'Astra Matrix Core' });

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

        } else if (subcommand === 'view') {
            const config = await db.fetchOne('SELECT announcement_channel_id FROM leveling_configs WHERE guild_id = ?', guild.id);
            const roles = await db.fetchAll('SELECT level, role_id FROM level_roles WHERE guild_id = ? ORDER BY level ASC', guild.id);

            const embed = new EmbedBuilder()
                .setTitle('📊 INTELLIGENCE MATRIX DIAGNOSTICS')
                .setColor(0x3498db)
                .addFields(
                    { name: '🛰️ Announcement Frequency', value: config ? `<#${config.announcement_channel_id}>` : '`DEFAULT` (Current Channel)', inline: true },
                    { name: '🎖️ Registered Milestones', value: roles.length.toString(), inline: true }
                );

            if (roles.length > 0) {
                const rewardList = roles.map(r => `**LVL ${r.level}** — <@&${r.role_id}>`).join('\n');
                embed.addFields({ name: '🏆 MILESTONE REWARDS', value: rewardList.length > 1024 ? rewardList.substring(0, 1021) + '...' : rewardList });
            } else {
                embed.addFields({ name: '🏆 MILESTONE REWARDS', value: '*No rewards bound to current matrix.*' });
            }

            embed.setFooter({ text: `Astra Leveling Config` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
