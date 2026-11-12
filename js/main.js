
```javascript
/* =========================================================
   Массив данных, рендер карточек, слайдер, поиск и избранное
   ========================================================= */

const ROUTES_DATA = [
  {
    id: 1,
    emoji: '🌲',
    title: 'Сосновая гряда и лесное озеро',
    desc: 'Спокойная лесная тропа по хвойному массиву с выходом к тихому песчаному берегу.',
    fullDesc: 'Маршрут начинается у северного входа в лесопарк. Вы пройдёте по утоптанным хвойным тропам мимо вековых сосен, пересечёте деревянный мостик через ручей и выйдете к оборудованной смотровой площадке у озера. Идеально для утренней перезагрузки.',
    category: 'Природа',
    distance: '6.4 км • 1 ч 40 мин'
  },
  {
    id: 2,
    emoji: '🏛️',
    title: 'Особняки эпохи модерна',
    desc: 'Прогулка по тихим переулкам с керамическими панно, эркерами и коваными решётками.',
    fullDesc: 'Архитектурный маршрут охватывает 9 знаковых зданий начала XX века. Вы узнаете, как менялся облик купеческих особняков, рассмотрите растительный орнамент на фасадах и заглянете в три открытых исторических двора-колодца.',
    category: 'Архитектура',
    distance: '4.1 км • 1 ч 15 мин'
  },
  {
    id: 3,
    emoji: '🌉',
    title: 'Большое кольцо набережных',
    desc: 'Ровный променад вдоль речного канала с видом на старые и современные мосты.',
    fullDesc: 'Трек проходит по благоустроенной набережной без резких перепадов высот. По пути встречаются несколько уютных кофеен навынос, спуск к воде и панорамный вид на закат. Подходит для прогулки с коляской или самокатом.',
    category: 'Набережные',
    distance: '8.0 км • 2 ч 00 мин'
  },
  {
    id: 4,
    emoji: '🏰',
    title: 'Тайны купеческой слободы',
    desc: 'Исторический маршрут по старейшему району с торговыми рядами и каменными палатами.',
    fullDesc: 'Погружение в историю города XVII–XIX веков. Маршрут связывает сохранившиеся каменные палаты, старую пожарную каланчу и бывшие ремесленные мастерские, превращённые сегодня в локальные музеи и галереи.',
    category: 'История',
    distance: '3.5 км • 1 ч 00 мин'
  },
  {
    id: 5,
    emoji: '🌿',
    title: 'Ботанический сад и оранжереи',
    desc: 'Лёгкая прогулка среди редких коллекционных растений, японского сада и прудов.',
    fullDesc: 'Кольцевой маршрут по тенистым аллеям. Вы увидите коллекцию хвойных пород, альпийскую горку и мостик через пруд с кувшинками. На середине пути есть зона отдыха с беседками.',
    category: 'Природа',
    distance: '3.2 км • 55 мин'
  },
  {
    id: 6,
    emoji: '🏗️',
    title: 'Кирпичный лофт и арт-кластеры',
    desc: 'Индустриальная архитектура XIX века, превращённая в современные культурные пространства.',
    fullDesc: 'Маршрут по бывшим мануфактурам из красного кирпича. Вы увидите водонапорные башни, чугунные лестницы, уличный стрит-арт и мастерские современных художников.',
    category: 'Архитектура',
    distance: '5.0 км • 1 ч 30 мин'
  },
  {
    id: 7,
    emoji: '⛵',
    title: 'Старый причал и маяк',
    desc: 'Видовой маршрут вдоль яхт-клуба и речного вокзала с открытым горизонтом.',
    fullDesc: 'Прогулка вдоль широкой водной глади. Отличное место, чтобы понаблюдать за парусниками, отдохнуть на деревянных шезлонгах пирса и сделать атмосферные снимки у старого сигнального маяка.',
    category: 'Набережные',
    distance: '4.8 км • 1 ч 20 мин'
  },
  {
    id: 8,
    emoji: '📜',
    title: 'Литературные адреса центра',
    desc: 'Места, где жили и работали известные писатели, поэты и издатели прошлого столетия.',
    fullDesc: 'Маршрут проходит мимо редакций старых журналов, мемориальных квартир и букинистических лавок, которые работают на одном месте уже более шестидесяти лет.',
    category: 'История',
    distance: '4.4 км • 1 ч 15 мин'
  }
];

/* Работа с избранным в localStorage */
function getFavorites() {
  return JSON.parse(localStorage.getItem('favoriteRoutes') || '[]');
}

function toggleFavorite(routeId) {
  let favs = getFavorites();
  if (favs.includes(routeId)) {
    favs = favs.filter(id => id !== routeId);
  } else {
    favs.push(routeId);
  }
  localStorage.setItem('favoriteRoutes', JSON.stringify(favs));

  renderCatalogCards();
  renderCabinetFavorites();
}

/* Создание HTML-разметки одной карточки */
function createCardHTML(item, isFav) {
  return `
    <article class="card">
      <div class="card-cover">
        <span>${item.emoji}</span>
        <button
          type="button"
          class="fav-toggle ${isFav ? 'active' : ''}"
          onclick="toggleFavorite(${item.id})"
          aria-label="${isFav ? 'Убрать из избранного' : 'Добавить в избранное'}"
          title="${isFav ? 'Убрать из избранного' : 'В избранное'}"
        >
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <span class="card-tag">${item.category}</span>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <span class="card-distance">${item.distance}</span>
          <button type="button" class="btn btn-outline btn-sm" onclick="openRouteModal(${item.id})">
            Подробнее
          </button>
        </div>
      </div>
    </article>
  `;
}

/* Состояние фильтра и поиска на главной странице */
let activeCategory = 'all';
let searchQuery = '';

function renderCatalogCards() {
  const grid = document.getElementById('cardsGrid');
  const emptyMsg = document.getElementById('emptySearchMsg');
  if (!grid) return;

  const favs = getFavorites();
  const filtered = ROUTES_DATA.filter(item => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyMsg) emptyMsg.hidden = false;
  } else {
    if (emptyMsg) emptyMsg.hidden = true;
    grid.innerHTML = filtered.map(item => createCardHTML(item, favs.includes(item.id))).join('');
  }
}

/* Рендер избранных карточек в Личном кабинете */
function renderCabinetFavorites() {
  const favGrid = document.getElementById('favGrid');
  const emptyFavMsg = document.getElementById('emptyFavMsg');
  const favCountEl = document.getElementById('favCount');
  if (!favGrid) return;

  const favIds = getFavorites();
  const favItems = ROUTES_DATA.filter(item => favIds.includes(item.id));

  if (favCountEl) {
    favCountEl.textContent = favItems.length;
  }

  if (favItems.length === 0) {
    favGrid.innerHTML = '';
    if (emptyFavMsg) emptyFavMsg.hidden = false;
  } else {
    if (emptyFavMsg) emptyFavMsg.hidden = true;
    favGrid.innerHTML = favItems.map(item => createCardHTML(item, true)).join('');
  }
}

/* Модальное окно «Подробнее» */
let currentModalRouteId = null;

function openRouteModal(routeId) {
  const modal = document.getElementById('materialModal');
  const route = ROUTES_DATA.find(r => r.id === routeId);
  if (!modal || !route) return;

  currentModalRouteId = routeId;
  document.getElementById('modalEmoji').textContent = route.emoji;
  document.getElementById('modalCategory').textContent = route.category;
  document.getElementById('modalTitle').textContent = route.title;
  document.getElementById('modalMeta').textContent = `Дистанция и время: ${route.distance}`;
  document.getElementById('modalFullDesc').textContent = route.fullDesc;

  updateModalFavButton();
  modal.hidden = false;
}

function updateModalFavButton() {
  const btn = document.getElementById('modalFavBtn');
  if (!btn || currentModalRouteId === null) return;
  const isFav = getFavorites().includes(currentModalRouteId);
  btn.textContent = isFav ? 'Убрать из избранного' : 'Добавить в избранное';
}

function initModal() {
  const modal = document.getElementById('materialModal');
  if (!modal) return;

  const closeModal = () => {
    modal.hidden = true;
    currentModalRouteId = null;
  };

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('modalOkBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById('modalFavBtn').addEventListener('click', () => {
    if (currentModalRouteId !== null) {
      toggleFavorite(currentModalRouteId);
      updateModalFavButton();
    }
  });
}

/* Слайдер на JavaScript */
function initSlider() {
  const slider = document.getElementById('mainSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');

  let current = 0;
  let timer = null;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }

  function startAuto() {
    timer = setInterval(nextSlide, 4500);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showSlide(idx));
  });

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  startAuto();
}

/* Фильтры, поиск и форма подписки */
function initCatalogControls() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
filterBtns.forEach(b => b.classList.remove('active'));
btn.classList.add('active');
activeCategory = btn.dataset.category;
renderCatalogCards();
});
});
const searchInput = document.getElementById('searchInput');
if (searchInput) {
searchInput.addEventListener('input', (e) => {
searchQuery = e.target.value.trim();
renderCatalogCards();
});
}
const subForm = document.getElementById('subscribeForm');
if (subForm) {
subForm.addEventListener('submit', (e) => {
e.preventDefault();
const input = document.getElementById('subEmail');
const feedback = document.getElementById('subFeedback');
const val = input.value.trim();
if (!val || !val.includes('@')) {
feedback.style.color = '#ffa8a8';
feedback.textContent = 'Пожалуйста, введите корректный email.';
} else {
feedback.style.color = '#8ce99a';
feedback.textContent = 'Спасибо! Подписка успешно оформлена.';
input.value = '';
}
});
}
}
/* Плавное появление блоков через IntersectionObserver */
function initScrollAnimations() {
const elements = document.querySelectorAll('.fade-in');
if (!elements.length) return;
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
observer.unobserve(entry.target);
}
});
}, { threshold: 0.12 });
elements.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', () => {
initSlider();
initCatalogControls();
initModal();
renderCatalogCards();
renderCabinetFavorites();
initScrollAnimations();
});