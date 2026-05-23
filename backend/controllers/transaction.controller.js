const Transaction = require('../models/transaction.model');

// GET all transactions for logged in user
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ date: -1 }); // newest first
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET weekly transactions
exports.getWeeklyTransactions = async (req, res) => {
    try {
        // get start of current week (Monday)
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0); // set to midnight
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // adjust to Monday

        const transactions = await Transaction.find({ // only get transactions for logged in user and from this week
            user: req.user.id,
            date: { $gte: startOfWeek }
        }).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ADD new transaction
exports.addTransaction = async (req, res) => {
    const { type, amount, category, description, date } = req.body;

    try {
        const transaction = await Transaction.create({
            user: req.user.id,
            type,
            amount,
            category,
            description,
            date: date || Date.now()
        });

        res.status(201).json({
            message: 'Transaction added!',
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // make sure user owns this transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await transaction.deleteOne();
        res.json({ message: 'Transaction deleted!' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET spending summary (for reports page)
exports.getSummary = async (req, res) => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

        const transactions = await Transaction.find({
            user: req.user.id,
            date: { $gte: startOfWeek }
        });

        // calculate totals
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0); // sum up all income transactions to get total income for the week

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0); // sum up all expense transactions to get total expenses for the week

        const balance = totalIncome - totalExpense;

        // group expenses by category
        const byCategory = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
            }); 

        res.json({
            totalIncome,
            totalExpense,
            balance,
            byCategory
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};