import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const WORK_COOLDOWN_MS = 3600000; // 1 hour
const WORK_MIN = 100;
const WORK_MAX = 300;
const DAILY_AMOUNT = 500;

const WORK_RESPONSES = [
    'You repaired a satellite dish',
    'You ran a tactical intelligence scan',
    'You patrolled the outer sector perimeter',
    'You decoded an encrypted transmission',
    'You serviced the armory systems',
    'You completed a logistics audit',
];

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('💰 Astra Fiscal Systems.')
        .addSubcommand(sub =>
            sub.setName('daily')
                .setDescription('Claim your daily credit allocation.')
        )
        .addSubcommand(sub =>
            sub.setName('work')
                .setDescription('Complete an assignment for hourly credit generation.')
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
            const user = await db.fetchOne('SELECT last_daily, balance FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_daily && now - parseInt(user.last_daily) < 86400000) {
                const timeLeft = 86400000 - (now - parseInt(user.last_daily));
                const hours = Math.floor(timeLeft / 3600000);
                const minutes = Math.floor((timeLeft % 3600000) / 60000);
                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('❌ Allocation Denied')
                    .setDescription(`Your next credit allocation is available in **${hours}h ${minutes}m**.`)] });
                return;
            }

            if (!user) {
                await db.execute('INSERT INTO users (user_id, balance, last_daily) VALUES (?, ?, ?)', userId, DAILY_AMOUNT, now.toString());
            } else {
                await db.execute('UPDATE users SET balance = balance + ?, last_daily = ? WHERE user_id = ?', DAILY_AMOUNT, now.toString(), userId);
            }

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('💰 Credits Allocated')
                .setDescription(`You have claimed your daily reward of **${DAILY_AMOUNT}** credits.`)
                .setFooter({ text: 'Astra Fiscal Systems • v7.0.0' })] });

        } else if (subcommand === 'work') {
            const user = await db.fetchOne('SELECT last_work, balance FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_work && now - parseInt(user.last_work) < WORK_COOLDOWN_MS) {
                const timeLeft = WORK_COOLDOWN_MS - (now - parseInt(user.last_work));
                const minutes = Math.ceil(timeLeft / 60000);
                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('❌ Assignment Unavailable')
                    .setDescription(`Your next assignment is available in **${minutes} minute(s)**. Rest between deployments.`)], ephemeral: true });
                return;
            }

            const earned = Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;
            const task = WORK_RESPONSES[Math.floor(Math.random() * WORK_RESPONSES.length)];

            if (!user) {
                await db.execute('INSERT INTO users (user_id, balance, last_work) VALUES (?, ?, ?)', userId, earned, now.toString());
            } else {
                await db.execute('UPDATE users SET balance = balance + ?, last_work = ? WHERE user_id = ?', earned, now.toString(), userId);
            }

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🔧 Assignment Complete')
                .setDescription(`*${task}* and earned **${earned}** credits.`)
                .setFooter({ text: 'Astra Fiscal Systems • Next assignment in 1 hour' })] });

        } else if (subcommand === 'balance') {
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', target.id);
            const balance = data?.balance ?? 0;

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
                .setTitle('💳 Fiscal Status')
                .setDescription(`Current Balance: **${balance.toLocaleString()}** credits`)
                .setTimestamp()] });

        } else if (subcommand === 'pay') {
            const target = interaction.options.getUser('user')!;
            const amount = interaction.options.getInteger('amount')!;

            if (target.id === userId) {
                await interaction.reply({ content: '❌ You cannot pay yourself.', ephemeral: true });
                return;
            }
            if (target.bot) {
                await interaction.reply({ content: '❌ Bots do not participate in fiscal systems.', ephemeral: true });
                return;
            }

            const senderData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!senderData || senderData.balance < amount) {
                await interaction.reply({ content: '❌ Insufficient credits for this transaction.', ephemeral: true });
                return;
            }

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', amount, userId);
            const targetExists = await db.fetchOne('SELECT user_id FROM users WHERE user_id = ?', target.id);
            if (!targetExists) {
                await db.execute('INSERT INTO users (user_id, balance) VALUES (?, ?)', target.id, amount);
            } else {
                await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', amount, target.id);
            }

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('💸 Transaction Confirmed')
                .setDescription(`Successfully transferred **${amount.toLocaleString()}** credits to **${target.tag}**.`)] });

        } else if (subcommand === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll('SELECT user_id, balance FROM users ORDER BY balance DESC LIMIT 10');

            if (!top || top.length === 0) {
                await interaction.editReply({ content: '❌ No fiscal data available yet.' });
                return;
            }

            const medals = ['🥇', '🥈', '🥉'];
            let description = '';
            for (let i = 0; i < top.length; i++) {
                const entry = top[i];
                const prefix = medals[i] || `**${i + 1}.**`;
                let username = `User ${entry.user_id}`;
                try {
                    const u = await interaction.client.users.fetch(entry.user_id);
                    username = u.username;
                } catch (_) {}
                description += `${prefix} **${username}** — \`${(entry.balance || 0).toLocaleString()}\` credits\n`;
            }

            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0xf1c40f)
                .setTitle('🏆 Fiscal Leaderboard')
                .setDescription(description)
                .setFooter({ text: 'Astra Fiscal Systems • Top 10 Wealthiest Operatives' })
                .setTimestamp()] });
        }
    }
};

export default command;
