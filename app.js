// Smooth scroll + Active links
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')){
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth', block:'start'});
      closeMenu();
    }
  });
});

// Burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const overlay = document.getElementById('overlay');

function closeMenu(){
  nav.classList.remove('is-open');
  burger?.classList.remove('is-open');
  overlay?.classList.remove('is-active');
}

if (burger && nav && overlay) {
  burger.addEventListener('click', ()=>{
    overlay.classList.toggle('is-active');
    nav.classList.toggle('is-open');
    burger.classList.toggle('is-open');
  });
  
  overlay.addEventListener('click', closeMenu);
}

// Active on scroll
const sections = [...document.querySelectorAll('section[id]')];
const makeActive = () => {
  const pos = window.scrollY + 120;
  let current = sections[0]?.id;
  
  for (const s of sections){
    if (pos >= s.offsetTop) current = s.id;
  }
  
  document.querySelectorAll('.nav__link').forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
  });
};

window.addEventListener('scroll', makeActive);
makeActive();

// Reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, {threshold: 0.12});

document.querySelectorAll('[data-animate]').forEach(el=>observer.observe(el));

// Parallax hero
const heroBg = document.querySelector('[data-parallax]');
if (heroBg) {
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.15}px) scale(1.08)`;
  });
}

// Form handler
const contactForms = document.querySelectorAll('#contact-form');
contactForms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const formSuccess = form.querySelector('.form__status.success');
    const formError = form.querySelector('.form__status.error');
    
    if (submitBtn) {
      // Show loading state
      submitBtn.classList.add('btn--loading');
      submitBtn.disabled = true;
      
      try {
        // Simulate form submission (in real implementation, use fetch)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        if (formSuccess) {
          formSuccess.style.display = 'block';
          if (formError) formError.style.display = 'none';
        }
        
        // Reset form
        form.reset();
      } catch (error) {
        // Show error message
        if (formError) {
          formError.style.display = 'block';
          if (formSuccess) formSuccess.style.display = 'none';
        }
      } finally {
        // Remove loading state
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
      }
    }
  });
});

// Tabs functionality
const tabButtons = document.querySelectorAll('.tabs__button');
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;
    
    // Remove active class from all buttons and panes
    document.querySelectorAll('.tabs__button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tabs__pane').forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked button and corresponding pane
    button.classList.add('active');
    document.getElementById(tab).classList.add('active');
  });
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLightTheme = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
  });
  
  // Check saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
}

// Video player functionality
const videoPlayers = document.querySelectorAll('.video-player');
videoPlayers.forEach(player => {
  const preview = player.querySelector('.video-player__preview');
  const playBtn = player.querySelector('.video-player__play-btn');
  
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      alert('Видео воспроизводится! В реальной реализации здесь будет встроенный видеоплеер.');
    });
  }
});

// Newsletter form
const newsletterForms = document.querySelectorAll('.newsletter__form');
newsletterForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    alert(`Спасибо за подписку! На адрес ${email} будут приходить наши новости.`);
    form.reset();
  });
});

// Cookie consent
const cookieConsent = document.getElementById('cookie-consent');
const cookieAccept = document.getElementById('cookie-accept');

if (cookieConsent && cookieAccept) {
  // Check if user has already accepted cookies
  if (!localStorage.getItem('cookiesAccepted')) {
    // Show cookie consent after a delay
    setTimeout(() => {
      cookieConsent.style.display = 'block';
    }, 1000);
  }
  
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieConsent.style.display = 'none';
  });
}

// Support banner
const supportBanner = document.getElementById('support-banner');
const supportClose = document.getElementById('support-close');

if (supportBanner && supportClose) {
  // Check if user has already closed the banner
  if (!localStorage.getItem('supportBannerClosed')) {
    // Show support banner after a delay
    setTimeout(() => {
      supportBanner.style.display = 'block';
    }, 2000);
  }
  
  supportClose.addEventListener('click', () => {
    localStorage.setItem('supportBannerClosed', 'true');
    supportBanner.style.display = 'none';
  });
}

// Scroll to top functionality
const scrollTopBtn = document.getElementById('scroll-top');
const toTopBtn = document.getElementById('to-top');

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

if (toTopBtn) {
  toTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Filter functionality for actors page
const filterButtons = document.querySelectorAll('.filter-button');
if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.dataset.filter;
      
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Filter content
      filterContent(filterValue);
    });
  });
}

function filterContent(filterValue) {
  const contentItems = document.querySelectorAll('.actor');
  
  contentItems.forEach(item => {
    if (filterValue === 'all' || item.dataset.category.includes(filterValue)) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 50);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
}

// Counter animation
function animateCounter(element, target) {
  let count = 0;
  const duration = 2000; // ms
  const increment = target / (duration / 16); // 60fps
  
  const updateCount = () => {
    if (count < target) {
      count += increment;
      if (count > target) count = target;
      element.textContent = Math.floor(count) + '+';
      requestAnimationFrame(updateCount);
    }
  };
  
  updateCount();
}

// Initialize counters when in view
const counterElements = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(counter => {
  counterObserver.observe(counter);
});

// Telegram API integration
async function fetchTelegramNews(limit = null) {
  try {
    const container = document.querySelector('.news-page #tg-news-container') || document.getElementById('tg-news-container') || document.getElementById('tg-news-container');
    if (!container) return;

    console.log('🔄 Загружаем новости из Telegram...');
    
    // Добавляем индикатор загрузки
    container.innerHTML = `
      <div class="news-loading">
        <div class="news-loading__spinner"></div>
        <p>Загружаем новости...</p>
      </div>
    `;
    
    let newsData = null;
    
    try {
      const url = limit ? `/api/telegram-news?limit=${limit}` : '/api/telegram-news';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      newsData = await response.json();
      console.log(`✅ Получено ${newsData.length} новостей`);
      
    } catch (error) {
      console.error('Ошибка получения новостей:', error);
      // Используем демо-новости как fallback
      newsData = await fetchDemoNews();
      console.log('🔄 Используем демо-новости');
    }
    
    displayNews(newsData, limit !== 3);
    localStorage.setItem('tgNews', JSON.stringify({
      data: newsData,
      timestamp: Date.now()
    }));
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    showSavedOrFallbackNews();
  }
}

// Демо-новости как fallback
async function fetchDemoNews() {
  return [
    {
      id: 1,
      title: 'Новый проект в разработке',
      text: 'Мы начали работу над новым фильмом. Следите за обновлениями в нашем канале!',
      fullText: 'Мы начали работу над новым фильмом. Следите за обновлениями в нашем канале! Это будет масштабный проект с известными актерами и современными спецэффектами. Производство займет около года, и мы будем делиться с вами всеми этапами создания картины.',
      date: new Date().toLocaleDateString('ru-RU'),
      media: {
        url: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=600&h=400&fit=crop',
        type: 'photo'
      },
      link: 'https://t.me/morkfilm',
      timestamp: Date.now()
    },
    {
      id: 2,
      title: 'Кастинг актеров',
      text: 'Объявляем кастинг на главные роли в новом проекте. Подробности в канале.',
      fullText: 'Объявляем кастинг на главные роли в новом проекте. Подробности в канале. Мы ищем талантливых актеров на роли второго плана. Требования: возраст 25-40 лет, опыт работы в кино от 2 лет. Заявки принимаются до 15 декабря.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
      media: {
        url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&h=400&fit=crop',
        type: 'photo'
      },
      link: 'https://t.me/morkfilm',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    {
      id: 3,
      title: 'Премьера фильма "Тени квартала"',
      text: 'Состоялась премьера нашего нового фильма "Тени квартала".',
      fullText: 'Состоялась премьера нашего нового фильма "Тени квартала". Картина получила восторженные отзывы критиков и зрителей. Фильм уже доступен на всех крупных стриминговых платформах. Не забудьте посмотреть и оставить свой отзыв!',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
      media: {
        url: 'https://images.unsplash.com/photo-1542228262-3d663b306a56?q=80&w=600&h=400&fit=crop',
        type: 'photo'
      },
      link: 'https://t.me/morkfilm',
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
    }
  ];
}

function displayNews(news, isHomePage = false) {
  // Определяем, на какой странице мы — если контейнер внутри .news-page, то это страница новостей
  const containerElemForPageDetect = document.querySelector('.news-page #tg-news-container') || document.getElementById('tg-news-container');
  const isNewsPage = !!(containerElemForPageDetect && containerElemForPageDetect.closest && containerElemForPageDetect.closest('.news-page'));

  const container = document.querySelector('.news-page #tg-news-container') || document.getElementById('tg-news-container') || document.getElementById('tg-news-container');
  if (!container || !news.length) {
    showNoNewsMessage();
    return;
  }
  
  if (isHomePage && !isNewsPage) {
    // ensure index container displays 3 in a row (compact)
    if (container && !container.closest('.news-page')) { container.classList.remove('news-grid-full'); container.classList.add('grid','grid--3'); }
    // Главная страница - только 3 новости с ограниченным текстом
    container.innerHTML = news.slice(0, 3).map((item, index) => `
      <div class="card news">
        ${item.media ? `
          ${item.media.type === 'video' ? `
            <div class="card__img video-thumbnail" style="position: relative;">
              <img src="${item.media.thumbnail || item.media.url}" alt="${item.title}" 
                   style="width: 100%; height: 200px; object-fit: cover;">
              <div class="video-play-btn">
                <i class="fas fa-play"></i>
              </div>
              <div class="video-badge">Видео</div>
            </div>
          ` : `
            <img loading="lazy" src="${item.media.url}" alt="${item.title}" 
                 class="card__img"
                 onerror="this.src='https://picsum.photos/seed/tg${index}/600/400'">
          `}
        ` : `
          <div class="card__img" style="background: linear-gradient(135deg, var(--orange), var(--orange-2)); display: flex; align-items: center; justify-content: center; height: 200px;">
            <i class="fas fa-newspaper" style="font-size: 48px; color: white;"></i>
          </div>
        `}
        <div class="card__body">
          <h3 class="card__title">${item.title}</h3>
          <p class="card__meta">${item.date} • Telegram</p>
          <p class="card__text">${item.text}</p>
        </div>
        <div class="card__footer">
          <a href="${item.link}" target="_blank" class="btn btn--ghost">
            <i class="fab fa-telegram"></i> Читать в Telegram
          </a>
          <a href="news.html" class="btn btn--primary" style="margin-left: 10px;">
            <i class="fas fa-external-link-alt"></i> На сайте
          </a>
        </div>
      </div>
    `).join('');
  } else {
    // Страница news.html - полные новости с возможностью раскрытия
    container.innerHTML = news.map((item, index) => `
      <div class="card news news-item" data-news-id="${item.id}">
        ${item.media ? `
          ${item.media.type === 'video' ? `
            <div class="card__img video-thumbnail" style="position: relative;">
              <video controls style="width: 100%; height: 300px; object-fit: cover;" poster="${item.media.thumbnail || ''}">
                <source src="${item.media.url}" type="video/mp4">
                Ваш браузер не поддерживает видео.
              </video>
              <div class="video-badge">Видео</div>
            </div>
          ` : `
            <img loading="lazy" src="${item.media.url}" alt="${item.title}" 
                 class="card__img"
                 onerror="this.src='https://picsum.photos/seed/tg${index}/600/400'">
          `}
        ` : `
          <div class="card__img" style="background: linear-gradient(135deg, var(--orange), var(--orange-2)); display: flex; align-items: center; justify-content: center; height: 200px;">
            <i class="fas fa-newspaper" style="font-size: 48px; color: white;"></i>
          </div>
        `}
        <div class="card__body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
            <h3 class="card__title">${item.title}</h3>
            <button class="delete-news-btn" data-news-id="${item.id}" title="Удалить новость">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <p class="card__meta">${item.date} • Telegram</p>
          
          <div class="news-content">
            <div class="news-text-full">
              <p class="card__text" style="white-space: pre-wrap; line-height: 1.6;">${item.fullText || item.text}</p>
            </div>
          </div>
        </div>
        <div class="card__footer">
          <a href="${item.link}" target="_blank" class="btn btn--ghost">
            <i class="fab fa-telegram"></i> В Telegram
          </a>
        </div>
      </div>
    `).join('');

    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.delete-news-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const newsId = this.dataset.newsId;
        if (confirm('Удалить эту новость?')) {
          fetch(`/api/telegram-news/${newsId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                this.closest('.news-item').remove();
                showNotification('Новость удалена', 'success');
              }
            })
            .catch(error => {
              console.error('Ошибка удаления новости:', error);
              showNotification('Ошибка при удалении новости', 'error');
            });
        }
      });
    });
  }
  
  // Анимируем появление
  setTimeout(() => {
    document.querySelectorAll('.card.news').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, index * 100);
    });
  }, 100);
}

