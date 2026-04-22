import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    version as djsVersion 
} from 'discord.js';
import { Command } from '../types';
import * as os from 'os';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('📊 Access sector intelligence and system diagnostics.')
        .addSubcommand(sub =>
            sub.setName('avatar')
                .setDescription('🛰️ Extract high-fidelity avatar data.')
                .addUserOption(opt => opt.setName('target').setDescription('The target to analyze.'))
        )
        .addSubcommand(sub =>
            sub.setName('stats')
                .setDescription('📡 System performance and network diagnostics.')
        )
        .addSubcommand(sub =>
            sub.setName('user')
                .setDescription('👤 Detailed intelligence report on a member.')
                .addUserOption(opt => opt.setName('target').setDescription('The member to analyze.'))
        )
        .addSubcommand(sub =>
            sub.setName('server')
                .setDescription('🏰 Sector configuration and population statistics.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'avatar') {
            const user = interaction.options.getUser('target') || interaction.user;
            const avatarUrl = user.displayAvatarURL({ size: 2048 });

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`🖼️ AVATAR MATRIX: ${user.username.toUpperCase()}`)
                .setImage(avatarUrl)
                .setDescription(`[Download High-Res](${avatarUrl})`)
                .setFooter({ text: 'Astra Intelligence Agency' });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'stats') {
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor(uptime / 3600) % 24;
            const minutes = Math.floor(uptime / 60) % 60;

            const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
            const totalMem = os.totalmem() / 1024 / 1024 / 1024;
            
            const shardId = interaction.client.shard?.ids[0] ?? 0;
            const totalShards = interaction.client.shard?.count ?? 1;

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('📡 SYSTEM DIAGNOSTICS')
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .addFields(
                    { name: '🛰️ NETWORK TOPOLOGY', value: `\`\`\`Shard: ${shardId + 1}/${totalShards}\nLatency: ${interaction.client.ws.ping}ms\nGuilds: ${interaction.client.guilds.cache.size}\`\`\``, inline: true },
                    { name: '💻 CORE ALLOCATION', value: `\`\`\`RAM: ${memUsage.toFixed(2)}MB\nCPU: ${os.loadavg()[0].toFixed(2)}%\nUptime: ${days}d ${hours}h ${minutes}m\`\`\``, inline: true },
                    { name: '🤖 VERSION CONTROL', value: `\`\`\`Engine: v7.1.0 Omega\nLibrary: discord.js v${djsVersion}\nHost: ${os.hostname()}\`\`\``, inline: false }
                )
                .setFooter({ text: 'Astra Global Infrastructure • All systems nominal' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'user') {
            const user = interaction.options.getUser('target') || interaction.user;
            const member = await guild.members.fetch(user.id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`👤 INTELLIGENCE REPORT: ${user.username.toUpperCase()}`)
                .setThumbnail(user.displayAvatarURL({ size: 512 }))
                .addFields(
                    { name: '🆔 IDENTIFICATION', value: `\`${user.id}\``, inline: true },
                    { name: '📅 RECRUITMENT', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
                    { name: '🎖️ AUTHORITY', value: member?.roles.highest.name || 'Citizen', inline: true }
                );

            if (member) {
                const roles = member.roles.cache
                    .filter(r => r.id !== guild.id)
                    .map(r => r.name)
                    .join(', ') || 'No specialized clearance';

                embed.addFields(
                    { name: '🛰️ SECTOR ENTRY', value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`, inline: true },
                    { name: '📜 CLEARANCE MATRIX', value: `\`\`\`${roles.length > 100 ? roles.substring(0, 97) + '...' : roles}\`\`\``, inline: false }
                );
            }

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'server') {
            const owner = await guild.fetchOwner();
            const channels = guild.channels.cache;

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`🏰 SECTOR PROFILE: ${guild.name.toUpperCase()}`)
                .setThumbnail(guild.iconURL({ size: 512 }))
                .addFields(
                    { name: '🛰️ CORE TELEMETRY', value: `\`\`\`ID: ${guild.id}\nOwner: ${owner.user.tag}\nCreated: ${guild.createdAt.toLocaleDateString()}\nRegion: ${guild.preferredLocale}\`\`\``, inline: false },
                    { name: '👥 POPULATION', value: `\`\`\`Total: ${guild.memberCount}\nBots: ${guild.members.cache.filter(m => m.user.bot).size}\nHumans: ${guild.memberCount - guild.members.cache.filter(m => m.user.bot).size}\`\`\``, inline: true },
                    { name: '📐 INFRASTRUCTURE', value: `\`\`\`Text: ${channels.filter(c => c.type === 0).size}\nVoice: ${channels.filter(c => c.type === 2).size}\nRoles: ${guild.roles.cache.size}\`\`\``, inline: true },
                    { name: '✨ SECTOR STATUS', value: `\`\`\`Boosts: ${guild.premiumSubscriptionCount || 0} (Tier ${guild.premiumTier})\nVerify: ${guild.verificationLevel}\`\`\``, inline: false }
                )
                .setFooter({ text: 'Astra Sector Diagnostics' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
};
    }
};

export default command;
