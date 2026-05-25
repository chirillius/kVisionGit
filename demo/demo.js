const DEMO_BANNER_TEXT =
  'Тестовая версия • данные вымышлены • демонстрация примера работа сервиса';

const DEMO_AUTH_KEY = 'kvision-demo-auth';
const DEMO_LOGIN_KEY = 'kvision-demo-login';
const DEMO_STORE_KEY = 'kvision-demo-store';
const DEMO_NOTICE_KEY = 'kvision-demo-notice';

const STORES = [
  {
    id: 'okhotny-ryad',
    name: 'Охотный ряд',
    city: 'Москва',
    address: 'Манежная площадь, 1с2',
    cluster: 'Центральный округ',
    cameras: ['Вход', 'Касса 1', 'Касса 2', 'Торговый зал', 'Прилавок', 'Склад'],
    uptime: '99.4%',
    alertsPerWeek: 86,
    dailyVisitors: 1840,
    conversion: '37%',
    status: 'Стабильно',
  },
  {
    id: 'nevsky-passage',
    name: 'Невский пассаж',
    city: 'Санкт-Петербург',
    address: 'Невский проспект, 48',
    cluster: 'Исторический центр',
    cameras: ['Вход', 'Зал А', 'Зал Б', 'Касса', 'Приёмка'],
    uptime: '98.8%',
    alertsPerWeek: 73,
    dailyVisitors: 1460,
    conversion: '34%',
    status: 'Высокий поток',
  },
  {
    id: 'baltiyskaya-liniya',
    name: 'Балтийская линия',
    city: 'Калининград',
    address: 'Ленинский проспект, 107',
    cluster: 'Прибрежная зона',
    cameras: ['Вход', 'Кассовая зона', 'Холодильники', 'Основной зал', 'Служебный вход'],
    uptime: '99.1%',
    alertsPerWeek: 64,
    dailyVisitors: 1190,
    conversion: '31%',
    status: 'Ровная работа',
  },
];

const DEFECT_TYPES = [
  { key: 'Conversion', label: 'Конверсия', weight: 8 },
  { key: 'Delays', label: 'Опоздание', weight: 4 },
  { key: 'TooManyPeopleAtStall', label: 'Много людей за прилавком', weight: 6 },
  { key: 'Smoke', label: 'Дым', weight: 2 },
  { key: 'NoOneAtStallForTooLong', label: 'Никого за прилавком', weight: 7 },
  { key: 'Light', label: 'Свет', weight: 3 },
  { key: 'Crowd', label: 'Очередь', weight: 7 },
  { key: 'CashRegister', label: 'Касса', weight: 3 },
  { key: 'CountingCashRegister', label: 'Пересчёт кассы', weight: 2 },
  { key: 'AbandonedOpenCashRegister', label: 'Касса оставлена открытой', weight: 2 },
  { key: 'HumanDetectionBeforeAndAfterShift', label: 'Человек после закрытия', weight: 1 },
  { key: 'ServiceNearCabinet', label: 'Ошибки обслуживания', weight: 3 },
  { key: 'Phone', label: 'Телефон', weight: 4 },
  { key: 'Pose', label: 'Сидит при клиенте', weight: 3 },
  { key: 'Mopping', label: 'Полы', weight: 2 },
  { key: 'Clothes', label: 'Форма', weight: 3 },
  { key: 'ClearStall', label: 'Лишние предметы', weight: 4 },
  { key: 'Bottles', label: 'Бутылки', weight: 2 },
  { key: 'InactiveSalesman', label: 'Продавец неактивен', weight: 5 },
  { key: 'Badge', label: 'Бейдж', weight: 2 },
];

const PEOPLE_TYPES = new Set(['Conversion', 'TooManyPeopleAtStall', 'Crowd']);

