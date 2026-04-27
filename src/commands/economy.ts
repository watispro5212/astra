import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME, VERSION, PROTOCOL } from '../core/constants';

const WORK_COOLDOWN_MS = 3600000;  // 1 hour
const MINE_COOLDOWN_MS = 1800000;  // 30 mins
const ROB_COOLDOWN_MS  = 7200000;  // 2 hours
const WORK_MIN  = 250;
const WORK_MAX  = 750;
const DAILY_AMOUNT = 2500;
const SLOTS_COST   = 50;
const GAMBLE_MIN   = 100;

const WORK_RESPONSES = [
    '🛰️ You successfully calibrated a deep-space satellite array.',
    '🕵️ You intercepted and decrypted a black-market data stream.',
    '🛡️ You coordinated a tactical perimeter defense for the outer sector.',
    '🧪 You synthesized a new batch of stabilization compounds in the lab.',
    '🔧 You performed emergency maintenance on the core propulsion systems.',
    '📊 You completed a comprehensive logistics audit for the Apex warehouse.',
    '🚀 You piloted a resupply drone through the debris field successfully.',
    '🔬 You cracked an alien cipher and recovered classified data.',
];

const SLOT_REELS = ['🔫', '💎', '⚡', '🪙', '🛸', '💀'];

const SLOT_PAYOUTS: Record<string, number> = {
    '💎': 50,   // jackpot
    '🛸': 20,
    '⚡': 10,
    '🔫': 8,
    '🪙': 5,
    '💀': 0,
};

function spinReels(): string[] {
    return Array.from({ length: 3 }, () => SLOT_REELS[Math.floor(Math.random() * SLOT_REELS.length)]);
}

