import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('👤 View your Quantum Profile Portfolio.')
        .setDMPermission(true)
        .addUserOption(opt => opt.setName('target').setDescription('The user to view.')),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const user = interaction.options.getUser('target') || interaction.user;
        const userId = user.id;

        const userEco = await db.fetchOne(
            'SELECT balance, bank_balance, level, xp FROM users WHERE user_id = ?',
            userId
        ) || { balance: 0, bank_balance: 0, level: 1, xp: 0 };

        const memberInfo = await db.fetchOne(
            'SELECT syndicate_id FROM syndicate_members WHERE user_id = ?',
            userId
        );

        let syndicateName = 'None';
        if (memberInfo) {
            const syndicate = await db.fetchOne('SELECT name FROM syndicates WHERE id = ?', memberInfo.syndicate_id);
            if (syndicate) syndicateName = syndicate.name;
        }

        const balance     = Number(userEco.balance      || 0);
        const bankBalance = Number(userEco.bank_balance  || 0);
        const netWorth    = balance + bankBalance;

        const embed = new EmbedBuilder()
            .setColor(THEME.ACCENT)
            .setAuthor({ name: `${user.username.toUpperCase()}'S IDENTITY MATRIX`, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .addFields(
                { name: '🌐 Level',      value: `\`${userEco.level || 1}\``,                inline: true },
                { name: '⚡ XP',         value: `\`${(userEco.xp || 0).toLocaleString()} XP\``, inline: true },
                { name: '💎 Net Worth',  value: `\`${netWorth.toLocaleString()} money\``,   inline: true },
                { name: '💰 Cash',       value: `\`${balance.toLocaleString()} money\``,    inline: true },
                { name: '🏦 Bank',       value: `\`${bankBalance.toLocaleString()} money\``, inline: true },
                { name: '🏛️ Syndicate', value: `\`${syndicateName}\``,                     inline: true },
            )
            .setFooter({ text: `Astra Global Intelligence • Classified Record` });

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
