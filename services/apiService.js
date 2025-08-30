const axios = require('axios');
const config = require('../config/config');

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Добавляем перехватчики для логирования
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Получение данных пользователя
  async getUser(userId) {
    try {
      const response = await this.client.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при получении данных пользователя: ${error.message}`);
    }
  }

  // Создание платежа
  async createPayment(userId, amount) {
    try {
      const response = await this.client.post('/payment/', {
        user_id: userId,
        amount: amount
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при создании платежа: ${error.message}`);
    }
  }

  // Получение истории платежей
  async getPaymentHistory(userId) {
    try {
      const response = await this.client.get(`/payment/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при получении истории платежей: ${error.message}`);
    }
  }

  // Удаление ключа
  async deleteKey(keyId) {
    try {
      const response = await this.client.delete(`/key/?server_id=${keyId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при удалении ключа: ${error.message}`);
    }
  }

  // Получение списка серверов
  async getServers() {
    try {
      const response = await this.client.get('/server/');
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при получении списка серверов: ${error.message}`);
    }
  }

  // Создание нового ключа
  async createKey(serverId) {
    try {
      const response = await this.client.post('/key/', {
        server_id: serverId
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при создании ключа: ${error.message}`);
    }
  }

  // Создание инвойса для оплаты через Stars
  async createStarsInvoice(amountRub, initData) {
    try {
      const response = await this.client.post('/payments/stars/invoice', {
        amount_rub: amountRub
      }, {
        headers: {
          'X-Telegram-Init-Data': initData
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при создании инвойса: ${error.message}`);
    }
  }

  // Проверка статуса платежа через Stars
  async checkStarsPaymentStatus(payload, initData) {
    try {
      const response = await this.client.get(`/payments/stars/status?payload=${encodeURIComponent(payload)}`, {
        headers: {
          'X-Telegram-Init-Data': initData
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при проверке статуса платежа: ${error.message}`);
    }
  }

  // Обновление баланса
  async getBalance(initData) {
    try {
      const response = await this.client.get('/me/balance', {
        headers: {
          'X-Telegram-Init-Data': initData
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при получении баланса: ${error.message}`);
    }
  }
}

module.exports = new ApiService();
