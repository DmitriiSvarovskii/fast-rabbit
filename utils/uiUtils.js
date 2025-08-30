// Утилиты для работы с пользовательским интерфейсом

/**
 * Показ модального окна
 * @param {HTMLElement} modal - Элемент модального окна
 */
function showModal(modal) {
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Скрытие модального окна
 * @param {HTMLElement} modal - Элемент модального окна
 */
function hideModal(modal) {
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Очистка полей ввода в модальных окнах
 */
function clearModalInputs() {
    const balanceAmountInput = document.getElementById('balanceAmountInput');
    if (balanceAmountInput) {
        balanceAmountInput.value = '';
    }
}

/**
 * Показ уведомления
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления ('info', 'success', 'error', 'warning')
 */
function showNotification(message, type = 'info') {
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
}

/**
 * Копирование текста в буфер обмена
 * @param {string} text - Текст для копирования
 * @returns {Promise<boolean>} Успешность операции
 */
async function copyToClipboard(text) {
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('Ошибка при копировании через Clipboard API:', error);
            return fallbackCopyTextToClipboard(text);
        }
    } else {
        return fallbackCopyTextToClipboard(text);
    }
}

/**
 * Fallback для копирования в старых браузерах
 * @param {string} text - Текст для копирования
 * @returns {boolean} Успешность операции
 */
function fallbackCopyTextToClipboard(text) {
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
        return successful;
    } catch (err) {
        console.error('Ошибка при fallback копировании:', err);
        document.body.removeChild(textArea);
        return false;
    }
}

/**
 * Переключение подраздела (сворачивание/разворачивание)
 * @param {string} subsectionId - ID подраздела
 */
function toggleSubsection(subsectionId) {
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
}

/**
 * Получение флага страны
 * @param {string} country - Название страны
 * @returns {string} Эмодзи флага
 */
function getCountryFlag(country) {
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
}

/**
 * Форматирование даты
 * @param {string|Date} date - Дата
 * @returns {string} Отформатированная дата
 */
function formatDate(date) {
    if (!date) return '';

    try {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('ru-RU');
    } catch (error) {
        console.warn('Ошибка форматирования даты:', error);
        return '';
    }
}

/**
 * Создание элемента ключа для списка
 * @param {object} key - Данные ключа
 * @returns {HTMLElement} Элемент ключа
 */
function createKeyElement(key) {
    const deviceElement = document.createElement('div');
    deviceElement.className = 'device';
    deviceElement.setAttribute('data-id', key.id);
    deviceElement.setAttribute('data-key-id', key.id);

    const createdDate = formatDate(key.created_at);

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
}

/**
 * Создание элемента сервера для списка
 * @param {object} server - Данные сервера
 * @returns {HTMLElement} Элемент сервера
 */
function createServerElement(server) {
    const serverElement = document.createElement('div');
    serverElement.className = 'server-item';
    serverElement.setAttribute('data-server-id', server.id);
    serverElement.setAttribute('data-server-country', server.country);

    const flag = getCountryFlag(server.country);

    serverElement.innerHTML = `
    <div class="server-icon">${flag}</div>
    <div class="server-info">
      <div class="server-name">${server.country}</div>
      <div class="server-description">Нажмите для создания конфигурации</div>
    </div>
  `;

    return serverElement;
}

/**
 * Обновление счетчика ключей
 * @param {number} count - Количество ключей
 */
function updateKeysCount(count) {
    const countElement = document.getElementById('keysCount');
    if (countElement) {
        countElement.textContent = `Количество ключей: ${count}`;
    }
}

/**
 * Обновление баланса в интерфейсе
 * @param {number} balance - Сумма баланса
 */
function updateBalance(balance) {
    const balanceElement = document.getElementById('balanceAmount');
    if (balanceElement) {
        balanceElement.textContent = `${balance || 0} ₽`;
    }
}

/**
 * Обновление имени пользователя в интерфейсе
 * @param {string} userName - Имя пользователя
 */
function updateUserName(userName) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
}

module.exports = {
    showModal,
    hideModal,
    clearModalInputs,
    showNotification,
    copyToClipboard,
    fallbackCopyTextToClipboard,
    toggleSubsection,
    getCountryFlag,
    formatDate,
    createKeyElement,
    createServerElement,
    updateKeysCount,
    updateBalance,
    updateUserName
};
