import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    ChannelType 
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leveling_config')
        .setDescription('⚙️ Manage the Astra Intelligence Matrix.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub.setName('channel')
                .setDescription('Set the official frequency for Level-Up transmissions.')
                .addChannelOption(opt => opt.setName('channel').setDescription('Target channel.').addChannelTypes(ChannelType.GuildText).setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('reward')
                .setDescription('Bind a role to a specific intelligence level.')
                .addIntegerOption(opt => opt.setName('level').setDescription('Target Level.').setRequired(true))
                .addRoleOption(opt => opt.setName('role').setDescription('Role to grant.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('Analyze current intelligence matrix configuration.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'channel') {
            const channel = interaction.options.getChannel('channel')!;
            
            const existing = await db.fetchOne('SELECT announcement_channel_id FROM leveling_configs WHERE guild_id = ?', guild.id);
            if (existing) {
                await db.execute('UPDATE leveling_configs SET announcement_channel_id = ? WHERE guild_id = ?', channel.id, guild.id);
            } else {
                await db.execute('INSERT INTO leveling_configs (guild_id, announcement_channel_id) VALUES (?, ?)', guild.id, channel.id);
            }

            await interaction.reply({
                content: `✅ **INTELLIGENCE SYNC**: Level-Up reports will now be transmitted to <#${channel.id}>.`,
                ephemeral: true
            });

        } else if (subcommand === 'reward') {
            const level = interaction.options.getInteger('level')!;
            const role = interaction.options.getRole('role')!;

            // Stricter checking for existing rewards to ensure SQLite compatibility
            const existing = await db.fetchOne('SELECT id FROM level_roles WHERE guild_id = ? AND level = ?', guild.id, level);
            
            if (existing) {
                await db.execute('UPDATE level_roles SET role_id = ? WHERE guild_id = ? AND level = ?', role.id, guild.id, level);
            } else {
                await db.execute('INSERT INTO level_roles (guild_id, level, role_id) VALUES (?, ?, ?)', guild.id, level, role.id);
            }

            await interaction.reply({
                content: `✅ **REWARD BIND**: Members reaching **Level ${level}** will now be granted the <@&${role.id}> role.`,
                ephemeral: true
            });

        } else if (subcommand === 'view') {
            const config = await db.fetchOne('SELECT announcement_channel_id FROM leveling_configs WHERE guild_id = ?', guild.id);
            const roles = await db.fetchAll('SELECT level, role_id FROM level_roles WHERE guild_id = ? ORDER BY level ASC', guild.id);

            const embed = new EmbedBuilder()
                .setTitle('📊 INTELLIGENCE MATRIX DIAGNOSTIC')
                .setColor(0x3498db)
                .addFields({ 
                    name: '📡 Announcement Frequency', 
                    value: config ? `<#${config.announcement_channel_id}>` : '`DEFAULT` (Current Channel)' 
                })
                .addFields({
                    name: '🏆 Milestone Rewards',
                    value: roles.length > 0 
                        ? roles.map(r => `**Level ${r.level}:** <@&${r.role_id}>`).join('\n')
                        : 'No rewards bound to current matrix.'
                })
                .setFooter({ text: 'Astra Intelligence Matrix v7.0.0' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
