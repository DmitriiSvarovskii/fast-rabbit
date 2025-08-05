// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Настройка Telegram Web App
if (tg) {
    tg.ready();

    // Отключаем вертикальные свайпы (если поддерживается)
    if (typeof tg.disableVerticalSwipes === 'function') {
        tg.disableVerticalSwipes();
    }

    // Всегда пытаемся перейти в fullscreen при открытии через меню
    if (typeof tg.requestFullscreen === 'function') {
        tg.requestFullscreen();
    } else if (typeof tg.expand === 'function') {
        tg.expand();
    }

    // Функция для открытия модалки с повторным fullscreen
    function openModalWithFullscreen(modal) {
        showModal(modal);
        if (typeof tg.requestFullscreen === 'function') {
            tg.requestFullscreen();
        } else if (typeof tg.expand === 'function') {
            tg.expand();
        }
    }

    // Предотвращение сворачивания приложения
    tg.enableClosingConfirmation();

    // Дополнительные настройки для предотвращения сворачивания
    tg.setHeaderColor('#000000');
    tg.setBackgroundColor('#000000');

    // Обработчик события попытки закрытия
    tg.onEvent('viewportChanged', function () {
        // Если пользователь пытается свернуть приложение, показываем предупреждение
        // if (tg.viewportHeight < window.innerHeight) {
        //     showNotification('Для закрытия приложения используйте кнопку "Назад"', 'info');
        // }
    });

    // Добавляем тянучесть сверху
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    document.addEventListener('touchstart', function (e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isDragging = true;
        }
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        if (isDragging && window.scrollY === 0) {
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;

            if (deltaY > 0) {
                // Пользователь тянет вниз сверху
                e.preventDefault();

                // Добавляем визуальный эффект тянучести
                const pullDistance = Math.min(deltaY * 0.3, 100);
                document.body.style.transform = `translateY(${pullDistance}px)`;
                document.body.style.transition = 'none';
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', function (e) {
        if (isDragging) {
            isDragging = false;

            // Возвращаем контент на место с анимацией
            document.body.style.transition = 'transform 0.3s ease';
            document.body.style.transform = 'translateY(0)';

            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        }
    }, { passive: true });

    // Установка основной кнопки
    // tg.MainButton.setText('Главная');
    // tg.MainButton.show();
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
const instructionsModal = document.getElementById('instructionsModal'); // Добавляем модалку инструкций

// Кнопки закрытия модальных окон
const closeBalanceModal = document.getElementById('closeBalanceModal');
const closeHistoryModal = document.getElementById('closeHistoryModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const closeServerModal = document.getElementById('closeServerModal');
const closeCreateKeyModal = document.getElementById('closeCreateKeyModal');
const closeInstructionsModal = document.getElementById('closeInstructionsModal'); // Кнопка закрытия инструкций

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
const keyText = document.getElementById('keyText'); // Поле для отображения ключа в инструкциях

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
    balanceAmountInput.value = '';
}

// Обработчики событий для модальных окон
addBalanceBtn.addEventListener('click', () => {
    openModalWithFullscreen(balanceModal);
    balanceAmountInput.focus();
});

historyLink.addEventListener('click', () => {
    openModalWithFullscreen(historyModal);
});

// Обработчик для добавления ключа
document.getElementById('addKeyBtn').addEventListener('click', () => {
    loadServers();
    openModalWithFullscreen(serverModal);
});

// Закрытие модальных окон
closeBalanceModal.addEventListener('click', () => {
    hideModal(balanceModal);
    clearModalInputs();
});

closeHistoryModal.addEventListener('click', () => {
    hideModal(historyModal);
});

closeDeleteModal.addEventListener('click', () => {
    hideModal(deleteModal);
    resetSwipeState();
});

closeServerModal.addEventListener('click', () => {
    hideModal(serverModal);
});

closeCreateKeyModal.addEventListener('click', () => {
    hideModal(createKeyModal);
});

closeInstructionsModal.addEventListener('click', () => {
    hideModal(instructionsModal);
});

// Закрытие модалки инструкций по клику вне её
instructionsModal.addEventListener('click', (e) => {
    if (e.target === instructionsModal) {
        hideModal(instructionsModal);
    }
});

cancelBalanceBtn.addEventListener('click', () => {
    hideModal(balanceModal);
    clearModalInputs();
});

cancelDeleteBtn.addEventListener('click', () => {
    hideModal(deleteModal);
    resetSwipeState();
});

cancelCreateKeyBtn.addEventListener('click', () => {
    hideModal(createKeyModal);
});

// Закрытие модальных окон при клике вне их
balanceModal.addEventListener('click', (e) => {
    if (e.target === balanceModal) {
        hideModal(balanceModal);
        clearModalInputs();
    }
});

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        hideModal(historyModal);
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        hideModal(deleteModal);
        resetSwipeState();
    }
});

