import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { StockMarketService, STOCKS } from '../services/stockMarketService';
import { THEME, VERSION, PROTOCOL } from '../core/constants';

const QUANTUM_CYAN = 0x00d4ff;

// Generate a simple ASCII sparkline for visual flair
function generateSparkline(history: number[]): string {
    const chars = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    
    return history.map(v => chars[Math.floor(((v - min) / range) * 7)]).join('');
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('stockmarket')
        .setDescription('📈 Access the Astra Tactical Exchange (ATX).')
        .setDMPermission(true)
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
            await interaction.deferReply();
            
            const embed = new EmbedBuilder()
                .setTitle('🛰️ ASTRA TACTICAL EXCHANGE | GLOBAL FEED')
                .setColor(QUANTUM_CYAN)
                .setDescription('Real-time telemetry from the high-volatility speculation grid.')
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/2620/2620582.png');

            for (const stock of STOCKS) {
                const { price, trend, indicator, change } = StockMarketService.getTrend(stock.symbol);
                const history = StockMarketService.getHistory(stock.symbol);
                const spark = generateSparkline(history);
                
                const sign = change >= 0 ? '+' : '';
                const trendText = `${indicator} ${change >= 0 ? 'BULLISH' : 'BEARISH'}`;

                embed.addFields({
                    name: `${stock.name} (${stock.symbol})`,
                    value: `\`\`\`diff\nPrice : ${price.toLocaleString()} cr\nChange: ${sign}${change.toFixed(2)}%\nTrend : ${trendText}\nGraph  : [${spark}]\nSector : ${stock.description}\`\`\``,
                    inline: false
                });
            }

            embed.setFooter({ text: `Quantum Financial Engine • ${PROTOCOL} • Live Telemetry` }).setTimestamp();
            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'buy') {
            await interaction.deferReply();
            const symbol = interaction.options.getString('symbol')!;
            const shares = interaction.options.getInteger('shares')!;
            const price  = StockMarketService.getPrice(symbol);
            const cost   = shares * price;

            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!user || user.balance < cost) {
                const deficit = cost - (user?.balance || 0);
                return interaction.editReply({ 
                    content: `❌ **LIQUIDITY ERROR**: Acquisition failed. You require an additional **${deficit.toLocaleString()} cr** to finalize this trade.` 
                });
            }

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', cost, userId);
            
            await db.execute(`
                INSERT INTO user_stocks (user_id, stock_symbol, shares, invested_amount) 
                VALUES (?, ?, ?, ?) 
                ON CONFLICT(user_id, stock_symbol) 
                DO UPDATE SET shares = user_stocks.shares + ?, invested_amount = user_stocks.invested_amount + ?`, 
                userId, symbol, shares, cost, shares, cost
            );

            const embed = new EmbedBuilder()
                .setTitle('✅ ACQUISITION CONFIRMED')
                .setColor(THEME.SUCCESS)
                .setDescription(`The Astra Exchange has confirmed your acquisition of **${shares}** shares in **${symbol}**.`)
                .addFields(
                    { name: '📦 Volume', value: `\`${shares.toLocaleString()} units\``, inline: true },
                    { name: '💰 Unit Price', value: `\`${price.toLocaleString()} cr\``, inline: true },
                    { name: '💳 Total Debit', value: `\`${cost.toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Astra Tactical Ledger • Transaction Finalized' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'sell') {
            await interaction.deferReply();
            const symbol = interaction.options.getString('symbol')!;
            const shares = interaction.options.getInteger('shares')!;
            const price  = StockMarketService.getPrice(symbol);
            const value  = shares * price;

            const holdings = await db.fetchOne('SELECT shares, invested_amount FROM user_stocks WHERE user_id = ? AND stock_symbol = ?', userId, symbol);
            if (!holdings || holdings.shares < shares) {
                return interaction.editReply({ 
                    content: `❌ **HOLDING ERROR**: Liquidate failed. Current portfolio volume for \`${symbol}\` is insufficient.` 
                });
            }

            // Calculate profit/loss for this specific sale
            const avgCostPerShare = holdings.invested_amount / holdings.shares;
            const profit = value - (shares * avgCostPerShare);
            const profitPct = (profit / (shares * avgCostPerShare)) * 100;

            await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', value, userId);
            await db.execute('UPDATE user_stocks SET shares = shares - ?, invested_amount = MAX(0, invested_amount - ?) WHERE user_id = ? AND stock_symbol = ?', shares, shares * avgCostPerShare, userId, symbol);

            const embed = new EmbedBuilder()
                .setTitle('✅ LIQUIDATION CONFIRMED')
                .setColor(profit >= 0 ? THEME.SUCCESS : THEME.DANGER)
                .setDescription(`Assets successfully liquidated on the Astra Tactical Exchange.`)
                .addFields(
                    { name: '📦 Volume', value: `\`${shares.toLocaleString()} units\``, inline: true },
                    { name: '💰 Sale Price', value: `\`${price.toLocaleString()} cr\``, inline: true },
                    { name: '📈 Yield', value: `\`${profit >= 0 ? '+' : ''}${profit.toLocaleString()} cr (${profitPct.toFixed(2)}%)\``, inline: true }
                )
                .setFooter({ text: 'Astra Tactical Ledger • Market Order Executed' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'portfolio') {
            await interaction.deferReply();
            const holdings = await db.fetchAll('SELECT stock_symbol, shares, invested_amount FROM user_stocks WHERE user_id = ? AND shares > 0', userId);
            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            let totalVal = 0;
            let totalInvested = 0;
            
            const embed = new EmbedBuilder()
                .setTitle(`📊 PORTFOLIO ANALYSIS | ${interaction.user.username.toUpperCase()}`)
                .setColor(QUANTUM_CYAN)
                .setThumbnail(interaction.user.displayAvatarURL());

            if (holdings.length === 0) {
                embed.setDescription('No active holdings detected in the Astra Tactical Exchange.');
            } else {
                for (const h of holdings) {
                    const currentPrice = StockMarketService.getPrice(h.stock_symbol);
                    const currentVal = h.shares * currentPrice;
                    const profit = currentVal - h.invested_amount;
                    const profitPct = (profit / h.invested_amount) * 100;
                    
                    totalVal += currentVal;
                    totalInvested += h.invested_amount;

                    embed.addFields({
                        name: `${h.stock_symbol} Holdings`,
                        value: `\`\`\`yaml\nShares : ${h.shares.toLocaleString()}\nValue  : ${currentVal.toLocaleString()} cr\nYield  : ${profit >= 0 ? '+' : ''}${profit.toLocaleString()} (${profitPct.toFixed(1)}%)\`\`\``,
                        inline: true
                    });
                }
            }

            const liquid = user?.balance || 0;
            const netWorth = totalVal + liquid;
            const totalProfit = totalVal - totalInvested;

            embed.addFields(
                { name: '💰 Liquid Credits', value: `\`${liquid.toLocaleString()} cr\``, inline: true },
                { name: '💎 Portfolio Value', value: `\`${totalVal.toLocaleString()} cr\``, inline: true },
                { name: '📈 Total Growth', value: `\`${totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()} cr\``, inline: true },
                { name: '🚀 EST. NET WORTH', value: `\`${netWorth.toLocaleString()} cr\``, inline: false }
            );

            embed.setFooter({ text: `Astra Financial Intelligence • ${VERSION}` }).setTimestamp();
            await interaction.editReply({ embeds: [embed] });
        }
    }
};

export default command;
