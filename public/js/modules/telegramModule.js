// Модуль для работы с Telegram Web App

const TelegramModule = {
  // Telegram Web App объект
  tg: null,

  // Инициализация модуля
  init() {
    this.tg = window.Telegram?.WebApp;
    if (this.tg) {
      this.setupTelegramApp();
    } else {
      console.warn('Telegram Web App не доступен');
    }
  },

  // Настройка Telegram Web App
  setupTelegramApp() {
    try {
      this.tg.ready();

      // Отключение вертикальных свайпов
      if (typeof this.tg.disableVerticalSwipes === 'function') {
        try {
          this.tg.disableVerticalSwipes();
        } catch (e) {
          console.warn('Не удалось отключить вертикальные свайпы:', e);
        }
      }

      // Переход в полноэкранный режим
      if (typeof this.tg.requestFullscreen === 'function') {
        try {
          this.tg.requestFullscreen();
        } catch (e) {
          console.warn('Не удалось перейти в полноэкранный режим:', e);
        }
      } else if (typeof this.tg.expand === 'function') {
        try {
          this.tg.expand();
        } catch (e) {
          console.warn('Не удалось развернуть приложение:', e);
        }
      }

      // Подтверждение закрытия
      try {
        this.tg.enableClosingConfirmation();
      } catch (e) {
        console.warn('Не удалось включить подтверждение закрытия:', e);
      }

      // Настройка цветов
      try {
        this.tg.setHeaderColor('#000000');
        this.tg.setBackgroundColor('#000000');
      } catch (e) {
        console.warn('Не удалось установить цвета:', e);
      }

      console.log('Telegram Web App инициализирован');
    } catch (error) {
      console.error('Ошибка инициализации Telegram Web App:', error);
    }
  },

  // Получение Telegram ID пользователя
  getTelegramId() {
    try {
      return this.tg?.initDataUnsafe?.user?.id || null;
    } catch (error) {
      console.warn('Ошибка при получении Telegram ID:', error);
      return null;
    }
  },

  // Получение данных инициализации
  getInitData() {
    try {
      return this.tg?.initData || '';
    } catch (error) {
      console.warn('Ошибка при получении данных инициализации:', error);
      return '';
    }
  },

  // Получение данных пользователя
  getUserData() {
    try {
      return this.tg?.initDataUnsafe?.user || null;
    } catch (error) {
      console.warn('Ошибка при получении данных пользователя:', error);
      return null;
    }
  },

  // Форматирование имени пользователя
  formatUserName(user) {
    if (!user) return 'Пользователь';
    
    let displayName = '';
    if (user.first_name) displayName += user.first_name;
    if (user.last_name) displayName += ' ' + user.last_name;
    if (!displayName && user.username) displayName = user.username;
    
    return displayName || 'Пользователь';
  },

  // Показ кнопки "Назад"
  showBackButton() {
    try {
      if (this.tg?.BackButton) {
        this.tg.BackButton.show();
      }
    } catch (error) {
      console.warn('Ошибка при показе кнопки "Назад":', error);
    }
  },

  // Скрытие кнопки "Назад"
  hideBackButton() {
    try {
      if (this.tg?.BackButton) {
        this.tg.BackButton.hide();
      }
    } catch (error) {
      console.warn('Ошибка при скрытии кнопки "Назад":', error);
    }
  },

  // Настройка обработчика кнопки "Назад"
  setupBackButton(callback) {
    try {
      if (this.tg?.BackButton) {
        this.tg.BackButton.onClick(callback);
      }
    } catch (error) {
      console.warn('Ошибка при настройке кнопки "Назад":', error);
    }
  },

  // Haptic feedback
  hapticFeedback(style = 'light') {
    try {
      if (this.tg?.HapticFeedback) {
        this.tg.HapticFeedback.impactOccurred(style);
      }
    } catch (error) {
      console.warn('Ошибка при haptic feedback:', error);
    }
  },

  // Открытие инвойса для оплаты
  openInvoice(invoiceLink, callback) {
    try {
      if (this.tg?.openInvoice) {
        this.tg.openInvoice(invoiceLink, callback);
      } else {
        throw new Error('openInvoice не поддерживается');
      }
    } catch (error) {
      console.error('Ошибка при открытии инвойса:', error);
      throw error;
    }
  },

  // Открытие ссылки в Telegram
  openTelegramLink(url) {
    try {
      if (this.tg?.openTelegramLink) {
        this.tg.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.warn('Ошибка при открытии ссылки в Telegram:', error);
      window.open(url, '_blank');
    }
  }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TelegramModule;
} else {
  window.TelegramModule = TelegramModule;
}
