import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME } from '../core/constants';
import logger from '../core/logger';

const CREATE_COST = 50000;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('syndicate')
        .setDescription('🦹 Create and manage your group.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('create')
               .setDescription(`Start a new group. Costs ${CREATE_COST.toLocaleString()} money.`)
               .addStringOption(opt => opt.setName('name').setDescription('Group name.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('info')
               .setDescription('See your group stats and members.')
        )
        .addSubcommand(sub =>
            sub.setName('deposit')
               .setDescription('Put money into the group bank.')
               .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to deposit.').setRequired(true).setMinValue(1))
        )
        .addSubcommand(sub =>
            sub.setName('kick')
               .setDescription('Kick a member from your group. (Owner only)')
               .addUserOption(opt => opt.setName('member').setDescription('The member to remove.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('disband')
               .setDescription('Permanently delete your group and refund the bank. (Owner only)')
        )
        .addSubcommand(sub =>
            sub.setName('leave')
               .setDescription('Leave your current group.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const sub    = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        // ── CREATE ────────────────────────────────────────────────────────
        if (sub === 'create') {
            await interaction.deferReply();
            const name = interaction.options.getString('name')!.trim();

            if (name.length < 2 || name.length > 32) {
                return interaction.editReply({ content: '❌ Group name must be 2–32 characters.' });
            }

            const alreadyIn = await db.fetchOne('SELECT 1 FROM syndicate_members WHERE user_id = ?', userId);
            if (alreadyIn) return interaction.editReply({ content: '❌ You are already in a group. Leave it first.' });

            const nameTaken = await db.fetchOne('SELECT 1 FROM syndicates WHERE name = ?', name);
            if (nameTaken) return interaction.editReply({ content: '❌ A group with that name already exists.' });

            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!user || user.balance < CREATE_COST) {
                return interaction.editReply({ content: `❌ You need **${CREATE_COST.toLocaleString()} money** to start a group. You have \`${(user?.balance ?? 0).toLocaleString()}\`.` });
            }

            try {
                await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', CREATE_COST, userId);
                await db.execute('INSERT INTO syndicates (name, owner_id) VALUES (?, ?)', name, userId);
                const newSyn = await db.fetchOne('SELECT id FROM syndicates WHERE name = ?', name);
                if (!newSyn) throw new Error('Syndicate creation returned no ID.');
                await db.execute('INSERT INTO syndicate_members (syndicate_id, user_id, role) VALUES (?, ?, ?)', newSyn.id, userId, 'owner');

                return interaction.editReply({ embeds: [new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('🦹 GROUP CREATED')
                    .setDescription(`**${name}** is now active. Recruit members!`)
                    .addFields(
                        { name: '💰 Cost', value: `\`${CREATE_COST.toLocaleString()} money\``, inline: true },
                        { name: '👑 Owner', value: `<@${userId}>`, inline: true }
                    )
                    .setFooter({ text: 'Astra Groups' })
                    .setTimestamp()] });
            } catch (err) {
                logger.error(`Syndicate create error: ${err}`);
                return interaction.editReply({ content: '❌ Something went wrong. Try again.' });
            }

        // ── INFO ──────────────────────────────────────────────────────────
        } else if (sub === 'info') {
            await interaction.deferReply();

            const member = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (!member) return interaction.editReply({ content: '❌ You are not in a group. Use `/syndicate create` to start one.' });

            const syn = await db.fetchOne('SELECT * FROM syndicates WHERE id = ?', member.syndicate_id);
            if (!syn) return interaction.editReply({ content: '❌ Group data missing.' });

            // Fixed: use fetchOne for COUNT aggregate
            const countRow = await db.fetchOne('SELECT COUNT(*) as cnt FROM syndicate_members WHERE syndicate_id = ?', member.syndicate_id);
            const memberCount = Number(countRow?.cnt ?? 0);

            const owner = await interaction.client.users.fetch(syn.owner_id).catch(() => null);

            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`🦹 ${syn.name.toUpperCase()}`)
                .addFields(
                    { name: '👑 Owner',       value: owner ? owner.username : `\`${syn.owner_id}\``, inline: true },
                    { name: '👥 Members',     value: `\`${memberCount}\``, inline: true },
                    { name: '⭐ Level',        value: `\`${syn.level ?? 1}\``, inline: true },
                    { name: '💰 Group Bank',  value: `\`${(syn.bank ?? 0).toLocaleString()} money\``, inline: true },
                    { name: '🎖️ Your Role',  value: `\`${member.role.toUpperCase()}\``, inline: true },
                )
                .setFooter({ text: 'Astra Groups' })
                .setTimestamp()] });

        // ── DEPOSIT ───────────────────────────────────────────────────────
        } else if (sub === 'deposit') {
            await interaction.deferReply();
            const amount = interaction.options.getInteger('amount')!;

            const member = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (!member) return interaction.editReply({ content: '❌ You are not in a group.' });

            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!user || user.balance < amount) return interaction.editReply({ content: '❌ Not enough money.' });

            try {
                await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', amount, userId);
                await db.execute('UPDATE syndicates SET bank = bank + ? WHERE id = ?', amount, member.syndicate_id);
                return interaction.editReply({ content: `💰 Deposited **${amount.toLocaleString()} money** into the group bank.` });
            } catch (err) {
                logger.error(`Syndicate deposit error: ${err}`);
                return interaction.editReply({ content: '❌ Deposit failed. Try again.' });
            }

        // ── KICK ──────────────────────────────────────────────────────────
        } else if (sub === 'kick') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const target = interaction.options.getUser('member')!;

            const myMember = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (!myMember || myMember.role !== 'owner') {
                return interaction.editReply({ content: '❌ Only the group owner can kick members.' });
            }
            if (target.id === userId) return interaction.editReply({ content: '❌ You cannot kick yourself.' });

            const targetMember = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ? AND syndicate_id = ?', target.id, myMember.syndicate_id);
            if (!targetMember) return interaction.editReply({ content: '❌ That user is not in your group.' });

            await db.execute('DELETE FROM syndicate_members WHERE user_id = ? AND syndicate_id = ?', target.id, myMember.syndicate_id);
            return interaction.editReply({ content: `✅ **${target.username}** has been removed from the group.` });

        // ── DISBAND ───────────────────────────────────────────────────────
        } else if (sub === 'disband') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            const myMember = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (!myMember || myMember.role !== 'owner') {
                return interaction.editReply({ content: '❌ Only the group owner can disband the group.' });
            }

            const syn = await db.fetchOne('SELECT * FROM syndicates WHERE id = ?', myMember.syndicate_id);
            if (!syn) return interaction.editReply({ content: '❌ Group not found.' });

            // Refund bank balance to owner
            if (syn.bank > 0) {
                await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', syn.bank, userId);
            }

            await db.execute('DELETE FROM syndicate_members WHERE syndicate_id = ?', myMember.syndicate_id);
            await db.execute('DELETE FROM syndicates WHERE id = ?', myMember.syndicate_id);

            return interaction.editReply({
                content: `🗑️ **${syn.name}** has been disbanded.${syn.bank > 0 ? ` The group bank (\`${syn.bank.toLocaleString()} money\`) was returned to you.` : ''}`
            });

        // ── LEAVE ─────────────────────────────────────────────────────────
        } else if (sub === 'leave') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            const member = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (!member) return interaction.editReply({ content: '❌ You are not in a group.' });

            if (member.role === 'owner') {
                return interaction.editReply({ content: '❌ You are the owner. Use `/syndicate disband` to delete the group, or transfer ownership first.' });
            }

            await db.execute('DELETE FROM syndicate_members WHERE user_id = ?', userId);
            return interaction.editReply({ content: '🚪 You have left the group.' });
        }
    }
};

export default command;
