import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME } from '../core/constants';

const WORK_COOLDOWN_MS = 3600000;  // 1 hour
const MINE_COOLDOWN_MS = 1800000;  // 30 mins
const ROB_COOLDOWN_MS  = 7200000;  // 2 hours
const WORK_MIN  = 250;
const WORK_MAX  = 750;
const DAILY_AMOUNT = 2500;
const SLOTS_COST   = 50;
const GAMBLE_MIN   = 100;

const WORK_RESPONSES = [
    '🛰️ You fixed a satellite.',
    '🕵️ You found some lost data.',
    '🛡️ You helped guard the server.',
    '🧪 You made some medicine in the lab.',
    '🔧 You fixed the engines.',
    '📊 You finished some paperwork.',
    '🚀 You flew a delivery drone.',
    '🔬 You solved a puzzle and got some info.',
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
        .setDescription('💰 Bot money and mining system.')
        .setDMPermission(true)
        .addSubcommand(sub =>
            sub.setName('daily')
               .setDescription('Get your daily money.')
        )
        .addSubcommand(sub =>
            sub.setName('work')
               .setDescription('Work for some money.')
        )
        .addSubcommand(sub =>
            sub.setName('mine')
               .setDescription('⛏️ Go mining (Risky!).')
        )
        .addSubcommand(sub =>
            sub.setName('harvest')
               .setDescription('🌾 Collect money from your items.')
        )
        .addSubcommand(sub =>
            sub.setName('rob')
               .setDescription('🦹 Try to steal money from someone.')
               .addUserOption(opt => opt.setName('user').setDescription('The person to rob.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('gamble')
               .setDescription('🎰 Bet some money — 45% chance to win big!')
               .addIntegerOption(opt => opt.setName('amount').setDescription(`How much money to bet (min ${GAMBLE_MIN}).`).setRequired(true).setMinValue(GAMBLE_MIN))
        )
        .addSubcommand(sub =>
            sub.setName('slots')
               .setDescription(`🎰 Spin the slot machine (costs ${SLOTS_COST} money per spin).`)
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
               .setDescription('Check how much money you have.')
               .addUserOption(opt => opt.setName('user').setDescription('The person to check.'))
        )
        .addSubcommand(sub =>
            sub.setName('pay')
               .setDescription('Send money to someone.')
               .addUserOption(opt => opt.setName('user').setDescription('The person to pay.').setRequired(true))
               .addIntegerOption(opt => opt.setName('amount').setDescription('How much to send.').setRequired(true).setMinValue(1))
        )
        .addSubcommand(sub =>
            sub.setName('leaderboard')
               .setDescription('See who is the richest.')
        )
        .addSubcommand(sub =>
            sub.setName('stats')
               .setDescription('📊 See your money stats.')
               .addUserOption(opt => opt.setName('user').setDescription('The person to check.'))
        )
        .addSubcommand(sub =>
            sub.setName('bank')
               .setDescription('🏦 Put your money in the bank or take it out.')
               .addStringOption(opt => opt.setName('action').setDescription('Deposit or withdraw.').setRequired(true).addChoices(
                   { name: 'Deposit', value: 'deposit' },
                   { name: 'Withdraw', value: 'withdraw' }
               ))
               .addIntegerOption(opt => opt.setName('amount').setDescription('How much money.').setRequired(true).setMinValue(1))
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
                    .setTitle('🚨 WAIT A BIT')
                    .setDescription(`You can get more money in **${formatCooldown(timeLeft)}**.`)
                    .setFooter({ text: `Astra Money` });
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
                'INSERT INTO users (user_id, balance, total_earned, last_daily, daily_streak) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = users.balance + ?, total_earned = users.total_earned + ?, last_daily = ?, daily_streak = ?',
                userId, totalDaily, totalDaily, now.toString(), streak, totalDaily, totalDaily, now.toString(), streak
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('💰 DAILY MONEY RECEIVED')
                .setDescription(`You got your daily money. You have a **${streak} day streak**!`)
                .addFields(
                    { name: '📈 Amount', value: `\`${DAILY_AMOUNT.toLocaleString()} money\``, inline: true },
                    { name: '🔥 Streak Bonus', value: `\`+${streakBonus.toLocaleString()} money\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? totalDaily).toLocaleString()} money\``, inline: true }
                )
                .setFooter({ text: `Astra Money` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'work') {
            await interaction.deferReply();
            const user = await db.fetchOne('SELECT last_work FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_work && now - parseInt(user.last_work) < WORK_COOLDOWN_MS) {
                const timeLeft = WORK_COOLDOWN_MS - (now - parseInt(user.last_work));
                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 NOT READY YET')
                    .setDescription(`You can work again in **${formatCooldown(timeLeft)}**.\nTake a break!`)
                    .setFooter({ text: `Astra Work` });
                return interaction.editReply({ embeds: [embed] });
            }

            const earned = Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;
            const task = WORK_RESPONSES[Math.floor(Math.random() * WORK_RESPONSES.length)];

            await db.execute(
                'INSERT INTO users (user_id, balance, total_earned, last_work) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = users.balance + ?, total_earned = users.total_earned + ?, last_work = ?',
                userId, earned, earned, now.toString(), earned, earned, now.toString()
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🔧 WORK DONE')
                .setDescription(`*${task}*`)
                .addFields(
                    { name: '💰 Money Earned', value: `\`+${earned.toLocaleString()} money\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? earned).toLocaleString()} money\``, inline: true }
                )
                .setFooter({ text: 'Good job!' });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'mine') {
            await interaction.deferReply();
            const user = await db.fetchOne('SELECT last_mine, balance FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (user?.last_mine && now - parseInt(user.last_mine) < MINE_COOLDOWN_MS) {
                const timeLeft = MINE_COOLDOWN_MS - (now - parseInt(user.last_mine));
                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 MINING NOT READY')
                    .setDescription(`The tools are cooling down. Ready in **${formatCooldown(timeLeft)}**.`)
                    .setFooter({ text: `Astra Mining` });
                return interaction.editReply({ embeds: [embed] });
            }

            const success = Math.random() > 0.30;
            const currentBalance = user?.balance ?? 0;
            const yieldAmount = success
                ? Math.floor(Math.random() * 2000) + 500
                : -Math.min(Math.floor(Math.random() * 1000), currentBalance);

            await db.execute(
                'INSERT INTO users (user_id, balance, total_earned, last_mine) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = GREATEST(0, users.balance + ?), total_earned = users.total_earned + ?, last_mine = ?',
                userId, Math.max(0, yieldAmount), success ? yieldAmount : 0, now.toString(), yieldAmount, success ? yieldAmount : 0, now.toString()
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setTitle(success ? '⛏️ MINING SUCCESS' : '🚨 MINING FAILED')
                .setColor(success ? THEME.SUCCESS : THEME.DANGER)
                .setDescription(success
                    ? `You found a lot of crystals while mining!`
                    : `Your tools broke while mining. It cost money to fix them.`)
                .addFields(
                    { name: success ? '💰 Found' : '🔧 Repair Cost', value: `\`${success ? '+' : ''}${yieldAmount.toLocaleString()} money\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} money\``, inline: true }
                )
                .setFooter({ text: `Astra Mining` });
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
                return interaction.editReply({ content: '❌ You don\'t own anything that makes money. Go to the `/shop view` to buy some items!' });
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
                    lines.push(`${inv.emoji ?? '📦'} **${inv.name}** ×${inv.quantity} — \`+${pendingCredits.toLocaleString()} money\``);
                    
                    // Fixed fractional loss
                    const exactMsGained = (pendingCredits / totalRate) * 3600000;
                    const newHarvestTime = new Date(lastHarvestTime + exactMsGained);
                    
                    await db.execute('UPDATE user_inventory SET last_harvest = ? WHERE id = ?', newHarvestTime.toISOString(), inv.id);
                }
            }

            if (totalHarvest === 0) {
                return interaction.editReply({ content: '⏳ Your items haven\'t made any money yet. Check back later!' });
            }

            await db.execute(
                'INSERT INTO users (user_id, balance, total_earned) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = users.balance + ?, total_earned = users.total_earned + ?',
                userId, totalHarvest, totalHarvest, totalHarvest, totalHarvest
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('🌾 MONEY COLLECTED')
                .setDescription(lines.join('\n'))
                .addFields(
                    { name: '💰 Total Collected', value: `\`+${totalHarvest.toLocaleString()} money\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} money\``, inline: true }
                )
                .setFooter({ text: `Astra Money` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'rob') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user')!;
            if (target.id === userId) return interaction.editReply({ content: '❌ You can\'t rob yourself!' });
            if (target.bot) return interaction.editReply({ content: '❌ You can\'t rob a bot!' });

            const robberData = await db.fetchOne('SELECT balance, last_rob FROM users WHERE user_id = ?', userId);
            const now = Date.now();

            if (robberData?.last_rob && now - parseInt(robberData.last_rob) < ROB_COOLDOWN_MS) {
                const timeLeft = ROB_COOLDOWN_MS - (now - parseInt(robberData.last_rob));
                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 CAN\'T ROB YET')
                    .setDescription(`The police are watching. Wait **${formatCooldown(timeLeft)}**.`)
                    .setFooter({ text: `Astra Robbing` });
                return interaction.editReply({ embeds: [embed] });
            }

            const targetData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', target.id);
            const targetBalance = targetData?.balance ?? 0;

            if (targetBalance < 200) {
                return interaction.editReply({ content: `❌ **${target.username}** doesn't have enough money to rob.` });
            }

            const success = Math.random() < 0.40;
            await db.execute(
                'INSERT INTO users (user_id, balance, last_rob) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET last_rob = ?',
                userId, 0, now.toString(), now.toString()
            );

            if (success) {
                const stolen = Math.floor(targetBalance * (Math.random() * 0.20 + 0.10));
                await db.execute('UPDATE users SET balance = GREATEST(0, balance - ?) WHERE user_id = ?', stolen, target.id);
                await db.execute('UPDATE users SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?', stolen, stolen, userId);
                const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

                const embed = new EmbedBuilder()
                    .setColor(THEME.SECONDARY)
                    .setTitle('🦹 ROBBED!')
                    .setDescription(`You successfully stole from **${target.username}**.`)
                    .addFields(
                        { name: '💰 Stolen', value: `\`+${stolen.toLocaleString()} money\``, inline: true },
                        { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} money\``, inline: true }
                    )
                    .setFooter({ text: 'Astra Robbing' });
                return interaction.editReply({ embeds: [embed] });
            } else {
                const robberBalance = robberData?.balance ?? 0;
                const fine = Math.min(Math.floor(robberBalance * 0.15), robberBalance);
                if (fine > 0) await db.execute('UPDATE users SET balance = GREATEST(0, balance - ?) WHERE user_id = ?', fine, userId);
                const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 ROBBERY FAILED')
                    .setDescription(`You were caught and had to pay a fine.`)
                    .addFields(
                        { name: '🔧 Fine', value: `\`-${fine.toLocaleString()} money\``, inline: true },
                        { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} money\``, inline: true }
                    )
                    .setFooter({ text: 'Don\'t get caught next time!' });
                return interaction.editReply({ embeds: [embed] });
            }

        } else if (subcommand === 'gamble') {
            await interaction.deferReply();
            const amount = interaction.options.getInteger('amount')!;
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < amount) return interaction.editReply({ content: `❌ You don't have enough money.` });

            const win = Math.random() < 0.45;
            const delta = win ? Math.floor(amount * 1.8) - amount : -amount;

            await db.execute('UPDATE users SET balance = GREATEST(0, balance + ?), total_earned = total_earned + ? WHERE user_id = ?', delta, win ? delta : 0, userId);
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);

            const embed = new EmbedBuilder()
                .setColor(win ? THEME.SUCCESS : THEME.DANGER)
                .setTitle(win ? '🎰 GAMBLE: WIN' : '🎰 GAMBLE: LOSS')
                .setDescription(win
                    ? `You got lucky! Your bet returned **${(amount + delta).toLocaleString()} money**.`
                    : `Bad luck, the house won this time. Your bet was lost.`)
                .addFields(
                    { name: win ? '💰 Gain' : '💸 Loss', value: `\`${win ? '+' : ''}${delta.toLocaleString()} money\``, inline: true },
                    { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} money\``, inline: true }
                )
                .setFooter({ text: `Astra Gambling` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'slots') {
            await interaction.deferReply();
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < SLOTS_COST) return interaction.editReply({ content: `❌ Slots cost **${SLOTS_COST} money**.` });

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
                    { name: net >= 0 ? '💰 Net Gain' : '💸 Net Loss', value: `\`${net >= 0 ? '+' : ''}${net.toLocaleString()} money\``, inline: true },
                    { name: '💳 Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} money\``, inline: true }
                )
                .setFooter({ text: `Astra Casino` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'coinflip') {
            await interaction.deferReply();
            const amount = interaction.options.getInteger('amount')!;
            const choice = interaction.options.getString('choice')!;
            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const balance = userData?.balance ?? 0;

            if (balance < amount) return interaction.editReply({ content: `❌ You don't have enough money.` });

            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            const win = result === choice;
            const delta = win ? amount : -amount;

            await db.execute('UPDATE users SET balance = GREATEST(0, balance + ?), total_earned = total_earned + ? WHERE user_id = ?', delta, win ? amount : 0, userId);
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            const coin = result === 'heads' ? '🪙 **HEADS**' : '🔘 **TAILS**';

            const embed = new EmbedBuilder()
                .setColor(win ? THEME.SUCCESS : THEME.DANGER)
                .setTitle(`🪙 COINFLIP: ${win ? 'WIN' : 'LOSS'}`)
                .setDescription(`The coin landed on ${coin}.\nYou called **${choice.toUpperCase()}**.`)
                .addFields(
                    { name: win ? '💰 Gained' : '💸 Lost', value: `\`${win ? '+' : '-'}${amount.toLocaleString()} money\``, inline: true },
                    { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} money\``, inline: true }
                )
                .setFooter({ text: `Fair 50/50` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'balance') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT balance, bank_balance FROM users WHERE user_id = ?', target.id);
            const liquid = data?.balance ?? 0;
            const vault  = data?.bank_balance ?? 0;

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setAuthor({ name: `${target.username}'s Money Report`, iconURL: target.displayAvatarURL() })
                .addFields(
                    { name: '💰 Cash', value: `\`${liquid.toLocaleString()} money\``, inline: true },
                    { name: '🏦 Bank Balance',  value: `\`${vault.toLocaleString()} money\``,  inline: true },
                    { name: '💼 Total Money',   value: `\`${(liquid + vault).toLocaleString()} money\``, inline: true }
                )
                .setFooter({ text: `Astra Money Info` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'pay') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user')!;
            const amount = interaction.options.getInteger('amount')!;

            if (target.id === userId) return interaction.editReply({ content: '❌ You can\'t pay yourself!' });
            if (target.bot) return interaction.editReply({ content: '❌ Bots don\'t use money!' });

            const senderData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!senderData || senderData.balance < amount) return interaction.editReply({ content: `❌ You don't have enough money.` });

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', amount, userId);
            await db.execute('INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = users.balance + ?', target.id, amount, amount);
            
            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('💸 MONEY SENT')
                .setDescription(`You sent **${amount.toLocaleString()} money** to **${target.username}**.`)
                .setFooter({ text: `Transaction confirmed` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll('SELECT user_id, balance, bank_balance FROM users ORDER BY (balance + COALESCE(bank_balance, 0)) DESC LIMIT 10');
            if (!top || top.length === 0) return interaction.editReply({ content: '❌ No money data found.' });

            const medals = ['👑', '🥈', '🥉'];
            const lines = top.map((u, i) => {
                const net = ((u.balance || 0) + (u.bank_balance || 0)).toLocaleString();
                return `${medals[i] ?? `**${i + 1}.**`} <@${u.user_id}> — \`${net} money\``;
            });

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('🏆 RICHEST MEMBERS')
                .setDescription(lines.join('\n'))
                .setFooter({ text: `Astra Bot` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'stats') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT balance, bank_balance, total_earned, daily_streak, level FROM users WHERE user_id = ?', target.id);
            const netWorth = (data?.balance ?? 0) + (data?.bank_balance ?? 0);

            const embed = new EmbedBuilder()
                .setColor(THEME.SECONDARY)
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setTitle('📊 MONEY STATS')
                .addFields(
                    { name: '💰 Total Money',    value: `\`${netWorth.toLocaleString()} money\``,   inline: true },
                    { name: '📈 Total Earned',   value: `\`${(data?.total_earned ?? 0).toLocaleString()} money\``, inline: true },
                    { name: '🔥 Daily Streak',   value: `\`${data?.daily_streak ?? 0} days\``,   inline: true },
                    { name: '⭐ Level',           value: `\`${data?.level ?? 0}\``,              inline: true },
                )
                .setFooter({ text: `Astra Bot` });
            return interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'bank') {
            await interaction.deferReply();
            const action = interaction.options.getString('action')!;
            const amount = interaction.options.getInteger('amount')!;
            const data   = await db.fetchOne('SELECT balance, bank_balance FROM users WHERE user_id = ?', userId);
            const liquid = data?.balance ?? 0;
            const vault  = data?.bank_balance ?? 0;

            if (action === 'deposit') {
                if (liquid < amount) return interaction.editReply({ content: `❌ You don't have enough money on you.` });
                await db.execute('UPDATE users SET balance = balance - ?, bank_balance = COALESCE(bank_balance, 0) + ? WHERE user_id = ?', amount, amount, userId);
                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('🏦 MONEY DEPOSITED')
                    .setDescription(`Put **${amount.toLocaleString()} money** in the bank.`)
                    .setFooter({ text: 'Money in the bank is safe from stealing.' });
                return interaction.editReply({ embeds: [embed] });
            } else {
                if (vault < amount) return interaction.editReply({ content: `❌ You don't have enough money in the bank.` });
                await db.execute('UPDATE users SET balance = balance + ?, bank_balance = bank_balance - ? WHERE user_id = ?', amount, amount, userId);
                const embed = new EmbedBuilder()
                    .setColor(THEME.PRIMARY)
                    .setTitle('🏦 MONEY WITHDRAWN')
                    .setDescription(`Took **${amount.toLocaleString()} money** out of the bank.`)
                    .setFooter({ text: `Astra Bank` });
                return interaction.editReply({ embeds: [embed] });
            }
        }
    }
};

export default command;