const MENU_ITEMS = [
  {
    page: 'streaming',
    title: 'Потоковое видео',
    description: 'Быстрый просмотр камер, статусов и контрольных точек магазина.',
    href: './streaming.html',
  },
  {
    page: 'download-archive',
    title: 'Загрузка и просмотр записей',
    description: 'История архивных выгрузок и быстрый переход к подготовленным фрагментам.',
    href: './download-archive.html',
  },
  {
    page: 'live-archive',
    title: 'Онлайн просмотр',
    description: 'Переход по временным срезам архива и контроль последних событий.',
    href: './live-archive.html',
  },
  {
    page: 'defects',
    title: 'Таблица нарушений',
    description: 'Случайно сгенерированные фиксации на выбранный 7-дневный диапазон.',
    href: './defects.html',
  },
  {
    page: 'statistics',
    title: 'Статистика',
    description: 'Итоговые показатели, динамика по дням и срез по типам дефектов.',
    href: './statistics.html',
  },
];

const PLACEHOLDER_PAGES = {
  streaming: {
    heading: 'Потоковое видео',
    description:
      'Демо-потоки не подключены к реальным камерам, но структура экрана сохранена для сценария показа сервиса.',
  },
  'download-archive': {
    heading: 'Загрузка и просмотр записей',
    description:
      'Показана тестовая очередь архивных выгрузок и точки входа в типовой процесс работы оператора.',
  },
  'live-archive': {
    heading: 'Онлайн просмотр',
    description:
      'Экран имитирует работу с живым архивом и временными фрагментами без подключения реального видео.',
  },
};

function getPage() {
  return document.body.dataset.demoPage || '';
}

