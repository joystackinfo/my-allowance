const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // This references the User model.
        ref: 'User',
        required: true
    },
    type: { //Type can only be income or expense, and is required
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: { // category is required
        type: String,
        required: true
    },
    description: { // description is optional, defaults to an empty string
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;