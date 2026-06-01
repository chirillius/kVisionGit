import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const demoLoginHtml = await readFile(new URL('../demo/login.html', import.meta.url), 'utf8');
const demoStoresHtml = await readFile(new URL('../demo/stores.html', import.meta.url), 'utf8');
const demoMenuHtml = await readFile(new URL('../demo/menu.html', import.meta.url), 'utf8');
const demoDefectsHtml = await readFile(new URL('../demo/defects.html', import.meta.url), 'utf8');
const demoStatisticsHtml = await readFile(new URL('../demo/statistics.html', import.meta.url), 'utf8');
const demoScript = await readFile(new URL('../demo/demo.js', import.meta.url), 'utf8');
const demoStyles = await readFile(new URL('../demo/demo.css', import.meta.url), 'utf8');

{
  assert.match(html, /AI-видеоаналитика для розничных сетей/i);
  assert.match(html, /Контролируйте магазины без ручного просмотра часов видео/i);
  assert.match(html, /Frontend/i);
  assert.match(html, /CentralServer/i);
  assert.match(html, /kServer/i);
  assert.match(html, /Neuro/i);
  assert.match(html, /Получить демонстрацию/i);
  assert.match(html, /styles\.css/i);
  assert.match(html, /script\.js/i);
  assert.match(html, /demo-app\/login\?demo=1/i);
  assert.match(html, /target="_blank"/i);
  assert.match(html, /rel="noopener"/i);
}