function setBanner() {
  const banner = document.querySelector('[data-demo-banner]');
  if (banner) {
    banner.textContent = DEMO_BANNER_TEXT;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInput(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    weekday: 'short',
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

function formatTime(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function seedFromString(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let result = Math.imul(value ^ (value >>> 15), 1 | value);
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function weightedPick(random, items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let pointer = random() * total;
  for (const item of items) {
    pointer -= item.weight;
    if (pointer <= 0) {
      return item;
    }
  }
  return items[items.length - 1];
}

function getStoreById(storeId) {
  return STORES.find((store) => store.id === storeId) || null;
}

function persistAuth() {
  sessionStorage.setItem(DEMO_AUTH_KEY, 'true');
  sessionStorage.setItem(DEMO_LOGIN_KEY, 'admin');
}

function isAuthenticated() {
  return sessionStorage.getItem(DEMO_AUTH_KEY) === 'true';
}

function logoutDemo() {
  sessionStorage.removeItem(DEMO_AUTH_KEY);
  sessionStorage.removeItem(DEMO_LOGIN_KEY);
  sessionStorage.removeItem(DEMO_STORE_KEY);
}

function saveSelectedStore(storeId) {
  sessionStorage.setItem(DEMO_STORE_KEY, storeId);
}

function getSelectedStore() {
  return getStoreById(sessionStorage.getItem(DEMO_STORE_KEY) || '');
}

function setPendingNotice(message) {
  sessionStorage.setItem(DEMO_NOTICE_KEY, message);
}

function popPendingNotice() {
  const message = sessionStorage.getItem(DEMO_NOTICE_KEY);
  if (message) {
    sessionStorage.removeItem(DEMO_NOTICE_KEY);
  }
  return message;
}

function ensureOverlayNodes() {
  if (!document.querySelector('[data-demo-notice]')) {
    const notice = document.createElement('div');
    notice.className = 'demo-notice';
    notice.setAttribute('data-demo-notice', '');
    document.body.append(notice);
  }

  if (!document.querySelector('[data-demo-modal]')) {
    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.setAttribute('data-demo-modal', '');
    modal.innerHTML = `
      <div class="demo-modal-card" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
        <div class="demo-card-head">
          <h3 id="demo-modal-title" data-demo-modal-title>Детали</h3>
          <button class="demo-button-ghost" type="button" data-demo-modal-close>Закрыть</button>
        </div>
        <div data-demo-modal-body></div>
      </div>
    `;
    document.body.append(modal);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    modal.querySelector('[data-demo-modal-close]')?.addEventListener('click', closeModal);
  }
}

let noticeTimerId = 0;

function showNotice(message) {
  const notice = document.querySelector('[data-demo-notice]');
  if (!notice) {
    return;
  }

  notice.textContent = message;
  notice.classList.add('is-visible');
  window.clearTimeout(noticeTimerId);
  noticeTimerId = window.setTimeout(() => {
    notice.classList.remove('is-visible');
  }, 2600);
}

function closeModal() {
  document.querySelector('[data-demo-modal]')?.classList.remove('is-open');
}

function openModal(title, bodyHtml) {
  const modal = document.querySelector('[data-demo-modal]');
  if (!modal) {
    return;
  }

  const titleNode = modal.querySelector('[data-demo-modal-title]');
  const bodyNode = modal.querySelector('[data-demo-modal-body]');
  if (titleNode) {
    titleNode.textContent = title;
  }
  if (bodyNode) {
    bodyNode.innerHTML = bodyHtml;
  }
  modal.classList.add('is-open');
}

function setupShell() {
  ensureOverlayNodes();

  const page = getPage();
  const selectedStore = getSelectedStore();
  const storeLabel = document.querySelector('[data-selected-store-name]');
  const cityLabel = document.querySelector('[data-selected-store-city]');

  if (storeLabel) {
    storeLabel.textContent = selectedStore?.name || 'Магазин не выбран';
  }
  if (cityLabel) {
    cityLabel.textContent = selectedStore
      ? `${selectedStore.city} • ${selectedStore.cluster}`
      : 'Выберите магазин для продолжения';
  }

  document.querySelectorAll('[data-demo-nav-page]').forEach((link) => {
    const linkPage = link.getAttribute('data-demo-nav-page');
    if (linkPage === page) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  document.querySelector('[data-demo-logout]')?.addEventListener('click', (event) => {
    event.preventDefault();
    logoutDemo();
    window.location.href = './login.html';
  });

  document.querySelectorAll('[data-requires-store]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (getSelectedStore()) {
        return;
      }
      event.preventDefault();
      setPendingNotice('Сначала выберите магазин в тестовой версии.');
      window.location.href = './stores.html';
    });
  });

  const pendingNotice = popPendingNotice();
  if (pendingNotice) {
    showNotice(pendingNotice);
  }
}

function guardPage() {
  const page = getPage();
  if (page === 'login') {
    return true;
  }

  if (!isAuthenticated()) {
    setPendingNotice('Для просмотра демо войдите под admin / admin.');
    window.location.href = './login.html';
    return false;
  }

  const requiresStore = new Set([
    'menu',
    'streaming',
    'download-archive',
    'live-archive',
    'defects',
    'statistics',
  ]);

  if (requiresStore.has(page) && !getSelectedStore()) {
    setPendingNotice('Выберите один из тестовых магазинов, чтобы продолжить.');
    window.location.href = './stores.html';
    return false;
  }

  return true;
}

function getStoreHeadline(store) {
  const cameraCount = store.cameras.length;
  const onlineCameras = Math.max(cameraCount - 1, 3);
  return {
    cameraCount,
    onlineCameras,
    reactionTime: `${2 + cameraCount / 3} мин`,
    controlZones: cameraCount + 4,
  };
}

function renderStoresPage() {
  const list = document.querySelector('[data-demo-store-list]');
  const summary = document.querySelector('[data-demo-store-summary]');
  const selectedStore = getSelectedStore();

  if (!list) {
    return;
  }

  list.innerHTML = STORES.map((store) => {
    const metrics = getStoreHeadline(store);
    const isActive = selectedStore?.id === store.id;
    const statusClass =
      store.status === 'Стабильно'
        ? 'demo-chip-success'
        : store.status === 'Высокий поток'
          ? 'demo-chip-warning'
          : 'demo-chip-info';

    return `
      <article class="demo-store-card" data-store-card data-store-id="${escapeHtml(store.id)}" data-store-name>
        <div class="demo-card-top">
          <div>
            <div class="demo-chip-row">
              <span class="demo-chip ${statusClass}">${escapeHtml(store.status)}</span>
              <span class="demo-chip">${escapeHtml(store.city)}</span>
            </div>
            <h3>${escapeHtml(store.name)}</h3>
            <p>${escapeHtml(store.address)}</p>
          </div>
          ${isActive ? '<span class="demo-chip demo-chip-info">Текущий</span>' : ''}
        </div>
        <div class="demo-card-stats">
          <div class="demo-card-stat">
            <strong>${metrics.cameraCount}</strong>
            <span>Камер в контуре</span>
          </div>
          <div class="demo-card-stat">
            <strong>${store.uptime}</strong>
            <span>Uptime недели</span>
          </div>
          <div class="demo-card-stat">
            <strong>${store.dailyVisitors}</strong>
            <span>Средний трафик в день</span>
          </div>
          <div class="demo-card-stat">
            <strong>${store.alertsPerWeek}</strong>
            <span>Фиксаций за неделю</span>
          </div>
        </div>
        <div class="demo-meta-row">
          <span class="demo-chip demo-chip-success">Конверсия ${escapeHtml(store.conversion)}</span>
          <span class="demo-chip">Кластер ${escapeHtml(store.cluster)}</span>
        </div>
        <div class="demo-inline-actions">
          <button class="demo-button" type="button" data-select-store="${escapeHtml(store.id)}">Открыть магазин</button>
          <button class="demo-button-secondary" type="button" data-preview-store="${escapeHtml(store.id)}">Посмотреть карточку</button>
        </div>
      </article>
    `;
  }).join('');

  const updateSummary = (store) => {
    if (!summary || !store) {
      return;
    }

    const metrics = getStoreHeadline(store);
    summary.innerHTML = `
      <div class="demo-side-card">
        <div class="demo-chip-row">
          <span class="demo-chip demo-chip-info">Выбранный магазин</span>
          <span class="demo-chip">${escapeHtml(store.city)}</span>
        </div>
        <h3>${escapeHtml(store.name)}</h3>
        <p class="demo-page-intro">
          Тестовый профиль магазина с предзаполненными разделами меню, фиксациями и статистикой на вымышленных данных.
        </p>
        <dl>
          <div>
            <dt>Адрес</dt>
            <dd>${escapeHtml(store.address)}</dd>
          </div>
          <div>
            <dt>Камер в мониторинге</dt>
            <dd>${metrics.cameraCount} • онлайн ${metrics.onlineCameras}</dd>
          </div>
          <div>
            <dt>Контрольные зоны</dt>
            <dd>${metrics.controlZones}</dd>
          </div>
          <div>
            <dt>Среднее время реакции</dt>
            <dd>${metrics.reactionTime}</dd>
          </div>
        </dl>
        <div class="demo-inline-actions">
          <a class="demo-button" href="./menu.html">Перейти в разделы</a>
          <a class="demo-button-secondary" href="./statistics.html">Открыть статистику</a>
        </div>
      </div>
    `;
  };

  updateSummary(selectedStore || STORES[0]);

  list.querySelectorAll('[data-select-store]').forEach((button) => {
    button.addEventListener('click', () => {
      const store = getStoreById(button.getAttribute('data-select-store') || '');
      if (!store) {
        return;
      }
      saveSelectedStore(store.id);
      updateSummary(store);
      showNotice(`Магазин ${store.name} выбран.`);
      window.setTimeout(() => {
        window.location.href = './menu.html';
      }, 180);
    });
  });

  list.querySelectorAll('[data-preview-store]').forEach((button) => {
    button.addEventListener('click', () => {
      const store = getStoreById(button.getAttribute('data-preview-store') || '');
      if (!store) {
        return;
      }
      saveSelectedStore(store.id);
      updateSummary(store);
      showNotice(`Карточка ${store.name} обновлена.`);
    });
  });
}

function renderMenuPage() {
  const grid = document.querySelector('[data-demo-menu-grid]');
  const store = getSelectedStore();

  if (!grid || !store) {
    return;
  }

  grid.innerHTML = MENU_ITEMS.map((item) => `
    <a class="demo-menu-card" href="${escapeHtml(item.href)}" data-requires-store>
      <div class="demo-chip-row">
        <span class="demo-chip demo-chip-info">${escapeHtml(store.name)}</span>
      </div>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <div class="demo-inline-actions">
        <span class="demo-button-secondary">Открыть</span>
      </div>
    </a>
  `).join('');
}

function renderPlaceholderPage() {
  const page = getPage();
  const config = PLACEHOLDER_PAGES[page];
  const grid = document.querySelector('[data-demo-placeholder-grid]');
  const store = getSelectedStore();

  if (!config || !grid || !store) {
    return;
  }

  const cards = [];

  if (page === 'streaming') {
    cards.push(
      ...store.cameras.map((camera, index) => `
        <article class="demo-placeholder-card">
          <div class="demo-card-head">
            <div>
              <h3>${escapeHtml(camera)}</h3>
              <p>${index % 2 === 0 ? 'Онлайн-поток активен в демо-контуре.' : 'Показывается тестовый слот камеры.'}</p>
            </div>
            <span class="demo-chip ${index % 3 === 0 ? 'demo-chip-warning' : 'demo-chip-success'}">
              ${index % 3 === 0 ? 'Нагрузка высокая' : 'Норма'}
            </span>
          </div>
          <div class="demo-card-stats">
            <div class="demo-card-stat">
              <strong>${99 - index * 0.4}%</strong>
              <span>Доступность</span>
            </div>
            <div class="demo-card-stat">
              <strong>${2 + index} сек</strong>
              <span>Буфер</span>
            </div>
          </div>
          <div class="demo-inline-actions">
            <button class="demo-button" type="button" data-open-placeholder="${escapeHtml(camera)}">Открыть поток</button>
          </div>
        </article>
      `),
    );
  }

  if (page === 'download-archive') {
    cards.push(
      ...Array.from({ length: 4 }, (_, index) => `
        <article class="demo-placeholder-card">
          <div class="demo-card-head">
            <div>
              <h3>Архивная заявка #${index + 1}</h3>
              <p>Подготовлен вымышленный интервал ${10 + index}:00 - ${11 + index}:00 по магазину ${escapeHtml(store.name)}.</p>
            </div>
            <span class="demo-chip demo-chip-info">Готово</span>
          </div>
          <div class="demo-inline-actions">
            <button class="demo-button" type="button" data-open-placeholder="Архивная выгрузка ${index + 1}">Открыть запись</button>
            <button class="demo-button-secondary" type="button" data-open-placeholder="Скачать архив ${index + 1}">Скачать</button>
          </div>
        </article>
      `),
    );
  }

  if (page === 'live-archive') {
    cards.push(
      ...Array.from({ length: 5 }, (_, index) => `
        <article class="demo-placeholder-card">
          <div class="demo-card-head">
            <div>
              <h3>Срез ${formatTime(9 + index * 2, 15)}</h3>
              <p>Тестовый фрагмент архива для ${escapeHtml(store.name)} без отображения реального видео.</p>
            </div>
            <span class="demo-chip ${index % 2 === 0 ? 'demo-chip-success' : 'demo-chip-warning'}">
              ${index % 2 === 0 ? 'Подтверждён' : 'Требует внимания'}
            </span>
          </div>
          <div class="demo-inline-actions">
            <button class="demo-button" type="button" data-open-placeholder="Фрагмент ${index + 1}">Открыть фрагмент</button>
          </div>
        </article>
      `),
    );
  }

  grid.innerHTML = cards.join('');

  document.querySelectorAll('[data-open-placeholder]').forEach((button) => {
    button.addEventListener('click', () => {
      const label = button.getAttribute('data-open-placeholder') || 'Раздел';
      openModal(
        label,
        `
          <div class="demo-detail-grid">
            <div class="demo-surface-card" style="padding: 18px;">
              <p class="demo-page-intro">
                Медиа-контент в тестовой версии пока не выводится. Здесь останется точка входа в настоящий сценарий работы, а сами видео и кадры можно будет подключить позже.
              </p>
            </div>
          </div>
        `,
      );
    });
  });
}

function generateDemoDefects(startDateValue, store) {
  const startDate = parseDateInput(startDateValue);
  const random = mulberry32(seedFromString(`${store.id}:${startDateValue}:demo-defects`));
  const records = [];
  let currentId = 1;

  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const currentDate = addDays(startDate, dayIndex);
    const perDayCount = randomInt(random, 9, 18);

    for (let recordIndex = 0; recordIndex < perDayCount; recordIndex += 1) {
      const type = weightedPick(random, DEFECT_TYPES);
      const hour = randomInt(random, 8, 22);
      const minute = randomInt(random, 0, 59);
      const camera = store.cameras[randomInt(random, 0, store.cameras.length - 1)];
      const statusRoll = random();
      const status =
        statusRoll > 0.66 ? 'Подтверждено' : statusRoll > 0.34 ? 'В очереди' : 'Новое';
      const severityRoll = random();
      const severity =
        severityRoll > 0.78 ? 'Высокий' : severityRoll > 0.4 ? 'Средний' : 'Низкий';
      const peopleNumber = PEOPLE_TYPES.has(type.key) ? randomInt(random, 1, 9) : null;
      const dateValue = formatDateInput(currentDate);

      records.push({
        id: `${store.id}-${dateValue}-${currentId}`,
        typeKey: type.key,
        typeLabel: type.label,
        dateValue,
        dateLabel: formatLongDate(currentDate),
        time: formatTime(hour, minute),
        camera,
        zone: `Зона ${randomInt(random, 1, 6)}`,
        status,
        severity,
        peopleNumber,
        note:
          status === 'Подтверждено'
            ? 'Событие уже отмечено в тестовом журнале оператора.'
            : 'Событие ожидает подтверждения в тестовом журнале оператора.',
      });
      currentId += 1;
    }
  }

  return records.sort((left, right) => {
    if (left.dateValue === right.dateValue) {
      return right.time.localeCompare(left.time);
    }
    return right.dateValue.localeCompare(left.dateValue);
  });
}

function groupDefectsByDay(records) {
  const map = new Map();
  records.forEach((record) => {
    if (!map.has(record.dateValue)) {
      map.set(record.dateValue, {
        dateValue: record.dateValue,
        dateLabel: record.dateLabel,
        records: [],
      });
    }
    map.get(record.dateValue).records.push(record);
  });
  return Array.from(map.values());
}

function getDefectTotals(records) {
  const confirmed = records.filter((record) => record.status === 'Подтверждено').length;
  const critical = records.filter((record) => record.severity === 'Высокий').length;
  const queued = records.filter((record) => record.status === 'В очереди').length;
  return { confirmed, critical, queued };
}

function renderDefectsPage() {
  const store = getSelectedStore();
  const startDateInput = document.querySelector('[data-defects-start-date]');
  const list = document.querySelector('[data-defects-list]');
  const summary = document.querySelector('[data-defects-summary]');
  const rangeLabel = document.querySelector('[data-defects-range-label]');
  const heroStore = document.querySelector('[data-defects-store-name]');

  if (!store || !startDateInput || !list || !summary || !rangeLabel) {
    return;
  }

  if (heroStore) {
    heroStore.textContent = store.name;
  }

  const defaultStart = formatDateInput(addDays(new Date(), -6));
  if (!startDateInput.value) {
    startDateInput.value = defaultStart;
  }

  const draw = () => {
    const startDate = startDateInput.value || defaultStart;
    const records = generateDemoDefects(startDate, store);
    const grouped = groupDefectsByDay(records);
    const endDate = formatDateInput(addDays(parseDateInput(startDate), 6));
    const totals = getDefectTotals(records);

    rangeLabel.textContent = `${formatShortDate(parseDateInput(startDate))} - ${formatShortDate(parseDateInput(endDate))} • 7 дней`;

    summary.innerHTML = `
      <div class="demo-summary-card demo-surface-card">
        <span>Всего событий</span>
        <strong>${records.length}</strong>
      </div>
      <div class="demo-summary-card demo-surface-card">
        <span>Подтверждено</span>
        <strong>${totals.confirmed}</strong>
      </div>
      <div class="demo-summary-card demo-surface-card">
        <span>В очереди</span>
        <strong>${totals.queued}</strong>
      </div>
      <div class="demo-summary-card demo-surface-card">
        <span>Высокий приоритет</span>
        <strong>${totals.critical}</strong>
      </div>
    `;

    list.innerHTML = grouped.map((day) => {
      const peopleCount = day.records.reduce((sum, record) => sum + (record.peopleNumber || 0), 0);
      return `
        <section class="demo-timeline-day">
          <div class="demo-day-header">
            <div>
              <h3>${escapeHtml(day.dateLabel)}</h3>
              <div class="demo-timeline-day-meta">
                <span>${day.records.length} фиксаций</span>
                <span>Людей по crowd/conversion: ${peopleCount}</span>
              </div>
            </div>
            <span class="demo-chip demo-chip-info">${escapeHtml(store.name)}</span>
          </div>
          <div class="demo-defect-list">
            ${day.records.map((record) => `
              <article class="demo-defect-row">
                <div class="demo-defect-main">
                  <strong>${escapeHtml(record.typeLabel)}</strong>
                  <span class="demo-defect-meta">${escapeHtml(record.time)} • ${escapeHtml(record.camera)} • ${escapeHtml(record.zone)}</span>
                </div>
                <div class="demo-chip-row">
                  <span class="demo-chip ${record.severity === 'Высокий' ? 'demo-chip-danger' : record.severity === 'Средний' ? 'demo-chip-warning' : 'demo-chip-success'}">${escapeHtml(record.severity)}</span>
                  <span class="demo-chip ${record.status === 'Подтверждено' ? 'demo-chip-success' : record.status === 'В очереди' ? 'demo-chip-warning' : 'demo-chip-info'}">${escapeHtml(record.status)}</span>
                  ${record.peopleNumber ? `<span class="demo-chip">Людей ${record.peopleNumber}</span>` : ''}
                </div>
                <button class="demo-button-secondary" type="button" data-view-defect="${escapeHtml(record.id)}">Открыть</button>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');

    list.querySelectorAll('[data-view-defect]').forEach((button) => {
      button.addEventListener('click', () => {
        const record = records.find((item) => item.id === button.getAttribute('data-view-defect'));
        if (!record) {
          return;
        }
        openModal(
          `${record.typeLabel} • ${record.time}`,
          `
            <div class="demo-detail-grid">
              <div class="demo-surface-card" style="padding: 18px;">
                <div class="demo-chip-row" style="margin-bottom: 12px;">
                  <span class="demo-chip demo-chip-info">${escapeHtml(record.typeKey)}</span>
                  <span class="demo-chip">${escapeHtml(record.status)}</span>
                </div>
                <p class="demo-page-intro">${escapeHtml(record.note)}</p>
              </div>
              <div class="demo-surface-card" style="padding: 18px;">
                <dl style="margin: 0; display: grid; gap: 10px;">
                  <div><dt class="demo-muted">Магазин</dt><dd style="margin: 4px 0 0;">${escapeHtml(store.name)}</dd></div>
                  <div><dt class="demo-muted">Камера</dt><dd style="margin: 4px 0 0;">${escapeHtml(record.camera)}</dd></div>
                  <div><dt class="demo-muted">Зона</dt><dd style="margin: 4px 0 0;">${escapeHtml(record.zone)}</dd></div>
                  <div><dt class="demo-muted">Дата</dt><dd style="margin: 4px 0 0;">${escapeHtml(record.dateLabel)}</dd></div>
                </dl>
              </div>
            </div>
          `,
        );
      });
    });
  };

  document.querySelector('[data-defects-generate]')?.addEventListener('click', draw);
  draw();
}

function renderStatisticsPage() {
  const store = getSelectedStore();
  const startDateInput = document.querySelector('[data-statistics-start-date]');
  const grid = document.querySelector('[data-statistics-grid]');
  const typesGrid = document.querySelector('[data-statistics-types]');
  const bars = document.querySelector('[data-statistics-bars]');
  const heroStore = document.querySelector('[data-statistics-store-name]');

  if (!store || !startDateInput || !grid || !typesGrid || !bars) {
    return;
  }

  if (heroStore) {
    heroStore.textContent = store.name;
  }

  const defaultStart = formatDateInput(addDays(new Date(), -6));
  if (!startDateInput.value) {
    startDateInput.value = defaultStart;
  }

  const draw = () => {
    const records = generateDemoDefects(startDateInput.value || defaultStart, store);
    const grouped = groupDefectsByDay(records);
    const totals = getDefectTotals(records);
    const byType = DEFECT_TYPES.map((type) => {
      const count = records.filter((record) => record.typeKey === type.key).length;
      return {
        key: type.key,
        label: type.label,
        count,
        share: records.length ? Math.round((count / records.length) * 100) : 0,
      };
    }).filter((item) => item.count > 0).sort((left, right) => right.count - left.count);

    const averagePerDay = (records.length / 7).toFixed(1);
    const stabilityIndex = Math.max(82, 100 - totals.critical - grouped.length);
    const responseMinutes = (2.4 + totals.queued / 16).toFixed(1);
    const onlineCameras = Math.max(store.cameras.length - 1, 3);

    grid.innerHTML = `
      <article class="demo-stat-card">
        <span>Событий за период</span>
        <strong>${records.length}</strong>
      </article>
      <article class="demo-stat-card">
        <span>Подтверждено оператором</span>
        <strong>${totals.confirmed}</strong>
      </article>
      <article class="demo-stat-card">
        <span>Среднее в день</span>
        <strong>${averagePerDay}</strong>
      </article>
      <article class="demo-stat-card">
        <span>Камер в мониторинге</span>
        <strong>${onlineCameras}/${store.cameras.length}</strong>
      </article>
    `;

    const kpiGrid = document.querySelector('[data-statistics-kpi]');
    if (kpiGrid) {
      kpiGrid.innerHTML = `
        <article class="demo-placeholder-card">
          <h3>Индекс стабильности</h3>
          <span class="demo-type-share">${stabilityIndex}</span>
          <p>Сводный показатель состояния магазина на базе интенсивности дефектов и доли критичных событий.</p>
        </article>
        <article class="demo-placeholder-card">
          <h3>SLA реакции</h3>
          <span class="demo-type-share">${Math.max(90, 98 - totals.queued)}%</span>
          <p>Доля событий, которые в демо-модели были бы обработаны в нормативное время.</p>
        </article>
        <article class="demo-placeholder-card">
          <h3>Среднее время реакции</h3>
          <span class="demo-type-share">${responseMinutes} мин</span>
          <p>Расчётный тайминг по операторскому подтверждению для вымышленного журнала инцидентов.</p>
        </article>
      `;
    }

    bars.innerHTML = grouped.map((day) => {
      const fill = Math.max(8, Math.round((day.records.length / 18) * 100));
      return `
        <div class="demo-bar-item">
          <div class="demo-bar-head">
            <span>${escapeHtml(formatLongDate(parseDateInput(day.dateValue)))}</span>
            <strong>${day.records.length}</strong>
          </div>
          <div class="demo-bar-track">
            <div class="demo-bar-fill" style="width: ${fill}%"></div>
          </div>
        </div>
      `;
    }).join('');

    typesGrid.innerHTML = byType.map((item, index) => `
      <article class="demo-type-card">
        <div class="demo-type-card-head">
          <div>
            <h3>${escapeHtml(item.label)}</h3>
            <p>${escapeHtml(item.key)}</p>
          </div>
          <span class="demo-chip ${index < 2 ? 'demo-chip-warning' : 'demo-chip-info'}">${item.count} шт.</span>
        </div>
        <div class="demo-type-share">${item.share}%</div>
        <div class="demo-type-row">
          <span>Доля в потоке</span>
          <span>${item.count} фиксаций</span>
        </div>
        <div class="demo-bar-track">
          <div class="demo-bar-fill" style="width: ${Math.max(item.share, 6)}%"></div>
        </div>
      </article>
    `).join('');
  };

  document.querySelector('[data-statistics-generate]')?.addEventListener('click', draw);
  draw();
}

function setupLoginPage() {
  ensureOverlayNodes();

  const form = document.querySelector('[data-demo-login-form]');
  const loginInput = document.querySelector('[data-demo-login]');
  const passwordInput = document.querySelector('[data-demo-password]');

  if (!form || !(loginInput instanceof HTMLInputElement) || !(passwordInput instanceof HTMLInputElement)) {
    return;
  }

  loginInput.value = 'admin';
  passwordInput.value = 'admin';

  const pendingNotice = popPendingNotice();
  if (pendingNotice) {
    showNotice(pendingNotice);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    persistAuth();
    setPendingNotice('Тестовый вход выполнен. Выберите магазин.');
    window.location.href = './stores.html';
  });
}

function initDemo() {
  setBanner();

  if (!guardPage()) {
    return;
  }

  if (getPage() === 'login') {
    setupLoginPage();
    return;
  }

  setupShell();

  switch (getPage()) {
    case 'stores':
      renderStoresPage();
      break;
    case 'menu':
      renderMenuPage();
      break;
    case 'defects':
      renderDefectsPage();
      break;
    case 'statistics':
      renderStatisticsPage();
      break;
    case 'streaming':
    case 'download-archive':
    case 'live-archive':
      renderPlaceholderPage();
      break;
    default:
      break;
  }
}

window.addEventListener('DOMContentLoaded', initDemo);
