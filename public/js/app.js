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

    // Обработчик для кнопки подтверждения пополнения баланса
    if (confirmBalanceBtn) {
        confirmBalanceBtn.addEventListener('click', async () => {
            console.log('Confirm balance button clicked');
            const amount = parseInt(balanceAmountInput.value);
            console.log('Amount:', amount);

            if (!amount || amount <= 0) {
                showNotification('Введите корректную сумму', 'error');
                return;
            }

            try {
                console.log('Sending payment request...');
                const response = await fetch('/api/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: 1,
                        amount: amount
                    })
                });

                console.log('Payment response:', response);
                const data = await response.json();
                console.log('Payment data:', data);

                if (data.success) {
                    if (balanceAmount) {
                        balanceAmount.textContent = `${data.balance} ₽`;
                    }
                    hideModal(balanceModal);
                    clearModalInputs();
                    showNotification(`Баланс пополнен на ${amount}₽`, 'success');

                    // Haptic feedback для Telegram
                    if (tg && tg.HapticFeedback) {
                        try {
                            tg.HapticFeedback.impactOccurred('medium');
                        } catch (e) {
                            console.warn('Failed to trigger haptic feedback:', e);
                        }
                    }
                } else {
                    showNotification(data.message || 'Ошибка при пополнении баланса', 'error');
                }
            } catch (error) {
                console.error('Payment error:', error);
                showNotification('Ошибка сети', 'error');
            }
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
        addKeyBtn.addEventListener('click', async () => {
            console.log('Add key button clicked');
            try {
                console.log('Loading servers...');
                const response = await fetch('/api/servers');
                console.log('Servers response:', response);
                const servers = await response.json();
                console.log('Servers data:', servers);

                const serversList = document.getElementById('serversList');
                if (serversList) {
                    serversList.innerHTML = '';

                    servers.forEach(server => {
                        console.log('Creating server element:', server);
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

                        serverElement.addEventListener('click', () => {
                            console.log('Server selected:', server);
                            const serverInfo = document.getElementById('serverInfo');
                            if (serverInfo) {
                                serverInfo.innerHTML = `${flag} ${server.country}`;
                            }

                            hideModal(serverModal);
                            showModal(createKeyModal);

                            // Настраиваем кнопку создания ключа
                            const confirmCreateKeyBtn = document.getElementById('confirmCreateKeyBtn');
                            if (confirmCreateKeyBtn) {
                                confirmCreateKeyBtn.onclick = async () => {
                                    console.log('Creating key for server:', server);
                                    try {
                                        const response = await fetch('/api/keys', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                server_id: server.id
                                            })
                                        });

                                        console.log('Create key response:', response);
                                        const data = await response.json();
                                        console.log('Create key data:', data);

                                        if (data.id) {
                                            hideModal(createKeyModal);
                                            showNotification('Конфигурация создана успешно!', 'success');

                                            // Haptic feedback для Telegram
                                            if (tg && tg.HapticFeedback) {
                                                try {
                                                    tg.HapticFeedback.impactOccurred('medium');
                                                } catch (e) {
                                                    console.warn('Failed to trigger haptic feedback:', e);
                                                }
                                            }

                                            // Обновляем список ключей
                                            const userResponse = await fetch('/api/user/1');
                                            const userData = await userResponse.json();

                                            // Обновляем количество ключей
                                            const subtitle = document.querySelector('.subtitle');
                                            if (subtitle) {
                                                subtitle.textContent = `Количество ключей: ${userData.keys.length}`;
                                            }

                                            // Обновляем список ключей
                                            const keysList = document.getElementById('keysList');
                                            if (keysList && userData.keys) {
                                                keysList.innerHTML = '';
                                                userData.keys.forEach((key) => {
                                                    const deviceElement = document.createElement('div');
                                                    deviceElement.className = 'device';
                                                    deviceElement.setAttribute('data-id', key.id);
                                                    deviceElement.setAttribute('data-key-id', key.id);

                                                    const createdDate = new Date(key.created_at).toLocaleDateString('ru-RU');

                                                    deviceElement.innerHTML = `
                                                        <div class="device-icon"></div>
                                                        <div class="device-info">
                                                            <div class="device-title">${key.country}</div>
                                                            <div class="device-date">Добавлено ${createdDate}</div>
                                                        </div>
                                                        <div class="device-actions">
                                                            <button class="copy-btn" data-key="${key.key}" title="Копировать">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m0 0h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div class="delete-action"></div>
                                                    `;

                                                    // Добавляем обработчик клика для перехода на страницу ключа
                                                    deviceElement.addEventListener('click', (e) => {
                                                        if (e.target.closest('.copy-btn') || e.target.closest('.delete-action')) {
                                                            return;
                                                        }
                                                        window.location.href = `/key/${key.id}`;
                                                    });

                                                    // Добавляем обработчик для кнопки копирования
                                                    const copyBtn = deviceElement.querySelector('.copy-btn');
                                                    if (copyBtn) {
                                                        copyBtn.addEventListener('click', (e) => {
                                                            e.stopPropagation();
                                                            copyKey(key.key);
                                                        });
                                                    }

                                                    // Добавляем обработчик для области удаления
                                                    const deleteAction = deviceElement.querySelector('.delete-action');
                                                    if (deleteAction) {
                                                        deleteAction.addEventListener('click', (e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            showDeleteConfirmation(key.id);
                                                        });
                                                    }

                                                    keysList.appendChild(deviceElement);
                                                });
                                            }
                                        } else {
                                            showNotification('Ошибка при создании конфигурации', 'error');
                                        }
                                    } catch (error) {
                                        console.error('Error creating key:', error);
                                        showNotification('Ошибка сети', 'error');
                                    }
                                };
                            }
                        });

                        serversList.appendChild(serverElement);
                    });
                }

                showModal(serverModal);
            } catch (error) {
                console.error('Error loading servers:', error);
                showNotification('Ошибка загрузки серверов', 'error');
            }
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