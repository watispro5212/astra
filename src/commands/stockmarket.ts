import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { StockMarketService, STOCKS } from '../services/stockMarketService';

const TITAN_CYAN = 0x00d4ff;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('stockmarket')
        .setDescription('📈 Access the Astra Tactical Exchange (ATX).')
        .addSubcommand(sub => 
            sub.setName('market')
               .setDescription('🛰️ View current market prices and global trends.')
        )
        .addSubcommand(sub => 
            sub.setName('buy')
               .setDescription('💸 Purchase shares in a listed sector.')
               .addStringOption(opt => 
                   opt.setName('symbol')
                      .setDescription('The stock symbol (e.g., AST, TITN)')
                      .setRequired(true)
                      .addChoices(
                          ...STOCKS.map(s => ({ name: `${s.symbol} - ${s.name}`, value: s.symbol }))
                      )
               )
               .addIntegerOption(opt => opt.setName('shares').setDescription('Number of shares to acquire.').setRequired(true).setMinValue(1))
        )
        .addSubcommand(sub => 
            sub.setName('sell')
               .setDescription('💰 Liquidate shares for sector credits.')
               .addStringOption(opt => 
                   opt.setName('symbol')
                      .setDescription('The stock symbol to liquidate')
                      .setRequired(true)
                      .addChoices(
                          ...STOCKS.map(s => ({ name: `${s.symbol} - ${s.name}`, value: s.symbol }))
                      )
               )
               .addIntegerOption(opt => opt.setName('shares').setDescription('Number of shares to liquidate.').setRequired(true).setMinValue(1))
        )
        .addSubcommand(sub => 
            sub.setName('portfolio')
               .setDescription('📂 Analyze your current holdings and net worth.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'market') {
            const embed = new EmbedBuilder()
                .setTitle('🛰️ ASTRA TACTICAL EXCHANGE | GLOBAL FEED')
                .setColor(TITAN_CYAN)
                .setDescription('Real-time telemetry from the industrial financial grid.')
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/2620/2620582.png');

            for (const stock of STOCKS) {
                const { price, trend, indicator } = StockMarketService.getTrend(stock.symbol);
                embed.addFields({
                    name: `${indicator} ${stock.name} (${stock.symbol})`,
                    value: `\`\`\`Price : ${price.toLocaleString()} cr\nTrend : ${trend}\nSector: ${stock.description}\`\`\``,
                    inline: false
                });
            }

            embed.setFooter({ text: 'Titan Financial Engine v7.5.0 • Live Telemetry' }).setTimestamp();
            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'buy') {
            const symbol = interaction.options.getString('symbol')!;
            const shares = interaction.options.getInteger('shares')!;
            const price  = StockMarketService.getPrice(symbol);
            const cost   = shares * price;

            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!user || user.balance < cost) {
                return interaction.reply({ 
                    content: `❌ **INSUFFICIENT FUNDS**: Acquisition of **${shares}** shares in \`${symbol}\` requires \`${cost.toLocaleString()}\` credits.`, 
                    flags: [MessageFlags.Ephemeral]
                });
            }

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', cost, userId);
            
            // Track stocks in a more robust way
            const existing = await db.fetchOne('SELECT shares FROM user_stocks WHERE user_id = ? AND stock_symbol = ?', userId, symbol);
            if (existing) {
                await db.execute('UPDATE user_stocks SET shares = shares + ? WHERE user_id = ? AND stock_symbol = ?', shares, userId, symbol);
            } else {
                await db.execute('INSERT INTO user_stocks (user_id, stock_symbol, shares) VALUES (?, ?, ?)', userId, symbol, shares);
            }

            const embed = new EmbedBuilder()
                .setTitle('✅ ACQUISITION SUCCESSFUL')
                .setColor(0x00ffaa)
                .setDescription(`You have successfully acquired shares in **${symbol}**.`)
                .addFields(
                    { name: '📦 Shares Acquired', value: `\`${shares.toLocaleString()}\``, inline: true },
                    { name: '💰 Price per Share', value: `\`${price.toLocaleString()} cr\``, inline: true },
                    { name: '💳 Total Cost', value: `\`${cost.toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Astra Exchange Confirmation' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'sell') {
            const symbol = interaction.options.getString('symbol')!;
            const shares = interaction.options.getInteger('shares')!;
            const price  = StockMarketService.getPrice(symbol);
            const value  = shares * price;

            const holdings = await db.fetchOne('SELECT shares FROM user_stocks WHERE user_id = ? AND stock_symbol = ?', userId, symbol);
            if (!holdings || holdings.shares < shares) {
                return interaction.reply({ 
                    content: `❌ **INSUFFICIENT HOLDINGS**: You do not possess **${shares}** shares of \`${symbol}\` to liquidate.`, 
                    flags: [MessageFlags.Ephemeral]
                });
            }

            await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', value, userId);
            await db.execute('UPDATE user_stocks SET shares = shares - ? WHERE user_id = ? AND stock_symbol = ?', shares, userId, symbol);

            const embed = new EmbedBuilder()
                .setTitle('✅ LIQUIDATION SUCCESSFUL')
                .setColor(0xffaa00)
                .setDescription(`You have successfully liquidated shares in **${symbol}**.`)
                .addFields(
                    { name: '📦 Shares Sold', value: `\`${shares.toLocaleString()}\``, inline: true },
                    { name: '💰 Value per Share', value: `\`${price.toLocaleString()} cr\``, inline: true },
                    { name: '💳 Total Received', value: `\`${value.toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Astra Exchange Confirmation' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'portfolio') {
            const holdings = await db.fetchAll('SELECT stock_symbol, shares FROM user_stocks WHERE user_id = ? AND shares > 0', userId);
            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            let totalPortfolioValue = 0;
            const embed = new EmbedBuilder()
                .setTitle(`📊 PORTFOLIO DIAGNOSTIC | ${interaction.user.username.toUpperCase()}`)
                .setColor(TITAN_CYAN)
                .setThumbnail(interaction.user.displayAvatarURL());

            if (holdings.length === 0) {
                embed.setDescription('No active holdings detected in the Astra Tactical Exchange.');
            } else {
                for (const h of holdings) {
                    const price = StockMarketService.getPrice(h.stock_symbol);
                    const val = h.shares * price;
                    totalPortfolioValue += val;
                    embed.addFields({
                        name: `${h.stock_symbol} Holdings`,
                        value: `\`\`\`Shares: ${h.shares.toLocaleString()}\nValue : ${val.toLocaleString()} cr\`\`\``,
                        inline: true
                    });
                }
            }

            const netWorth = totalPortfolioValue + (user?.balance || 0);

            embed.addFields(
                { name: '💰 Liquid Credits', value: `\`${(user?.balance || 0).toLocaleString()} cr\``, inline: false },
                { name: '💎 Net Worth', value: `\`${netWorth.toLocaleString()} cr\``, inline: false }
            );

            embed.setFooter({ text: 'Astra Financial Intelligence • Titan v7.5.0' }).setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
