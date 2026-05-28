const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const {
    getGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    addMoneyToGoal
} = require('../controllers/goal.controller');

// all routes protected
router.get('/', protect, getGoals);
router.post('/', protect, addGoal);
router.put('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);
router.post('/:id/add-money', protect, addMoneyToGoal);

module.exports = router;