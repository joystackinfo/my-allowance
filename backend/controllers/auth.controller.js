const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Email validation regex - only accepts @gmail.com or @email.com domains
const emailRegex = /^[^\s@]+@(gmail\.com|email\.com)$/;

// Create transporter once and reuse it (much faster than creating new one each time)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// SIGNUP
exports.signup = async (req, res) => {
    const { name, nickname, email, password, weeklyAllowance, weekStart } = req.body; 
    try {
        // Validate email format before checking database
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // hash the password before saving
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = await User.create({
            name,
            nickname,
            email,
            password: hashedPassword,
            weeklyAllowance,
            weekStart
        });

        // create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                weeklyAllowance: user.weeklyAllowance,
                weekStart: user.weekStart
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate email format before querying database
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                weeklyAllowance: user.weeklyAllowance,
                brokeAlertThreshold: user.brokeAlertThreshold,
                weekStart: user.weekStart
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
//update profile
exports.updateProfile = async (req, res) => {
    try {
        const { nickname, weeklyAllowance, brokeAlertThreshold, weekStart } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { nickname, weeklyAllowance, brokeAlertThreshold, weekStart },
            { new: true }
        ).select('-password'); // exclude password from response
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        // Validate email format
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'No account with that email' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: `MyAllowance <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'MyAllowance — Reset your password',
            html: `
                <h2>Reset your password</h2>
                <p>Click the link below:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>Expires in 15 minutes.</p>
            `
        });

        res.json({ message: 'Reset link sent to your email!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
//RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
