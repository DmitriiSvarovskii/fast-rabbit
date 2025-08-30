const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Главная страница
router.get('/', pageController.getHomePage);

// Страница ключа
router.get('/key/:id', pageController.getKeyPage);

module.exports = router;
