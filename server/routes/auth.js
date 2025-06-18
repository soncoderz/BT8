const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Check auth status route
router.get('/check', authController.checkAuth);

module.exports = router; 