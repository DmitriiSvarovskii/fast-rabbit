const apiService = require('../services/apiService');
const config = require('../config/config');

class PageController {
  /**
   * Главная страница
   */
  async getHomePage(req, res) {
    try {
      res.render('index', {
        apiBaseUrl: config.api.baseUrl,
        title: config.app.title,
        user: { keys: [] } // чтобы EJS не падал
      });
    } catch (error) {
      console.error('Error rendering home page:', error);
      res.status(500).render('error', { 
        message: 'Ошибка при загрузке страницы',
        error: config.app.environment === 'development' ? error : {}
      });
    }
  }

  /**
   * Страница ключа
   */
  async getKeyPage(req, res) {
    try {
      const keyId = req.params.id;
      
      // Получаем данные пользователя
      const userResponse = await apiService.getUser(1); // TODO: получать реальный ID пользователя
      const user = userResponse;

      // Находим ключ по ID
      const key = user.keys?.find(k => k.id == keyId);

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
  }
}

module.exports = new PageController();
