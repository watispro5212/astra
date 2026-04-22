import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('💰 Astra Fiscal Systems.')
        .addSubcommand(sub =>
            sub.setName('daily')
                .setDescription('Claim your daily credit allocation.')
        )
        .addSubcommand(sub =>
            sub.setName('balance')
                .setDescription('View your current fiscal status.')
                .addUserOption(opt => opt.setName('user').setDescription('Target user.'))
        )
        .addSubcommand(sub =>
            sub.setName('pay')
                .setDescription('Transfer credits to another operative.')
                .addUserOption(opt => opt.setName('user').setDescription('Target recipient.').setRequired(true))
                .addIntegerOption(opt => opt.setName('amount').setDescription('Credit amount.').setRequired(true).setMinValue(1))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'daily') {
            const user = await db.fetchOne('SELECT last_daily, balance FROM users WHERE user_id = ?', userId);
            const now = Date.now();
            const dailyAmount = 500;

            if (user && user.last_daily && now - parseInt(user.last_daily) < 86400000) {
                const timeLeft = 86400000 - (now - parseInt(user.last_daily));
                const hours = Math.floor(timeLeft / 3600000);
                const minutes = Math.floor((timeLeft % 3600000) / 60000);

                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('❌ Allocation Denied')
                        .setDescription(`Your next credit allocation is available in **${hours}h ${minutes}m**.`)]
                });
                return;
            }

            if (!user) {
                await db.execute('INSERT INTO users (user_id, balance, last_daily) VALUES (?, ?, ?)', userId, dailyAmount, now.toString());
            } else {
                await db.execute('UPDATE users SET balance = balance + ?, last_daily = ? WHERE user_id = ?', dailyAmount, now.toString(), userId);
            }

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('💰 Credits Allocated')
                    .setDescription(`You have claimed your daily reward of **${dailyAmount}** credits.`)
                    .setFooter({ text: 'Astra Fiscal Systems' })]
            });
            return;
        }

        if (subcommand === 'balance') {
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', target.id);
            const balance = data ? data.balance : 0;

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x3498db)
                    .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
                    .setTitle('💳 Fiscal Status')
                    .setDescription(`Current Balance: **${balance}** credits`)
                    .setTimestamp()]
            });
            return;
        }

        if (subcommand === 'pay') {
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

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('💸 Transaction Confirmed')
                    .setDescription(`Successfully transferred **${amount}** credits to **${target.tag}**.`)]
            });
        }
    }
};

export default command;
