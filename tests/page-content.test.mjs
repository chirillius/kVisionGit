import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

{
  assert.match(html, /Видеоаналитика и контроль торговых точек/i);
  assert.match(html, /Frontend/i);
  assert.match(html, /CentralServer/i);
  assert.match(html, /TobaccoServer/i);
  assert.match(html, /Neuro/i);
  assert.match(html, /Получить демонстрацию/i);
  assert.match(html, /styles\.css/i);
  assert.match(html, /script\.js/i);
}

{
  const requiredArchitectureCopy = [
    'Один интерфейс для сети магазинов',
    'Frontend -> CentralServer -> TobaccoServer -> Neuro',
    'оператор видит единый интерфейс',
    'локальный архив и камеры остаются на стороне магазина',
    'Neuro работает как внутренний CV-сервис',
    'architecture-map',
    'data-carousel="architecture"',
    'data-carousel-autoplay="false"',
    'images/icons/kvlogo.svg',
    'architecture-slide',
    'architecture-full',
    'data-architecture-full',
    'Пользователь',
    'RTSP-камеры',
    'Видеоархив',
    'AI-анализ',
  ];

  for (const copy of requiredArchitectureCopy) {
    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredBusinessCopy = [
    'Ежедневный контроль без ручного просмотра часов видео',
    'Руководитель видит повторяющиеся проблемы',
    'Администратор управляет магазинами',
    'Оператор закрывает фиксации',
    'Управленческая аналитика',
  ];

  for (const copy of requiredBusinessCopy) {
    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredCompanyCopy = [
    'О Квантрон',
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
    'Выбор камер для стрима',
    'Просмотр стрима',
    'Скачивание видео',
    'Просмотр записей',
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
}

{
  const requiredImages = [
    'images/client/stores.jpg',
    'images/client/login-page.jpg',
    'images/client/streaming-camera-select.jpg',
    'images/client/streaming.jpg',
    'images/client/download-page.jpg',
    'images/client/players-download-page.jpg',
    'images/client/live-archive.jpg',
    'images/client/defects.jpg',
    'images/client/defectsImages.jpg',
    'images/client/defectsVideos.jpg',
    'images/client/statistics.jpg',
    'images/client/statisticsproblems.jpg',
  ];

  for (const image of requiredImages) {
    assert.match(html, new RegExp(image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
}

{
  const requiredControlScenarios = [
    'Работа кассы и прилавка',
    'Персонал и стандарты обслуживания',
    'Безопасность и порядок',
    'Клиентский поток',
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
    'Телефоны',
    'Мытье полов',
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
    'потенциальная кража из кассового лотка',
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
    'data-carousel="defects"',
    'data-carousel="statistics"',
  ];

  for (const group of requiredCarouselGroups) {
    assert.match(html, new RegExp(group, 'i'));
  }

  assert.match(html, /carousel__button/i);
  assert.match(html, /data-carousel-next/i);
  assert.match(html, /data-carousel-prev/i);
}

{
  assert.doesNotMatch(html, /video-detection-box/i);
  assert.doesNotMatch(html, /video-scan-line/i);
  assert.doesNotMatch(html, /defect-preview/i);
  assert.doesNotMatch(html, /<video[^>]*\scontrols(\s|>|=)/i);
}

console.log('kVision landing content checks passed');