function formatCooldown(ms: number): string {
    const h = Math.floor(ms / 3600000);
    const m = Math.ceil((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('💰 Astra Fiscal & Extraction Systems.')
        .setDMPermission(true)
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
            sub.setName('harvest')
               .setDescription('🌾 Collect passive income from your yield-bearing assets.')
        )
        .addSubcommand(sub =>
            sub.setName('rob')
               .setDescription('🦹 Attempt to steal credits from another operative.')
               .addUserOption(opt => opt.setName('user').setDescription('Target operative.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('gamble')
               .setDescription('🎰 Wager credits — 45% chance to win 1.8× your bet.')
               .addIntegerOption(opt => opt.setName('amount').setDescription(`Amount of credits to wager (min ${GAMBLE_MIN}).`).setRequired(true).setMinValue(GAMBLE_MIN))
        )
        .addSubcommand(sub =>
            sub.setName('slots')
               .setDescription(`🎰 Spin the slot machine (costs ${SLOTS_COST} credits per spin).`)
        )
        .addSubcommand(sub =>
            sub.setName('coinflip')
               .setDescription('🪙 Flip a coin for double or nothing.')
               .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to wager.').setRequired(true).setMinValue(1))
               .addStringOption(opt => opt.setName('choice').setDescription('Your call.').setRequired(true).addChoices(
                   { name: 'Heads', value: 'heads' },
                   { name: 'Tails', value: 'tails' }
               ))
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
               .setDescription('View the top wealth rankings.')
        )
        .addSubcommand(sub =>
            sub.setName('stats')
               .setDescription('📊 View your fiscal statistics and performance report.')
               .addUserOption(opt => opt.setName('user').setDescription('Target operative.'))
        )
        .addSubcommand(sub =>
            sub.setName('bank')
               .setDescription('🏦 Access your secure fiscal vault.')
               .addStringOption(opt => opt.setName('action').setDescription('Deposit or withdraw.').setRequired(true).addChoices(
                   { name: 'Deposit', value: 'deposit' },
                   { name: 'Withdraw', value: 'withdraw' }
               ))
               .addIntegerOption(opt => opt.setName('amount').setDescription('Credit amount.').setRequired(true).setMinValue(1))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'daily') {
            await interaction.deferReply();
            const user = await db.fetchOne('SELECT last_daily, daily_streak FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_daily && now - parseInt(user.last_daily) < 86400000) {
                const timeLeft = 86400000 - (now - parseInt(user.last_daily));
                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 ALLOCATION DENIED')
                    .setDescription(`Your next credit ration is available in **${formatCooldown(timeLeft)}**.`)
                    .setFooter({ text: `Astra Fiscal Protocol • ${VERSION}` });
                return interaction.editReply({ embeds: [embed] });
            }

            let streak = user?.daily_streak || 0;
            // If last daily was within 48 hours, increment streak, else reset to 1
            if (user?.last_daily && now - parseInt(user.last_daily) < 172800000) {
                streak++;
            } else {
                streak = 1;
            }

            const streakBonus = Math.min(streak * 100, 5000); // Max 5000 bonus
            const totalDaily = DAILY_AMOUNT + streakBonus;

            await db.execute(
                'INSERT INTO users (user_id, balance, total_earned, last_daily, daily_streak) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, last_daily = ?, daily_streak = ?',
                userId, totalDaily, totalDaily, now.toString(), streak, totalDaily, totalDaily, now.toString(), streak
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('💰 DAILY CREDITS ALLOCATED')
                .setDescription(`You have claimed your daily allocation. Consistent activity has maintained a **${streak} day streak**.`)
                .addFields(
                    { name: '📈 Base Amount', value: `\`${DAILY_AMOUNT.toLocaleString()} cr\``, inline: true },
                    { name: '🔥 Streak Bonus', value: `\`+${streakBonus.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? totalDaily).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: `Astra Fiscal Protocol • ${PROTOCOL}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'work') {
            await interaction.deferReply();
            const user = await db.fetchOne('SELECT last_work FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_work && now - parseInt(user.last_work) < WORK_COOLDOWN_MS) {
                const timeLeft = WORK_COOLDOWN_MS - (now - parseInt(user.last_work));
                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 ASSIGNMENT UNAVAILABLE')
                    .setDescription(`Next deployment in **${formatCooldown(timeLeft)}**.\nRest is required between tactical assignments.`)
                    .setFooter({ text: `Astra Work Protocol • ${VERSION}` });
                return interaction.editReply({ embeds: [embed] });
            }

            const earned = Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;
            const task = WORK_RESPONSES[Math.floor(Math.random() * WORK_RESPONSES.length)];

            await db.execute(
                'INSERT INTO users (user_id, balance, total_earned, last_work) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, last_work = ?',
                userId, earned, earned, now.toString(), earned, earned, now.toString()
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🔧 ASSIGNMENT COMPLETE')
                .setDescription(`*${task}*`)
                .addFields(
                    { name: '💰 Credits Earned', value: `\`+${earned.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? earned).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Deployment successful.' });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'mine') {
            await interaction.deferReply();
            const user = await db.fetchOne('SELECT last_mine, balance FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_mine && now - parseInt(user.last_mine) < MINE_COOLDOWN_MS) {
                const timeLeft = MINE_COOLDOWN_MS - (now - parseInt(user.last_mine));
                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 EXTRACTION UNAVAILABLE')
                    .setDescription(`Coolant systems active. Ready in **${formatCooldown(timeLeft)}**.`)
                    .setFooter({ text: `Astra Mining Protocol • ${VERSION}` });
                return interaction.editReply({ embeds: [embed] });
            }

            const success = Math.random() > 0.30;
            const currentBalance = user?.balance ?? 0;
            const yieldAmount = success
                ? Math.floor(Math.random() * 2000) + 500
                : -Math.min(Math.floor(Math.random() * 1000), currentBalance);

            await db.execute(
                'INSERT INTO users (user_id, balance, total_earned, last_mine) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = MAX(0, balance + ?), total_earned = total_earned + ?, last_mine = ?',
                userId, Math.max(0, yieldAmount), success ? yieldAmount : 0, now.toString(), yieldAmount, success ? yieldAmount : 0, now.toString()
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setTitle(success ? '⛏️ EXTRACTION SUCCESS' : '🚨 EXTRACTION FAILURE')
                .setColor(success ? THEME.SUCCESS : THEME.DANGER)
                .setDescription(success
                    ? `Tactical extraction complete. Sub-sector core yielded a rich vein.`
                    : `Extraction probe malfunctioned. Infrastructure repairs incurred a cost.`)
                .addFields(
                    { name: success ? '💰 Yield' : '🔧 Repair Cost', value: `\`${success ? '+' : ''}${yieldAmount.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: `Astra Mining Protocol • ${PROTOCOL}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'harvest') {
            await interaction.deferReply();
            const inventory = await db.fetchAll(`
                SELECT ui.id, ui.quantity, ui.last_harvest, si.name, si.production_rate, si.emoji
                FROM user_inventory ui
                JOIN shop_items si ON ui.item_id = si.id
                WHERE ui.user_id = ? AND si.production_rate > 0
            `, userId);

            if (!inventory || inventory.length === 0) {
                return interaction.editReply({ content: '❌ You own no yield-bearing assets. Visit `/shop view` to acquire passive income items.' });
            }

            let totalHarvest = 0;
            const lines: string[] = [];

            for (const inv of inventory) {
                const lastHarvestTime = new Date(inv.last_harvest).getTime();
                const hoursElapsed = (Date.now() - lastHarvestTime) / 3600000;
                const totalRate = inv.production_rate * (inv.quantity || 1);
                const pendingCredits = Math.floor(hoursElapsed * totalRate);

                if (pendingCredits > 0) {
                    totalHarvest += pendingCredits;
                    lines.push(`${inv.emoji ?? '📦'} **${inv.name}** ×${inv.quantity} — \`+${pendingCredits.toLocaleString()} cr\``);
                    
                    // Fixed fractional loss
                    const exactMsGained = (pendingCredits / totalRate) * 3600000;
                    const newHarvestTime = new Date(lastHarvestTime + exactMsGained);
                    
                    await db.execute('UPDATE user_inventory SET last_harvest = ? WHERE id = ?', newHarvestTime.toISOString(), inv.id);
                }
            }

            if (totalHarvest === 0) {
                return interaction.editReply({ content: '⏳ Your assets have not generated enough credits to harvest yet.' });
            }

            await db.execute(
                'INSERT INTO users (user_id, balance, total_earned) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?',
                userId, totalHarvest, totalHarvest, totalHarvest, totalHarvest
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('🌾 PASSIVE INCOME HARVESTED')
                .setDescription(lines.join('\n'))
                .addFields(
                    { name: '💰 Total Collected', value: `\`+${totalHarvest.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: `Industrial Yield Engine • ${VERSION}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'rob') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user')!;
            if (target.id === userId) return interaction.editReply({ content: '❌ Self-robbery prohibited.' });
            if (target.bot) return interaction.editReply({ content: '❌ Cannot rob automated systems.' });

            const robberData = await db.fetchOne('SELECT balance, last_rob FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (robberData?.last_rob && now - parseInt(robberData.last_rob) < ROB_COOLDOWN_MS) {
                const timeLeft = ROB_COOLDOWN_MS - (now - parseInt(robberData.last_rob));
                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 OPERATION DENIED')
                    .setDescription(`Intelligence tracking active. Lay low for **${formatCooldown(timeLeft)}**.`)
                    .setFooter({ text: `Astra Covert Ops • ${VERSION}` });
                return interaction.editReply({ embeds: [embed] });
            }

            const targetData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', target.id);
            const targetBalance = targetData?.balance ?? 0;

            if (targetBalance < 200) {
                return interaction.editReply({ content: `❌ **${target.username}** has insufficient funds to warrant a heist.` });
            }

            const success = Math.random() < 0.40;
            await db.execute(
                'INSERT INTO users (user_id, balance, last_rob) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET last_rob = ?',
                userId, 0, now.toString(), now.toString()
            );

            if (success) {
                const stolen = Math.floor(targetBalance * (Math.random() * 0.20 + 0.10));
                await db.execute('UPDATE users SET balance = MAX(0, balance - ?) WHERE user_id = ?', stolen, target.id);
                await db.execute('UPDATE users SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?', stolen, stolen, userId);
                const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

                const embed = new EmbedBuilder()
                    .setColor(THEME.SECONDARY)
                    .setTitle('🦹 HEIST SUCCESSFUL')
                    .setDescription(`You successfully breached **${target.username}**'s security.`)
                    .addFields(
                        { name: '💰 Stolen', value: `\`+${stolen.toLocaleString()} cr\``, inline: true },
                        { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                    )
                    .setFooter({ text: 'Astra Black Division' });
                return interaction.editReply({ embeds: [embed] });
            } else {
                const robberBalance = robberData?.balance ?? 0;
                const fine = Math.min(Math.floor(robberBalance * 0.15), robberBalance);
                if (fine > 0) await db.execute('UPDATE users SET balance = MAX(0, balance - ?) WHERE user_id = ?', fine, userId);
                const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 HEIST FAILED')
                    .setDescription(`You were caught and fined.`)
                    .addFields(
                        { name: '🔧 Fine', value: `\`-${fine.toLocaleString()} cr\``, inline: true },
                        { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                    )
                    .setFooter({ text: 'Lockout protocol applied.' });
                return interaction.editReply({ embeds: [embed] });
            }

        } else if (subcommand === 'gamble') {
            await interaction.deferReply();
            const amount = interaction.options.getInteger('amount')!;
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < amount) return interaction.editReply({ content: `❌ Insufficient credits.` });

            const win = Math.random() < 0.45;
            const delta = win ? Math.floor(amount * 1.8) - amount : -amount;

            await db.execute('UPDATE users SET balance = MAX(0, balance + ?), total_earned = total_earned + ? WHERE user_id = ?', delta, win ? delta : 0, userId);
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setColor(win ? THEME.SUCCESS : THEME.DANGER)
                .setTitle(win ? '🎰 GAMBLE: WIN' : '🎰 GAMBLE: LOSS')
                .setDescription(win
                    ? `The odds favoured you. Your wager returned **${(amount + delta).toLocaleString()} cr**.`
                    : `The house always wins. Your wager was lost.`)
                .addFields(
                    { name: win ? '💰 Gain' : '💸 Loss', value: `\`${win ? '+' : ''}${delta.toLocaleString()} cr\``, inline: true },
                    { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: `Fiscal Risk Division • ${PROTOCOL}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'slots') {
            await interaction.deferReply();
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < SLOTS_COST) return interaction.editReply({ content: `❌ Slots cost **${SLOTS_COST} cr**.` });

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', SLOTS_COST, userId);

            const reels = spinReels();
            const [a, b, c] = reels;
            let payout = 0;
            let resultText = '';

            if (a === b && b === c) {
                const multiplier = SLOT_PAYOUTS[a] ?? 3;
                payout = SLOTS_COST * multiplier;
                resultText = multiplier >= 20 ? `🎊 **JACKPOT!** Triple ${a}` : multiplier > 0 ? `✨ **TRIPLE MATCH!** ${a}` : `💀 **TRIPLE SKULL**`;
            } else if (a === b || b === c || a === c) {
                payout = Math.floor(SLOTS_COST * 1.5);
                resultText = `🔸 **PARTIAL MATCH**`;
            } else {
                resultText = `❌ **NO MATCH**`;
            }

            if (payout > 0) await db.execute('UPDATE users SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?', payout, payout, userId);
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const net = payout - SLOTS_COST;

            const embed = new EmbedBuilder()
                .setColor(payout > SLOTS_COST ? THEME.SUCCESS : payout > 0 ? THEME.WARNING : THEME.DANGER)
                .setTitle('🎰 SLOT MACHINE')
                .setDescription(`\`[ ${a}  ${b}  ${c} ]\`\n\n${resultText}`)
                .addFields(
                    { name: net >= 0 ? '💰 Net Gain' : '💸 Net Loss', value: `\`${net >= 0 ? '+' : ''}${net.toLocaleString()} cr\``, inline: true },
                    { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: `Astra Casino • ${VERSION}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'coinflip') {
            await interaction.deferReply();
            const amount = interaction.options.getInteger('amount')!;
            const choice = interaction.options.getString('choice')!;
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < amount) return interaction.editReply({ content: `❌ Insufficient credits.` });

            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            const win = result === choice;
            const delta = win ? amount : -amount;

            await db.execute('UPDATE users SET balance = MAX(0, balance + ?), total_earned = total_earned + ? WHERE user_id = ?', delta, win ? amount : 0, userId);
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const coin = result === 'heads' ? '🪙 **HEADS**' : '🔘 **TAILS**';

            const embed = new EmbedBuilder()
                .setColor(win ? THEME.SUCCESS : THEME.DANGER)
                .setTitle(`🪙 COINFLIP: ${win ? 'WIN' : 'LOSS'}`)
                .setDescription(`The coin landed on ${coin}.\nYou called **${choice.toUpperCase()}**.`)
                .addFields(
                    { name: win ? '💰 Gained' : '💸 Lost', value: `\`${win ? '+' : '-'}${amount.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: `Fair 50/50 • ${PROTOCOL}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'balance') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT balance, bank_balance FROM users WHERE user_id = ?', target.id);
            const liquid = data?.balance ?? 0;
            const vault  = data?.bank_balance ?? 0;

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setAuthor({ name: `${target.username}'s Fiscal Report`, iconURL: target.displayAvatarURL() })
                .addFields(
                    { name: '💰 Liquid Credits', value: `\`${liquid.toLocaleString()} cr\``, inline: true },
                    { name: '🏦 Vault Balance',  value: `\`${vault.toLocaleString()} cr\``,  inline: true },
                    { name: '💼 Total Assets',   value: `\`${(liquid + vault).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: `Astra Fiscal Intelligence • ${VERSION}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'pay') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user')!;
            const amount = interaction.options.getInteger('amount')!;

            if (target.id === userId) return interaction.editReply({ content: '❌ Self-transfers prohibited.' });
            if (target.bot) return interaction.editReply({ content: '❌ Bots cannot hold assets.' });

            const senderData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!senderData || senderData.balance < amount) return interaction.editReply({ content: `❌ Insufficient funds.` });

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', amount, userId);
            await db.execute('INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?', target.id, amount, amount);
            
            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('💸 TRANSACTION CONFIRMED')
                .setDescription(`Transferred **${amount.toLocaleString()} cr** to **${target.username}**.`)
                .setFooter({ text: `Secure Tactical Ledger • ${VERSION}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll('SELECT user_id, balance, bank_balance FROM users ORDER BY (balance + COALESCE(bank_balance, 0)) DESC LIMIT 10');
            if (!top || top.length === 0) return interaction.editReply({ content: '❌ No fiscal data found.' });

            const medals = ['👑', '🥈', '🥉'];
            const lines = top.map((u, i) => {
                const net = ((u.balance || 0) + (u.bank_balance || 0)).toLocaleString();
                return `${medals[i] ?? `**${i + 1}.**`} <@${u.user_id}> — \`${net} cr\``;
            });

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('🏆 GLOBAL FISCAL LEADERBOARD')
                .setDescription(lines.join('\n'))
                .setFooter({ text: `Quantum v8.0.1 • Ranked by Net Worth` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'stats') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT balance, bank_balance, total_earned, daily_streak, level FROM users WHERE user_id = ?', target.id);
            const netWorth = (data?.balance ?? 0) + (data?.bank_balance ?? 0);

            const embed = new EmbedBuilder()
                .setColor(THEME.SECONDARY)
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setTitle('📊 OPERATIVE FISCAL REPORT')
                .addFields(
                    { name: '💰 Net Worth',      value: `\`${netWorth.toLocaleString()} cr\``,   inline: true },
                    { name: '📈 Total Earned',   value: `\`${(data?.total_earned ?? 0).toLocaleString()} cr\``, inline: true },
                    { name: '🔥 Daily Streak',   value: `\`${data?.daily_streak ?? 0} days\``,   inline: true },
                    { name: '⭐ Level',           value: `\`${data?.level ?? 0}\``,              inline: true },
                )
                .setFooter({ text: `Astra Intelligence Agency • ${VERSION}` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'bank') {
            await interaction.deferReply();
            const action = interaction.options.getString('action')!;
            const amount = interaction.options.getInteger('amount')!;
            const data   = await db.fetchOne('SELECT balance, bank_balance FROM users WHERE user_id = ?', userId);
            const liquid = data?.balance ?? 0;
            const vault  = data?.bank_balance ?? 0;

            if (action === 'deposit') {
                if (liquid < amount) return interaction.editReply({ content: `❌ Insufficient liquid funds.` });
                await db.execute('UPDATE users SET balance = balance - ?, bank_balance = COALESCE(bank_balance, 0) + ? WHERE user_id = ?', amount, amount, userId);
                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('🏦 VAULT DEPOSIT CONFIRMED')
                    .setDescription(`Secured **${amount.toLocaleString()} cr** in your vault.`)
                    .setFooter({ text: 'Vault credits are safe from robberies.' });
                return interaction.editReply({ embeds: [embed] });
            } else {
                if (vault < amount) return interaction.editReply({ content: `❌ Insufficient vault funds.` });
                await db.execute('UPDATE users SET balance = balance + ?, bank_balance = bank_balance - ? WHERE user_id = ?', amount, amount, userId);
                const embed = new EmbedBuilder()
                    .setColor(THEME.PRIMARY)
                    .setTitle('🏦 VAULT WITHDRAWAL CONFIRMED')
                    .setDescription(`Withdrawn **${amount.toLocaleString()} cr** to liquid balance.`)
                    .setFooter({ text: `Secure Fiscal Vault • ${VERSION}` });
                return interaction.editReply({ embeds: [embed] });
            }
        }
    }
};

export default command;
