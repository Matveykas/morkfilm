// Smooth scroll + Active links
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')){
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth', block:'start'});
      closeMenu();
    } else if (href !== 'javascript:void(0)') {
      // Добавляем анимацию перехода для внутренних страниц
      e.preventDefault();
      pageTransition(href);
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
burger?.addEventListener('click', ()=>{
  overlay.classList.toggle('is-active');
  nav.classList.toggle('is-open');
  burger.classList.toggle('is-open');
});

// Active on scroll
const sections = [...document.querySelectorAll('section[id]')];
const makeActive = () => {
  const pos = window.scrollY + 120;
  let current = sections[0]?.id;
  for (const s of sections){
    if (pos >= s.offsetTop) current = s.id;
  }
  document.querySelectorAll('.nav__link').forEach(a=>a.classList.toggle('is-active', a.getAttribute('href') === '#'+current));
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
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  if (heroBg){
    heroBg.style.transform = `translateY(${y * 0.15}px) scale(1.08)`;
  }
});

// Form handler
document.querySelector('.form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Сообщение отправлено! Мы свяжемся с вами.');
  e.target.reset();
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

// Modal functionality
function initModal(modalId, triggerSelector) {
  const modal = document.getElementById(modalId);
  const triggers = document.querySelectorAll(triggerSelector);
  const closeBtn = modal.querySelector('.modal__close');
  
  if (!modal) return;
  
  // Open modal
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close modal
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  
  closeBtn.addEventListener('click', closeModal);
  modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

// Initialize modals if they exist on the page
if (document.getElementById('actor-modal')) {
  initModal('actor-modal', '.actor-card');
}

// Counter animation for stats
function animateCounter(el, target, duration) {
  let start = 0;
  const increment = target / (duration / 16);
  const updateCounter = () => {
    start += increment;
    if (start < target) {
      el.textContent = Math.ceil(start) + '+';
      requestAnimationFrame(updateCounter);
    } else {
      el.textContent = target + '+';
    }
  };
  updateCounter();
}

// Animate stats when they come into view
const statObservers = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValue = entry.target.querySelector('span');
      const target = parseInt(statValue.textContent);
      animateCounter(statValue, target, 1000);
      statObservers.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats li').forEach(stat => {
  statObservers.observe(stat);
});

// Image lazy loading
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Current year for footer
document.addEventListener('DOMContentLoaded', () => {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Custom cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline) {
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    
    cursorOutline.style.left = e.clientX + 'px';
    cursorOutline.style.top = e.clientY + 'px';
  });
  
  // Interactive elements effect
  const interactiveElements = document.querySelectorAll('a, button, .card, .video-player, .socials__link');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.2)';
      cursorOutline.style.borderColor = 'var(--orange)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.borderColor = 'var(--orange)';
    });
  });
}

// Progress bar on scroll
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLightTheme = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    
    // Move toggle thumb
    const thumb = themeToggle.querySelector('.theme-toggle__thumb');
    thumb.style.transform = isLightTheme ? 'translateX(26px)' : 'translateX(0)';
  });
  
  // Check saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    const thumb = themeToggle.querySelector('.theme-toggle__thumb');
    thumb.style.transform = 'translateX(26px)';
  }
}

// Video player functionality
const videoPlayers = document.querySelectorAll('.video-player');
videoPlayers.forEach(player => {
  const preview = player.querySelector('.video-player__preview');
  const playBtn = player.querySelector('.video-player__play-btn');
  
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      // In a real implementation, you would replace the image with a video
      alert('Видео воспроизводится! В реальной реализации здесь будет встроенный видеоплеер.');
    });
  }
});

// Particle background
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  function createParticles() {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 5 + 2;
      
      // Random animation
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  createParticles();
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter__form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    alert(`Спасибо за подписку! На адрес ${email} будут приходить наши новости.`);
    newsletterForm.reset();
  });
}

// Text animation
function animateText() {
  const animatedElements = document.querySelectorAll('.hero__title, .hero__subtitle');
  
  animatedElements.forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.textContent = text[i];
      span.style.animationDelay = `${i * 0.05}s`;
      el.appendChild(span);
    }
  });
}

// Page transition animation
function pageTransition(url) {
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  document.body.appendChild(transition);
  
  setTimeout(() => {
    transition.classList.add('active');
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }, 50);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add loading animation
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerHTML = '<div class="loading__spinner"></div>';
  document.body.appendChild(loading);
  
  // Remove loading animation after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      loading.style.opacity = '0';
      setTimeout(() => {
        loading.remove();
      }, 500);
    }, 1000);
  });
  
  // Initialize text animation
  animateText();
  
  // Initialize filter buttons
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter content based on the button's data attribute
      const filterValue = button.dataset.filter;
      filterContent(filterValue);
    });
  });
  
  // Initialize image comparison sliders
  initComparisonSliders();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize interactive elements
  initInteractiveElements();
  
  // Initialize dynamic content loading
  initDynamicContent();
});