serverModal.addEventListener('click', (e) => {
    if (e.target === serverModal) {
        hideModal(serverModal);
    }
});

createKeyModal.addEventListener('click', (e) => {
    if (e.target === createKeyModal) {
        hideModal(createKeyModal);
    }
});

instructionsModal.addEventListener('click', (e) => {
    if (e.target === instructionsModal) {
        hideModal(instructionsModal);
    }
});

// Пополнение баланса
confirmBalanceBtn.addEventListener('click', async () => {
    const amount = parseInt(balanceAmountInput.value);

    if (!amount || amount <= 0) {
        showNotification('Введите корректную сумму', 'error');
        return;
    }

    try {
        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: 1, // В реальном приложении ID пользователя должен приходить из Telegram
                amount: amount
            })
        });

        const data = await response.json();

        if (data.success) {
            balanceAmount.textContent = `${data.balance} ₽`;
            hideModal(balanceModal);
            clearModalInputs();
            showNotification(`Баланс пополнен на ${amount}₽`, 'success');

            // Haptic feedback для Telegram
            if (tg && tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('medium');
            }
        } else {
            showNotification(data.message || 'Ошибка при пополнении баланса', 'error');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Ошибка сети', 'error');
    }
});

// Функция для копирования ключа
function copyKey(keyValue) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(keyValue).then(() => {
            showNotification('Ключ скопирован', 'success');

            // Haptic feedback для Telegram
            if (tg && tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
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
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Автоматическое удаление
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Обработка Enter в полях ввода
balanceAmountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        confirmBalanceBtn.click();
    }
});



// Обработка ошибок сети
window.addEventListener('online', () => {
    showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Нет соединения с интернетом', 'error');
});

// Функция для обновления данных пользователя
async function refreshUserData() {
    try {
        const response = await fetch('/api/user/1');
        const user = await response.json();

        // Обновляем баланс
        balanceAmount.textContent = `${user.balance.balance} ₽`;

        // Обновляем количество ключей
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.textContent = `Количество ключей: ${user.keys.length}`;
        }

        // Обновляем список ключей
        updateKeysList(user.keys);

    } catch (error) {
        console.error('Error refreshing user data:', error);
        showNotification('Ошибка обновления данных', 'error');
    }
}

// Функция для обновления списка ключей
function updateKeysList(keys) {
    const keysList = document.getElementById('keysList');
    if (!keysList) return;

    keysList.innerHTML = '';

    keys.forEach((key) => {
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

        // Добавляем обработчик клика на весь элемент для открытия инструкций
        deviceElement.addEventListener('click', (e) => {
            console.log('Клик по элементу ключа:', e.target);

            // Не открываем инструкции, если кликнули на кнопку копирования или область удаления
            if (e.target.closest('.copy-btn') || e.target.closest('.delete-action')) {
                console.log('Клик по кнопке копирования или области удаления - игнорируем');
                return;
            }

            // Проверяем, что не было движения (это был настоящий клик, а не свайп)
            if (hasMoved) {
                console.log('Было движение - игнорируем клик');
                return;
            }

            console.log('Открываем инструкции для ключа:', key.key);
            showKeyInstructions(key);
        });

        // Добавляем обработчик для кнопки копирования
        const copyBtn = deviceElement.querySelector('.copy-btn');
        copyBtn.addEventListener('click', (e) => {
            console.log('Клик по кнопке копирования');
            e.stopPropagation(); // Предотвращаем всплытие события
            e.preventDefault(); // Предотвращаем стандартное поведение
            copyKey(key.key);
        });

        // Добавляем обработчик для области удаления
        const deleteAction = deviceElement.querySelector('.delete-action');
        deleteAction.addEventListener('click', (e) => {
            console.log('Клик по области удаления');
            e.stopPropagation(); // Предотвращаем всплытие события
            e.preventDefault(); // Предотвращаем стандартное поведение

            const keyId = deviceElement.getAttribute('data-key-id');
            if (keyId) {
                showDeleteConfirmation(keyId);
            }
        });

        keysList.appendChild(deviceElement);
    });

    // Переинициализируем свайп для новых элементов
    initializeSwipe();
}

