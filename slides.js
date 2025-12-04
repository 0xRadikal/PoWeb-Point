const slides = [
  {
    id: 'slide-1',
    title: 'چرا تحلیل و طراحی سیستم؟',
    topic: 'مقدمه',
    meta: 'جلسه اول • نگاه کلی',
    body: `
      <ul>
        <li>پل ارتباطی بین کسب‌وکار و فناوری؛ به زبان مشترک نیاز داریم.</li>
        <li>کاهش ریسک توسعه: قبل از کدنویسی، مسئله را درست بفهمیم.</li>
        <li>تحویل‌پذیری و مستندسازی: خروجی قابل ارجاع برای تیم و ذی‌نفع.</li>
      </ul>
    `
  },
  {
    id: 'slide-2',
    title: 'چرخه حیات سیستم (SDLC)',
    topic: 'فرآیند',
    meta: 'شناسایی → تحلیل → طراحی → پیاده‌سازی → نگهداشت',
    body: `
      <ul>
        <li><strong>شناسایی:</strong> مشکل یا فرصت را تعریف کن، دامنه را محدود کن.</li>
        <li><strong>تحلیل:</strong> الزامات کاربردی و غیرکاربردی را استخراج کن.</li>
        <li><strong>طراحی:</strong> معماری، داده، واسط کاربری و امنیت را طرح‌ریزی کن.</li>
        <li><strong>پیاده‌سازی و آزمون:</strong> ساخت، استقرار، تست پذیرش.</li>
        <li><strong>نگهداشت:</strong> بازخورد، به‌روزرسانی، پایش.</li>
      </ul>
    `
  },
  {
    id: 'slide-3',
    title: 'ابزارهای تحلیل',
    topic: 'ابزار',
    meta: 'مدل‌سازی به زبان تصویر',
    body: `
      <ul>
        <li>Use Case Diagram برای ثبت سناریوهای کاربر.</li>
        <li>Activity / BPMN برای جریان کار و تصمیم‌گیری.</li>
        <li>Class Diagram و ERD برای ساختار داده و ارتباط‌ها.</li>
        <li>Prototyping سریع UI با Figma یا HTML استاتیک.</li>
      </ul>
    `
  },
  {
    id: 'slide-4',
    title: 'الزامات خوب چه ویژگی دارد؟',
    topic: 'کیفیت',
    meta: 'SMART + قابل آزمون',
    body: `
      <ul>
        <li>مشخص، قابل اندازه‌گیری، دست‌یافتنی، مرتبط و زمان‌مند (SMART).</li>
        <li>قابل آزمون: بتوان سناریوی پذیرش برای آن نوشت.</li>
        <li>بدون ابهام: اصطلاحات مشترک و تعریف‌شده.</li>
        <li>ردیابی: هر الزام به منبع و آزمون متصل است.</li>
      </ul>
    `
  },
  {
    id: 'slide-5',
    title: 'معماری پیشنهادی سامانه',
    topic: 'طراحی',
    meta: 'لایه‌ای و ماژولار',
    body: `
      <ul>
        <li>لایه ارائه (Front-end) برای UX روان و واکنش‌گرا.</li>
        <li>لایه منطق کسب‌وکار با APIهای نسخه‌دار.</li>
        <li>لایه داده با امنیت، پشتیبان‌گیری و لاگ‌گیری.</li>
        <li>اتصالات: پیام‌رسانی، صف، و وب‌هوک برای یکپارچگی.</li>
      </ul>
    `
  },
  {
    id: 'slide-6',
    title: 'آزمون و پذیرش',
    topic: 'QA',
    meta: 'کیفیت قبل از استقرار',
    body: `
      <ul>
        <li>تست واحد، یکپارچه، و رگرسیون خودکار.</li>
        <li>تست کارایی و امنیت برای نقاط حساس.</li>
        <li>UAT با سناریوهای Use Case و چک‌لیست UX.</li>
        <li>مدارک پذیرش: صورت‌جلسه، موارد باز، برنامه انتشار.</li>
      </ul>
    `
  }
];

