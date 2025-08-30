// Модуль для работы с пользовательским интерфейсом

const UIModule = {
  // Модальные окна
  modals: {
    balance: null,
    history: null,
    delete: null,
    server: null,
    createKey: null
  },

  // Элементы интерфейса
  elements: {
    balanceAmount: null,
    addBalanceBtn: null,
    historyLink: null,
    keysList: null,
    balanceAmountInput: null,
    confirmBalanceBtn: null,
    confirmDeleteBtn: null,
    confirmCreateKeyBtn: null
  },

  // Инициализация модуля
  init() {
    this.initElements();
    this.initModals();
    this.setupEventListeners();
  },

  // Инициализация элементов
  initElements() {
    this.elements.balanceAmount = document.getElementById('balanceAmount');
    this.elements.addBalanceBtn = document.getElementById('addBalanceBtn');
    this.elements.historyLink = document.getElementById('historyLink');
    this.elements.keysList = document.getElementById('keysList');
    this.elements.balanceAmountInput = document.getElementById('balanceAmountInput');
    this.elements.confirmBalanceBtn = document.getElementById('confirmBalanceBtn');
    this.elements.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    this.elements.confirmCreateKeyBtn = document.getElementById('confirmCreateKeyBtn');
  },

  // Инициализация модальных окон
  initModals() {
    this.modals.balance = document.getElementById('balanceModal');
    this.modals.history = document.getElementById('historyModal');
    this.modals.delete = document.getElementById('deleteModal');
    this.modals.server = document.getElementById('serverModal');
    this.modals.createKey = document.getElementById('createKeyModal');
  },

  // Настройка обработчиков событий
  setupEventListeners() {
    // Обработчики для модальных окон
    this.setupModalEventListeners();
    
    // Обработчики для кнопок
    this.setupButtonEventListeners();
    
    // Обработчики для списка ключей
    this.setupKeysListEventListeners();
  },

  // Настройка обработчиков модальных окон
  setupModalEventListeners() {
    // Закрытие модальных окон при клике вне их
    Object.values(this.modals).forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.hideModal(modal);
          }
        });
      }
    });

    // Обработчики для кнопок закрытия
    const closeButtons = [
      { modal: this.modals.balance, button: document.getElementById('closeBalanceModal') },
      { modal: this.modals.history, button: document.getElementById('closeHistoryModal') },
      { modal: this.modals.delete, button: document.getElementById('closeDeleteModal') },
      { modal: this.modals.server, button: document.getElementById('closeServerModal') },
      { modal: this.modals.createKey, button: document.getElementById('closeCreateKeyModal') }
    ];

    closeButtons.forEach(({ modal, button }) => {
      if (button && modal) {
        button.addEventListener('click', () => this.hideModal(modal));
      }
    });

    // Обработчики для кнопок отмены
    const cancelButtons = [
      { modal: this.modals.balance, button: document.getElementById('cancelBalanceBtn') },
      { modal: this.modals.delete, button: document.getElementById('cancelDeleteBtn') },
      { modal: this.modals.createKey, button: document.getElementById('cancelCreateKeyBtn') }
    ];

    cancelButtons.forEach(({ modal, button }) => {
      if (button && modal) {
        button.addEventListener('click', () => this.hideModal(modal));
      }
    });
  },

  // Настройка обработчиков кнопок
  setupButtonEventListeners() {
    // Кнопка пополнения баланса
    if (this.elements.addBalanceBtn) {
      this.elements.addBalanceBtn.addEventListener('click', () => {
        this.showModal(this.modals.balance);
        if (this.elements.balanceAmountInput) {
          this.elements.balanceAmountInput.focus();
        }
      });
    }

    // Кнопка истории платежей
    if (this.elements.historyLink) {
      this.elements.historyLink.addEventListener('click', () => {
        this.showModal(this.modals.history);
      });
    }

    // Обработка Enter в поле ввода баланса
    if (this.elements.balanceAmountInput) {
      this.elements.balanceAmountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && this.elements.confirmBalanceBtn) {
          this.elements.confirmBalanceBtn.click();
        }
      });
    }
  },

  // Настройка обработчиков списка ключей
  setupKeysListEventListeners() {
    if (this.elements.keysList) {
      // Делегирование событий для динамически добавляемых элементов
      this.elements.keysList.addEventListener('click', (e) => {
        const deviceElement = e.target.closest('.device');
        if (!deviceElement) return;

        if (e.target.closest('.copy-btn')) {
          e.stopPropagation();
          const keyValue = e.target.closest('.copy-btn').getAttribute('data-key');
          if (keyValue) {
            this.copyKey(keyValue);
          }
        } else if (e.target.closest('.delete-action')) {
          e.stopPropagation();
          e.preventDefault();
          const keyId = deviceElement.getAttribute('data-key-id');
          if (keyId) {
            this.showDeleteConfirmation(keyId);
          }
        } else {
          const keyId = deviceElement.getAttribute('data-key-id');
          if (keyId) {
            window.location.href = `/key/${keyId}`;
          }
        }
      });
    }
  },

  // Показ модального окна
  showModal(modal) {
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // Скрытие модального окна
  hideModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  },

  // Очистка полей ввода
  clearModalInputs() {
    if (this.elements.balanceAmountInput) {
      this.elements.balanceAmountInput.value = '';
    }
  },

  // Показ уведомления
  showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Автоматическое скрытие
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },

  // Копирование ключа
  async copyKey(keyValue) {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(keyValue);
        this.showNotification('Ключ скопирован', 'success');
        
        // Haptic feedback
        if (window.TelegramModule) {
          window.TelegramModule.hapticFeedback('light');
        }
      } catch (error) {
        this.fallbackCopyTextToClipboard(keyValue);
      }
    } else {
      this.fallbackCopyTextToClipboard(keyValue);
    }
  },

  // Fallback для копирования
  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        this.showNotification('Ключ скопирован', 'success');
      } else {
        this.showNotification('Ошибка при копировании', 'error');
      }
    } catch (err) {
      console.error('Ошибка при fallback копировании:', err);
      document.body.removeChild(textArea);
      this.showNotification('Ошибка при копировании', 'error');
    }
  },

  // Переключение подраздела
  toggleSubsection(subsectionId) {
    console.log('Toggling subsection:', subsectionId);

    const content = document.getElementById(`${subsectionId}-content`);
    if (!content) return;

    const subsection = content.closest('.collapsible-subsection');
    if (!subsection) return;

    if (content.classList.contains('expanded')) {
      // Сворачиваем подраздел
      content.classList.remove('expanded');
      subsection.classList.remove('expanded');
      subsection.classList.add('collapsed');
    } else {
      // Разворачиваем подраздел
      content.classList.add('expanded');
      subsection.classList.remove('collapsed');
      subsection.classList.add('expanded');
    }

    // Haptic feedback
    if (window.TelegramModule) {
      window.TelegramModule.hapticFeedback('light');
    }
  },

  // Получение флага страны
  getCountryFlag(country) {
    const flags = {
      'Germany': '🇩🇪',
      'Turkey': '🇹🇷',
      'USA': '🇺🇸',
      'Netherlands': '🇳🇱',
      'France': '🇫🇷',
      'UK': '🇬🇧',
      'Japan': '🇯🇵',
      'Singapore': '🇸🇬',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺'
    };
    return flags[country] || '🌐';
  },

  // Форматирование даты
  formatDate(date) {
    if (!date) return '';
    
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('ru-RU');
    } catch (error) {
      console.warn('Ошибка форматирования даты:', error);
      return '';
    }
  },

  // Создание элемента ключа
  createKeyElement(key) {
    const deviceElement = document.createElement('div');
    deviceElement.className = 'device';
    deviceElement.setAttribute('data-id', key.id);
    deviceElement.setAttribute('data-key-id', key.id);

    const createdDate = this.formatDate(key.created_at);

    deviceElement.innerHTML = `
      <div class="device-icon"></div>
      <div class="device-info">
        <div class="device-title">${key.country || ''}</div>
        <div class="device-date">Добавлено ${createdDate}</div>
      </div>
      <div class="device-actions">
        <button class="copy-btn" data-key="${key.key || ''}" title="Копировать">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m0 0h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
          </svg>
        </button>
      </div>
      <div class="delete-action"></div>
    `;

    return deviceElement;
  },

  // Создание элемента сервера
  createServerElement(server) {
    const serverElement = document.createElement('div');
    serverElement.className = 'server-item';
    serverElement.setAttribute('data-server-id', server.id);
    serverElement.setAttribute('data-server-country', server.country);

    const flag = this.getCountryFlag(server.country);

    serverElement.innerHTML = `
      <div class="server-icon">${flag}</div>
      <div class="server-info">
        <div class="server-name">${server.country}</div>
        <div class="server-description">Нажмите для создания конфигурации</div>
      </div>
    `;

    return serverElement;
  },

  // Обновление счетчика ключей
  updateKeysCount(count) {
    const countElement = document.getElementById('keysCount');
    if (countElement) {
      countElement.textContent = `Количество ключей: ${count}`;
    }
  },

  // Обновление баланса
  updateBalance(balance) {
    if (this.elements.balanceAmount) {
      this.elements.balanceAmount.textContent = `${balance || 0} ₽`;
    }
  },

  // Обновление имени пользователя
  updateUserName(userName) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = userName;
    }
  },

  // Показ подтверждения удаления
  showDeleteConfirmation(keyId) {
    if (this.modals.delete) {
      const deleteKeyInfo = document.getElementById('deleteKeyInfo');
      if (deleteKeyInfo) {
        deleteKeyInfo.textContent = `Конфигурация ID: ${keyId}`;
      }
      this.showModal(this.modals.delete);
    }
  },

  // Открытие поддержки в Telegram
  openTelegramSupport() {
    const telegramUrl = 'https://t.me/swrsky';

    // Haptic feedback
    if (window.TelegramModule) {
      window.TelegramModule.hapticFeedback('medium');
    }

    // Показываем уведомление
    this.showNotification('Открываем чат поддержки...', 'info');

    // Открываем ссылку
    if (window.TelegramModule) {
      window.TelegramModule.openTelegramLink(telegramUrl);
    } else {
      window.open(telegramUrl, '_blank');
    }
  }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIModule;
} else {
  window.UIModule = UIModule;
}
