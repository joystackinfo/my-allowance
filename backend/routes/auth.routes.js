const express = require('express');
const router = express.Router();
const { signup, login, updateProfile, forgotPassword, resetPassword} = require('../controllers/auth.controller');
const protect  = require('../middleware/auth.middleware');

//    POST /api/auth/signup
router.post('/signup', signup);

//    PUT /api/auth/update
router.put('/update', protect, updateProfile);

//    POST /api/auth/login
router.post('/login', login);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password
router.put('/reset-password', resetPassword);

module.exports = router;