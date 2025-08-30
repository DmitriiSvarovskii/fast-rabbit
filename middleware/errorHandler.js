const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Определяем тип ошибки
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Ошибка валидации данных',
      errors: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Не авторизован'
    });
  }

  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Сервис временно недоступен'
    });
  }

  // По умолчанию возвращаем 500 ошибку
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
};

module.exports = errorHandler;
