const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// SIGNUP
exports.signup = async (req, res) => {
    const { name, nickname, email, password, weeklyAllowance } = req.body; 
    try {
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
            weeklyAllowance
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
                weeklyAllowance: user.weeklyAllowance
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
                brokeAlertThreshold: user.brokeAlertThreshold
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
//update profile
exports.updateProfile = async (req, res) => {
    try {
        const {nickname, weeklyAllowance, brokeAlertThreshold} = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { nickname, weeklyAllowance, brokeAlertThreshold },
            { new: true }
        ).select('-password'); // exclude password from response
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//FORGOT PASSWORD
exports.forgotPassword = async (req, res) => { // Implement forgot password logic here
    try {
        const user = await User.findOne({ email: req.body.email }); // Find user by email
        if (!user) {
            return res.status(404)
            .json({ message: 'No account with that email' });
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex'); // Generate reset token by creating random bytes and converting to hex string

        //savee hashed token to db
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // Hash the reset token and save to user document
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Set token expiration time (15 minutes)
        await user.save(); // Save the user document with the reset token

        //create reset URL
        const resetUrl= `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; // Create reset URL to be sent in email

        // send email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'MyAllowance - Reset your password',
            html: `
                <h2>Reset your password</h2>
                <p>You requested a password reset. Click the link below:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 15 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                `
        });

        res.json({ message: 'Reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    };
}