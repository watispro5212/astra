import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

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

// Slot payouts: matching 3 symbols → multiplier on the 50-cr cost
const SLOT_PAYOUTS: Record<string, number> = {
    '💎': 50,   // jackpot
    '🛸': 20,
    '⚡': 10,
    '🔫': 8,
    '🪙': 5,
    '💀': 0,    // lose even on triple skull
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
               .setDescription('View the top 10 wealthiest operatives globally.')
        )
        .addSubcommand(sub =>
            sub.setName('stats')
               .setDescription('📊 View your fiscal statistics and performance report.')
               .addUserOption(opt => opt.setName('user').setDescription('Target operative.'))
        )
        .addSubcommand(sub =>
            sub.setName('bank')
               .setDescription('🏦 Deposit or withdraw credits from your secure vault.')
               .addStringOption(opt => opt.setName('action').setDescription('Deposit or withdraw.').setRequired(true).addChoices(
                   { name: 'Deposit', value: 'deposit' },
                   { name: 'Withdraw', value: 'withdraw' }
               ))
               .addIntegerOption(opt => opt.setName('amount').setDescription('Credit amount.').setRequired(true).setMinValue(1))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        // ── DAILY ─────────────────────────────────────────────────────────────
        if (subcommand === 'daily') {
            const user = await db.fetchOne('SELECT last_daily FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_daily && now - parseInt(user.last_daily) < 86400000) {
                const timeLeft = 86400000 - (now - parseInt(user.last_daily));
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🚨 ALLOCATION DENIED')
                    .setDescription(`Your next credit ration is available in **${formatCooldown(timeLeft)}**.`)
                    .setFooter({ text: 'Astra Fiscal Protocol v7.2.0' })], ephemeral: true });
            }

            await db.execute(
                'INSERT INTO users (user_id, balance, last_daily) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?, last_daily = ?',
                userId, DAILY_AMOUNT, now.toString(), DAILY_AMOUNT, now.toString()
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('💰 DAILY CREDITS ALLOCATED')
                .setDescription(`You have claimed your daily allocation of **${DAILY_AMOUNT.toLocaleString()}** credits.`)
                .addFields(
                    { name: '📈 Amount', value: `\`+${DAILY_AMOUNT.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? DAILY_AMOUNT).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Astra Fiscal Protocol • Sector 08' })] });

        // ── WORK ──────────────────────────────────────────────────────────────
        } else if (subcommand === 'work') {
            const user = await db.fetchOne('SELECT last_work FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_work && now - parseInt(user.last_work) < WORK_COOLDOWN_MS) {
                const timeLeft = WORK_COOLDOWN_MS - (now - parseInt(user.last_work));
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🚨 ASSIGNMENT UNAVAILABLE')
                    .setDescription(`Your next deployment is available in **${formatCooldown(timeLeft)}**.\nRest is required between tactical assignments.`)], ephemeral: true });
            }

            const earned = Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;
            const task = WORK_RESPONSES[Math.floor(Math.random() * WORK_RESPONSES.length)];

            await db.execute(
                'INSERT INTO users (user_id, balance, last_work) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?, last_work = ?',
                userId, earned, now.toString(), earned, now.toString()
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🔧 ASSIGNMENT COMPLETE')
                .setDescription(`*${task}*`)
                .addFields(
                    { name: '💰 Credits Earned', value: `\`+${earned.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? earned).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Next assignment available in 60 minutes.' })] });

        // ── MINE ──────────────────────────────────────────────────────────────
        } else if (subcommand === 'mine') {
            const user = await db.fetchOne('SELECT last_mine, balance FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_mine && now - parseInt(user.last_mine) < MINE_COOLDOWN_MS) {
                const timeLeft = MINE_COOLDOWN_MS - (now - parseInt(user.last_mine));
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🚨 EXTRACTION UNAVAILABLE')
                    .setDescription(`Coolant systems are still active. Ready in **${formatCooldown(timeLeft)}**.`)], ephemeral: true });
            }

            const success = Math.random() > 0.30; // 70% success
            const currentBalance = user?.balance ?? 0;
            const yieldAmount = success
                ? Math.floor(Math.random() * 2000) + 500
                : -Math.min(Math.floor(Math.random() * 1000), currentBalance); // never go below 0

            // FIX: use MAX to ensure balance never goes negative on DB side either
            await db.execute(
                'INSERT INTO users (user_id, balance, last_mine) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = MAX(0, balance + ?), last_mine = ?',
                userId, Math.max(0, yieldAmount), now.toString(), yieldAmount, now.toString()
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setTitle(success ? '⛏️ EXTRACTION SUCCESS' : '🚨 EXTRACTION FAILURE')
                .setColor(success ? 0x2ecc71 : 0xe74c3c)
                .setDescription(success
                    ? `Tactical extraction complete. Sub-sector core yielded a rich vein.`
                    : `Extraction probe malfunctioned. Infrastructure repairs incurred a cost.`)
                .addFields(
                    { name: success ? '💰 Yield' : '🔧 Repair Cost', value: `\`${success ? '+' : ''}${yieldAmount.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Astra Mining Protocol • v7.2.0' })] });

        // ── HARVEST ───────────────────────────────────────────────────────────
        } else if (subcommand === 'harvest') {
            const inventory = await db.fetchAll(`
                SELECT ui.id, ui.last_harvest, si.name, si.production_rate, si.emoji
                FROM user_inventory ui
                JOIN shop_items si ON ui.item_id = si.id
                WHERE ui.user_id = ? AND si.production_rate > 0
            `, userId);

            if (!inventory || inventory.length === 0) {
                return interaction.reply({ content: '❌ You own no yield-bearing assets. Visit `/shop view` to acquire passive income items.', ephemeral: true });
            }

            let totalHarvest = 0;
            const lines: string[] = [];

            for (const inv of inventory) {
                const hoursElapsed = (Date.now() - new Date(inv.last_harvest).getTime()) / 3600000;
                const pendingCredits = Math.floor(hoursElapsed * inv.production_rate);

                if (pendingCredits > 0) {
                    totalHarvest += pendingCredits;
                    lines.push(`${inv.emoji ?? '📦'} **${inv.name}** — \`+${pendingCredits.toLocaleString()} cr\``);
                    await db.execute('UPDATE user_inventory SET last_harvest = ? WHERE id = ?', new Date().toISOString(), inv.id);
                }
            }

            if (totalHarvest === 0) {
                return interaction.reply({ content: '⏳ Your assets have not generated enough credits to harvest yet. Check back later.', ephemeral: true });
            }

            await db.execute(
                'INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?',
                userId, totalHarvest, totalHarvest
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('🌾 PASSIVE INCOME HARVESTED')
                .setDescription(lines.join('\n'))
                .addFields(
                    { name: '💰 Total Collected', value: `\`+${totalHarvest.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Astra Industrial Yield Engine v7.2.0' })
                .setTimestamp()] });

        // ── ROB ───────────────────────────────────────────────────────────────
        } else if (subcommand === 'rob') {
            const target = interaction.options.getUser('user')!;

            if (target.id === userId) return interaction.reply({ content: '❌ You cannot rob yourself.', ephemeral: true });
            if (target.bot) return interaction.reply({ content: '❌ Automated systems cannot be robbed.', ephemeral: true });

            const robberData = await db.fetchOne('SELECT balance, last_rob FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (robberData?.last_rob && now - parseInt(robberData.last_rob) < ROB_COOLDOWN_MS) {
                const timeLeft = ROB_COOLDOWN_MS - (now - parseInt(robberData.last_rob));
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🚨 OPERATION DENIED')
                    .setDescription(`Intelligence operatives are tracking you. Lay low for **${formatCooldown(timeLeft)}**.`)], ephemeral: true });
            }

            const targetData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', target.id);
            const targetBalance = targetData?.balance ?? 0;

            if (targetBalance < 200) {
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🦹 INSUFFICIENT TARGET FUNDS')
                    .setDescription(`**${target.username}** is practically broke. Not worth the risk.`)
                    .setFooter({ text: 'Minimum target balance: 200 cr' })], ephemeral: true });
            }

            // 40% success rate
            const success = Math.random() < 0.40;
            await db.execute(
                'INSERT INTO users (user_id, balance, last_rob) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET last_rob = ?',
                userId, 0, now.toString(), now.toString()
            );

            if (success) {
                const stolen = Math.floor(targetBalance * (Math.random() * 0.20 + 0.10)); // steal 10–30%
                await db.execute('UPDATE users SET balance = MAX(0, balance - ?) WHERE user_id = ?', stolen, target.id);
                await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', stolen, userId);
                const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0x9b59b6)
                    .setTitle('🦹 HEIST SUCCESSFUL')
                    .setDescription(`You slipped past **${target.username}**'s defences and made off with their credits.`)
                    .addFields(
                        { name: '💰 Stolen', value: `\`+${stolen.toLocaleString()} cr\``, inline: true },
                        { name: '💳 Your Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                    )
                    .setFooter({ text: 'Astra Black Division • Covert Ops' })] });
            } else {
                const robberBalance = robberData?.balance ?? 0;
                const fine = Math.min(Math.floor(robberBalance * 0.15), robberBalance);
                if (fine > 0) {
                    await db.execute('UPDATE users SET balance = MAX(0, balance - ?) WHERE user_id = ?', fine, userId);
                }
                const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🚨 HEIST FAILED')
                    .setDescription(`You were caught attempting to rob **${target.username}** and fined for the attempt.`)
                    .addFields(
                        { name: '🔧 Fine', value: `\`-${fine.toLocaleString()} cr\``, inline: true },
                        { name: '💳 Your Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                    )
                    .setFooter({ text: '2-hour lockout applied.' })] });
            }

        // ── GAMBLE ────────────────────────────────────────────────────────────
        } else if (subcommand === 'gamble') {
            const amount = interaction.options.getInteger('amount')!;
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < amount) {
                return interaction.reply({ content: `❌ Insufficient credits. You have \`${balance.toLocaleString()} cr\`.`, ephemeral: true });
            }

            const win = Math.random() < 0.45; // 45% win
            const delta = win ? Math.floor(amount * 1.8) - amount : -amount;

            await db.execute(
                'INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = MAX(0, balance + ?)',
                userId, Math.max(0, balance + delta), delta
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(win ? 0x2ecc71 : 0xe74c3c)
                .setTitle(win ? '🎰 GAMBLE: WIN' : '🎰 GAMBLE: LOSS')
                .setDescription(win
                    ? `The odds favoured you. Your wager of **${amount.toLocaleString()} cr** returned **${(amount + delta).toLocaleString()} cr**.`
                    : `The house always wins. Your wager of **${amount.toLocaleString()} cr** was lost.`)
                .addFields(
                    { name: win ? '💰 Net Gain' : '💸 Net Loss', value: `\`${win ? '+' : ''}${delta.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Astra Fiscal Risk Division • House odds: 55%' })] });

        // ── SLOTS ─────────────────────────────────────────────────────────────
        } else if (subcommand === 'slots') {
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < SLOTS_COST) {
                return interaction.reply({ content: `❌ Slot machines cost **${SLOTS_COST} cr** per spin. You have \`${balance.toLocaleString()} cr\`.`, ephemeral: true });
            }

            // Deduct spin cost first
            await db.execute(
                'INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = MAX(0, balance - ?)',
                userId, Math.max(0, balance - SLOTS_COST), SLOTS_COST
            );

            const reels = spinReels();
            const [a, b, c] = reels;
            let payout = 0;
            let resultText = '';

            if (a === b && b === c) {
                // Triple match
                const multiplier = SLOT_PAYOUTS[a] ?? 3;
                payout = SLOTS_COST * multiplier;
                resultText = multiplier >= 20
                    ? `🎊 **JACKPOT!** Triple ${a} — Multiplier: **×${multiplier}**`
                    : multiplier > 0
                    ? `✨ **TRIPLE MATCH!** ${a} — Multiplier: **×${multiplier}**`
                    : `💀 **TRIPLE SKULL** — No payout.`;
            } else if (a === b || b === c || a === c) {
                // Partial match
                payout = Math.floor(SLOTS_COST * 1.5);
                resultText = `🔸 **PARTIAL MATCH** — Small return of **${payout} cr**.`;
            } else {
                resultText = `❌ **NO MATCH** — Better luck next spin.`;
            }

            if (payout > 0) {
                await db.execute(
                    'UPDATE users SET balance = balance + ? WHERE user_id = ?',
                    payout, userId
                );
            }

            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const net = payout - SLOTS_COST;

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(payout > SLOTS_COST ? 0x2ecc71 : payout > 0 ? 0xf1c40f : 0xe74c3c)
                .setTitle('🎰 SLOT MACHINE')
                .setDescription(`\`[ ${a}  ${b}  ${c} ]\`\n\n${resultText}`)
                .addFields(
                    { name: net >= 0 ? '💰 Net Gain' : '💸 Net Loss', value: `\`${net >= 0 ? '+' : ''}${net.toLocaleString()} cr\``, inline: true },
                    { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: `Spin cost: ${SLOTS_COST} cr • Jackpot: ×50 on triple 💎` })] });

        // ── COINFLIP ──────────────────────────────────────────────────────────
        } else if (subcommand === 'coinflip') {
            const amount = interaction.options.getInteger('amount')!;
            const choice = interaction.options.getString('choice')!;
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < amount) {
                return interaction.reply({ content: `❌ Insufficient credits. You have \`${balance.toLocaleString()} cr\`.`, ephemeral: true });
            }

            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            const win = result === choice;
            const delta = win ? amount : -amount;

            await db.execute(
                'INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = MAX(0, balance + ?)',
                userId, Math.max(0, balance + delta), delta
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const coin = result === 'heads' ? '🪙 **HEADS**' : '🔘 **TAILS**';

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(win ? 0x2ecc71 : 0xe74c3c)
                .setTitle(`🪙 COINFLIP: ${win ? 'WIN' : 'LOSS'}`)
                .setDescription(`The coin landed on ${coin}.\nYou called **${choice.toUpperCase()}** — ${win ? '**Correct!**' : '**Wrong.**'}`)
                .addFields(
                    { name: win ? '💰 Gained' : '💸 Lost', value: `\`${win ? '+' : '-'}${amount.toLocaleString()} cr\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                )
                .setFooter({ text: 'Astra Fiscal Risk Division • Fair 50/50' })] });

        // ── BALANCE ───────────────────────────────────────────────────────────
        } else if (subcommand === 'balance') {
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT balance, bank_balance, xp, level, total_earned, daily_streak FROM users WHERE user_id = ?', target.id);
            const balance = data?.balance ?? 0;
            const bank    = data?.bank_balance ?? 0;

            // Pending harvest
            const inventory = await db.fetchAll(`
                SELECT ui.last_harvest, si.production_rate
                FROM user_inventory ui
                JOIN shop_items si ON ui.item_id = si.id
                WHERE ui.user_id = ? AND si.production_rate > 0
            `, target.id);
            let pendingHarvest = 0;
            for (const inv of inventory) {
                const hrs = (Date.now() - new Date(inv.last_harvest).getTime()) / 3600000;
                pendingHarvest += Math.floor(hrs * inv.production_rate);
            }

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setTitle('💳 FISCAL STATUS')
                .addFields(
                    { name: '💰 Liquid Credits', value: `\`${balance.toLocaleString()} cr\``,      inline: true },
                    { name: '🏦 Vault Balance',  value: `\`${bank.toLocaleString()} cr\``,         inline: true },
                    { name: '💼 Total Assets',   value: `\`${(balance + bank).toLocaleString()} cr\``, inline: true },
                    { name: '⭐ Level',           value: `\`${data?.level ?? 0}\``,                 inline: true },
                    { name: '🔥 Daily Streak',   value: `\`${data?.daily_streak ?? 0} days\``,     inline: true },
                    { name: '🌾 Pending Harvest', value: `\`${pendingHarvest.toLocaleString()} cr\``, inline: true },
                )
                .setFooter({ text: 'Astra Intelligence Agency • Fiscal Report' })
                .setTimestamp()] });

        // ── PAY ───────────────────────────────────────────────────────────────
        } else if (subcommand === 'pay') {
            const target = interaction.options.getUser('user')!;
            const amount = interaction.options.getInteger('amount')!;

            if (target.id === userId) return interaction.reply({ content: '❌ Intra-sector transfers to oneself are prohibited.', ephemeral: true });
            if (target.bot) return interaction.reply({ content: '❌ Automated systems cannot hold fiscal assets.', ephemeral: true });

            const senderData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!senderData || senderData.balance < amount) {
                return interaction.reply({ content: `❌ Insufficient credit liquidity. You have \`${(senderData?.balance ?? 0).toLocaleString()} cr\`.`, ephemeral: true });
            }

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', amount, userId);
            await db.execute(
                'INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?',
                target.id, amount, amount
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('💸 TRANSACTION CONFIRMED')
                .setDescription(`Successfully transferred **${amount.toLocaleString()} cr** to **${target.username}**.`)
                .addFields({ name: '💳 Your Remaining Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true })
                .setFooter({ text: 'Secure Tactical Ledger • Astra v7.2.0' })] });

        // ── LEADERBOARD ───────────────────────────────────────────────────────
        } else if (subcommand === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll('SELECT user_id, balance, bank_balance FROM users ORDER BY (balance + COALESCE(bank_balance, 0)) DESC LIMIT 10');

            if (!top || top.length === 0) {
                return interaction.editReply({ content: '❌ Global fiscal diagnostic returned zero data.' });
            }

            const medals = ['👑', '🥈', '🥉'];
            const description = top.map((entry, i) =>
                `${medals[i] ?? `**${i + 1}.**`} <@${entry.user_id}> — \`${((entry.balance || 0) + (entry.bank_balance || 0)).toLocaleString()} cr\``
            ).join('\n');

            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0xf1c40f)
                .setTitle('🏆 GLOBAL FISCAL LEADERBOARD')
                .setDescription(description)
                .setFooter({ text: 'Net worth = Liquid + Vault • Astra v7.2.0' })
                .setTimestamp()] });

        // ── STATS ─────────────────────────────────────────────────────────────
        } else if (subcommand === 'stats') {
            const target   = interaction.options.getUser('user') || interaction.user;
            const data     = await db.fetchOne(
                'SELECT balance, bank_balance, total_earned, daily_streak, level FROM users WHERE user_id = ?',
                target.id
            );
            const total    = data?.total_earned    ?? 0;
            const streak   = data?.daily_streak    ?? 0;
            const liquid   = data?.balance         ?? 0;
            const bank     = data?.bank_balance    ?? 0;
            const netWorth = liquid + bank;

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x9b59b6)
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setTitle('📊 OPERATIVE FISCAL REPORT')
                .addFields(
                    { name: '💰 Net Worth',      value: `\`${netWorth.toLocaleString()} cr\``,   inline: true },
                    { name: '📈 Total Earned',   value: `\`${total.toLocaleString()} cr\``,      inline: true },
                    { name: '🔥 Daily Streak',   value: `\`${streak} days\``,                    inline: true },
                    { name: '💳 Liquid',         value: `\`${liquid.toLocaleString()} cr\``,     inline: true },
                    { name: '🏦 Vault',          value: `\`${bank.toLocaleString()} cr\``,       inline: true },
                    { name: '⭐ Level',           value: `\`${data?.level ?? 0}\``,              inline: true },
                )
                .setFooter({ text: 'Astra Intelligence Agency • Operative Stats' })
                .setTimestamp()] });

        // ── BANK ──────────────────────────────────────────────────────────────
        } else if (subcommand === 'bank') {
            const action = interaction.options.getString('action')!;
            const amount = interaction.options.getInteger('amount')!;
            const data   = await db.fetchOne('SELECT balance, bank_balance FROM users WHERE user_id = ?', userId);
            const liquid = data?.balance      ?? 0;
            const vault  = data?.bank_balance ?? 0;

            if (action === 'deposit') {
                if (liquid < amount) {
                    return interaction.reply({ content: `❌ Insufficient liquid credits. You have \`${liquid.toLocaleString()} cr\`.`, ephemeral: true });
                }
                await db.execute('UPDATE users SET balance = balance - ?, bank_balance = COALESCE(bank_balance, 0) + ? WHERE user_id = ?', amount, amount, userId);
                const after = await db.fetchOne('SELECT balance, bank_balance FROM users WHERE user_id = ?', userId);
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('🏦 VAULT DEPOSIT CONFIRMED')
                    .setDescription(`Secured **${amount.toLocaleString()} cr** in your vault.`)
                    .addFields(
                        { name: '💰 Liquid', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``,      inline: true },
                        { name: '🏦 Vault',  value: `\`${(after?.bank_balance ?? 0).toLocaleString()} cr\``, inline: true },
                    )
                    .setFooter({ text: 'Vault credits are safe from rob/gamble events.' })] });

            } else {
                if (vault < amount) {
                    return interaction.reply({ content: `❌ Insufficient vault balance. Your vault holds \`${vault.toLocaleString()} cr\`.`, ephemeral: true });
                }
                await db.execute('UPDATE users SET balance = balance + ?, bank_balance = bank_balance - ? WHERE user_id = ?', amount, amount, userId);
                const after = await db.fetchOne('SELECT balance, bank_balance FROM users WHERE user_id = ?', userId);
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle('🏦 VAULT WITHDRAWAL CONFIRMED')
                    .setDescription(`Withdrawn **${amount.toLocaleString()} cr** to liquid balance.`)
                    .addFields(
                        { name: '💰 Liquid', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``,      inline: true },
                        { name: '🏦 Vault',  value: `\`${(after?.bank_balance ?? 0).toLocaleString()} cr\``, inline: true },
                    )
                    .setFooter({ text: 'Astra Secure Fiscal Vault • v7.2.0' })] });
            }
        }
    }
};

export default command;
