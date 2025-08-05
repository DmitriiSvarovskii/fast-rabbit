// Глобальные переменные
console.log('Script loaded and running');
let tg = window.Telegram.WebApp;
console.log('Telegram WebApp:', tg);
let currentKey = null; // Для хранения текущего ключа

// Инициализация всех обработчиков событий
function initializeEventHandlers() {
    console.log('Initializing event handlers');

    // Обработчики для ключей
    document.querySelectorAll('.device').forEach(deviceElement => {
        console.log('Adding click handler to device:', deviceElement);

        deviceElement.addEventListener('click', (e) => {
            console.log('Device clicked:', e.target);

            if (e.target.closest('.copy-btn') || e.target.closest('.delete-action')) {
                console.log('Click on copy or delete button - ignoring');
                return;
            }

            const keyId = deviceElement.getAttribute('data-key-id');
            console.log('Key ID:', keyId);

            if (keyId) {
                console.log('Navigating to:', `/key/${keyId}`);
                window.location.href = `/key/${keyId}`;
            }
        });
    });

    // Обработчики для модальных окон
    if (addBalanceBtn) {
        addBalanceBtn.addEventListener('click', () => {
            console.log('Balance button clicked');
            showModal(balanceModal);
            balanceAmountInput.focus();
        });
    }

    if (historyLink) {
        historyLink.addEventListener('click', () => {
            console.log('History link clicked');
            showModal(historyModal);
        });
    }

    // Обработчик для добавления ключа
    const addKeyBtn = document.getElementById('addKeyBtn');
    if (addKeyBtn) {
        addKeyBtn.addEventListener('click', () => {
            console.log('Add key button clicked');
            loadServers();
            showModal(serverModal);
        });
    }

    // Закрытие модальных окон
    if (closeBalanceModal) {
        closeBalanceModal.addEventListener('click', () => {
            hideModal(balanceModal);
            clearModalInputs();
        });
    }

    if (closeHistoryModal) {
        closeHistoryModal.addEventListener('click', () => {
            hideModal(historyModal);
        });
    }

    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', () => {
            hideModal(deleteModal);
            resetSwipeState();
        });
    }

    if (closeServerModal) {
        closeServerModal.addEventListener('click', () => {
            hideModal(serverModal);
        });
    }

    if (closeCreateKeyModal) {
        closeCreateKeyModal.addEventListener('click', () => {
            hideModal(createKeyModal);
        });
    }

    // Кнопки отмены
    if (cancelBalanceBtn) {
        cancelBalanceBtn.addEventListener('click', () => {
            hideModal(balanceModal);
            clearModalInputs();
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            hideModal(deleteModal);
        });
    }

    if (cancelCreateKeyBtn) {
        cancelCreateKeyBtn.addEventListener('click', () => {
            hideModal(createKeyModal);
        });
    }

    // Закрытие модальных окон при клике вне их
    if (balanceModal) {
        balanceModal.addEventListener('click', (e) => {
            if (e.target === balanceModal) {
                hideModal(balanceModal);
                clearModalInputs();
            }
        });
    }

    if (historyModal) {
        historyModal.addEventListener('click', (e) => {
            if (e.target === historyModal) {
                hideModal(historyModal);
            }
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                hideModal(deleteModal);
                resetSwipeState();
            }
        });
    }

    if (serverModal) {
        serverModal.addEventListener('click', (e) => {
            if (e.target === serverModal) {
                hideModal(serverModal);
            }
        });
    }

    if (createKeyModal) {
        createKeyModal.addEventListener('click', (e) => {
            if (e.target === createKeyModal) {
                hideModal(createKeyModal);
            }
        });
    }

    // Обработка Enter в полях ввода
    if (balanceAmountInput) {
        balanceAmountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmBalanceBtn.click();
            }
        });
    }

    // Инициализируем все подразделы как свернутые
    const subsections = document.querySelectorAll('.collapsible-subsection');
    subsections.forEach(subsection => {
        subsection.classList.add('collapsed');
    });
}

// Элементы DOM
const balanceAmount = document.getElementById('balanceAmount');
const addBalanceBtn = document.getElementById('addBalanceBtn');
const historyLink = document.getElementById('historyLink');
const keysList = document.getElementById('keysList');

// Модальные окна
const balanceModal = document.getElementById('balanceModal');
const historyModal = document.getElementById('historyModal');
const deleteModal = document.getElementById('deleteModal');
const serverModal = document.getElementById('serverModal');
const createKeyModal = document.getElementById('createKeyModal');

