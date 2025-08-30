const config = {
  // Настройки сервера
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '127.0.0.1' // Изменено с 'localhost' на '0.0.0.0' для продакшена
  },

  // Настройки API
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.fast-rabbit-vpn.swrsky.ru',
    // baseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    timeout: 10000
  },

  // Настройки Telegram
  telegram: {
    supportUrl: 'https://t.me/swrsky',
    webAppUrl: 'https://telegram.org/js/telegram-web-app.js'
  },

  // Настройки приложения
  app: {
    title: 'Fast Rabbit VPN',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  // Настройки безопасности
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  }
};

module.exports = config;