// Filter content function
function filterContent(filterValue) {
  const contentItems = document.querySelectorAll('.content-item');
  
  contentItems.forEach(item => {
    if (filterValue === 'all' || item.dataset.category === filterValue) {
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

// Image comparison sliders
function initComparisonSliders() {
  const sliders = document.querySelectorAll('.comparison-slider');
  
  sliders.forEach(slider => {
    const handle = slider.querySelector('.comparison-slider__handle');
    const after = slider.querySelector('.comparison-slider__after');
    
    let isMoving = false;
    
    // Mouse events
    handle.addEventListener('mousedown', () => {
      isMoving = true;
    });
    
    document.addEventListener('mouseup', () => {
      isMoving = false;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isMoving) return;
      
      const sliderRect = slider.getBoundingClientRect();
      let position = (e.clientX - sliderRect.left) / sliderRect.width;
      position = Math.max(0, Math.min(1, position));
      
      after.style.width = position * 100 + '%';
      handle.style.left = position * 100 + '%';
    });
    
    // Touch events for mobile
    handle.addEventListener('touchstart', () => {
      isMoving = true;
    });
    
    document.addEventListener('touchend', () => {
      isMoving = false;
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isMoving) return;
      
      const sliderRect = slider.getBoundingClientRect();
      let position = (e.touches[0].clientX - sliderRect.left) / sliderRect.width;
      position = Math.max(0, Math.min(1, position));
      
      after.style.width = position * 100 + '%';
      handle.style.left = position * 100 + '%';
    });
  });
}

// Scroll animations
function initScrollAnimations() {
  // Add scroll-triggered animations
  const scrollElements = document.querySelectorAll('.scroll-animate');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });
  
  scrollElements.forEach(el => scrollObserver.observe(el));
}

// Interactive elements
function initInteractiveElements() {
  // Add hover effects to cards
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) rotateZ(2deg)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateZ(0)';
    });
  });
  
  // Add click effect to buttons
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });
}

// Dynamic content loading
function initDynamicContent() {
  // Load more content on button click
  const loadMoreBtn = document.getElementById('load-more');
  
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      this.textContent = 'Загрузка...';
      this.disabled = true;
      
      // Simulate loading
      setTimeout(() => {
        // In a real implementation, you would fetch data from an API
        const newContent = document.createElement('div');
        newContent.className = 'content-item';
        newContent.innerHTML = `
          <h3>Новый контент</h3>
          <p>Этот контент был загружен динамически</p>
        `;
        
        document.querySelector('.content-grid').appendChild(newContent);
        
        this.textContent = 'Загрузить еще';
        this.disabled = false;
      }, 1000);
    });
  }
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Responsive navigation
function initResponsiveNav() {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  function handleTabletChange(e) {
    if (e.matches) {
      // Mobile view
      document.addEventListener('click', handleMobileClick);
    } else {
      // Desktop view
      document.removeEventListener('click', handleMobileClick);
    }
  }
  
  function handleMobileClick(e) {
    if (!e.target.closest('.nav') && nav.classList.contains('is-open')) {
      closeMenu();
    }
  }
  
  mediaQuery.addListener(handleTabletChange);
  handleTabletChange(mediaQuery);
}

// Initialize responsive navigation
initResponsiveNav();

// Form validation
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      const inputs = this.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
          
          // Remove error style after delay
          setTimeout(() => {
            input.style.borderColor = '';
          }, 2000);
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        alert('Пожалуйста, заполните все обязательные поля.');
      }
    });
  });
}

// Initialize form validation
initFormValidation();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Close modal on Escape
  if (e.key === 'Escape') {
    const openModal = document.querySelector('.modal.is-open');
    if (openModal) {
      openModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    
    // Close menu on Escape
    if (nav.classList.contains('is-open')) {
      closeMenu();
    }
  }
  
  // Navigate with arrow keys in galleries
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const gallery = document.querySelector('.gallery');
    if (gallery) {
      const activeIndex = parseInt(gallery.dataset.activeIndex || 0);
      const items = gallery.querySelectorAll('.gallery-item');
      const newIndex = e.key === 'ArrowLeft' 
        ? Math.max(0, activeIndex - 1) 
        : Math.min(items.length - 1, activeIndex + 1);
      
      gallery.dataset.activeIndex = newIndex;
      items[newIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

perfObserver.observe({ entryTypes: ['measure', 'navigation', 'resource'] });

// Measure page load time
window.addEventListener('load', () => {
  performance.measure('pageLoad', 'navigationStart', 'loadEventEnd');
});

// Error tracking
window.addEventListener('error', (e) => {
  console.error('Error:', e.error);
  // In a real application, you would send this to an error tracking service
});

// Analytics tracking
function trackEvent(category, action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
  console.log(`Tracked: ${category} - ${action} - ${label}`);
}

// Track page views
trackEvent('Page', 'View', window.location.pathname);

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('Button', 'Click', btn.textContent.trim());
  });
});

// Utility function for getting CSS variables
function getCssVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

// Utility function for setting CSS variables
function setCssVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
}

// Cookie consent
function initCookieConsent() {
  if (!localStorage.getItem('cookiesAccepted')) {
    const consentBanner = document.createElement('div');
    consentBanner.className = 'cookie-consent';
    consentBanner.innerHTML = `
      <p>Мы используем файлы cookie для улучшения вашего опыта.</p>
      <button class="btn btn--primary">Принять</button>
    `;
    document.body.appendChild(consentBanner);
    
    consentBanner.querySelector('button').addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      consentBanner.style.display = 'none';
    });
  }
}

// Initialize cookie consent
initCookieConsent();