// Кнопки закрытия модальных окон
const closeBalanceModal = document.getElementById('closeBalanceModal');
const closeHistoryModal = document.getElementById('closeHistoryModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const closeServerModal = document.getElementById('closeServerModal');
const closeCreateKeyModal = document.getElementById('closeCreateKeyModal');

// Кнопки отмены
const cancelBalanceBtn = document.getElementById('cancelBalanceBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const cancelCreateKeyBtn = document.getElementById('cancelCreateKeyBtn');

// Кнопки подтверждения
const confirmBalanceBtn = document.getElementById('confirmBalanceBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const confirmCreateKeyBtn = document.getElementById('confirmCreateKeyBtn');

// Поля ввода
const balanceAmountInput = document.getElementById('balanceAmountInput');

// Функции для работы с модальными окнами
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function clearModalInputs() {
    if (balanceAmountInput) {
        balanceAmountInput.value = '';
    }
}

// Настройка Telegram Web App
if (tg) {
    try {
        tg.ready();

        // Отключаем вертикальные свайпы (если поддерживается)
        if (typeof tg.disableVerticalSwipes === 'function') {
            try {
                tg.disableVerticalSwipes();
            } catch (e) {
                console.warn('Failed to disable vertical swipes:', e);
            }
        }

        // Всегда пытаемся перейти в fullscreen при открытии через меню
        if (typeof tg.requestFullscreen === 'function') {
            try {
                tg.requestFullscreen();
            } catch (e) {
                console.warn('Failed to request fullscreen:', e);
            }
        } else if (typeof tg.expand === 'function') {
            try {
                tg.expand();
            } catch (e) {
                console.warn('Failed to expand:', e);
            }
        }

        // Предотвращение сворачивания приложения
        try {
            tg.enableClosingConfirmation();
        } catch (e) {
            console.warn('Failed to enable closing confirmation:', e);
        }

        // Дополнительные настройки для предотвращения сворачивания
        try {
            tg.setHeaderColor('#000000');
            tg.setBackgroundColor('#000000');
        } catch (e) {
            console.warn('Failed to set colors:', e);
        }
    } catch (e) {
        console.error('Error initializing Telegram Web App:', e);
    }
}

// Функция для копирования ключа
function copyKey(keyValue) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(keyValue).then(() => {
            showNotification('Ключ скопирован', 'success');

            // Haptic feedback для Telegram
            if (tg && tg.HapticFeedback) {
                try {
                    tg.HapticFeedback.impactOccurred('light');
                } catch (e) {
                    console.warn('Failed to trigger haptic feedback:', e);
                }
            }
        }).catch(() => {
            fallbackCopyTextToClipboard(keyValue);
        });
    } else {
        fallbackCopyTextToClipboard(keyValue);
    }
}

// Fallback для копирования в старых браузерах
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
        document.execCommand('copy');
        showNotification('Ключ скопирован', 'success');
    } catch (err) {
        showNotification('Ошибка при копировании', 'error');
    }

    document.body.removeChild(textArea);
}

// Система уведомлений
function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Функция для переключения выпадающих подразделов
function toggleSubsection(subsectionId) {
    console.log('Toggling subsection:', subsectionId);

    const content = document.getElementById(`${subsectionId}-content`);
    const subsection = content.closest('.collapsible-subsection');

    if (content.classList.contains('expanded')) {
        // Сворачиваем подраздел
        content.classList.remove('expanded');
        subsection.classList.remove('expanded');
        subsection.classList.add('collapsed');

        // Haptic feedback для Telegram
        if (tg && tg.HapticFeedback) {
            try {
                tg.HapticFeedback.impactOccurred('light');
            } catch (e) {
                console.warn('Failed to trigger haptic feedback:', e);
            }
        }
    } else {
        // Разворачиваем подраздел
        content.classList.add('expanded');
        subsection.classList.remove('collapsed');
        subsection.classList.add('expanded');

        // Haptic feedback для Telegram
        if (tg && tg.HapticFeedback) {
            try {
                tg.HapticFeedback.impactOccurred('light');
            } catch (e) {
                console.warn('Failed to trigger haptic feedback:', e);
            }
        }
    }
}

// Функция для открытия поддержки в Telegram
function openTelegramSupport() {
    const telegramUrl = 'https://t.me/swrsky';

    // Haptic feedback для Telegram
    if (tg && tg.HapticFeedback) {
        try {
            tg.HapticFeedback.impactOccurred('medium');
        } catch (e) {
            console.warn('Failed to trigger haptic feedback:', e);
        }
    }

    // Показываем уведомление
    showNotification('Открываем чат поддержки...', 'info');

    // Открываем ссылку
    if (tg && tg.openTelegramLink) {
        // Если мы в Telegram Web App, используем его API
        try {
            tg.openTelegramLink(telegramUrl);
        } catch (e) {
            console.warn('Failed to open Telegram link:', e);
            window.open(telegramUrl, '_blank');
        }
    } else {
        // Иначе открываем в новой вкладке
        window.open(telegramUrl, '_blank');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing');

    // Инициализируем обработчики событий
    initializeEventHandlers();

    // Показываем приветственное уведомление
    setTimeout(() => {
        showNotification('Добро пожаловать в Fast Rabbit!', 'info');
    }, 1000);

    // Настройка Telegram Web App после загрузки
    if (tg) {
        try {
            // Устанавливаем цветовую схему
            tg.setHeaderColor('#000000');
            tg.setBackgroundColor('#000000');
        } catch (e) {
            console.warn('Failed to set colors:', e);
        }
    }
});