import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

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
                const name         = interaction.options.getString('name')!;
                const price        = interaction.options.getInteger('price')!;
                const itemType     = interaction.options.getString('item-type') ?? 'consumable';
                const emoji        = interaction.options.getString('emoji') ?? '📦';
                const prodRate     = interaction.options.getInteger('production-rate') ?? 0;
                const description  = interaction.options.getString('description') ?? 'No description provided.';
                const stock        = interaction.options.getInteger('stock') ?? -1;

                await db.execute(
                    'INSERT INTO shop_items (guild_id, name, description, price, production_rate, stock, item_type, emoji) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    guildId, name, description, price, prodRate, stock, itemType, emoji
                );

                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(0x2ecc71)
                        .setTitle('✅ ITEM LISTED')
                        .setDescription(`${emoji} **${name}** has been added to the marketplace.`)
                        .addFields(
                            { name: '💰 Price',    value: `\`${price.toLocaleString()} cr\``,      inline: true },
                            { name: '📂 Type',     value: `\`${itemType}\``,                         inline: true },
                            { name: '📦 Stock',    value: `\`${stock === -1 ? '∞' : stock}\``,       inline: true },
                            ...(prodRate > 0 ? [{ name: '📊 Yield', value: `\`${prodRate} cr/hr\``, inline: true }] : [])
                        )
                        .setFooter({ text: 'Astra Commerce Division v7.2.0' })],
                    ephemeral: true
                });

            } else if (subcommand === 'remove') {
                const id = interaction.options.getInteger('id')!;
                const item = await db.fetchOne('SELECT name, emoji FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                if (!item) return interaction.reply({ content: `❌ Item ID \`${id}\` not found in this sector's marketplace.`, ephemeral: true });

                await db.execute('DELETE FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                return interaction.reply({ content: `✅ **DECOMMISSIONED**: ${item.emoji ?? '📦'} **${item.name}** has been purged from the marketplace.`, ephemeral: true });

            } else if (subcommand === 'edit') {
                const id = interaction.options.getInteger('id')!;
                const item = await db.fetchOne('SELECT * FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                if (!item) return interaction.reply({ content: `❌ Item ID \`${id}\` not found.`, ephemeral: true });

                const newPrice   = interaction.options.getInteger('price')         ?? item.price;
                const newStock   = interaction.options.getInteger('stock')         ?? item.stock;
                const newDesc    = interaction.options.getString('description')    ?? item.description;
                const newRate    = interaction.options.getInteger('production-rate') ?? item.production_rate;
                const newEmoji   = interaction.options.getString('emoji')          ?? item.emoji;

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
                        .setFooter({ text: 'Astra Commerce Division v7.2.0' })],
                    ephemeral: true
                });
            }

            return;
        }

        // ── VIEW ──────────────────────────────────────────────────────────────
        if (subcommand === 'view') {
            const items = await db.fetchAll(
                'SELECT id, name, description, price, production_rate, stock, item_type, emoji FROM shop_items WHERE guild_id = ? ORDER BY item_type, price',
                guildId
            );

            const embed = new EmbedBuilder()
                .setTitle(`🛒 APEX MARKETPLACE — ${interaction.guild!.name}`)
                .setColor(0xf1c40f)
                .setFooter({ text: `${items.length} item(s) available • Astra Commerce Division v7.2.0` })
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

            return interaction.reply({ embeds: [embed] });

        // ── BUY ───────────────────────────────────────────────────────────────
        } else if (subcommand === 'buy') {
            const id = interaction.options.getInteger('id')!;
            const item = await db.fetchOne('SELECT * FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);

            if (!item) return interaction.reply({ content: '❌ **INVALID TARGET**: Item ID not found in current sector marketplace.', ephemeral: true });
            if (item.stock === 0) return interaction.reply({ content: '❌ **OUT OF STOCK**: This item is no longer available.', ephemeral: true });

            const userData = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', interaction.user.id);
            const balance = userData?.balance ?? 0;

            if (balance < item.price) {
                return interaction.reply({
                    content: `❌ **INSUFFICIENT CREDITS**: You need \`${item.price.toLocaleString()} cr\`. Your balance: \`${balance.toLocaleString()} cr\``,
                    ephemeral: true
                });
            }

            // Deduct cost
            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', item.price, interaction.user.id);

            // Reduce stock if finite
            if (item.stock > 0) {
                await db.execute('UPDATE shop_items SET stock = stock - 1 WHERE id = ?', id);
            }

            // FIX: Record ALL purchases in inventory (not just passive items)
            const existing = await db.fetchOne('SELECT id, quantity FROM user_inventory WHERE user_id = ? AND item_id = ?', interaction.user.id, id);
            if (existing) {
                await db.execute('UPDATE user_inventory SET quantity = quantity + 1 WHERE id = ?', existing.id);
            } else {
                await db.execute(
                    'INSERT INTO user_inventory (user_id, item_id, quantity, last_harvest) VALUES (?, ?, 1, ?)',
                    interaction.user.id, item.id, new Date().toISOString()
                );
            }

            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', interaction.user.id);

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('✅ ACQUISITION CONFIRMED')
                    .setDescription(`${item.emoji ?? '📦'} You purchased **${item.name}**.${item.production_rate > 0 ? `\n\n📊 This asset generates \`${item.production_rate} cr/hr\`. Use \`/economy harvest\` to collect.` : ''}`)
                    .addFields(
                        { name: '💸 Spent',         value: `\`-${item.price.toLocaleString()} cr\``, inline: true },
                        { name: '💳 New Balance',    value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                    )
                    .setFooter({ text: 'Astra Commerce Division v7.2.0' })]
            });

        // ── SELL ──────────────────────────────────────────────────────────────
        } else if (subcommand === 'sell') {
            const id = interaction.options.getInteger('id')!;
            const invEntry = await db.fetchOne(
                'SELECT ui.id AS inv_id, ui.quantity, si.name, si.price, si.emoji FROM user_inventory ui JOIN shop_items si ON ui.item_id = si.id WHERE ui.user_id = ? AND ui.item_id = ?',
                interaction.user.id, id
            );

            if (!invEntry) {
                return interaction.reply({ content: `❌ You don't own item ID \`${id}\`. Check \`/shop inventory\`.`, ephemeral: true });
            }

            const refund = Math.floor(invEntry.price * SELL_REFUND_RATE);

            // Remove from inventory (1 unit)
            if (invEntry.quantity > 1) {
                await db.execute('UPDATE user_inventory SET quantity = quantity - 1 WHERE id = ?', invEntry.inv_id);
            } else {
                await db.execute('DELETE FROM user_inventory WHERE id = ?', invEntry.inv_id);
            }

            // Credit refund
            await db.execute(
                'INSERT INTO users (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?',
                interaction.user.id, refund, refund
            );
            const after = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', interaction.user.id);

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle('💱 ASSET SOLD')
                    .setDescription(`${invEntry.emoji ?? '📦'} **${invEntry.name}** has been liquidated at **${SELL_REFUND_RATE * 100}%** market value.`)
                    .addFields(
                        { name: '💰 Refund',      value: `\`+${refund.toLocaleString()} cr\``, inline: true },
                        { name: '💳 New Balance', value: `\`${(after?.balance ?? 0).toLocaleString()} cr\``, inline: true }
                    )
                    .setFooter({ text: 'Sell price is 50% of purchase price.' })]
            });

        // ── INVENTORY ─────────────────────────────────────────────────────────
        } else if (subcommand === 'inventory') {
            // FIX: was using si.item_id — correct column is si.id (already joined via ui.item_id = si.id)
            const inventory = await db.fetchAll(`
                SELECT ui.quantity, ui.last_harvest, si.id AS item_id, si.name, si.production_rate, si.item_type, si.emoji
                FROM user_inventory ui
                JOIN shop_items si ON ui.item_id = si.id
                WHERE ui.user_id = ?
                ORDER BY si.item_type, si.name
            `, interaction.user.id);

            if (!inventory || inventory.length === 0) {
                return interaction.reply({ content: '❌ Your inventory is empty. Visit `/shop view` to browse available assets.', ephemeral: true });
            }

            const grouped = groupBy(inventory, i => i.item_type ?? 'consumable');
            const sections: string[] = [];

            for (const [type, group] of Object.entries(grouped)) {
                const header = `**${TYPE_LABELS[type] ?? '📦 Items'}**`;
                const lines = group.map(inv => {
                    let extra = '';
                    if (inv.production_rate > 0) {
                        const pending = Math.floor(
                            ((Date.now() - new Date(inv.last_harvest).getTime()) / 3600000) * inv.production_rate
                        );
                        extra = ` · 📊 \`${inv.production_rate} cr/hr\` · Pending: \`${pending.toLocaleString()} cr\``;
                    }
                    return `> ${inv.emoji ?? '📦'} **${inv.name}** ×${inv.quantity}${extra}`;
                });
                sections.push(`${header}\n${lines.join('\n')}`);
            }

            return interaction.reply({
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
