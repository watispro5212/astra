import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const STOCK_NAME = 'ASTRA SHARES (AST)';

const getCurrentPrice = () => {
    // Deterministic price based on the current hour/minute to simulate a trend
    const now = Date.now();
    const basePrice = 250;
    const volatility = 150;
    const sinValue = Math.sin(now / (1000 * 60 * 60)); // Hourly wave
    const cosValue = Math.cos(now / (1000 * 60 * 15)); // 15-minute wave
    
    return Math.floor(basePrice + (sinValue * volatility) + (cosValue * 30));
};

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('stockmarket')
        .setDescription('📈 Access the Astra Tactical Exchange.')
        .addSubcommand(sub => 
            sub.setName('view')
               .setDescription('Audit current market prices and trends.')
        )
        .addSubcommand(sub => 
            sub.setName('buy')
               .setDescription('Purchase shares in Astra Tactical.')
               .addIntegerOption(opt => opt.setName('amount').setDescription('Number of shares to acquire.').setRequired(true))
        )
        .addSubcommand(sub => 
            sub.setName('sell')
               .setDescription('Liquidate shares for sector credits.')
               .addIntegerOption(opt => opt.setName('amount').setDescription('Number of shares to liquidate.').setRequired(true))
        )
        .addSubcommand(sub => 
            sub.setName('portfolio')
               .setDescription('Analyze your current holdings and net worth.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const price = getCurrentPrice();
        const userId = interaction.user.id;

        if (subcommand === 'view') {
            const embed = new EmbedBuilder()
                .setTitle(`📊 TACTICAL EXCHANGE: ${STOCK_NAME}`)
                .setColor(0x2ecc71)
                .addFields(
                    { name: '💰 Current Value', value: `\`${price} Credits\` per share`, inline: true },
                    { name: '📉 Market Status', value: 'Operational', inline: true },
                    { name: '📈 Forecast', value: price > 250 ? '📈 Bullish' : '📉 Bearish', inline: true }
                )
                .setFooter({ text: 'Astra Market Engine v7.0.0' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'buy') {
            const amount = interaction.options.getInteger('amount')!;
            const totalCost = amount * price;

            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!user || user.balance < totalCost) {
                await interaction.reply({ content: `❌ **INSUFFICIENT CREDITS**: This acquisition requires \`${totalCost}\` credits.`, ephemeral: true });
                return;
            }

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', totalCost, userId);
            
            const existing = await db.fetchOne('SELECT shares FROM user_stocks WHERE user_id = ?', userId);
            if (existing) {
                await db.execute('UPDATE user_stocks SET shares = shares + ?, invested_amount = invested_amount + ? WHERE user_id = ?', amount, totalCost, userId);
            } else {
                await db.execute('INSERT INTO user_stocks (user_id, shares, invested_amount) VALUES (?, ?, ?)', userId, amount, totalCost);
            }

            await interaction.reply({ content: `✅ **ACQUISITION SUCCESS**: You have acquired **${amount}** shares in ${STOCK_NAME} for \`${totalCost}\` credits.` });

        } else if (subcommand === 'sell') {
            const amount = interaction.options.getInteger('amount')!;
            const totalValue = amount * price;

            const holdings = await db.fetchOne('SELECT shares FROM user_stocks WHERE user_id = ?', userId);
            if (!holdings || holdings.shares < amount) {
                await interaction.reply({ content: '❌ **LIQUIDATION FAILED**: You do not possess the required shares for this transaction.', ephemeral: true });
                return;
            }

            await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', totalValue, userId);
            await db.execute('UPDATE user_stocks SET shares = shares - ? WHERE user_id = ?', amount, userId);

            await interaction.reply({ content: `✅ **LIQUIDATION SUCCESS**: You have sold **${amount}** shares for \`${totalValue}\` credits.` });

        } else if (subcommand === 'portfolio') {
            const holdings = await db.fetchOne('SELECT shares, invested_amount FROM user_stocks WHERE user_id = ?', userId);
            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const shares = holdings?.shares || 0;
            const netWorth = (shares * price) + (user?.balance || 0);

            const embed = new EmbedBuilder()
                .setTitle(`📊 PORTFOLIO DIAGNOSTIC: ${interaction.user.username}`)
                .setColor(0x3498db)
                .addFields(
                    { name: '📦 Shares Held', value: `\`${shares}\` shares`, inline: true },
                    { name: '💰 Liquid Credits', value: `\`${user?.balance || 0}\``, inline: true },
                    { name: '💎 Net Worth', value: `\`${netWorth}\` credits`, inline: true }
                )
                .setFooter({ text: 'Astra Market Engine v7.0.0' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
