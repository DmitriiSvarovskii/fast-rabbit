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

// Логирование для диагностики
console.log('=== Fast Rabbit VPN Server Starting ===');
console.log('Environment:', config.app.environment);
console.log('Server config:', config.server);
console.log('API config:', config.api);

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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

// Обработка 404
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).render('error', {
    message: 'Страница не найдена',
    error: {}
  });
});

// Запуск сервера
const server = app.listen(config.server.port, config.server.host, () => {
  console.log(`=== Fast Rabbit VPN Server Started ===`);
  console.log(`Server running on port ${config.server.port}`);
  console.log(`API Base URL: ${config.api.baseUrl}`);
  console.log(`Environment: ${config.app.environment}`);
  console.log(`Open http://${config.server.host}:${config.server.port} in your browser`);
});

// Обработка ошибок сервера
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${config.server.port} is already in use`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});