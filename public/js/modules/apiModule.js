// Модуль для работы с API

const ApiModule = {
  // Базовый URL API
  baseUrl: window.API_BASE_URL || 'http://localhost:8000',

  // Инициализация модуля
  init() {
    console.log('API Module initialized with base URL:', this.baseUrl);
  },

  // Базовый метод для HTTP запросов
  async request(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Получение данных пользователя
  async getUser(userId) {
    try {
      const response = await this.request(`${this.baseUrl}/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Ошибка при получении данных пользователя');
    }
  },

  // Создание платежа
  async createPayment(userId, amount) {
    try {
      const response = await this.request(`${this.baseUrl}/payment/`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          amount: amount
        })
      });
      return response;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Ошибка при создании платежа');
    }
  },

  // Получение истории платежей
  async getPaymentHistory(userId) {
    try {
      const response = await this.request(`${this.baseUrl}/payment/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw new Error('Ошибка при получении истории платежей');
    }
  },

  // Удаление ключа
  async deleteKey(keyId) {
    try {
      const response = await this.request(`${this.baseUrl}/key/?server_id=${keyId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Error deleting key:', error);
      throw new Error('Ошибка при удалении ключа');
    }
  },

  // Получение списка серверов
  async getServers() {
    try {
      const response = await this.request(`${this.baseUrl}/server/`);
      return response;
    } catch (error) {
      console.error('Error fetching servers:', error);
      throw new Error('Ошибка при получении списка серверов');
    }
  },

  // Создание нового ключа
  async createKey(serverId) {
    try {
      const response = await this.request(`${this.baseUrl}/key/`, {
        method: 'POST',
        body: JSON.stringify({
          server_id: serverId
        })
      });
      return response;
    } catch (error) {
      console.error('Error creating key:', error);
      throw new Error('Ошибка при создании ключа');
    }
  },

  // Создание инвойса для оплаты через Stars
  async createStarsInvoice(amountRub) {
    try {
      const initData = window.TelegramModule ? window.TelegramModule.getInitData() : '';
      
      const response = await this.request(`${this.baseUrl}/payments/stars/invoice`, {
        method: 'POST',
        headers: {
          'X-Telegram-Init-Data': initData
        },
        body: JSON.stringify({ amount_rub: amountRub })
      });
      return response;
    } catch (error) {
      console.error('Error creating Stars invoice:', error);
      throw new Error('Ошибка при создании инвойса');
    }
  },

  // Проверка статуса платежа через Stars
  async checkStarsPaymentStatus(payload) {
    try {
      const initData = window.TelegramModule ? window.TelegramModule.getInitData() : '';
      
      const response = await this.request(
        `${this.baseUrl}/payments/stars/status?payload=${encodeURIComponent(payload)}`,
        {
          headers: {
            'X-Telegram-Init-Data': initData
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Error checking Stars payment status:', error);
      throw new Error('Ошибка при проверке статуса платежа');
    }
  },

  // Обновление баланса
  async getBalance() {
    try {
      const initData = window.TelegramModule ? window.TelegramModule.getInitData() : '';
      
      const response = await this.request(`${this.baseUrl}/me/balance`, {
        headers: {
          'X-Telegram-Init-Data': initData
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw new Error('Ошибка при получении баланса');
    }
  },

  // Загрузка данных пользователя и рендеринг
  async loadUserAndRender() {
    try {
      const telegramId = window.TelegramModule ? window.TelegramModule.getTelegramId() : null;
      if (!telegramId) {
        console.warn('Нет Telegram ID (WebApp не в Telegram?)');
        return;
      }

      const user = await this.getUser(telegramId);

      // Обновляем имя пользователя
      if (window.UIModule) {
        const userName = window.TelegramModule.formatUserName(user);
        window.UIModule.updateUserName(userName);
      }

      // Обновляем баланс
      if (window.UIModule) {
        window.UIModule.updateBalance(user.balance?.balance || 0);
      }

      // Обновляем ключи
      const keys = Array.isArray(user.keys) ? user.keys : [];
      if (window.UIModule) {
        window.UIModule.updateKeysCount(keys.length);
      }

      // Обновляем список ключей
      const keysList = document.getElementById('keysList');
      if (keysList && window.UIModule) {
        keysList.innerHTML = '';
        keys.forEach(key => {
          const keyElement = window.UIModule.createKeyElement(key);
          keysList.appendChild(keyElement);
        });
      }

      return user;
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
      if (window.UIModule) {
        window.UIModule.showNotification('Ошибка загрузки данных', 'error');
      }
    }
  },

  // Обновление баланса в UI
  async refreshBalanceUI() {
    try {
      const balanceData = await this.getBalance();
      if (window.UIModule && balanceData.balance_rub !== undefined) {
        window.UIModule.updateBalance(balanceData.balance_rub);
      }
    } catch (error) {
      console.error('Ошибка обновления баланса:', error);
    }
  },

  // Создание инвойса Stars
  async createStarsInvoice(amountRub) {
    try {
      const { invoice_link, stars, payload } = await this.createStarsInvoice(amountRub);
      return { invoice_link, stars, payload };
    } catch (error) {
      console.error('Stars payment error:', error);
      throw error;
    }
  }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiModule;
} else {
  window.ApiModule = ApiModule;
}
