const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
     targetAmount: { // User must set a target goal amount 
        type: Number,
        required: true
    },
    savedAmount: { // saved amount defaults to 0 when the goal is created
        type: Number,
        default: 0
    },
    emoji: {
        type: String,
        default: '🎯'
    },
    completed: {
        type: Boolean,
        default: false // completed becomes true when savedAmount reaches the targetAmount
    }
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;