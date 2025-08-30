// Модуль для работы с платежами

const PaymentModule = {
  // Инициализация модуля
  init() {
    this.setupPaymentHandlers();
  },

  // Настройка обработчиков платежей
  setupPaymentHandlers() {
    // Обработчик для кнопки подтверждения пополнения баланса
    const confirmBalanceBtn = document.getElementById('confirmBalanceBtn');
    if (confirmBalanceBtn) {
      // Создаем новый элемент для сброса старых слушателей
      const freshBtn = confirmBalanceBtn.cloneNode(true);
      confirmBalanceBtn.parentNode.replaceChild(freshBtn, confirmBalanceBtn);

      freshBtn.addEventListener('click', async () => {
        await this.handleBalancePayment();
      });
    }

    // Обработчик для кнопки подтверждения удаления
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', async () => {
        await this.handleKeyDeletion();
      });
    }

    // Обработчик для кнопки добавления ключа
    const addKeyBtn = document.getElementById('addKeyBtn');
    if (addKeyBtn) {
      addKeyBtn.addEventListener('click', async () => {
        await this.handleAddKey();
      });
    }
  },

  // Обработка пополнения баланса
  async handleBalancePayment() {
    const balanceAmountInput = document.getElementById('balanceAmountInput');
    const confirmBalanceBtn = document.getElementById('confirmBalanceBtn');

    if (!balanceAmountInput || !confirmBalanceBtn) return;

    const amount = parseInt(balanceAmountInput.value);
    if (!amount || amount <= 0) {
      if (window.UIModule) {
        window.UIModule.showNotification('Введите корректную сумму', 'error');
      }
      return;
    }

    try {
      // Создаем ссылку-инвойс в звёздах на бэке
      const { invoice_link, stars, payload } = await window.ApiModule.createStarsInvoice(amount);
      console.log('Stars: invoice link =', invoice_link);

      // Открываем телеграмовское окно оплаты
      if (!window.TelegramModule || !window.TelegramModule.tg?.openInvoice) {
        if (window.UIModule) {
          window.UIModule.showNotification('Откройте приложение внутри Telegram', 'error');
        }
        return;
      }

      // Блокируем кнопку
      confirmBalanceBtn.disabled = true;
      const oldText = confirmBalanceBtn.textContent;
      confirmBalanceBtn.textContent = 'Ожидание оплаты...';

      // Открываем инвойс
      window.TelegramModule.openInvoice(invoice_link, async (status) => {
        console.log('Stars: invoice status =', status); // 'paid' | 'cancelled' | 'failed'

        if (status === 'paid') {
          // Проверяем статус на бэке
          try {
            await window.ApiModule.checkStarsPaymentStatus(payload);
          } catch (error) {
            console.warn('Failed to check payment status:', error);
          }

          // Обновляем баланс
          await window.ApiModule.refreshBalanceUI();

          // Закрываем модальное окно
          if (window.UIModule) {
            window.UIModule.hideModal(window.UIModule.modals.balance);
            window.UIModule.clearModalInputs();
            window.UIModule.showNotification(`Баланс пополнен (~${stars} ⭐)`, 'success');
          }

          // Haptic feedback
          if (window.TelegramModule) {
            window.TelegramModule.hapticFeedback('medium');
          }
        } else if (status === 'cancelled') {
          if (window.UIModule) {
            window.UIModule.showNotification('Оплата отменена', 'info');
          }
        } else {
          if (window.UIModule) {
            window.UIModule.showNotification('Оплата не прошла', 'error');
          }
        }

        // Разблокируем кнопку
        confirmBalanceBtn.disabled = false;
        confirmBalanceBtn.textContent = oldText;
      });

    } catch (error) {
      console.error('Stars payment error:', error);
      if (window.UIModule) {
        window.UIModule.showNotification(error.message || 'Ошибка при создании счёта', 'error');
      }

      // Разблокируем кнопку в случае ошибки
      if (confirmBalanceBtn) {
        confirmBalanceBtn.disabled = false;
        confirmBalanceBtn.textContent = 'Пополнить';
      }
    }
  },

  // Обработка удаления ключа
  async handleKeyDeletion() {
    const deleteModal = document.getElementById('deleteModal');
    const deleteKeyInfo = document.getElementById('deleteKeyInfo');

    if (!deleteModal || !deleteKeyInfo) return;

    // Получаем ID ключа из текста
    const keyInfoText = deleteKeyInfo.textContent;
    const keyIdMatch = keyInfoText.match(/ID: (\d+)/);
    const keyId = keyIdMatch ? keyIdMatch[1] : null;

    if (!keyId) {
      if (window.UIModule) {
        window.UIModule.showNotification('Ошибка: не найден ID ключа', 'error');
      }
      return;
    }

    try {
      const response = await window.ApiModule.deleteKey(keyId);

      if (response.success !== false) {
        // Закрываем модальное окно
        if (window.UIModule) {
          window.UIModule.hideModal(deleteModal);
          window.UIModule.showNotification('Конфигурация удалена', 'success');
        }

        // Haptic feedback
        if (window.TelegramModule) {
          window.TelegramModule.hapticFeedback('medium');
        }

        // Обновляем список ключей
        await window.ApiModule.loadUserAndRender();

        // Возвращаемся на главную страницу через секунду
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        if (window.UIModule) {
          window.UIModule.showNotification('Ошибка при удалении', 'error');
        }
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      if (window.UIModule) {
        window.UIModule.showNotification('Ошибка сети', 'error');
      }
    }
  },

  // Обработка добавления ключа
  async handleAddKey() {
    try {
      console.log('Loading servers...');
      const servers = await window.ApiModule.getServers();
      console.log('Servers data:', servers);

      const serversList = document.getElementById('serversList');
      if (serversList && window.UIModule) {
        serversList.innerHTML = '';

        servers.forEach(server => {
          console.log('Creating server element:', server);
          const serverElement = window.UIModule.createServerElement(server);

          serverElement.addEventListener('click', () => {
            console.log('Server selected:', server);
            this.handleServerSelection(server);
          });

          serversList.appendChild(serverElement);
        });
      }

      if (window.UIModule) {
        window.UIModule.showModal(window.UIModule.modals.server);
      }
    } catch (error) {
      console.error('Error loading servers:', error);
      if (window.UIModule) {
        window.UIModule.showNotification('Ошибка загрузки серверов', 'error');
      }
    }
  },

  // Обработка выбора сервера
  handleServerSelection(server) {
    const serverInfo = document.getElementById('serverInfo');
    if (serverInfo && window.UIModule) {
      const flag = window.UIModule.getCountryFlag(server.country);
      serverInfo.innerHTML = `${flag} ${server.country}`;
    }

    if (window.UIModule) {
      window.UIModule.hideModal(window.UIModule.modals.server);
      window.UIModule.showModal(window.UIModule.modals.createKey);
    }

    // Настраиваем кнопку создания ключа
    const confirmCreateKeyBtn = document.getElementById('confirmCreateKeyBtn');
    if (confirmCreateKeyBtn) {
      confirmCreateKeyBtn.onclick = async () => {
        await this.handleKeyCreation(server);
      };
    }
  },

  // Обработка создания ключа
  async handleKeyCreation(server) {
    console.log('Creating key for server:', server);

    try {
      const response = await window.ApiModule.createKey(server.id);
      console.log('Create key response:', response);

      if (response.id) {
        if (window.UIModule) {
          window.UIModule.hideModal(window.UIModule.modals.createKey);
          window.UIModule.showNotification('Конфигурация создана успешно!', 'success');
        }

        // Haptic feedback
        if (window.TelegramModule) {
          window.TelegramModule.hapticFeedback('medium');
        }

        // Обновляем список ключей
        await window.ApiModule.loadUserAndRender();
      } else {
        if (window.UIModule) {
          window.UIModule.showNotification('Ошибка при создании конфигурации', 'error');
        }
      }
    } catch (error) {
      console.error('Error creating key:', error);
      if (window.UIModule) {
        window.UIModule.showNotification('Ошибка сети', 'error');
      }
    }
  },

  // Загрузка истории платежей
  async loadPaymentHistory() {
    try {
      const payments = await window.ApiModule.getPaymentHistory();
      this.renderPaymentHistory(payments);
    } catch (error) {
      console.error('Error loading payment history:', error);
      if (window.UIModule) {
        window.UIModule.showNotification('Ошибка загрузки истории платежей', 'error');
      }
    }
  },

  // Рендеринг истории платежей
  renderPaymentHistory(payments) {
    const paymentsList = document.getElementById('paymentsList');
    if (!paymentsList) return;

    if (!Array.isArray(payments) || payments.length === 0) {
      paymentsList.innerHTML = '<p class="no-payments">История платежей пуста</p>';
      return;
    }

    paymentsList.innerHTML = '';
    payments.forEach(payment => {
      const paymentElement = document.createElement('div');
      paymentElement.className = 'payment-item';

      const date = payment.created_at ? new Date(payment.created_at).toLocaleDateString('ru-RU') : 'Неизвестно';
      const amount = payment.amount || 0;
      const status = payment.status || 'pending';

      paymentElement.innerHTML = `
        <div class="payment-info">
          <div class="payment-date">${date}</div>
          <div class="payment-amount">${amount} ₽</div>
        </div>
        <div class="payment-status payment-status-${status}">
          ${this.getStatusText(status)}
        </div>
      `;

      paymentsList.appendChild(paymentElement);
    });
  },

  // Получение текста статуса платежа
  getStatusText(status) {
    const statusTexts = {
      'pending': 'В обработке',
      'completed': 'Завершен',
      'failed': 'Ошибка',
      'cancelled': 'Отменен'
    };
    return statusTexts[status] || 'Неизвестно';
  }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PaymentModule;
} else {
  window.PaymentModule = PaymentModule;
}
