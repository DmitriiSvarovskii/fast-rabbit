const apiService = require('../services/apiService');

class ApiController {
  /**
   * API для пополнения баланса
   */
  async createPayment(req, res) {
    try {
      const { user_id, amount } = req.body;

      if (!user_id || !amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Неверные данные для платежа'
        });
      }

      const response = await apiService.createPayment(user_id, amount);

      res.json({
        success: true,
        balance: response.balance
      });
    } catch (error) {
      console.error('Payment error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при обработке платежа'
      });
    }
  }

  /**
   * API для получения данных пользователя
   */
  async getUser(req, res) {
    try {
      const userId = req.params.id;
      const response = await apiService.getUser(userId);
      res.json(response);
    } catch (error) {
      console.error('User fetch error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении данных пользователя'
      });
    }
  }

  /**
   * API для получения истории платежей
   */
  async getPaymentHistory(req, res) {
    try {
      const userId = req.params.id;
      const response = await apiService.getPaymentHistory(userId);
      res.json(response);
    } catch (error) {
      console.error('Payments fetch error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении истории платежей'
      });
    }
  }

  /**
   * API для удаления ключа
   */
  async deleteKey(req, res) {
    try {
      const keyId = req.params.id;
      const response = await apiService.deleteKey(keyId);
      res.json(response);
    } catch (error) {
      console.error('Key delete error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении ключа'
      });
    }
  }

  /**
   * API для получения списка серверов
   */
  async getServers(req, res) {
    try {
      const response = await apiService.getServers();
      res.json(response);
    } catch (error) {
      console.error('Servers fetch error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка серверов'
      });
    }
  }

  /**
   * API для создания нового ключа
   */
  async createKey(req, res) {
    try {
      const { server_id } = req.body;
      const response = await apiService.createKey(server_id);
      res.json(response);
    } catch (error) {
      console.error('Key creation error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании ключа'
      });
    }
  }

  /**
   * API для создания инвойса Stars
   */
  async createStarsInvoice(req, res) {
    try {
      const { amount_rub } = req.body;
      const initData = req.headers['x-telegram-init-data'] || '';
      
      const response = await apiService.createStarsInvoice(amount_rub, initData);
      res.json(response);
    } catch (error) {
      console.error('Stars invoice creation error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании инвойса'
      });
    }
  }

  /**
   * API для проверки статуса платежа Stars
   */
  async checkStarsPaymentStatus(req, res) {
    try {
      const { payload } = req.query;
      const initData = req.headers['x-telegram-init-data'] || '';
      
      const response = await apiService.checkStarsPaymentStatus(payload, initData);
      res.json(response);
    } catch (error) {
      console.error('Stars payment status check error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при проверке статуса платежа'
      });
    }
  }

  /**
   * API для получения баланса
   */
  async getBalance(req, res) {
    try {
      const initData = req.headers['x-telegram-init-data'] || '';
      const response = await apiService.getBalance(initData);
      res.json(response);
    } catch (error) {
      console.error('Balance fetch error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении баланса'
      });
    }
  }
}

module.exports = new ApiController();
