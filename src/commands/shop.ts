import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import logger from '../core/logger';

const SELL_REFUND_RATE = 0.50; // 50% refund on sell-back

/** Group an array by a key function */
function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
    return arr.reduce((acc, item) => {
        const k = key(item);
        if (!acc[k]) acc[k] = [];
        acc[k].push(item);
        return acc;
    }, {} as Record<string, T[]>);
}

const TYPE_LABELS: Record<string, string> = {
    passive:    '📊 Passive Income',
    consumable: '🎁 Consumable',
    role:       '🎭 Role Reward',
};

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('🛒 Access the Apex Marketplace.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('view')
               .setDescription('Browse all available items in the marketplace.')
        )
        .addSubcommand(sub =>
            sub.setName('buy')
               .setDescription('Purchase an item from the marketplace.')
               .addIntegerOption(opt => opt.setName('id').setDescription('Target item ID.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('sell')
               .setDescription(`Sell back an owned item for ${SELL_REFUND_RATE * 100}% of its purchase price.`)
               .addIntegerOption(opt => opt.setName('id').setDescription('Item ID from your inventory.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('inventory')
               .setDescription('View your owned assets and passive income stats.')
        )
        .addSubcommandGroup(group =>
            group.setName('admin')
                 .setDescription('🛡️ Administrative inventory management.')
                 .addSubcommand(sub =>
                    sub.setName('add')
                       .setDescription('Add a new item to the marketplace.')
                       .addStringOption(opt => opt.setName('name').setDescription('Item name.').setRequired(true))
                       .addIntegerOption(opt => opt.setName('price').setDescription('Credit cost.').setRequired(true).setMinValue(1))
                       .addStringOption(opt => opt.setName('item-type').setDescription('Item category.').addChoices(
                           { name: '📊 Passive Income', value: 'passive' },
                           { name: '🎁 Consumable',     value: 'consumable' },
                           { name: '🎭 Role Reward',    value: 'role' }
                       ))
                       .addRoleOption(opt => opt.setName('role').setDescription('Role to grant (role items only).'))
                       .addStringOption(opt => opt.setName('emoji').setDescription('Display emoji for the item (e.g. 🛸).'))
                       .addIntegerOption(opt => opt.setName('production-rate').setDescription('Passive income per hour (passive items only).').setMinValue(0))
                       .addStringOption(opt => opt.setName('description').setDescription('Item description.'))
                       .addIntegerOption(opt => opt.setName('stock').setDescription('Stock quantity (-1 = unlimited).'))
                 )
                 .addSubcommand(sub =>
                    sub.setName('remove')
                       .setDescription('Decommission an item from the marketplace.')
                       .addIntegerOption(opt => opt.setName('id').setDescription('Target item ID.').setRequired(true))
                 )
                 .addSubcommand(sub =>
                    sub.setName('edit')
                       .setDescription('Edit an existing marketplace item.')
                       .addIntegerOption(opt => opt.setName('id').setDescription('Item ID to edit.').setRequired(true))
                       .addIntegerOption(opt => opt.setName('price').setDescription('New price.').setMinValue(1))
                       .addIntegerOption(opt => opt.setName('stock').setDescription('New stock quantity (-1 = unlimited).'))
                       .addStringOption(opt => opt.setName('description').setDescription('New description.'))
                       .addIntegerOption(opt => opt.setName('production-rate').setDescription('New passive income rate per hour.').setMinValue(0))
                       .addStringOption(opt => opt.setName('emoji').setDescription('New display emoji.'))
                 )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const group = interaction.options.getSubcommandGroup();
        const guildId = interaction.guildId!;

        // ── ADMIN ─────────────────────────────────────────────────────────────
        if (group === 'admin') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ **CLEARANCE DENIED**: Administrator authority required.', ephemeral: true });
            }

            if (subcommand === 'add') {
                const name = interaction.options.getString('name')!;
                const price = interaction.options.getInteger('price')!;
                const type = interaction.options.getString('item-type') || 'consumable';
                const role = interaction.options.getRole('role');
                const emoji = interaction.options.getString('emoji') || '📦';
                const rate = interaction.options.getInteger('production-rate') || 0;
                const desc = interaction.options.getString('description') || 'No description available.';
                const stock = interaction.options.getInteger('stock') ?? -1;

                await db.execute(
                    'INSERT INTO shop_items (guild_id, name, price, item_type, role_id, emoji, production_rate, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    guildId, name, price, type, role?.id || null, emoji, rate, desc, stock
                );

                return interaction.reply({ content: `✅ Successfully added **${name}** to the marketplace.`, flags: [MessageFlags.Ephemeral] });
            }

            if (subcommand === 'remove') {
                const id = interaction.options.getInteger('id')!;
                const item = await db.fetchOne('SELECT name FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                if (!item) return interaction.reply({ content: '❌ Item not found.', ephemeral: true });

                await db.execute('DELETE FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                return interaction.reply({ content: `✅ Item **${item.name}** (ID: \`${id}\`) has been decommissioned.`, flags: [MessageFlags.Ephemeral] });
            }

            if (subcommand === 'edit') {
                const id = interaction.options.getInteger('id')!;
                const item = await db.fetchOne('SELECT * FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                if (!item) return interaction.reply({ content: '❌ Item not found.', ephemeral: true });

                const newPrice = interaction.options.getInteger('price') ?? item.price;
                const newStock = interaction.options.getInteger('stock') ?? item.stock;
                const newDesc = interaction.options.getString('description') ?? item.description;
                const newRate = interaction.options.getInteger('production-rate') ?? item.production_rate;
                const newEmoji = interaction.options.getString('emoji') ?? item.emoji;

                await db.execute(
                    'UPDATE shop_items SET price = ?, stock = ?, description = ?, production_rate = ?, emoji = ? WHERE id = ? AND guild_id = ?',
                    newPrice, newStock, newDesc, newRate, newEmoji, id, guildId
                );

                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(0x3498db)
                        .setTitle('✏️ ITEM UPDATED')
                        .setDescription(`${newEmoji} **${item.name}** (ID: \`${id}\`) has been updated.`)
                        .addFields(
                            { name: '💰 Price',  value: `\`${newPrice.toLocaleString()} cr\``,          inline: true },
                            { name: '📦 Stock',  value: `\`${newStock === -1 ? '∞' : newStock}\``,       inline: true },
                            { name: '📊 Yield',  value: `\`${newRate > 0 ? `${newRate} cr/hr` : 'None'}\``, inline: true }
                        )
                        .setFooter({ text: 'Astra Commerce Division v8.0.1 Quantum' })],
                    flags: [MessageFlags.Ephemeral]
                });
            }

            return;
        }

        // ── VIEW ──────────────────────────────────────────────────────────────
        if (subcommand === 'view') {
            await interaction.deferReply();
            const items = await db.fetchAll(
                'SELECT id, name, description, price, production_rate, stock, item_type, emoji FROM shop_items WHERE guild_id = ? ORDER BY item_type, price',
                guildId
            );

            const embed = new EmbedBuilder()
                .setTitle(`🛒 APEX MARKETPLACE — ${interaction.guild!.name}`)
                .setColor(0xf1c40f)
                .setFooter({ text: `${items.length} item(s) available • Astra Commerce Division v8.0.1 Quantum` })
                .setTimestamp();

            if (items.length === 0) {
                embed.setDescription('The warehouse is empty. An administrator can add items with `/shop admin add`.');
            } else {
                const grouped = groupBy(items, i => i.item_type ?? 'consumable');
                const sections: string[] = [];

                for (const [type, group] of Object.entries(grouped)) {
                    const header = `**${TYPE_LABELS[type] ?? '📦 Items'}**`;
                    const lines = group.map(i => {
                        const stockStr = i.stock === -1 ? '∞' : `${i.stock}`;
                        const yieldStr = i.production_rate > 0 ? ` · 📊 \`${i.production_rate} cr/hr\`` : '';
                        return `> ${i.emoji ?? '📦'} **[${i.id}] ${i.name}** — \`${i.price.toLocaleString()} cr\` · Stock: \`${stockStr}\`${yieldStr}\n> *${i.description}*`;
                    });
                    sections.push(`${header}\n${lines.join('\n')}`);
                }
                embed.setDescription(sections.join('\n\n'));
            }

            return interaction.editReply({ embeds: [embed] });

        // ── BUY ───────────────────────────────────────────────────────────────
        } else if (subcommand === 'buy') {
            const id = interaction.options.getInteger('id')!;
            await interaction.deferReply();

            const item = await db.fetchOne('SELECT * FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);

            if (!item) return interaction.editReply({ content: '❌ **INVALID TARGET**: Item ID not found in current sector marketplace.' });
            if (item.stock === 0) return interaction.editReply({ content: '❌ **OUT OF STOCK**: This item is no longer available.' });

            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', interaction.user.id);
            const balance = userData?.balance ?? 0;

            if (balance < item.price) {
                return interaction.editReply({
                    content: `❌ **INSUFFICIENT CREDITS**: You need \`${item.price.toLocaleString()} cr\`. Your balance: \`${balance.toLocaleString()} cr\``
                });
            }

            // CHECK & HARVEST EXISTING (To prevent exploits when adding quantity)
            if (item.item_type === 'passive') {
                const existing = await db.fetchOne('SELECT * FROM user_inventory WHERE user_id = ? AND item_id = ?', interaction.user.id, id);
                if (existing) {
                    const hoursElapsed = (Date.now() - new Date(existing.last_harvest).getTime()) / 3600000;
                    const totalRate = item.production_rate * existing.quantity;
                    const pending = Math.floor(hoursElapsed * totalRate);
                    if (pending > 0) {
                        await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', pending, interaction.user.id);
                        logger.info(`Shop: Auto-harvested ${pending} cr for ${interaction.user.id} before item purchase catchup.`);
                    }
                }
            }

            // Deduct cost
            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', item.price, interaction.user.id);

            // Reduction in stock
            if (item.stock > 0) {
                await db.execute('UPDATE shop_items SET stock = stock - 1 WHERE id = ?', id);
            }

            const existing = await db.fetchOne('SELECT id, quantity FROM user_inventory WHERE user_id = ? AND item_id = ?', interaction.user.id, id);
            if (existing) {
                await db.execute('UPDATE user_inventory SET quantity = quantity + 1, last_harvest = ? WHERE id = ?', new Date().toISOString(), existing.id);
            } else {
                await db.execute(
                    'INSERT INTO user_inventory (user_id, item_id, quantity, last_harvest) VALUES (?, ?, 1, ?)',
                    interaction.user.id, item.id, new Date().toISOString()
                );
            }

            // Handle Role Grant
            if (item.item_type === 'role' && item.role_id) {
                const member = await interaction.guild?.members.fetch(interaction.user.id).catch(() => null);
                const role = await interaction.guild?.roles.fetch(item.role_id).catch(() => null);
                if (member && role) {
                    if (member.roles.cache.has(role.id)) {
                        // Refund if they already had the role
                        await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', item.price, interaction.user.id);
                        return interaction.editReply({ content: `❌ **AUTHORITY CONFLICT**: You already possess the **${role.name}** clearance. Credits refunded.` });
                    }
                    await member.roles.add(role).catch(err => {
                        logger.error(`Failed to grant role ${item.role_id} to ${interaction.user.id}: ${err}`);
                    });
                }
            }

            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', interaction.user.id);

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('✅ ACQUISITION CONFIRMED')
                    .setDescription(`${item.emoji ?? '📦'} You purchased **${item.name}**.${item.production_rate > 0 ? `\n\n📊 This asset generates \`${item.production_rate} cr/hr\`. Use \`/economy harvest\` to collect.` : ''}`)
                    .addFields(
                        { name: '💸 Spent',         value: `\`-${item.price.toLocaleString()} cr\``, inline: true },
                        { name: '💳 New Balance',    value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                    )
                    .setFooter({ text: 'Astra Commerce Division v8.0.1 Quantum' })]
            });

        // ── SELL ──────────────────────────────────────────────────────────────
        } else if (subcommand === 'sell') {
            const id = interaction.options.getInteger('id')!;
            await interaction.deferReply();

            const invEntry = await db.fetchOne(
                'SELECT ui.id AS inv_id, ui.quantity, ui.last_harvest, si.name, si.price, si.emoji, si.production_rate, si.item_type FROM user_inventory ui JOIN shop_items si ON ui.item_id = si.id WHERE ui.user_id = ? AND ui.item_id = ?',
                interaction.user.id, id
            );

            if (!invEntry) {
                return interaction.editReply({ content: `❌ You don't own item ID \`${id}\`. Check \`/shop inventory\`.` });
            }

            // Harvest before selling to prevent loss of pending income
            if (invEntry.item_type === 'passive') {
                const hoursElapsed = (Date.now() - new Date(invEntry.last_harvest).getTime()) / 3600000;
                const totalRate = invEntry.production_rate * invEntry.quantity;
                const pending = Math.floor(hoursElapsed * totalRate);
                if (pending > 0) {
                    await db.execute('UPDATE users SET balance = balance + ? WHERE user_id = ?', pending, interaction.user.id);
                }
            }

            const refund = Math.floor(invEntry.price * SELL_REFUND_RATE);

            // Remove from inventory (1 unit)
            if (invEntry.quantity > 1) {
                // If selling 1 unit of a passive stack, we still need to reset the timestamp for the remaining ones since we just harvested
                await db.execute('UPDATE user_inventory SET quantity = quantity - 1, last_harvest = ? WHERE id = ?', new Date().toISOString(), invEntry.inv_id);
            } else {
                await db.execute('DELETE FROM user_inventory WHERE id = ?', invEntry.inv_id);
            }

            // Credit refund
            await db.execute(
                'INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?',
                interaction.user.id, refund, refund
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', interaction.user.id);

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle('💱 ASSET SOLD')
                    .setDescription(`${invEntry.emoji ?? '📦'} **${invEntry.name}** has been liquidated at **${SELL_REFUND_RATE * 100}%** market value.`)
                    .addFields(
                        { name: '💰 Refund',      value: `\`+${refund.toLocaleString()} cr\``, inline: true },
                        { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                    )
                    .setFooter({ text: 'Sell price is 50% of purchase price. • Astra Commerce Division v8.0.1 Quantum' })]
            });

        // ── INVENTORY ─────────────────────────────────────────────────────────
        } else if (subcommand === 'inventory') {
            await interaction.deferReply();
            const inventory = await db.fetchAll(`
                SELECT ui.quantity, ui.last_harvest, si.id AS item_id, si.name, si.production_rate, si.item_type, si.emoji
                FROM user_inventory ui
                JOIN shop_items si ON ui.item_id = si.id
                WHERE ui.user_id = ?
                ORDER BY si.item_type, si.name
            `, interaction.user.id);

            if (!inventory || inventory.length === 0) {
                return interaction.editReply({ content: '❌ Your inventory is empty. Visit `/shop view` to browse available assets.' });
            }

            const grouped = groupBy(inventory, i => i.item_type ?? 'consumable');
            const sections: string[] = [];

            for (const [type, group] of Object.entries(grouped)) {
                const header = `**${TYPE_LABELS[type] ?? '📦 Items'}**`;
                const lines = group.map(inv => {
                    let extra = '';
                    if (inv.production_rate > 0) {
                        const pending = Math.floor(
                            ((Date.now() - new Date(inv.last_harvest).getTime()) / 3600000) * inv.production_rate * (inv.quantity || 1)
                        );
                        extra = ` · 📊 \`${inv.production_rate} cr/hr\` · Pending: \`${pending.toLocaleString()} cr\``;
                    }
                    return `> ${inv.emoji ?? '📦'} **${inv.name}** ×${inv.quantity}${extra}`;
                });
                sections.push(`${header}\n${lines.join('\n')}`);
            }

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle(`📦 ASSET INVENTORY — ${interaction.user.username}`)
                    .setDescription(sections.join('\n\n'))
                    .setFooter({ text: 'Use /economy harvest to collect passive income • /shop sell to liquidate assets' })
                    .setTimestamp()]
            });
        }
    }
};

export default command;