{
  const requiredArchitectureCopy = [
    'Единый интерфейс для всей сети и локальная обработка видео рядом с камерами',
    'Интерфейс оператора',
    'Центральный контур',
    'Локальный сервер магазина',
    'Способ подключения',
    'Что Нужно Для Запуска',
    'Подключение без сложной перестройки текущего контура',
    '2-6 камерам',
    'Единый вход',
    'Сервер на точке',
    'Готовые фиксации',
    'Пилот можно собрать быстро и масштабировать по сети',
    '1 точка для старта',
    '2-6 камер на пилот',
    'Локальный контур',
    'Масштабирование по сети',
    'architecture-map',
    'data-carousel="architecture"',
    'data-carousel-autoplay="false"',
    'images/icons/kvlogo.svg',
    'architecture-slide',
    'architecture-full',
    'data-architecture-full',
    'images/architecture/operator.png',
    'images/architecture/frontend.png',
    'images/architecture/centralServer.png',
    'images/architecture/kServer.png',
    'images/architecture/neuro.png',
    'AI-анализ',
    'Доступ и роли',
    'Видео и архив',
    'AI анализ',
  ];

  for (const copy of requiredArchitectureCopy) {
    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredBusinessCopy = [
    'Меньше ручной проверки, быстрее реакция, прозрачнее контроль',
    'Руководитель видит повторяющиеся проблемы',
    'Администратор управляет доступами',
    'Оператор проверяет доказательства',
    'Данные для решений',
  ];

  for (const copy of requiredBusinessCopy) {
    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredCompanyCopy = [
    'О компании',
    'Российский разработчик систем технического зрения и автоматизации производства',
    'Специализируемся на полном цикле создания',
    'программно-аппаратных',
    'Разработка систем',
    'Внедрение и интеграция',
    'Обучение и экосистема',
    'Внедрение Индустрии 4.0',
    'Подробно о компании',
    'Выбор Роспатента',
    'Лучшие изобретения 2025 года',
    'images/about.webp',
    'images/rospatent.webp',
  ];

  for (const copy of requiredCompanyCopy) {
    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredSlots = [
    'Меню выбора магазина',
    'Выбор камер',
    'Онлайн-просмотр',
    'Видеофрагменты',
    'Архив и видеофрагменты',
    'Live-архив',
    'Таблица нарушений',
    'Изображения фиксаций',
    'Видео фиксации',
    'Статистика за неделю',
    'Проблемные зоны статистики',
  ];

  for (const slot of requiredSlots) {
    assert.match(html, new RegExp(slot, 'i'));
  }

  assert.match(html, /demo-app\/login\?demo=1/i);
}

{
  const requiredImages = [
    'images/client/stores.jpg',
    'images/client/streaming-camera-select.jpg',
    'images/client/streaming.jpg',
    'images/client/download-page.jpg',
    'images/client/players-download-page.jpg',
    'images/client/live-archive.jpg',
    'images/architecture/operator.png',
    'images/architecture/frontend.png',
    'images/architecture/centralServer.png',
    'images/architecture/kServer.png',
    'images/architecture/neuro.png',
  ];

  for (const image of requiredImages) {
    assert.match(html, new RegExp(image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredControlScenarios = [
    'Касса и поток клиентов',
    'Персонал и стандарты',
    'Безопасность и порядок',
    '18 сценариев контроля',
    'Лишние предметы в области',
    'Опоздания',
    'Пересчет кассы',
    'Мойка полов',
    'Свет',
    'Сидит при клиенте',
    'Телефон',
    'Бейдж',
    'Касса',
    'Курение',
    'Конверсия',
    'Много людей за прилавком',
    'Никого за прилавком',
    'Очередь',
    'Продавец неактивен',
    'Форма одежды',
    'Человек после закрытия',
    'data-preview-src="images/defects/bottle.jpeg"',
    'data-preview-src="images/defects/smoke.jpeg"',
    'data-preview-src="images/defects/phones.jpeg"',
    'data-preview-src="images/defects/pose.jpeg"',
    'data-preview-src="images/defects/cash-register.jpeg"',
    'data-preview-src="images/defects/toManyPeopleAtStall.jpeg"',
    'data-preview-src="images/defects/noOneAtStall.jpeg"',
    'data-preview-src="images/defects/crowd.jpeg"',
    'data-preview-src="images/defects/delays.jpeg"',
    'data-preview-src="images/defects/mopping.jpeg"',
    'data-preview-src="images/defects/clearStall.jpeg"',
  ];

  for (const scenario of requiredControlScenarios) {
    assert.match(html, new RegExp(scenario.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredDetectionExamples = [
    'Примеры фиксаций',
    'Бутылки',
    'Курение',
    'Телефон в рабочей зоне',
    'Мытьё полов',
    'Открытие кассы',
    'Очереди',
    'videos/bottles-h264.mp4',
    'videos/smoke-h264.mp4',
    'videos/phone-h264.mp4',
    'videos/mopping-h264.mp4',
    'videos/cash-register-h264.mp4',
    'videos/crowd-h264.mp4',
    'data-scroll-video',
    'data-detection-video',
    'Фиксирует события в кассовой зоне',
    'Точность в контуре',
    'Дообучение модели',
    'подтверждённым и отклонённым оператором событиям',
  ];

  for (const example of requiredDetectionExamples) {
    assert.match(html, new RegExp(example.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredCarouselGroups = [
    'data-carousel="product-entry"',
    'data-carousel="streaming"',
    'data-carousel="archive"',
  ];

  for (const group of requiredCarouselGroups) {
    assert.match(html, new RegExp(group, 'i'));
  }

  assert.match(html, /carousel__button/i);
  assert.match(html, /data-carousel-next/i);
  assert.match(html, /data-carousel-prev/i);
  assert.match(html, /data-carousel="streaming"[^>]*data-carousel-autoplay="false"/i);
  assert.match(html, /data-carousel="archive"[^>]*data-carousel-autoplay="false"/i);
}

{
  assert.doesNotMatch(html, /video-detection-box/i);
  assert.doesNotMatch(html, /video-scan-line/i);
  assert.doesNotMatch(html, /defect-preview/i);
  assert.doesNotMatch(html, /<video[^>]*\scontrols(\s|>|=)/i);
}

{
  const demoPages = [
    demoLoginHtml,
    demoStoresHtml,
    demoMenuHtml,
    demoDefectsHtml,
    demoStatisticsHtml,
  ];

  for (const page of demoPages) {
    assert.match(page, /demo\.css/i);
    assert.match(page, /demo\.js/i);
    assert.match(
      page,
      /Тестовая версия • данные вымышлены • демонстрация примера работа сервиса/i
    );
  }
}

{
  assert.match(demoLoginHtml, /value="admin"/i);
  assert.match(demoLoginHtml, /data-demo-login-form/i);
  assert.match(demoStoresHtml, /data-demo-store-list/i);
  assert.match(demoStoresHtml, /data-store-name/i);
  assert.match(demoMenuHtml, /data-demo-menu-page/i);
  assert.match(demoDefectsHtml, /data-demo-defects-page/i);
  assert.match(demoDefectsHtml, /data-defects-start-date/i);
  assert.match(demoDefectsHtml, /data-defects-list/i);
  assert.match(demoStatisticsHtml, /data-demo-statistics-page/i);
  assert.match(demoStatisticsHtml, /data-statistics-start-date/i);
  assert.match(demoStatisticsHtml, /data-statistics-grid/i);
}

{
  const expectedDemoTokens = [
    'Охотный ряд',
    'Невский пассаж',
    'Балтийская линия',
    'Conversion',
    'TooManyPeopleAtStall',
    'NoOneAtStallForTooLong',
    'InactiveSalesman',
    'generateDemoDefects',
    'renderStatisticsPage',
    'renderStoresPage',
  ];

  for (const token of expectedDemoTokens) {
    assert.match(demoScript, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  assert.match(demoStyles, /demo-sidebar/i);
  assert.match(demoStyles, /demo-test-banner/i);
  assert.match(demoStyles, /demo-store-card/i);
  assert.match(demoStyles, /demo-stat-card/i);
}

console.log('kVision landing content checks passed');
