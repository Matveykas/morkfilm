# Сайт MorkFilm с новостями из Telegram и рабочей формой Formspree

## Как запустить локально

1. Установите Node.js (https://nodejs.org/)
2. В папке проекта выполните:
   npm install
   npm start
3. Откройте http://localhost:3000

- Новости из Telegram подгружаются через /api/telegram-news
- Форма Formspree работает прямо в браузере, при успешной отправке появляется сообщение.

## Файлы
- index.html — главная страница
- news.html — страница новостей
- contacts.html — контакты с формой
- app.js — логика фронтенда (обновление новостей, отправка формы)
- style.css — стили
- server.js — сервер на Express для выдачи новостей из Telegram