// Функция для показа инструкций по ключу
function showKeyInstructions(key) {
    console.log('Вызывается showKeyInstructions для ключа:', key.key);

    const instructionsModal = document.getElementById('instructionsModal');
    const keyTextElement = document.getElementById('keyText');
    const platformTabs = document.getElementById('platformTabs');

    if (!instructionsModal) {
        console.error('Модалка инструкций не найдена!');
        return;
    }

    if (!keyTextElement) {
        console.error('Элемент для отображения ключа не найден!');
        return;
    }

    // Устанавливаем текст ключа
    keyTextElement.textContent = key.key;

    // Показываем модалку
    console.log('Открываем модалку инструкций');
    openModalWithFullscreen(instructionsModal);
}

// Функция для копирования ключа из модалки инструкций
function copyKeyFromInstructions() {
    const keyText = document.getElementById('keyText').textContent;
    copyKey(keyText);
}

// Функция для переключения между платформами
function switchPlatform(platform) {
    // Убираем активный класс со всех табов и инструкций
    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.platform-instructions').forEach(instruction => {
        instruction.classList.remove('active');
    });

    // Добавляем активный класс к выбранному табу и инструкции
    document.querySelector(`[data-platform="${platform}"]`).classList.add('active');
    document.getElementById(`${platform}-instructions`).classList.add('active');
}

// Инициализация обработчиков для табов платформ
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const platform = this.getAttribute('data-platform');
            switchPlatform(platform);
        });
    });

    // Инициализируем свайп при загрузке страницы
    initializeSwipe();
});

// Функция для сброса состояния свайпа
function resetSwipeState() {
    // Сбрасываем состояние свайпа для всех элементов
    document.querySelectorAll('.device.swiped').forEach(device => {
        device.classList.remove('swiped');
        device.style.transform = 'translateX(0)';
    });

    // Сбрасываем глобальные переменные свайпа
    isSwiping = false;
    currentSwipeElement = null;
    hasMoved = false;
    touchStartTime = 0;
}

// Переменные для свайпа
let currentSwipeElement = null;
let startX = 0;
let currentX = 0;
let isSwiping = false;
let touchStartTime = 0;
let hasMoved = false;

// Инициализация свайпа
function initializeSwipe() {
    const devices = document.querySelectorAll('.device');

    devices.forEach(device => {
        // Touch события
        device.addEventListener('touchstart', handleTouchStart);
        device.addEventListener('touchmove', handleTouchMove);
        device.addEventListener('touchend', handleTouchEnd);

        // Mouse события для десктопа
        device.addEventListener('mousedown', handleMouseStart);
        device.addEventListener('mousemove', handleMouseMove);
        device.addEventListener('mouseup', handleMouseEnd);
        device.addEventListener('mouseleave', handleMouseEnd);
    });
}

// Touch обработчики
function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    currentSwipeElement = e.currentTarget;
    touchStartTime = Date.now(); // Запоминаем время начала касания
    hasMoved = false;
    // НЕ устанавливаем isSwiping = true сразу
}

