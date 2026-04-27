import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('👤 Access your V8 Quantum Profile Portfolio.')
        .setDMPermission(false)
        .addUserOption(opt => opt.setName('target').setDescription('The operative to view.')),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const user = interaction.options.getUser('target') || interaction.user;
        const userId = user.id;

        // Fetch unified user data from SQL
        const userEco = await db.fetchOne('SELECT credits, bank, level, xp FROM users WHERE user_id = $1', [userId]) || { credits: 0, bank: 0, level: 1, xp: 0 };
        const memberInfo = await db.fetchOne('SELECT syndicate_id FROM syndicate_members WHERE user_id = $1', [userId]);
        
        let syndicateName = 'None';
        if (memberInfo) {
            const syndicate = await db.fetchOne('SELECT name FROM syndicates WHERE id = $1', [memberInfo.syndicate_id]);
            if (syndicate) syndicateName = syndicate.name;
        }

        const credits = Number(userEco.credits || 0);
        const bank = Number(userEco.bank || 0);
        const totalCredits = credits + bank;

        const profileText = `\`\`\`ansi
\u001b[1;36m🌐 Level         :\u001b[0m ${userEco.level || 1}
\u001b[1;35m⚡ XP Tracker    :\u001b[0m ${userEco.xp || 0} XP
\u001b[1;32m💎 Net Worth     :\u001b[0m ₵${totalCredits.toLocaleString()}
\u001b[1;33m🏛️ Syndicate     :\u001b[0m ${syndicateName}
\`\`\``;

        const embed = new EmbedBuilder()
            .setColor(THEME.ACCENT)
            .setAuthor({ name: `${user.username.toUpperCase()}'S IDENTITY MATRIX`, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .setDescription(profileText)
            .setFooter({ text: `Astra Global Intelligence • Classified Record` });

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