function showNoNewsMessage() {
  const container = document.querySelector('.news-page #tg-news-container') || document.getElementById('tg-news-container') || document.getElementById('tg-news-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="news-loading">
      <i class="fas fa-newspaper" style="font-size: 48px; color: var(--muted); margin-bottom: 20px;"></i>
      <p>Новостей пока нет</p>
      <p style="font-size: 14px; margin-top: 10px;">Подпишитесь на наш канал, чтобы быть первыми!</p>
      <a href="https://t.me/morkfilm" target="_blank" class="btn btn--primary" style="margin-top: 20px;">
        <i class="fab fa-telegram"></i> Подписаться на канал
      </a>
    </div>
  `;
}

function showSavedOrFallbackNews() {
  const container = document.querySelector('.news-page #tg-news-container') || document.getElementById('tg-news-container') || document.getElementById('tg-news-container');
  if (!container) return;
  
  const saved = localStorage.getItem('tgNews');
  if (saved) {
    try {
      const { data, timestamp } = JSON.parse(saved);
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
        const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
        displayNews(data, isHomePage);
        return;
      }
    } catch (e) {
      console.warn('Ошибка чтения сохраненных новостей');
    }
  }
  
  fetchDemoNews().then(news => {
    const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
    displayNews(news, isHomePage);
  });
}

// Функция принудительного обновления новостей
async function refreshNews() {
  const refreshBtn = document.getElementById('refresh-news');
  const successEl = document.getElementById('refresh-success');
  if (!refreshBtn) return;

  // Prevent concurrent runs (global & per-button guard)
  if (window._refreshNewsRunning) return;
  if (refreshBtn.dataset.running === '1') return;
  window._refreshNewsRunning = true;
  refreshBtn.dataset.running = '1';

  // Preserve original HTML once (avoid restoring spinner as original if nested)
  if (!refreshBtn.dataset.originalHtml) {
    refreshBtn.dataset.originalHtml = refreshBtn.innerHTML;
  }
  const originalHtml = refreshBtn.dataset.originalHtml;

  // Show loading state
  try {
    refreshBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Обновление...';
    refreshBtn.disabled = true;
    if (successEl) successEl.style.display = 'none';

    // Запрашиваем принудительное обновление на сервере
    let refreshResponse;
    try {
      refreshResponse = await fetch('/api/refresh-news');
    } catch (e) {
      throw new Error('Сеть недоступна');
    }
    if (!refreshResponse.ok) throw new Error('Ошибка сервера при обновлении');

    // Ждём небольшой интервал, чтобы бекенд успел обновиться
    await new Promise(resolve => setTimeout(resolve, 800));

    // Загружаем обновлённые новости (если есть функция)
    const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
    try {
      await fetchTelegramNews(isHomePage ? 3 : null);
    } catch (e) {
      console.warn('fetchTelegramNews failed:', e);
      // fallback - перезагрузим страницу как крайний случай
      try { window.location.reload(); } catch(_) {}
    }

    // Показать inline-метку на главной странице
    if (isHomePage && successEl) {
      successEl.style.display = 'inline';
      setTimeout(() => { if (successEl) successEl.style.display = 'none'; }, 3000);
    }

    // Показываем нотификацию на всех страницах (чтобы index тоже видел)
    showNotification('Новости успешно обновлены!', 'success');

  } catch (error) {
    console.error('Ошибка обновления новостей:', error);
    showNotification('Ошибка при обновлении новостей', 'error');
  } finally {
    // Всегда восстанавливаем кнопку в исходное состояние
    try {
      refreshBtn.innerHTML = originalHtml;
      refreshBtn.disabled = false;
    } catch (e) {
      console.warn('Не удалось восстановить кнопку:', e);
    }
    // Clear running flags
    refreshBtn.dataset.running = '0';
    window._refreshNewsRunning = false;
  }
}

// Показать уведомление
function showNotification(message, type) {
  // avoid duplicate identical notifications
  try {
    const existing = Array.from(document.querySelectorAll('.notification')).find(n => n.textContent && n.textContent.trim() === message.trim());
    if (existing) {
      // briefly re-show it if hidden
      existing.classList.add('show');
      setTimeout(() => existing.classList.remove('show'), 3000);
      return;
    }
  } catch (e) { console.warn('notify dedupe check failed', e); }

  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Добавляем в body
  document.body.appendChild(notification);
  
  // Показываем с анимацией
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Убираем через 3 секунды
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification && notification.parentNode) document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Автоматическое обновление новостей
function startNewsAutoUpdate() {
  const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
  fetchTelegramNews(isHomePage ? 3 : null);
  
  newsUpdateInterval = setInterval(() => {
    const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
    fetchTelegramNews(isHomePage ? 3 : null);
  }, 30 * 60 * 1000);
  
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
      fetchTelegramNews(isHomePage ? 3 : null);
    }
  });
}

// Настраиваем форму обратной связи
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const formData = new FormData(this);
    
    // Показываем индикатор загрузки
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch('https://formspree.io/f/mvgborlo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Успешная отправка
        showFormMessage(this, 'success', 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
        this.reset();
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      showFormMessage(this, 'error', 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
    } finally {
      // Восстанавливаем кнопку
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFormMessage(form, type, message) {
  // Удаляем старые сообщения
  const oldMessages = form.querySelectorAll('.form__status');
  oldMessages.forEach(msg => msg.remove());
  
  // Создаем новое сообщение
  const messageDiv = document.createElement('div');
  messageDiv.className = `form__status ${type}`;
  messageDiv.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Добавляем в форму
  form.appendChild(messageDiv);
  
  // Убираем через 5 секунд
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Инициализация приложения...');
  
  // Инициализация новостей
  startNewsAutoUpdate();
  
  // Настройка формы обратной связи
  setupContactForm();
  
  // Добавляем кнопку обновления новостей если есть контейнер
  const newsContainer = document.querySelector('.news-page #tg-news-container') || document.getElementById('tg-news-container');
if (newsContainer && !document.getElementById('refresh-news')) {
  const refreshBtn = document.createElement('button');
  refreshBtn.id = 'refresh-news';
  refreshBtn.className = 'btn btn--ghost';
  refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить новости';
  refreshBtn.addEventListener('click', refreshNews);
  newsContainer.parentNode.insertBefore(refreshBtn, newsContainer);
}

// Привязываем обработчик и к уже существующей кнопке, если она в вёрстке
const refreshBtnEl = document.getElementById('refresh-news');
if (refreshBtnEl && !refreshBtnEl._bound) {
  refreshBtnEl._bound = true;
  refreshBtnEl.addEventListener('click', refreshNews);
}

  
  console.log('✅ Приложение инициализировано');
});


// ---------- Обработчик кнопки "Обновить" на странице news ----------
(function attachNewsRefreshButton(){
  // ждем, когда DOM будет готов
  function bind() {
    const btn = document.getElementById('refresh-news');
    const successEl = document.getElementById('refresh-success');
    if (!btn) return;
    btn.addEventListener('click', async function onRefreshClick(e) {
      try {
        btn.disabled = true;
        btn.classList.add('loading');
        if (successEl) { successEl.style.display = 'none'; }
        const resp = await fetch('/api/refresh-news');
        const data = await resp.json();
        if (!resp.ok) throw new Error(data && data.error ? data.error : 'Ошибка обновления');
        // Перезагрузим новости с сервера (вызов существующей функции)
        if (typeof fetchTelegramNews === 'function') {
          await fetchTelegramNews(); // обновит контейнер и локальное хранилище
        } else {
          // fallback: перезагрузим страницу
          window.location.reload();
        }
        if (successEl) {
          successEl.style.display = 'inline-block';
          setTimeout(() => { successEl.style.display = 'none'; }, 2500);
        }
      } catch (err) {
        console.error('Ошибка при ручном обновлении новостей:', err);
        alert('Не удалось обновить новости: ' + (err.message || err));
      } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
      }
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(bind, 50);
  } else {
    document.addEventListener('DOMContentLoaded', bind);
  }
})();



// Привязка кнопки "Обновить" на news к уже существующей функции refreshNews (поведение как на index)
(function bindExistingRefreshToNews(){
  function bind() {
    const btn = document.getElementById('refresh-news');
    if (!btn) return;
    // Если уже привязан — не добавляем второй обработчик
    if (btn.dataset.bound === '1') return;
    btn.addEventListener('click', function(e){
      if (typeof refreshNews === 'function') {
        refreshNews();
      } else {
        // fallback: делаем как раньше — запрос к /api/refresh-news и ребут
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Обновление...';
        fetch('/api/refresh-news').then(()=>{ window.location.reload(); }).catch(err=>{ console.error(err); alert('Ошибка'); }).finally(()=>{ btn.disabled = false; });
      }
    });
    btn.dataset.bound = '1';
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') { setTimeout(bind,50); } else { document.addEventListener('DOMContentLoaded', bind); }
})();



// --- Fix: ensure only one refresh handler is active (prevents duplicate listeners/broken state) ---
document.addEventListener('DOMContentLoaded', function() {
  try {
    const btn = document.getElementById('refresh-news');
    if (!btn) return;
    // If we've already initialized, skip
    if (btn.dataset.singleInit === '1') return;
    // Replace with a clone to remove any previously attached listeners that conflicted
    const clean = btn.cloneNode(true);
    clean.dataset.singleInit = '1';
    // Preserve id and classes (cloneNode keeps them) and replace
    btn.parentNode.replaceChild(clean, btn);
    // Attach a single controlled listener which calls the existing refreshNews function
    clean.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof refreshNews === 'function') {
        refreshNews();
      } else {
        // fallback behaviour: trigger old API and reload
        clean.disabled = true;
        clean.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Обновление...';
        fetch('/api/refresh-news').then(()=>{ window.location.reload(); }).catch(err=>{ console.error(err); alert('Ошибка обновления'); }).finally(()=>{ clean.disabled = false; });
      }
    });
  } catch (err) {
    console.error('Error initializing single refresh button handler:', err);
  }
});
// --- end fix ---



// --- Robust interception for all #refresh-news clicks (capturing phase) ---
document.addEventListener('click', function(evt) {
  try {
    const el = evt.target.closest && evt.target.closest('#refresh-news');
    if (!el) return;
    // Stop other handlers on the same target from firing
    evt.stopImmediatePropagation();
    evt.preventDefault();
    // Call central refresh function
    if (typeof refreshNews === 'function') {
      refreshNews();
    } else {
      // fallback
      fetch('/api/refresh-news').then(()=>{ window.location.reload(); }).catch(e=>{ console.error(e); alert('Ошибка обновления'); });
    }
  } catch (e) {
    console.error('Error in refresh-news interceptor', e);
  }
}, true); // useCapture = true
// --- end interceptor ---

