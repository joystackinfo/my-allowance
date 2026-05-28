const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getWeeklySummary,
    getWeeklyTransactions
} = require('../controllers/transaction.controller');

// all routes protected - user must be logged in
router.get('/', protect, getTransactions);
router.post('/', protect, addTransaction);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);
router.get('/weekly', protect, getWeeklyTransactions);

module.exports = router;