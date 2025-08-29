const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.fast-rabbit-vpn.swrsky.ru';

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Главная страница
app.get('/', async (req, res) => {
  try {
    // Получаем данные пользователя
    const userResponse = await axios.get(`${API_BASE_URL}/user/1`);
    const user = userResponse.data;

    // Получаем историю платежей
    const paymentsResponse = await axios.get(`${API_BASE_URL}/payment/1`);
    const payments = paymentsResponse.data;

    res.render('index', {
      title: 'Fast Rabbit VPN',
      user: user,
      payments: payments
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    // В случае ошибки показываем демо данные
    res.render('index', {
      title: 'Fast Rabbit VPN',
      user: {
        id: 1,
        telegram_id: 123,
        first_name: '',
        last_name: '',
        username: '',
        balance: { balance: 100 },
        keys: [
          {
            id: 1,
            country: 'Germany',
            key: 'vless://5611bc6d-de7e-457d-bab5-21db3f9e2231@germany.swrsky.ru:443?flow=xtls-rprx-vision&type=tcp&security=reality&fp=random&sni=www.google.com&pbk=QuXc8-KY25ZOt9lVKBQfrfNr4TCq7ZUQ9fCJ0SjdDxI&sid=0702ff2baba7&spx=/#1swarovski-dima-vpn-germany',
            created_at: '2023-10-01T12:00:00Z'
          },
          {
            id: 2,
            country: 'Germany',
            key: 'vless://5611bc6d-de7e-457d-bab5-21db3f9e2231@germany.swrsky.ru:443?flow=xtls-rprx-vision&type=tcp&security=reality&fp=random&sni=www.google.com&pbk=QuXc8-KY25ZOt9lVKBQfrfNr4TCq7ZUQ9fCJ0SjdDxI&sid=0702ff2baba7&spx=/#dima-vpn-germany',
            created_at: '2023-10-01T12:00:00Z'
          },
          {
            id: 3,
            country: 'Germany',
            key: 'vless://5611bc6d-de7e-457d-bab5-21db3f9e2231@germany.swrsky.ru:443?flow=xtls-rprx-vision&type=tcp&security=reality&fp=random&sni=www.google.com&pbk=QuXc8-KY25ZOt9lVKBQfrfNr4TCq7ZUQ9fCJ0SjdDxI&sid=0702ff2baba7&spx=/#swarovski-vpn-germany',
            created_at: '2023-10-01T12:00:00Z'
          }
        ]
      },
      payments: [
        {
          id: 1,
          user_id: 1,
          amount: 100,
          created_at: '2025-08-02T10:30:00Z'
        }
      ]
    });
  }
});

// Страница ключа
app.get('/key/:id', async (req, res) => {
  try {
    // Получаем данные пользователя
    const userResponse = await axios.get(`${API_BASE_URL}/user/1`);
    const user = userResponse.data;

    // Находим ключ по ID
    const key = user.keys.find(k => k.id == req.params.id);

    if (!key) {
      return res.redirect('/');
    }

    res.render('key', {
      title: 'Конфигурация VPN',
      key: key
    });
  } catch (error) {
    console.error('Error fetching key:', error.message);
    res.redirect('/');
  }
});

// API для пополнения баланса
app.post('/api/payment', async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    if (!user_id || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные для платежа'
      });
    }

    const response = await axios.post(`${API_BASE_URL}/payment/`, {
      user_id: user_id,
      amount: amount
    });

    res.json({
      success: true,
      balance: response.data.balance
    });
  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обработке платежа'
    });
  }
});

// API для получения данных пользователя
app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    res.json(response.data);
  } catch (error) {
    console.error('User fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных пользователя'
    });
  }
});

// API для получения истории платежей
app.get('/api/payment/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await axios.get(`${API_BASE_URL}/payment/${userId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Payments fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении истории платежей'
    });
  }
});

// API для удаления ключа
app.delete('/api/keys/:id', async (req, res) => {
  try {
    const keyId = req.params.id;
    const response = await axios.delete(`${API_BASE_URL}/key/?server_id=${keyId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Key delete error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении ключа'
    });
  }
});

// API для получения списка серверов
app.get('/api/servers', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/server/`);
    res.json(response.data);
  } catch (error) {
    console.error('Servers fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка серверов'
    });
  }
});

// API для создания нового ключа
app.post('/api/keys', async (req, res) => {
  try {
    const { server_id } = req.body;
    const response = await axios.post(`${API_BASE_URL}/key/`, {
      server_id: server_id
    });
    res.json(response.data);
  } catch (error) {
    console.error('Key creation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании ключа'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Fast Rabbit VPN server running on port ${PORT}`);
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Open http://127.0.0.1:${PORT} in your browser`);
});