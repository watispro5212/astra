import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const WORK_COOLDOWN_MS = 3600000; // 1 hour
const MINE_COOLDOWN_MS = 1800000; // 30 mins
const WORK_MIN = 250;
const WORK_MAX = 750;
const DAILY_AMOUNT = 2500;

const WORK_RESPONSES = [
    '🛰️ You successfully calibrated a deep-space satellite array.',
    '🕵️ You intercepted and decrypted a black-market data stream.',
    '🛡️ You coordinated a tactical perimeter defense for the outer sector.',
    '🧪 You synthesized a new batch of stabilization compounds in the lab.',
    '🔧 You performed emergency maintenance on the core propulsion systems.',
    '📊 You completed a comprehensive logistics audit for the Apex warehouse.'
];

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('💰 Astra Fiscal & Extraction Systems.')
        .addSubcommand(sub =>
            sub.setName('daily')
                .setDescription('Claim your daily credit allocation.')
        )
        .addSubcommand(sub =>
            sub.setName('work')
                .setDescription('Complete an assignment for tactical credit generation.')
        )
        .addSubcommand(sub =>
            sub.setName('mine')
                .setDescription('⛏️ High-risk tactical extraction protocol.')
        )
        .addSubcommand(sub =>
            sub.setName('balance')
                .setDescription('View your current fiscal status.')
                .addUserOption(opt => opt.setName('user').setDescription('Target operative.'))
        )
        .addSubcommand(sub =>
            sub.setName('pay')
                .setDescription('Transfer credits to another operative.')
                .addUserOption(opt => opt.setName('user').setDescription('Target recipient.').setRequired(true))
                .addIntegerOption(opt => opt.setName('amount').setDescription('Credit amount.').setRequired(true).setMinValue(1))
        )
        .addSubcommand(sub =>
            sub.setName('leaderboard')
                .setDescription('View the top 10 wealthiest operatives globally.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'daily') {
            const user = await db.fetchOne('SELECT last_daily FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_daily && now - parseInt(user.last_daily) < 86400000) {
                const timeLeft = 86400000 - (now - parseInt(user.last_daily));
                const hours = Math.floor(timeLeft / 3600000);
                const minutes = Math.floor((timeLeft % 3600000) / 60000);
                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🚨 ALLOCATION DENIED')
                    .setDescription(`Your next credit ration is available in **${hours}h ${minutes}m**.`)
                    .setFooter({ text: 'Astra Fiscal Protocol v7.1.0' })], ephemeral: true });
                return;
            }

            await db.execute('INSERT INTO users (user_id, balance, last_daily) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?, last_daily = ?', 
                userId, DAILY_AMOUNT, now.toString(), DAILY_AMOUNT, now.toString());

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('💰 CREDITS ALLOCATED')
                .setDescription(`You have successfully claimed your daily ration of **${DAILY_AMOUNT}** credits.`)
                .addFields({ name: '📈 Current Status', value: 'Verified Operative', inline: true })
                .setFooter({ text: 'Astra Fiscal Protocol • Sector 08' })] });

        } else if (subcommand === 'work') {
            const user = await db.fetchOne('SELECT last_work FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_work && now - parseInt(user.last_work) < WORK_COOLDOWN_MS) {
                const timeLeft = WORK_COOLDOWN_MS - (now - parseInt(user.last_work));
                const minutes = Math.ceil(timeLeft / 60000);
                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🚨 ASSIGNMENT UNAVAILABLE')
                    .setDescription(`Your next deployment is available in **${minutes}m**. Rest required between tactical assignments.`)] , ephemeral: true });
                return;
            }

            const earned = Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;
            const task = WORK_RESPONSES[Math.floor(Math.random() * WORK_RESPONSES.length)];

            await db.execute('INSERT INTO users (user_id, balance, last_work) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?, last_work = ?', 
                userId, earned, now.toString(), earned, now.toString());

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🔧 ASSIGNMENT COMPLETE')
                .setDescription(`*${task}*\n\nYou have been compensated with **${earned}** credits.`)
                .setFooter({ text: 'Next assignment available in 60 minutes.' })] });

        } else if (subcommand === 'mine') {
            const user = await db.fetchOne('SELECT last_mine FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            // Add last_mine to migrations if not exists
            if (user?.last_mine && now - parseInt(user.last_mine) < MINE_COOLDOWN_MS) {
                const timeLeft = MINE_COOLDOWN_MS - (now - parseInt(user.last_mine));
                const minutes = Math.ceil(timeLeft / 60000);
                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🚨 EXTRACTION UNAVAILABLE')
                    .setDescription(`Coolant systems for the extraction probe are still active. Ready in **${minutes}m**.`)] , ephemeral: true });
                return;
            }

            const success = Math.random() > 0.3; // 70% success rate
            const yieldAmount = success ? Math.floor(Math.random() * 2000) + 500 : -Math.floor(Math.random() * 1000);

            await db.execute('INSERT INTO users (user_id, balance, last_mine) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?, last_mine = ?', 
                userId, Math.max(0, yieldAmount), now.toString(), yieldAmount, now.toString());

            const embed = new EmbedBuilder()
                .setTitle(success ? '⛏️ EXTRACTION SUCCESS' : '🚨 EXTRACTION FAILURE')
                .setColor(success ? 0x2ecc71 : 0xe74c3c)
                .setDescription(success 
                    ? `Tactical extraction complete. Yielded **${yieldAmount}** credits from the sub-sector core.`
                    : `Extraction probe malfunctioned. Infrastructure repairs cost you **${Math.abs(yieldAmount)}** credits.`)
                .setFooter({ text: 'Astra Mining Protocol • v7.1.0' });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'balance') {
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', target.id);
            const balance = data?.balance ?? 0;

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setTitle('💳 FISCAL STATUS')
                .addFields(
                    { name: '💰 Liquid Credits', value: `\`${balance.toLocaleString()}\``, inline: true },
                    { name: '🛰️ Sector ID', value: `\`${interaction.guildId || 'Global'}\``, inline: true }
                )
                .setFooter({ text: 'Astra Intelligence Agency' })
                .setTimestamp()] });

        } else if (subcommand === 'pay') {
            const target = interaction.options.getUser('user')!;
            const amount = interaction.options.getInteger('amount')!;

            if (target.id === userId) {
                await interaction.reply({ content: '❌ Intra-sector transfers to oneself are prohibited.', ephemeral: true });
                return;
            }
            if (target.bot) {
                await interaction.reply({ content: '❌ Automated systems cannot hold fiscal assets.', ephemeral: true });
                return;
            }

            const senderData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!senderData || senderData.balance < amount) {
                await interaction.reply({ content: '❌ Insufficient credit liquidity for this transaction.', ephemeral: true });
                return;
            }

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', amount, userId);
            await db.execute('INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?', 
                target.id, amount, amount);

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('💸 TRANSACTION CONFIRMED')
                .setDescription(`Successfully authorized a transfer of **${amount.toLocaleString()}** credits to operative **${target.username}**.`)
                .setFooter({ text: 'Secure Tactical Ledger' })] });

        } else if (subcommand === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll('SELECT user_id, balance FROM users ORDER BY balance DESC LIMIT 10');

            if (!top || top.length === 0) {
                await interaction.editReply({ content: '❌ Global fiscal diagnostic returned zero data.' });
                return;
            }

            let description = '';
            for (let i = 0; i < top.length; i++) {
                const entry = top[i];
                const prefix = i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
                description += `${prefix} <@${entry.user_id}> — \`${(entry.balance || 0).toLocaleString()}\` credits\n`;
            }

            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0xf1c40f)
                .setTitle('🏆 GLOBAL FISCAL LEADERBOARD')
                .setDescription(description)
                .setFooter({ text: 'Top 10 High-Worth Operatives' })
                .setTimestamp()] });
        }
    }
};

export default command;
