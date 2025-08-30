console.log('Fast Rabbit VPN App - Modular Version');

// Инициализация всех модулей
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded - initializing modules');

    // Инициализация Telegram модуля
    if (window.TelegramModule) {
        window.TelegramModule.init();
    }

    // Инициализация API модуля (включает аутентификацию)
    if (window.ApiModule) {
        window.ApiModule.init();

        // Ждем завершения аутентификации
        await new Promise(resolve => {
            const checkAuth = () => {
                if (window.currentUser || window.ApiModule.accessToken) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }

    // Инициализация UI модуля
    if (window.UIModule) {
        window.UIModule.init();
    }

    // Инициализация Payment модуля
    if (window.PaymentModule) {
        window.PaymentModule.init();
    }

    // Загрузка данных пользователя и рендеринг
    if (window.ApiModule) {
        await window.ApiModule.loadUserAndRender();
    }

    // Показываем приветственное уведомление
    setTimeout(() => {
        if (window.UIModule) {
            window.UIModule.showNotification('Добро пожаловать в Fast Rabbit!', 'info');
        }
    }, 1000);

    // Настройка Telegram Web App после загрузки
    if (window.TelegramModule) {
        try {
            // Устанавливаем цветовую схему
            if (window.TelegramModule.tg) {
                window.TelegramModule.tg.setHeaderColor('#000000');
                window.TelegramModule.tg.setBackgroundColor('#000000');
            }
        } catch (e) {
            console.warn('Failed to set colors:', e);
        }
    }

    // Инициализируем все подразделы как свернутые
    const subsections = document.querySelectorAll('.collapsible-subsection');
    subsections.forEach(subsection => {
        subsection.classList.add('collapsed');
    });

    console.log('All modules initialized successfully');
});

// Глобальные функции для совместимости с существующим кодом

// Функция для копирования ключа (для совместимости)
function copyKey(keyValue) {
    if (window.UIModule) {
        window.UIModule.copyKey(keyValue);
    }
}

// Функция для переключения подраздела (для совместимости)
function toggleSubsection(subsectionId) {
    if (window.UIModule) {
        window.UIModule.toggleSubsection(subsectionId);
    }
}

// Функция для открытия поддержки в Telegram (для совместимости)
function openTelegramSupport() {
    if (window.UIModule) {
        window.UIModule.openTelegramSupport();
    }
}

// Обработчик для истории платежей
document.addEventListener('DOMContentLoaded', () => {
    const historyLink = document.getElementById('historyLink');
    if (historyLink && window.PaymentModule) {
        historyLink.addEventListener('click', () => {
            // Загружаем историю платежей при открытии модального окна
            setTimeout(() => {
                window.PaymentModule.loadPaymentHistory();
            }, 100);
        });
    }
});

// Обработчик для кнопки помощи
document.addEventListener('DOMContentLoaded', () => {
    const helpBlock = document.querySelector('.help-block');
    if (helpBlock) {
        helpBlock.addEventListener('click', () => {
            openTelegramSupport();
        });
    }
});

console.log('App initialization complete');