// Модуль для работы с API

const ApiModule = {
  // Базовый URL API
  baseUrl: window.API_BASE_URL || 'https://api.fast-rabbit-vpn.swrsky.ru',
  // baseUrl: window.API_BASE_URL || 'http://localhost:8000',

  // Токен доступа
  accessToken: null,

  // Инициализация модуля
  init() {
    console.log('API Module initialized with base URL:', this.baseUrl);
    // Автоматическая аутентификация при инициализации
    this.authenticate();
  },

  // Аутентификация через Telegram WebApp
  async authenticate() {
    try {
      const initData = window.TelegramModule ? window.TelegramModule.getInitData() : '';

      if (!initData) {
        console.warn('Нет данных инициализации Telegram WebApp');
        return false;
      }

      const response = await this.request(`${this.baseUrl}/auth/telegram`, {
        method: 'POST',
        headers: {
          'X-Telegram-WebApp-InitData': initData,
          'accept': 'application/json'
        }
      });

      if (response.access_token && response.access_token.access_token) {
        this.accessToken = response.access_token.access_token;
        console.log('Аутентификация успешна, токен получен');

        // Сохраняем данные пользователя в глобальную переменную
        window.currentUser = response;

        return true;
      } else {
        console.error('Не удалось получить токен доступа');
        return false;
      }
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      return false;
    }
  },

  // Базовый метод для HTTP запросов
  async request(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Добавляем токен авторизации, если он есть
    if (this.accessToken) {
      defaultOptions.headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

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
        // Если получили 401, попробуем переаутентифицироваться
        if (response.status === 401) {
          console.log('Токен истек, пытаемся переаутентифицироваться...');
          const reauthSuccess = await this.authenticate();
          if (reauthSuccess) {
            // Повторяем запрос с новым токеном
            finalOptions.headers['Authorization'] = `Bearer ${this.accessToken}`;
            const retryResponse = await fetch(url, finalOptions);
            if (!retryResponse.ok) {
              throw new Error(`HTTP error! status: ${retryResponse.status}`);
            }
            return await retryResponse.json();
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Получение данных пользователя (теперь используем данные из аутентификации)
  async getUser() {
    try {
      if (window.currentUser) {
        return window.currentUser;
      }

      // Если данных нет, пытаемся аутентифицироваться
      const authSuccess = await this.authenticate();
      if (authSuccess && window.currentUser) {
        return window.currentUser;
      }

      throw new Error('Не удалось получить данные пользователя');
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Ошибка при получении данных пользователя');
    }
  },

  // Создание платежа
  async createPayment(amount) {
    try {
      const response = await this.request(`${this.baseUrl}/payment/`, {
        method: 'POST',
        body: JSON.stringify({
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
  async getPaymentHistory() {
    try {
      const response = await this.request(`${this.baseUrl}/payment/history`);
      return response;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw new Error('Ошибка при получении истории платежей');
    }
  },

  // Удаление ключа
  async deleteKey(keyId) {
    try {
      const response = await this.request(`${this.baseUrl}/key/${keyId}`, {
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
      const response = await this.request(`${this.baseUrl}/payments/stars/invoice`, {
        method: 'POST',
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
      const response = await this.request(
        `${this.baseUrl}/payments/stars/status?payload=${encodeURIComponent(payload)}`
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
      // Используем данные из аутентификации
      if (window.currentUser && window.currentUser.balance) {
        return window.currentUser.balance;
      }

      // Если данных нет, пытаемся аутентифицироваться
      const authSuccess = await this.authenticate();
      if (authSuccess && window.currentUser && window.currentUser.balance) {
        return window.currentUser.balance;
      }

      throw new Error('Не удалось получить баланс');
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw new Error('Ошибка при получении баланса');
    }
  },

  // Загрузка данных пользователя и рендеринг
  async loadUserAndRender() {
    try {
      // Проверяем, есть ли уже данные пользователя
      if (!window.currentUser) {
        console.warn('Нет данных пользователя, пытаемся аутентифицироваться...');
        const authSuccess = await this.authenticate();
        if (!authSuccess) {
          console.error('Не удалось аутентифицироваться');
          if (window.UIModule) {
            window.UIModule.showNotification('Ошибка аутентификации', 'error');
          }
          return;
        }
      }

      const user = window.currentUser;

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
      // Используем данные из аутентификации
      if (window.currentUser && window.currentUser.balance) {
        if (window.UIModule) {
          window.UIModule.updateBalance(window.currentUser.balance.balance);
        }
        return;
      }

      // Если данных нет, пытаемся аутентифицироваться
      const authSuccess = await this.authenticate();
      if (authSuccess && window.currentUser && window.currentUser.balance) {
        if (window.UIModule) {
          window.UIModule.updateBalance(window.currentUser.balance.balance);
        }
      }
    } catch (error) {
      console.error('Ошибка обновления баланса:', error);
    }
  }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiModule;
} else {
  window.ApiModule = ApiModule;
}
