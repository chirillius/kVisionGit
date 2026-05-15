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

    window.addEventListener('scroll', syncHeaderVisibility, { passive: true });
  }

  const playVideo = (video) => {
    const playPromise = video.play();

    if (playPromise) {
      playPromise.catch((error) => {
        video.dataset.playbackError = error?.name || 'playback-error';
      });
    }
  };

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

  const revealItems = document.querySelectorAll(
    '.reveal, .reveal-card, .news-strip article, .module-grid article, .value-list article'
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
