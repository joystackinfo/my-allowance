const Goal = require('../models/goal.model');

// GET all goals for logged in user
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ADD new goal
exports.addGoal = async (req, res) => {
    const { name, targetAmount, emoji } = req.body;

    try {
        const goal = await Goal.create({
            user: req.user.id,
            name,
            targetAmount,
            emoji: emoji || '🎯'
        });

        res.status(201).json({
            message: 'Goal created!',
            goal
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ADD money to a goal
exports.addMoneyToGoal = async (req, res) => {
    const { amount } = req.body; // amount to add to the goal

    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // make sure user owns this goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // add money to savedAmount
        goal.savedAmount += amount;

        // check if goal is completed
        if (goal.savedAmount >= goal.targetAmount) {
            goal.completed = true;
            goal.savedAmount = goal.targetAmount; // cap at target
        }

        await goal.save();

        res.status(200).json({
            message: goal.completed ? 'Goal completed! 🎉' : 'Money added to goal!',
            goal
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// UPDATE a goal
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // make sure user owns this goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updated = await Goal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({ message: 'Goal updated!', updated });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE a goal
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // make sure user owns this goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Goal.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Goal deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};