const overviewGrid = document.getElementById('overviewGrid');
const currentSlideEl = document.getElementById('currentSlide');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const slideTopic = document.getElementById('slideTopic');
const slideCountBadge = document.getElementById('slideCount');
const topicMenu = document.getElementById('topicMenu');
const themeToggle = document.getElementById('themeToggle');
const startPresentationBtn = document.getElementById('startPresentation');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

let currentIndex = 0;

function renderGrid() {
  overviewGrid.innerHTML = slides.map((slide, index) => `
    <div class="col">
      <div class="slide-card h-100 ${index === currentIndex ? 'is-active' : ''}" data-id="${slide.id}" role="button" tabindex="0">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div class="topic-chip">${slide.topic}</div>
          <span class="small text-muted">${index + 1}</span>
        </div>
        <h3 class="fw-semibold">${slide.title}</h3>
        <p class="mini-body mb-0">${slide.meta}</p>
      </div>
    </div>
  `).join('');
  slideCountBadge.textContent = slides.length;
}

function renderTopicMenu() {
  const topics = [...new Set(slides.map(s => s.topic))];
  topicMenu.innerHTML = topics.map(topic => `
    <button class="btn btn-outline-light btn-sm" data-topic="${topic}">${topic}</button>
  `).join('');
}

function setActiveSlide(index, opts = { scroll: true }) {
  if (index < 0 || index >= slides.length) return;
  currentIndex = index;
  const slide = slides[index];
  const slideHtml = `
    <div class="card-body slide-enter">
      <div class="meta mb-2">${slide.meta}</div>
      <h3 class="slide-title">${slide.title}</h3>
      ${slide.body}
    </div>
  `;
  currentSlideEl.innerHTML = slideHtml;
  statusText.textContent = `اسلاید ${index + 1} از ${slides.length}`;
  progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
  progressBar.setAttribute('aria-valuenow', index + 1);
  slideTopic.textContent = slide.topic;
  syncGridActive();
  syncHash(slide.id);
  if (opts.scroll) {
    currentSlideEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function syncGridActive() {
  document.querySelectorAll('.slide-card').forEach((card, idx) => {
    card.classList.toggle('is-active', idx === currentIndex);
  });
}

function syncHash(id) {
  if (location.hash !== `#${id}`) {
    history.replaceState(null, '', `#${id}`);
  }
}

function goToSlideById(id) {
  const index = slides.findIndex(s => s.id === id);
  if (index >= 0) {
    setActiveSlide(index, { scroll: false });
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('theme-light');
  themeToggle.querySelector('.text').textContent = isLight ? 'تم تیره' : 'تم روشن';
  themeToggle.querySelector('.icon').textContent = isLight ? '🌙' : '☀️';
}

function requestFullscreen() {
  const target = document.documentElement;
  if (target.requestFullscreen) target.requestFullscreen();
}

function attachEvents() {
  overviewGrid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-id]');
    if (!card) return;
    goToSlideById(card.dataset.id);
  });

  overviewGrid.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      const card = event.target.closest('[data-id]');
      if (card) {
        event.preventDefault();
        goToSlideById(card.dataset.id);
      }
    }
  });

  topicMenu.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-topic]');
    if (!btn) return;
    const topic = btn.dataset.topic;
    const index = slides.findIndex(s => s.topic === topic);
    if (index >= 0) setActiveSlide(index);
  });

  themeToggle.addEventListener('click', toggleTheme);
  startPresentationBtn.addEventListener('click', () => {
    requestFullscreen();
    currentSlideEl.focus({ preventScroll: true });
  });

  prevBtn.addEventListener('click', () => setActiveSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => setActiveSlide(currentIndex + 1));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') setActiveSlide(currentIndex - 1);
    if (event.key === 'ArrowRight') setActiveSlide(currentIndex + 1);
    if (event.key === 'Home') setActiveSlide(0);
    if (event.key === 'End') setActiveSlide(slides.length - 1);
  });

  window.addEventListener('hashchange', () => goToSlideById(location.hash.replace('#', '')));
}

function init() {
  renderGrid();
  renderTopicMenu();
  const initialId = location.hash.replace('#', '');
  const index = slides.findIndex(s => s.id === initialId);
  setActiveSlide(index >= 0 ? index : 0, { scroll: false });
  attachEvents();
}

document.addEventListener('DOMContentLoaded', init);