function handleTouchMove(e) {
    if (!currentSwipeElement) return;

    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    if (Math.abs(diffX) > 10) {
        // Устанавливаем isSwiping только после минимального движения
        if (!isSwiping) {
            isSwiping = true;
        }
        hasMoved = true;
    }

    if (diffX < 0 && isSwiping) {
        e.preventDefault();
        const translateX = Math.max(diffX, -80);
        currentSwipeElement.style.transform = `translateX(${translateX}px)`;
    }
}

function handleTouchEnd(e) {
    if (!currentSwipeElement) return;

    const diffX = currentX - startX;

    if (diffX < -60 && isSwiping) {
        // Свайп влево достаточно для показа области удаления
        currentSwipeElement.classList.add('swiped');
        currentSwipeElement.style.transform = 'translateX(-80px)';

        // НЕ показываем подтверждение удаления автоматически
        // Пользователь должен кликнуть на область удаления
    } else {
        // Возвращаем в исходное положение
        currentSwipeElement.classList.remove('swiped');
        currentSwipeElement.style.transform = 'translateX(0)';
    }

    isSwiping = false;
    currentSwipeElement = null;
    touchStartTime = 0;

    // Сбрасываем флаг движения с небольшой задержкой
    setTimeout(() => {
        hasMoved = false;
    }, 100);
}

// Mouse обработчики
function handleMouseStart(e) {
    startX = e.clientX;
    currentSwipeElement = e.currentTarget;
    touchStartTime = Date.now(); // Запоминаем время начала касания
    hasMoved = false;
    // НЕ устанавливаем isSwiping = true сразу
}

function handleMouseMove(e) {
    if (!currentSwipeElement) return;

    currentX = e.clientX;
    const diffX = currentX - startX;

    if (Math.abs(diffX) > 10) {
        // Устанавливаем isSwiping только после минимального движения
        if (!isSwiping) {
            isSwiping = true;
        }
        hasMoved = true;
    }

    if (diffX < 0 && isSwiping) {
        const translateX = Math.max(diffX, -80);
        currentSwipeElement.style.transform = `translateX(${translateX}px)`;
    }
}

function handleMouseEnd(e) {
    if (!currentSwipeElement) return;

    const diffX = currentX - startX;

    if (diffX < -60 && isSwiping) {
        // Свайп влево достаточно для показа области удаления
        currentSwipeElement.classList.add('swiped');
        currentSwipeElement.style.transform = 'translateX(-80px)';

        // НЕ показываем подтверждение удаления автоматически
        // Пользователь должен кликнуть на область удаления
    } else {
        currentSwipeElement.classList.remove('swiped');
        currentSwipeElement.style.transform = 'translateX(0)';
    }

    isSwiping = false;
    currentSwipeElement = null;
    touchStartTime = 0;

    // Сбрасываем флаг движения с небольшой задержкой
    setTimeout(() => {
        hasMoved = false;
    }, 100);
}

// Функция показа подтверждения удаления
function showDeleteConfirmation(keyId) {
    const deviceElement = document.querySelector(`[data-key-id="${keyId}"]`);
    if (!deviceElement) return;

    const keyInfo = deviceElement.querySelector('.device-title').textContent.trim();
    document.getElementById('deleteKeyInfo').textContent = `Конфигурация: ${keyInfo}`;

    showModal(deleteModal);

    // Сохраняем ID ключа для удаления
    confirmDeleteBtn.onclick = () => performDelete(keyId);
}

// Функция удаления ключа (оставляем для совместимости)
function deleteKey(keyId) {
    showDeleteConfirmation(keyId);
}

