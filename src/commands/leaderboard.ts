import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('📊 View the top-tier operative rankings.')
        .addSubcommand(sub => 
            sub.setName('server')
               .setDescription('Display the top 10 operatives in this sector.')
        )
        .addSubcommand(sub => 
            sub.setName('global')
               .setDescription('Display the Top 100 operatives across the global network.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'server') {
            // Since we don't have a guild_id in the users table currently, we filter by members in the cache
            // In a larger system, we'd add guild_id to the users table.
            const members = await interaction.guild!.members.fetch();
            const memberIds = Array.from(members.keys());
            
            // This is a bit heavy for large servers, but works for the current schema
            const users = await db.fetchAll(`
                SELECT user_id, level, xp FROM users 
                WHERE user_id IN (${memberIds.join(',')})
                ORDER BY level DESC, xp DESC 
                LIMIT 10
            `);

            const embed = new EmbedBuilder()
                .setTitle(`📊 SECTOR LEADERBOARD: ${interaction.guild!.name}`)
                .setColor(0x3498db)
                .setDescription(users.length > 0 
                    ? users.map((u, i) => `**#${i + 1}** <@${u.user_id}> - Level **${u.level}** (${u.xp} XP)`).join('\n')
                    : 'No intelligence data recorded for this sector.')
                .setFooter({ text: 'Astra Intelligence System' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'global') {
            const users = await db.fetchAll('SELECT user_id, level, xp FROM users ORDER BY level DESC, xp DESC LIMIT 10');

            const embed = new EmbedBuilder()
                .setTitle('🌎 GLOBAL APEX 100: Top Operatives')
                .setColor(0xf1c40f)
                .setDescription(users.length > 0
                    ? users.map((u, i) => `**#${i + 1}** <@${u.user_id}> - Level **${u.level}** (${u.xp} XP)`).join('\n')
                    : 'Global network diagnostics returned no data.')
                .setFooter({ text: 'Astra Global Network' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
