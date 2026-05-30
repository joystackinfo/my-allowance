const express = require('express');
const router = express.Router();
const { signup, login, updateProfile} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

//    POST /api/auth/signup
router.post('/signup', signup);

//    PUT /api/auth/update
router.put('/update', protect, updateProfile);


//    POST /api/auth/login
router.post('/login', login);

module.exports = router;