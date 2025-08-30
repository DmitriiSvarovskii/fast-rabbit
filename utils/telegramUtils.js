// Утилиты для работы с Telegram Web App

/**
 * Получение Telegram ID пользователя
 * @returns {number|null} ID пользователя или null
 */
function getTelegramId() {
    try {
        const tg = window.Telegram?.WebApp;
        return tg?.initDataUnsafe?.user?.id || null;
    } catch (error) {
        console.warn('Ошибка при получении Telegram ID:', error);
        return null;
    }
}

/**
 * Получение данных инициализации Telegram
 * @returns {string} Данные инициализации
 */
function getInitData() {
    try {
        const tg = window.Telegram?.WebApp;
        return tg?.initData || '';
    } catch (error) {
        console.warn('Ошибка при получении данных инициализации:', error);
        return '';
    }
}

/**
 * Получение данных пользователя из Telegram
 * @returns {object|null} Данные пользователя или null
 */
function getTelegramUserData() {
    try {
        const tg = window.Telegram?.WebApp;
        return tg?.initDataUnsafe?.user || null;
    } catch (error) {
        console.warn('Ошибка при получении данных пользователя:', error);
        return null;
    }
}

/**
 * Формирование отображаемого имени пользователя
 * @param {object} user - Данные пользователя
 * @returns {string} Отображаемое имя
 */
function formatUserName(user) {
    if (!user) return 'Пользователь';

    let displayName = '';
    if (user.first_name) displayName += user.first_name;
    if (user.last_name) displayName += ' ' + user.last_name;
    if (!displayName && user.username) displayName = user.username;

    return displayName || 'Пользователь';
}

/**
 * Инициализация Telegram Web App
 */
function initializeTelegramWebApp() {
    try {
        const tg = window.Telegram?.WebApp;
        if (!tg) {
            console.warn('Telegram Web App не доступен');
            return;
        }

        // Готовность приложения
        tg.ready();

        // Отключение вертикальных свайпов
        if (typeof tg.disableVerticalSwipes === 'function') {
            try {
                tg.disableVerticalSwipes();
            } catch (e) {
                console.warn('Не удалось отключить вертикальные свайпы:', e);
            }
        }

        // Переход в полноэкранный режим
        if (typeof tg.requestFullscreen === 'function') {
            try {
                tg.requestFullscreen();
            } catch (e) {
                console.warn('Не удалось перейти в полноэкранный режим:', e);
            }
        } else if (typeof tg.expand === 'function') {
            try {
                tg.expand();
            } catch (e) {
                console.warn('Не удалось развернуть приложение:', e);
            }
        }

        // Подтверждение закрытия
        try {
            tg.enableClosingConfirmation();
        } catch (e) {
            console.warn('Не удалось включить подтверждение закрытия:', e);
        }

        // Настройка цветов
        try {
            tg.setHeaderColor('#000000');
            tg.setBackgroundColor('#000000');
        } catch (e) {
            console.warn('Не удалось установить цвета:', e);
        }

        console.log('Telegram Web App инициализирован');
    } catch (error) {
        console.error('Ошибка инициализации Telegram Web App:', error);
    }
}

/**
 * Показ кнопки "Назад" в Telegram
 */
function showBackButton() {
    try {
        const tg = window.Telegram?.WebApp;
        if (tg?.BackButton) {
            tg.BackButton.show();
        }
    } catch (error) {
        console.warn('Ошибка при показе кнопки "Назад":', error);
    }
}

/**
 * Скрытие кнопки "Назад" в Telegram
 */
function hideBackButton() {
    try {
        const tg = window.Telegram?.WebApp;
        if (tg?.BackButton) {
            tg.BackButton.hide();
        }
    } catch (error) {
        console.warn('Ошибка при скрытии кнопки "Назад":', error);
    }
}

/**
 * Настройка обработчика кнопки "Назад"
 * @param {function} callback - Функция обратного вызова
 */
function setupBackButton(callback) {
    try {
        const tg = window.Telegram?.WebApp;
        if (tg?.BackButton) {
            tg.BackButton.onClick(callback);
        }
    } catch (error) {
        console.warn('Ошибка при настройке кнопки "Назад":', error);
    }
}

/**
 * Haptic feedback (тактильная обратная связь)
 * @param {string} style - Стиль обратной связи ('light', 'medium', 'heavy')
 */
function hapticFeedback(style = 'light') {
    try {
        const tg = window.Telegram?.WebApp;
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred(style);
        }
    } catch (error) {
        console.warn('Ошибка при haptic feedback:', error);
    }
}

/**
 * Открытие инвойса для оплаты
 * @param {string} invoiceLink - Ссылка на инвойс
 * @param {function} callback - Функция обратного вызова
 */
function openInvoice(invoiceLink, callback) {
    try {
        const tg = window.Telegram?.WebApp;
        if (tg?.openInvoice) {
            tg.openInvoice(invoiceLink, callback);
        } else {
            throw new Error('openInvoice не поддерживается');
        }
    } catch (error) {
        console.error('Ошибка при открытии инвойса:', error);
        throw error;
    }
}

/**
 * Открытие ссылки в Telegram
 * @param {string} url - URL для открытия
 */
function openTelegramLink(url) {
    try {
        const tg = window.Telegram?.WebApp;
        if (tg?.openTelegramLink) {
            tg.openTelegramLink(url);
        } else {
            window.open(url, '_blank');
        }
    } catch (error) {
        console.warn('Ошибка при открытии ссылки в Telegram:', error);
        window.open(url, '_blank');
    }
}

module.exports = {
    getTelegramId,
    getInitData,
    getTelegramUserData,
    formatUserName,
    initializeTelegramWebApp,
    showBackButton,
    hideBackButton,
    setupBackButton,
    hapticFeedback,
    openInvoice,
    openTelegramLink
};