// Выполнение удаления
async function performDelete(keyId) {
    try {
        const response = await fetch(`/api/keys/${keyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Удаляем элемент из DOM
            const deviceElement = document.querySelector(`[data-key-id="${keyId}"]`);
            if (deviceElement) {
                deviceElement.style.transform = 'translateX(-100%)';
                deviceElement.style.opacity = '0';
                setTimeout(() => {
                    deviceElement.remove();
                    // Обновляем количество ключей
                    const keysList = document.getElementById('keysList');
                    const subtitle = document.querySelector('.subtitle');
                    if (subtitle) {
                        subtitle.textContent = `Количество ключей: ${keysList.children.length}`;
                    }
                }, 300);
            }

            hideModal(deleteModal);
            showNotification('Конфигурация удалена', 'success');

            // Haptic feedback для Telegram
            if (tg && tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('medium');
            }

            // Обновляем данные пользователя для синхронизации
            await refreshUserData();
        } else {
            showNotification(data.message || 'Ошибка при удалении', 'error');
        }
    } catch (error) {
        console.error('Ошибка удаления:', error);
        showNotification('Ошибка сети', 'error');
    }
}

// Функция загрузки серверов
async function loadServers() {
    try {
        const response = await fetch('/api/servers');
        const servers = await response.json();

        const serversList = document.getElementById('serversList');
        serversList.innerHTML = '';

        servers.forEach(server => {
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
                selectServer(server);
            });

            serversList.appendChild(serverElement);
        });

    } catch (error) {
        console.error('Ошибка загрузки серверов:', error);
        showNotification('Ошибка загрузки серверов', 'error');
    }
}

// Функция выбора сервера
function selectServer(server) {
    const serverInfo = document.getElementById('serverInfo');
    const flag = getCountryFlag(server.country);
    serverInfo.innerHTML = `${flag} ${server.country}`;

    hideModal(serverModal);
    showModal(createKeyModal);

    // Сохраняем выбранный сервер для создания ключа
    confirmCreateKeyBtn.onclick = () => createKey(server.id);
}

// Функция создания ключа
async function createKey(serverId) {
    try {
        const response = await fetch('/api/keys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                server_id: serverId
            })
        });

        const data = await response.json();

        if (data.id) {
            hideModal(createKeyModal);
            showNotification('Конфигурация создана успешно!', 'success');

            // Haptic feedback для Telegram
            if (tg && tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('medium');
            }

            // Обновляем данные пользователя
            await refreshUserData();
        } else {
            showNotification('Ошибка при создании конфигурации', 'error');
        }
    } catch (error) {
        console.error('Ошибка создания ключа:', error);
        showNotification('Ошибка сети', 'error');
    }
}

// Функция получения флага страны
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

// Функция для переключения выпадающих подразделов
function toggleSubsection(subsectionId) {
    const content = document.getElementById(`${subsectionId}-content`);
    const icon = document.getElementById(`${subsectionId}-icon`);
    const subsection = content.closest('.collapsible-subsection');

    if (content.classList.contains('expanded')) {
        // Сворачиваем подраздел
        content.classList.remove('expanded');
        subsection.classList.remove('expanded');
        subsection.classList.add('collapsed');

        // Haptic feedback для Telegram
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    } else {
        // Разворачиваем подраздел
        content.classList.add('expanded');
        subsection.classList.remove('collapsed');
        subsection.classList.add('expanded');

        // Haptic feedback для Telegram
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    }
}

// Функция для открытия поддержки в Telegram
function openTelegramSupport() {
    const telegramUrl = 'https://t.me/swrsky';

    // Haptic feedback для Telegram
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }

    // Показываем уведомление
    showNotification('Открываем чат поддержки...', 'info');

    // Открываем ссылку
    if (tg && tg.openTelegramLink) {
        // Если мы в Telegram Web App, используем его API
        tg.openTelegramLink(telegramUrl);
    } else {
        // Иначе открываем в новой вкладке
        window.open(telegramUrl, '_blank');
    }
}

// Инициализация выпадающих подразделов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем все подразделы как свернутые
    const subsections = document.querySelectorAll('.collapsible-subsection');
    subsections.forEach(subsection => {
        subsection.classList.add('collapsed');
    });

    // Показываем приветственное уведомление
    setTimeout(() => {
        showNotification('Добро пожаловать в Fast Rabbit!', 'info');
    }, 1000);

    // Настройка Telegram Web App после загрузки
    if (tg) {
        // Устанавливаем цветовую схему
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');

        // Обработчик основной кнопки
        tg.MainButton.onClick(() => {
            window.location.reload();
        });
    }

    // Добавляем обработчики для кнопок копирования
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const keyValue = btn.getAttribute('data-key');
            if (keyValue) {
                copyKey(keyValue);
            }
        });
    });
}); 