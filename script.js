(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');

  root.classList.add('js-enabled');

  if (header && !reduceMotion) {
    let lastScrollY = window.scrollY;
    let isHidden = false;

    const syncHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 24) {
        header.classList.remove('is-hidden');
        isHidden = false;
        lastScrollY = currentScrollY;
        return;
      }

      if (delta > 10 && currentScrollY > 120 && !isHidden) {
        header.classList.add('is-hidden');
        isHidden = true;
      } else if (delta < -8 && isHidden) {
        header.classList.remove('is-hidden');
        isHidden = false;
      }

      lastScrollY = currentScrollY;
    };

    syncHeaderVisibility();
    window.addEventListener('scroll', syncHeaderVisibility, { passive: true });
    window.addEventListener('resize', syncHeaderVisibility);
  }

  const playVideo = (video) => {
    const playPromise = video.play();

    if (playPromise) {
      playPromise.catch((error) => {
        video.dataset.playbackError = error?.name || 'playback-error';
      });
    }
  };

  const productShowcaseCategories = [
    {
      id: 'cash-flow',
      tab: 'Касса и поток',
      label: 'Категория 01',
      title: 'Касса и поток клиентов',
      description:
        'Сценарии, которые помогают быстрее замечать перегрузку кассовой зоны, очереди и спорные эпизоды обслуживания.',
      scenarios: [
        {
          id: 'cash-register',
          name: 'Касса',
          description:
            'Быстрый просмотр эпизодов в кассовой зоне с понятным визуальным доказательством для проверки.',
          image: 'images/defects/cash-register.jpeg',
        },
        {
          id: 'too-many-people',
          name: 'Много людей за прилавком',
          description:
            'Помогает увидеть перегруженные зоны и ситуации, где сервис уже начинает проседать.',
          image: 'images/defects/toManyPeopleAtStall.jpeg',
        },
        {
          id: 'no-one-at-stall',
          name: 'Никого за прилавком',
          description:
            'Подсвечивает моменты, когда клиентская зона остается без сотрудника.',
          image: 'images/defects/noOneAtStall.jpeg',
        },
        {
          id: 'crowd',
          name: 'Очередь',
          description:
            'Сигнализирует о росте очереди до того, как это перерастет в потерю качества обслуживания.',
          image: 'images/defects/crowd.jpeg',
        },
        { id: 'cash-count', name: 'Пересчёт кассы', description: '', image: null },
        { id: 'conversion', name: 'Конверсия', description: '', image: null },
        { id: 'inactive-seller', name: 'Продавец неактивен', description: '', image: null },
      ],
    },
    {
      id: 'personnel',
      tab: 'Персонал и стандарты',
      label: 'Категория 02',
      title: 'Персонал и стандарты',
      description:
        'Сценарии дисциплины и регламентов, которые трудно отслеживать стабильно вручную на длинном архиве.',
      scenarios: [
        {
          id: 'delays',
          name: 'Опоздания',
          description: 'Фиксация входа сотрудников позже ожидаемого времени смены.',
          image: 'images/defects/delays.jpeg',
        },
        {
          id: 'pose',
          name: 'Сидит при клиенте',
          description:
            'Помогает видеть эпизоды, где поведение сотрудника расходится со стандартом обслуживания.',
          image: 'images/defects/pose.jpeg',
        },
        {
          id: 'phones',
          name: 'Телефон',
          description: 'Подсвечивает отвлечение сотрудника на телефон в рабочей зоне.',
          image: 'images/defects/phones.jpeg',
        },
        {
          id: 'mopping',
          name: 'Мойка полов',
          description:
            'Помогает находить эпизоды обслуживания и уборки, которые конфликтуют по времени или контексту.',
          image: 'images/defects/mopping.jpeg',
        },
        { id: 'badge', name: 'Бейдж', description: '', image: null },
        { id: 'uniform', name: 'Форма одежды', description: '', image: null },
      ],
    },
    {
      id: 'safety',
      tab: 'Безопасность и порядок',
      label: 'Категория 03',
      title: 'Безопасность и порядок',
      description:
        'Сценарии для нежелательных событий и визуальных отклонений, которые нельзя пропускать в общем потоке камер.',
      scenarios: [
        {
          id: 'bottles',
          name: 'Бутылки',
          description:
            'Контроль объектов в заданных зонах с быстрым переходом к визуальному подтверждению.',
          image: 'images/defects/bottle.jpeg',
        },
        {
          id: 'clear-stall',
          name: 'Лишние предметы в области',
          description:
            'Помогает видеть изменения сцены и посторонние объекты в чувствительных зонах.',
          image: 'images/defects/clearStall.jpeg',
        },
        {
          id: 'smoke',
          name: 'Курение',
          description:
            'Выводит события с дымом или курением там, где это критично для регламента.',
          image: 'images/defects/smoke.jpeg',
        },
        { id: 'light', name: 'Свет', description: '', image: null },
        { id: 'after-close', name: 'Человек после закрытия', description: '', image: null },
      ],
    },
  ];

  const getFirstAvailableScenario = (category) =>
    category.scenarios.find((scenario) => scenario.image) ?? category.scenarios[0];

  const heroVideoBg = document.querySelector('[data-hero-video-bg]');

  if (heroVideoBg) {
    const videos = Array.from(heroVideoBg.querySelectorAll('video'));
    const playlist = (heroVideoBg.dataset.videoList || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    let activeVideoIndex = 0;
    let playlistIndex = 0;

    videos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.controls = false;
    });

    if (videos[0]) {
      videos[0].src = playlist[0] || videos[0].getAttribute('src') || '';
      playVideo(videos[0]);
    }

    const switchHeroVideo = () => {
      if (videos.length < 2 || playlist.length < 2) {
        return;
      }

      const currentVideo = videos[activeVideoIndex];
      const nextVideo = videos[(activeVideoIndex + 1) % videos.length];
      playlistIndex = (playlistIndex + 1) % playlist.length;
      nextVideo.src = playlist[playlistIndex];
      nextVideo.currentTime = 0;
      nextVideo.load();
      let switched = false;

      const showNext = () => {
        if (switched) {
          return;
        }

        switched = true;
        playVideo(nextVideo);
        nextVideo.classList.add('is-active');
        currentVideo.classList.remove('is-active');
        activeVideoIndex = (activeVideoIndex + 1) % videos.length;
      };

      if (nextVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        showNext();
      } else {
        nextVideo.addEventListener('loadeddata', showNext, { once: true });
        nextVideo.addEventListener('canplay', showNext, { once: true });
      }
    };

    if (!reduceMotion && playlist.length > 1) {
      window.setInterval(switchHeroVideo, 5000);
    }
  }

  const productShowcase = document.querySelector('[data-product-showcase]');

  if (productShowcase) {
    const stage = productShowcase.querySelector('.product-showcase-stage');
    const tabs = productShowcase.querySelector('[data-product-tabs]');
    const scenarios = productShowcase.querySelector('[data-product-scenarios]');
    const categoryLabel = productShowcase.querySelector('[data-product-category-label]');
    const categoryTitle = productShowcase.querySelector('[data-product-category-title]');
    const categoryDescription = productShowcase.querySelector('[data-product-category-description]');
    const preview = productShowcase.querySelector('[data-product-preview]');
    const previewKicker = productShowcase.querySelector('[data-product-preview-kicker]');
    const previewTitle = productShowcase.querySelector('[data-product-preview-title]');
    const previewCopy = productShowcase.querySelector('[data-product-preview-copy]');
    const previewImage = productShowcase.querySelector('[data-product-preview-image]');

    if (
      tabs &&
      scenarios &&
      categoryLabel &&
      categoryTitle &&
      categoryDescription &&
      preview &&
      previewKicker &&
      previewTitle &&
      previewCopy &&
      previewImage &&
      stage
    ) {
      let activeCategoryId = productShowcaseCategories[0].id;
      let activeScenarioId = getFirstAvailableScenario(productShowcaseCategories[0]).id;
      let lockedShowcaseHeight = 0;

      const applyLockedShowcaseHeight = () => {
        if (window.innerWidth <= 1180) {
          stage.style.height = '';
          return;
        }

        if (lockedShowcaseHeight > 0) {
          stage.style.height = `${lockedShowcaseHeight}px`;
        }
      };

      const lockInitialShowcaseHeight = () => {
        if (window.innerWidth <= 1180 || lockedShowcaseHeight > 0) {
          return;
        }

        stage.style.height = '';
        lockedShowcaseHeight = Math.ceil(stage.getBoundingClientRect().height);
        applyLockedShowcaseHeight();
      };

      const renderPreview = (category, scenario) => {
        preview.classList.remove('is-switching');
        void preview.offsetWidth;
        preview.classList.add('is-switching');

        previewKicker.textContent = category.title;
        previewTitle.textContent = scenario.name;
        previewCopy.textContent = scenario.description;
        previewImage.src = scenario.image || '';
        previewImage.alt = scenario.name;
      };

      const renderScenarios = (category) => {
        scenarios.innerHTML = '';

        category.scenarios.forEach((scenario, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'product-scenario';
          button.dataset.scenarioId = scenario.id;

          if (!scenario.image) {
            button.classList.add('is-disabled');
            button.disabled = true;
          }

          if (scenario.id === activeScenarioId) {
            button.classList.add('is-active');
          }

          button.innerHTML = `
            <span class="product-scenario-index">${String(index + 1).padStart(2, '0')}</span>
            <span class="product-scenario-name">${scenario.name}</span>
          `;

          if (scenario.image) {
            button.addEventListener('click', () => {
              activeScenarioId = scenario.id;
              render();
            });
          }

          scenarios.append(button);
        });
      };

      const renderTabs = () => {
        tabs.innerHTML = '';

        productShowcaseCategories.forEach((category) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'product-tab';
          button.textContent = category.tab;

          if (category.id === activeCategoryId) {
            button.classList.add('is-active');
          }

          button.addEventListener('click', () => {
            if (category.id === activeCategoryId) {
              return;
            }

            activeCategoryId = category.id;
            activeScenarioId = getFirstAvailableScenario(category).id;
            render();
          });

          tabs.append(button);
        });
      };

      const render = () => {
        const category = productShowcaseCategories.find((item) => item.id === activeCategoryId);
        if (!category) {
          return;
        }

        const scenario =
          category.scenarios.find((item) => item.id === activeScenarioId && item.image) ||
          getFirstAvailableScenario(category);

        activeScenarioId = scenario.id;
        categoryLabel.textContent = category.label;
        categoryTitle.textContent = category.title;
        categoryDescription.textContent = category.description;

        renderTabs();
        renderScenarios(category);
        renderPreview(category, scenario);
      };

      render();
      window.requestAnimationFrame(lockInitialShowcaseHeight);
      window.addEventListener('resize', applyLockedShowcaseHeight);
    }
  }

  const revealItems = document.querySelectorAll(
    '.reveal, .reveal-card, .news-strip article, .module-grid article'
  );

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 45, 260)}ms`);
      observer.observe(item);
    });
  }

  const scrollVideos = document.querySelectorAll('[data-scroll-video]');

  const toggleVideo = (video) => {
    if (video.paused) {
      playVideo(video);
    } else {
      video.pause();
    }
  };

  scrollVideos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.controls = false;

    const updatePlaybackState = (state) => {
      video.dataset.playbackState = state;
      video.dataset.playbackTime = video.currentTime.toFixed(2);
    };

    updatePlaybackState(video.paused ? 'paused' : 'playing');
    video.addEventListener('play', () => updatePlaybackState('play'));
    video.addEventListener('playing', () => updatePlaybackState('playing'));
    video.addEventListener('pause', () => updatePlaybackState('paused'));
    video.addEventListener('timeupdate', () => updatePlaybackState(video.paused ? 'paused' : 'playing'));
    video.addEventListener('error', () => {
      video.dataset.playbackError = video.error?.message || `media-error-${video.error?.code || 'unknown'}`;
    });
    video.addEventListener('click', () => toggleVideo(video));
    video.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleVideo(video);
      }
    });
  });

  const detectionButtons = document.querySelectorAll('[data-detection-video]');

  if (detectionButtons.length) {
    const detectionVideo = document.querySelector('.detection-video-frame video');
    const detectionSource = detectionVideo?.querySelector('source');
    const detectionFrame = detectionVideo?.closest('.detection-video-frame');
    const detectionTitle = document.querySelector('[data-detection-title]');
    const detectionDescription = document.querySelector('[data-detection-description]');
    let detectionSwitchId = 0;

    detectionVideo?.removeAttribute('poster');

    const playDetectionWhenReady = (switchId) => {
      let started = false;

      const start = () => {
        if (started || switchId !== detectionSwitchId || !detectionVideo) {
          return;
        }

        started = true;
        detectionVideo.currentTime = 0;
        playVideo(detectionVideo);
        window.setTimeout(() => {
          if (switchId === detectionSwitchId) {
            detectionFrame?.classList.remove('is-switching');
          }
        }, reduceMotion ? 0 : 220);
      };

      if (!detectionVideo) {
        return;
      }

      if (detectionVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        start();
        return;
      }

      playVideo(detectionVideo);
      detectionVideo.addEventListener('loadeddata', start, { once: true });
      detectionVideo.addEventListener('canplay', start, { once: true });
    };

    const selectDetection = (button) => {
      if (!detectionVideo || !detectionSource) {
        return;
      }

      const nextVideo = button.dataset.detectionVideo;
      if (!nextVideo) {
        return;
      }

      const switchId = ++detectionSwitchId;
      const isNewVideo = !detectionVideo.currentSrc.endsWith(nextVideo) && !detectionVideo.getAttribute('src')?.endsWith(nextVideo);

      detectionButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.classList.toggle('is-featured', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      if (detectionTitle) {
        detectionTitle.textContent = button.dataset.detectionName || button.querySelector('h3')?.textContent || '';
      }

      if (detectionDescription) {
        detectionDescription.textContent = button.dataset.detectionCopy || button.querySelector('p')?.textContent || '';
      }

      detectionVideo.setAttribute(
        'aria-label',
        `Пример видеофиксации: ${button.dataset.detectionName || button.querySelector('h3')?.textContent || ''}`
      );

      if (!isNewVideo) {
        detectionVideo.currentTime = 0;
        playDetectionWhenReady(switchId);
        return;
      }

      detectionFrame?.classList.add('is-switching');

      window.setTimeout(() => {
        if (switchId !== detectionSwitchId) {
          return;
        }

        detectionVideo.pause();
        detectionSource.src = nextVideo;
        detectionVideo.src = nextVideo;
        detectionVideo.load();
        playDetectionWhenReady(switchId);
      }, reduceMotion ? 0 : 180);
    };

    detectionButtons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === 0));
      button.addEventListener('click', () => selectDetection(button));
    });
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            playVideo(video);
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.36 }
    );

    scrollVideos.forEach((video) => videoObserver.observe(video));
  }

  const previewTriggers = document.querySelectorAll('[data-preview-src]');

  if (previewTriggers.length) {
    const preview = document.createElement('div');
    preview.className = 'scenario-preview';
    preview.setAttribute('aria-hidden', 'true');
    preview.innerHTML = '<img alt="" /><span></span>';
    document.body.append(preview);

    const previewImage = preview.querySelector('img');
    const previewTitle = preview.querySelector('span');
    let activeTrigger = null;
    let pointerPosition = null;

    const getHeaderBottom = () => document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;

    const getAnchorPoint = (trigger, event) => {
      if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
        pointerPosition = { x: event.clientX, y: event.clientY };
        return pointerPosition;
      }

      if (pointerPosition) {
        return pointerPosition;
      }

      const bounds = trigger.getBoundingClientRect();
      return {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      };
    };

    const positionPreview = (trigger, event) => {
      const previewWidth = Math.min(Math.max(320, window.innerWidth * 0.38), 560);
      const previewHeight = previewWidth / 1.6;
      const margin = 18;
      const gap = 20;
      const headerBottom = getHeaderBottom() + 12;
      const anchor = getAnchorPoint(trigger, event);
      const spaceRight = window.innerWidth - anchor.x - gap - margin;
      const spaceLeft = anchor.x - gap - margin;
      const spaceBottom = window.innerHeight - anchor.y - gap - margin;
      const spaceTop = anchor.y - gap - Math.max(margin, headerBottom);
      let x = anchor.x + gap;
      let y = anchor.y + gap;

      if (spaceRight < previewWidth && spaceLeft >= previewWidth) {
        x = anchor.x - previewWidth - gap;
      } else if (spaceRight < previewWidth) {
        x = Math.max(margin, window.innerWidth - previewWidth - margin);
      }

      if (spaceBottom < previewHeight && spaceTop >= previewHeight) {
        y = anchor.y - previewHeight - gap;
      } else if (spaceBottom < previewHeight) {
        y = Math.max(headerBottom, window.innerHeight - previewHeight - margin);
      }

      x = Math.min(Math.max(margin, x), Math.max(margin, window.innerWidth - previewWidth - margin));
      y = Math.min(Math.max(headerBottom, y), Math.max(headerBottom, window.innerHeight - previewHeight - margin));

      preview.style.setProperty('--preview-x', `${x}px`);
      preview.style.setProperty('--preview-y', `${y}px`);
      preview.style.transform = `translate(${x}px, ${y}px) scale(${preview.classList.contains('is-visible') ? 1 : 0.96})`;
    };

    const showPreview = (trigger, event) => {
      activeTrigger = trigger;
      previewImage.src = trigger.dataset.previewSrc;
      previewImage.alt = trigger.dataset.previewTitle || trigger.textContent.trim();
      previewTitle.textContent = trigger.dataset.previewTitle || trigger.textContent.trim();
      positionPreview(trigger, event);
      preview.classList.add('is-visible');
      positionPreview(trigger, event);
    };

    const hidePreview = () => {
      activeTrigger = null;
      pointerPosition = null;
      preview.classList.remove('is-visible');
    };

    previewTriggers.forEach((trigger) => {
      trigger.tabIndex = 0;
      trigger.addEventListener('mouseenter', (event) => showPreview(trigger, event));
      trigger.addEventListener('mousemove', (event) => {
        if (activeTrigger === trigger) {
          positionPreview(trigger, event);
        }
      });
      trigger.addEventListener('focus', () => showPreview(trigger));
      trigger.addEventListener('mouseleave', hidePreview);
      trigger.addEventListener('blur', hidePreview);
    });

    window.addEventListener('scroll', () => {
      if (activeTrigger) {
        positionPreview(activeTrigger);
      }
    }, { passive: true });

    window.addEventListener('resize', hidePreview);
  }

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dots = carousel.querySelector('.carousel-dots');
    const autoplay = carousel.dataset.carouselAutoplay !== 'false';
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let timer = null;
    let dragStartX = null;
    let dragStartY = null;
    let dragPointerId = null;

    if (slides.length <= 1) {
      return;
    }

    const dotButtons = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Показать слайд ${index + 1}`);
      dot.addEventListener('click', () => showSlide(index, true));
      dots?.append(dot);
      return dot;
    });

    const update = () => {
      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === activeIndex);
        slide.setAttribute('aria-hidden', String(index !== activeIndex));
      });
      dotButtons.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === activeIndex);
      });
    };

    const showSlide = (index, userAction = false) => {
      activeIndex = (index + slides.length) % slides.length;
      update();
      if (userAction && autoplay) {
        restartAutoplay();
      }
    };

    const startAutoplay = () => {
      if (reduceMotion || !autoplay) {
        return;
      }
      timer = window.setInterval(() => showSlide(activeIndex + 1), 6500);
    };

    const stopAutoplay = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    prev?.addEventListener('click', () => showSlide(activeIndex - 1, true));
    next?.addEventListener('click', () => showSlide(activeIndex + 1, true));

    const handleSwipeEnd = (endX, endY) => {
      if (dragStartX === null || dragStartY === null) {
        return;
      }

      const deltaX = endX - dragStartX;
      const deltaY = endY - dragStartY;
      dragStartX = null;
      dragStartY = null;
      dragPointerId = null;

      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
        return;
      }

      showSlide(activeIndex + (deltaX < 0 ? 1 : -1), true);
    };

    carousel.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragPointerId = event.pointerId;
      stopAutoplay();
    });

    carousel.addEventListener('pointerup', (event) => {
      if (dragPointerId !== null && event.pointerId !== dragPointerId) {
        return;
      }

      handleSwipeEnd(event.clientX, event.clientY);
    });

    carousel.addEventListener('pointercancel', () => {
      dragStartX = null;
      dragStartY = null;
      dragPointerId = null;
    });

    if (autoplay) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('focusin', stopAutoplay);
      carousel.addEventListener('focusout', startAutoplay);
    }

    update();
    startAutoplay();
  });

  document.querySelectorAll('[data-interface-tabs]').forEach((tabsRoot) => {
    const tabs = Array.from(tabsRoot.querySelectorAll('[data-interface-tab]'));
    const panels = Array.from(tabsRoot.querySelectorAll('[data-interface-panel]'));

    if (!tabs.length || !panels.length) {
      return;
    }

    const selectTab = (tabToSelect, shouldFocus = false) => {
      const target = tabToSelect.dataset.interfaceTab;

      tabs.forEach((tab) => {
        const isActive = tab === tabToSelect;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.interfacePanel === target;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });

      if (shouldFocus) {
        tabToSelect.focus({ preventScroll: true });
      }
    };

    tabs.forEach((tab, index) => {
      tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (event) => {
        const nextKeys = ['ArrowRight', 'ArrowDown'];
        const prevKeys = ['ArrowLeft', 'ArrowUp'];

        if (!nextKeys.includes(event.key) && !prevKeys.includes(event.key) && event.key !== 'Home' && event.key !== 'End') {
          return;
        }

        event.preventDefault();
        let nextIndex = index;

        if (nextKeys.includes(event.key)) {
          nextIndex = (index + 1) % tabs.length;
        } else if (prevKeys.includes(event.key)) {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        }

        selectTab(tabs[nextIndex], true);
      });
    });
  });

  const interfaceImages = document.querySelectorAll('.interface-carousel .carousel-slide img, .interface-panel > .carousel-shell .carousel-slide img, .architecture-full-image');

  if (interfaceImages.length) {
    const preview = document.createElement('div');
    preview.className = 'interface-image-preview';
    preview.setAttribute('aria-hidden', 'true');
    preview.setAttribute('role', 'dialog');
    preview.setAttribute('aria-modal', 'true');
    preview.setAttribute('aria-label', 'Просмотр изображения во весь экран');
    preview.innerHTML = '<button class="interface-image-preview__close" type="button" aria-label="Закрыть полноэкранный просмотр">×</button><img alt="" /><span></span>';
    document.body.append(preview);

    const closeButton = preview.querySelector('button');
    const previewImage = preview.querySelector('img');
    const previewCaption = preview.querySelector('span');
    let activeImage = null;

    const getImageTitle = (image) => {
      const figure = image.closest('figure');
      return (
        figure?.querySelector('figcaption strong')?.textContent?.trim() ||
        image.alt ||
        image.getAttribute('aria-label') ||
        'Изображение интерфейса'
      );
    };

    const showInterfacePreview = (image) => {
      const title = getImageTitle(image);

      activeImage = image;
      previewImage.src = image.currentSrc || image.src;
      previewImage.alt = image.alt || title;
      previewCaption.textContent = title;
      preview.classList.add('is-visible');
      preview.removeAttribute('aria-hidden');
      document.body.classList.add('has-image-modal');
      closeButton.focus({ preventScroll: true });
    };

    const hideInterfacePreview = () => {
      if (!activeImage) {
        return;
      }

      const imageToFocus = activeImage;
      activeImage = null;
      preview.classList.remove('is-visible');
      preview.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('has-image-modal');
      imageToFocus.focus({ preventScroll: true });
    };

    interfaceImages.forEach((image) => {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `${getImageTitle(image)} — открыть во весь экран`);
      image.addEventListener('click', () => showInterfacePreview(image));
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showInterfacePreview(image);
        }
      });
    });

    closeButton.addEventListener('click', hideInterfacePreview);
    preview.addEventListener('click', (event) => {
      if (event.target === preview) {
        hideInterfacePreview();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && activeImage) {
        hideInterfacePreview();
      }
    });
  }

  const companyStats = document.querySelector('[data-company-stats]');

  if (companyStats) {
    const statCards = Array.from(companyStats.querySelectorAll('[data-company-stat]'));

    const updateCompanyStats = () => {
      if (!statCards.length) {
        return;
      }

      if (reduceMotion) {
        statCards.forEach((card) => card.classList.add('is-visible'));
        return;
      }

      const rect = companyStats.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / viewportHeight));
      const thresholds = [0.18, 0.34, 0.5];

      statCards.forEach((card, index) => {
        card.classList.toggle('is-visible', progress >= thresholds[index]);
      });
    };

    updateCompanyStats();
    window.addEventListener('scroll', updateCompanyStats, { passive: true });
    window.addEventListener('resize', updateCompanyStats);
  }
})();
