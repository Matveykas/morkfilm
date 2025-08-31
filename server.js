import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || "8101222414:AAFKDBAXW8GDsuD_DBdbXuxs-YXScsAhhk8";
const CHANNEL_USERNAME = "morkfilm";
let newsCache = [];

// Функция для извлечения названия из кавычек
function extractTitleFromText(text) {
  if (!text) return "Без названия";
  
  const titleMatch = text.match(/«([^»]+)»/);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1];
  }
  
  // Если нет кавычек, берем первые 5-7 слов
  const words = text.split(/\s+/);
  if (words.length > 7) {
    return words.slice(0, 7).join(' ') + '...';
  }
  
  return text.length > 70 ? text.substring(0, 70) + '...' : text;
}

// Функция для получения информации о файле
async function getTelegramFileInfo(fileId) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.ok) {
      return data.result;
    }
  } catch (error) {
    console.error("Ошибка получения информации о файле:", error.message);
  }
  return null;
}

// Прокси для медиафайлов Telegram
app.get("/api/telegram-file/:file_path(*)", async (req, res) => {
  try {
    const file_path = req.params.file_path;
    const telegramUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`;
    
    const response = await fetch(telegramUrl);
    if (!response.ok) {
      return res.status(404).send('File not found');
    }
    
    // Устанавливаем правильные заголовки
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Пересылаем файл
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Ошибка прокси файла:", error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Функция для получения URL медиафайла
async function getMediaUrl(fileId, isVideo = false) {
  const fileInfo = await getTelegramFileInfo(fileId);
  if (!fileInfo) return null;
  
  // Используем наш прокси для обхода CORS
  return `/api/telegram-file/${fileInfo.file_path}`;
}

// Основная функция получения новостей
async function fetchTelegramNews() {
  try {
    console.log("🔄 Получение новостей из Telegram...");
    
    // Пробуем получить последние сообщения из канала
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=50`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.ok && data.result && data.result.length > 0) {
      const newPosts = [];
      
      for (const upd of data.result) {
        if (upd.channel_post) {
          const msg = upd.channel_post;
          
          // Проверяем, что пост из нужного канала
          if (msg.chat && msg.chat.username === CHANNEL_USERNAME) {
            const text = msg.text || msg.caption || "";
            
            // Пропускаем пустые сообщения
            if (!text || text.trim().length < 5) continue;
            
            let mediaUrl = null;
            let mediaType = null;
            let thumbnailUrl = null;
            
            // Обработка фото (берем самую качественную фотку)
            if (msg.photo && msg.photo.length > 0) {
              const fileId = msg.photo[msg.photo.length - 1].file_id;
              mediaUrl = await getMediaUrl(fileId);
              mediaType = 'photo';
            }
            // Обработка видео
            else if (msg.video) {
              const fileId = msg.video.file_id;
              mediaUrl = await getMediaUrl(fileId, true);
              mediaType = 'video';
              
              // Для видео можно попробовать получить превью
              if (msg.video.thumb) {
                thumbnailUrl = await getMediaUrl(msg.video.thumb.file_id);
              }
            }
            
            // Извлекаем название из текста
            const title = extractTitleFromText(text);
            
            // Формируем короткое описание (для главной страницы)
            let shortText = text;
            if (shortText.length > 120) {
              shortText = shortText.substring(0, 120) + '...';
            }
            
            const newsItem = {
              id: msg.message_id,
              update_id: upd.update_id,
              title: title,
              text: shortText,
              fullText: text,
              date: new Date(msg.date * 1000).toLocaleDateString("ru-RU"),
              timestamp: msg.date * 1000,
              link: `https://t.me/${CHANNEL_USERNAME}/${msg.message_id}`
            };
            
            // Добавляем медиа если есть
            if (mediaUrl) {
              newsItem.media = {
                url: mediaUrl,
                type: mediaType,
                thumbnail: thumbnailUrl
              };
            }
            
            newPosts.push(newsItem);
          }
        }
      }
      
      if (newPosts.length > 0) {
        // Объединяем старые и новые посты, убираем дубликаты
        const existingIds = new Set(newsCache.map(n => n.id));
        const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
        
        if (uniqueNewPosts.length > 0) {
          // Добавляем новые посты в начало
          newsCache = [...uniqueNewPosts, ...newsCache];
          
          // Ограничиваем количество новостей
          if (newsCache.length > 50) {
            newsCache = newsCache.slice(0, 50);
          }
          
          console.log(`✅ Добавлено ${uniqueNewPosts.length} новых постов. Всего: ${newsCache.length}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Ошибка при получении новостей:", error.message);
  }
}

// API для получения новостей
app.get("/api/telegram-news", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const news = newsCache.slice(0, limit);
    res.json(news);
  } catch (error) {
    console.error("Ошибка в API новостей:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API для принудительного обновления
app.get("/api/refresh-news", async (req, res) => {
  try {
    await fetchTelegramNews();
    res.json({ success: true, count: newsCache.length });
  } catch (error) {
    console.error("Ошибка при обновлении:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API для удаления новости
app.delete("/api/telegram-news/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = newsCache.length;
    
    newsCache = newsCache.filter(news => news.id !== id);
    
    if (newsCache.length < initialLength) {
      res.json({ success: true, message: `Новость ${id} удалена` });
    } else {
      res.status(404).json({ success: false, message: 'Новость не найдена' });
    }
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Запускаем обновление каждые 5 минут
setInterval(fetchTelegramNews, 5 * 60 * 1000);

// Первоначальная загрузка при старте
setTimeout(fetchTelegramNews, 1000);

// Статические страницы
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/news", (req, res) => res.sendFile(path.join(__dirname, "news.html")));
app.get("/projects", (req, res) => res.sendFile(path.join(__dirname, "projects.html")));
app.get("/contacts", (req, res) => res.sendFile(path.join(__dirname, "contacts.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "about.html")));
app.get("/actors", (req, res) => res.sendFile(path.join(__dirname, "actors.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running http://localhost:${PORT}`));