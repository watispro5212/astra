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
        .setDescription('📊 Access system and user information.')
        .addSubcommand(sub =>
            sub.setName('avatar')
                .setDescription('View the high-fidelity avatar of a target.')
                .addUserOption(opt => opt.setName('target').setDescription('The target to analyze.'))
        )
        .addSubcommand(sub =>
            sub.setName('stats')
                .setDescription('View Astra system performance and diagnostics.')
        )
        .addSubcommand(sub =>
            sub.setName('user')
                .setDescription('View detailed intelligence on a member.')
                .addUserOption(opt => opt.setName('target').setDescription('The member to analyze.'))
        )
        .addSubcommand(sub =>
            sub.setName('server')
                .setDescription('View sector (server) configuration and statistics.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'avatar') {
            const user = interaction.options.getUser('target') || interaction.user;
            const avatarUrl = user.displayAvatarURL({ size: 1024 });

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`🖼️ Avatar Matrix: ${user.tag}`)
                .setImage(avatarUrl)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'stats') {
            const uptime = os.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor(uptime / 3600) % 24;
            const minutes = Math.floor(uptime / 60) % 60;

            const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
            const totalMem = os.totalmem() / 1024 / 1024 / 1024;

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('📡 Astra System Diagnostics')
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .addFields(
                    { name: '🤖 Client', value: `\`\`\`Tag: ${interaction.client.user?.tag}\nVersion: v6.3.0\nLibrary: discord.js v${djsVersion}\`\`\``, inline: false },
                    { name: '💻 System Host', value: `\`\`\`OS: ${os.type()} ${os.arch()}\nCPU: ${os.cpus()[0].model}\nRAM: ${memUsage.toFixed(2)} MB / ${totalMem.toFixed(2)} GB\`\`\``, inline: false },
                    { name: '📊 Metrics', value: `\`\`\`Guilds: ${interaction.client.guilds.cache.size}\nLatency: ${interaction.client.ws.ping}ms\nUptime: ${days}d ${hours}h ${minutes}m\`\`\``, inline: false }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'user') {
            const user = interaction.options.getUser('target') || interaction.user;
            const member = await guild.members.fetch(user.id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`👤 Intelligence Report: ${user.tag}`)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: 'Basic Intel', value: `\`\`\`ID: ${user.id}\nCreated: ${user.createdAt.toLocaleDateString()}\nBot: ${user.bot ? 'YES' : 'NO'}\`\`\``, inline: false }
                );

            if (member) {
                embed.addFields({ 
                    name: 'Sector Intel', 
                    value: `\`\`\`Joined: ${member.joinedAt?.toLocaleDateString()}\nRole Count: ${member.roles.cache.size - 1}\nTop Role: ${member.roles.highest.name}\`\`\``, 
                    inline: false 
                });
            }

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'server') {
            const owner = await guild.fetchOwner();

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`🏰 Sector Profile: ${guild.name}`)
                .setThumbnail(guild.iconURL())
                .addFields(
                    { name: 'Core Infrastructure', value: `\`\`\`ID: ${guild.id}\nOwner: ${owner.user.tag}\nCreated: ${guild.createdAt.toLocaleDateString()}\`\`\``, inline: false },
                    { name: 'Statistics', value: `\`\`\`Members: ${guild.memberCount}\nChannels: ${guild.channels.cache.size}\nRoles: ${guild.roles.cache.size}\nBoosts: ${guild.premiumSubscriptionCount || 0}\`\`\``, inline: false }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
