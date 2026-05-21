const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { // name is required
        type: String,
        required: true
    },
    nickname: { // nickname is required and must be unique
        type: String,
        required: true
    },
    email: { // email is required and must be unique
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    weeklyAllowance: { // if the user doesn't set a weekly allowance, it defaults to 0
        type: Number,
        default: 0
    },
    brokeAlertThreshold: { // if the user doesn't set a broke alert threshold, it defaults to 200
        type: Number,
        default: 200
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;