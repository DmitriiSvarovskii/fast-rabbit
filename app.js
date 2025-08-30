const express = require('express');
const path = require('path');

// Импорт конфигурации
const config = require('./config/config');

// Импорт middleware
const errorHandler = require('./middleware/errorHandler');

// Импорт маршрутов
const pageRoutes = require('./routes/pageRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/', pageRoutes);
app.use('/api', apiRoutes);

// Обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(config.server.port, config.server.host, () => {
  console.log(`Fast Rabbit VPN server running on port ${config.server.port}`);
  console.log(`API Base URL: ${config.api.baseUrl}`);
  console.log(`Environment: ${config.app.environment}`);
  console.log(`Open http://${config.server.host}:${config.server.port} in your browser`);
});