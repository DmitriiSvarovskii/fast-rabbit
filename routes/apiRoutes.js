const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// API для пополнения баланса
router.post('/payment', apiController.createPayment);

// API для получения данных пользователя
router.get('/user/:id', apiController.getUser);

// API для получения истории платежей
router.get('/payment/:id', apiController.getPaymentHistory);

// API для удаления ключа
router.delete('/keys/:id', apiController.deleteKey);

// API для получения списка серверов
router.get('/servers', apiController.getServers);

// API для создания нового ключа
router.post('/keys', apiController.createKey);

// API для создания инвойса Stars
router.post('/payments/stars/invoice', apiController.createStarsInvoice);

// API для проверки статуса платежа Stars
router.get('/payments/stars/status', apiController.checkStarsPaymentStatus);

// API для получения баланса
router.get('/me/balance', apiController.getBalance);

module.exports = router;
