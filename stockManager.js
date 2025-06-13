const db = require('./db');

const stockManager = {
    async create(item) {
        await db('stock').insert(item);
        return item;
    },

    async read({ search, user_id } = {}) {
        let query = db('stock').whereNull('deleted_at');
        if (search) query = query.where('name', 'like', `%${search}%`);
        if (user_id) query = query.andWhere({ user_id });
        return query.select('*');
    },

    async update(id, updatedFields) {
        await db('stock').where({ id }).update(updatedFields);
        return db('stock').where({ id }).first();
    },

    async softDelete(id) {
        return db('stock').where({ id }).update({ deleted_at: new Date() });
    },

    async stockOut(id, amount, date, user_id) {
        const item = await db('stock').where({ id }).first();
        if (!item || item.quantity < amount) return null;

        await db('stock')
            .where({ id })
            .update({
                quantity: item.quantity - amount,
                stock_out: item.stock_out + amount,
                updated_at: new Date()
            });

        // Log history
        await db('stock_out_history').insert({
            stock_id: id,
            user_id,
            amount,
            date
        });

        return db('stock').where({ id }).first();
    },

    async stockOutSummary(range = 'daily') {
        let startDateCondition;

        // Determine date filter range
        switch (range) {
            case 'weekly':
                startDateCondition = db.raw('CURRENT_DATE - INTERVAL 7 DAY');
                break;
            case 'monthly':
                startDateCondition = db.raw('CURRENT_DATE - INTERVAL 1 MONTH');
                break;
            default:
                startDateCondition = db.raw('CURRENT_DATE');
        }

        // Fetch raw data grouped by date and stock name
        const rows = await db('stock_out_history')
            .join('stock', 'stock_out_history.stock_id', 'stock.id')
            .select(
                db.raw("DATE_FORMAT(stock_out_history.date, '%d-%m-%Y') as date"),
                'stock.name as name'
            )
            .sum('stock_out_history.amount as qty')
            .where('stock_out_history.date', '>=', startDateCondition)
            .groupBy('date', 'stock.name')
            .orderBy('date', 'desc');

        // Group by date with item list and compute per-date total
        const grouped = {};
        const dailyTotals = {};
        let totalAll = 0;

        for (const row of rows) {
            if (!grouped[row.date]) {
                grouped[row.date] = [];
                dailyTotals[row.date] = 0;
            }

            const qty = Number(row.qty);
            grouped[row.date].push({
                name: row.name,
                qty
            });

            dailyTotals[row.date] += qty;
            totalAll += qty;
        }

        // Convert into desired array format
        const result = Object.entries(grouped).map(([date, items]) => ({
            date,
            total: dailyTotals[date],
            items
        }));

        return {
            range,
            total: totalAll,
            days: result
        };
    }
};

module.exports = stockManager;