(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const buyNowBtn = document.getElementById('buyNowBtn');
  const cartBtn = document.getElementById('cartBtn');
  const stickyBar = document.getElementById('stickyBar');
  const storyProgress = document.getElementById('storyProgress');
  const buySection = document.getElementById('buy');

  const scentNames = {
    fir: '雪山木质',
    cedar: '黑金皮革',
    ebony: '夜幕乌木',
  };

  let selectedScent = 'fir';
  let ticking = false;

  function resolveAsset(path) {
    var base = window.VELTOR_BASE || '';
    return base + String(path).replace(/^\//, '').replace(/^\.\//, '');
  }

  document.querySelectorAll('img[data-veltor-asset]').forEach(function (img) {
    img.src = resolveAsset(img.getAttribute('data-veltor-asset'));
  });

  /* ---- Nav ---- */
  function handleNavScroll() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  /* ---- Global parallax ---- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      parallaxEls.forEach(function (el) {
        el.style.transform = '';
      });
      ticking = false;
      return;
    }

    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    parallaxEls.forEach(function (el) {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const offset = centerOffset * speed * -0.5;
      el.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateParallax();
        updateProductStory();
        updateStickyBar();
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateParallax();

  /* ---- Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---- Counter ---- */
  const statNumbers = document.querySelectorAll('.stat__number[data-count]');

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(function (el) {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ---- AirPods-style product story ---- */
  const productStory = document.getElementById('productStory');
  const storyPanels = document.querySelectorAll('.story-panel');
  const storyDevice = document.querySelector('.product-story__device');

  function updateProductStory() {
    if (!productStory || !storyPanels.length) return;

    const track = productStory.querySelector('.product-story__track');
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const trackTop = trackRect.top + window.scrollY;
    const trackHeight = track.offsetHeight;
    const scrollInTrack = window.scrollY - trackTop;
    const progress = Math.max(0, Math.min(1, scrollInTrack / (trackHeight - window.innerHeight)));

    const panelCount = storyPanels.length;
    const activeIndex = Math.min(
      panelCount - 1,
      Math.floor(progress * panelCount)
    );

    storyPanels.forEach(function (panel, i) {
      panel.classList.toggle('is-active', i === activeIndex);
    });

    if (storyProgress) {
      const dots = storyProgress.querySelectorAll('.story-progress__dot');
      const inStory =
        trackRect.top < window.innerHeight && trackRect.bottom > 0;
      storyProgress.classList.toggle('is-visible', inStory);
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === activeIndex);
      });
    }

    if (storyDevice) {
      const scale = 0.92 + progress * 0.12;
      const rotate = (progress - 0.5) * 4;
      storyDevice.style.transform =
        'scale(' + scale + ') rotate(' + rotate + 'deg)';
    }
  }

  /* Set track height for scroll length */
  if (productStory && storyPanels.length) {
    const track = productStory.querySelector('.product-story__track');
    if (track) {
      track.style.minHeight = storyPanels.length * 80 + 'vh';
    }
    updateProductStory();

    if (storyProgress) {
      storyProgress.querySelectorAll('.story-progress__dot').forEach(function (dot) {
        dot.addEventListener('click', function () {
          const index = parseInt(dot.getAttribute('data-dot'), 10);
          const track = productStory.querySelector('.product-story__track');
          if (!track) return;
          const trackTop = track.getBoundingClientRect().top + window.scrollY;
          const segment = (track.offsetHeight - window.innerHeight) / storyPanels.length;
          window.scrollTo({
            top: trackTop + segment * index + 1,
            behavior: 'smooth',
          });
        });
      });
    }
  }

  /* ---- Scent sync ---- */
  function scrollToBuy() {
    if (!buySection) return;
    var navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10
    );
    window.scrollTo({
      top: buySection.getBoundingClientRect().top + window.scrollY - navH,
      behavior: 'smooth',
    });
  }

  function setScent(scent) {
    selectedScent = scent;
    document.querySelectorAll('.scent-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-scent') === scent);
    });
    document.querySelectorAll('.scent-card').forEach(function (card) {
      var isActive = card.getAttribute('data-scent') === scent;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.scent-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setScent(btn.getAttribute('data-scent'));
    });
  });

  document.querySelectorAll('.scent-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      setScent(card.getAttribute('data-scent'));
      if (e.target.closest('.scent-card__cta')) {
        scrollToBuy();
      }
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setScent(card.getAttribute('data-scent'));
        if (e.target.closest('.scent-card__cta')) {
          scrollToBuy();
        }
      }
    });
  });

  /* ---- Smooth anchor ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      if (anchor.classList.contains('js-open-purchase')) return;
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      );
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth',
      });
    });
  });

  /* ---- Section parallax (features, specs, reasons) ---- */
  const sectionParallax = document.querySelectorAll(
    '.screen--value, .screen--scents, .screen--reviews, .screen--story, .screen--final-buy'
  );

  function updateSectionParallax() {
    const vh = window.innerHeight;
    sectionParallax.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (vh - rect.top) / (vh + rect.height);
        const offset = (progress - 0.5) * 30;
        section.style.setProperty('--section-shift', offset + 'px');
      }
    });
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateSectionParallax();
        });
      }
    },
    { passive: true }
  );

  /* Hero scroll: product scale down as user leaves first screen */
  const hero = document.getElementById('hero');
  const heroImg = document.querySelector('.hero__product-img');

  if (hero && heroImg) {
    window.addEventListener(
      'scroll',
      function () {
        if (window.matchMedia('(max-width: 768px)').matches) return;
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;
        if (scrollY <= heroH) {
          const p = scrollY / heroH;
          heroImg.style.setProperty('--scroll-scale', 1 - p * 0.06);
        }
      },
      { passive: true }
    );
  }

  /* ---- Sticky buy bar ---- */
  function updateStickyBar() {
    if (!stickyBar || !hero) return;
    const heroBottom = hero.offsetHeight;
    const buyVisible =
      buySection &&
      buySection.getBoundingClientRect().top < window.innerHeight * 0.85;
    const show = window.scrollY > heroBottom * 0.6 && !buyVisible;
    stickyBar.classList.toggle('is-visible', show);
    stickyBar.setAttribute('aria-hidden', show ? 'false' : 'true');
    document.body.classList.toggle('has-sticky-bar', show);
  }

  window.addEventListener('scroll', updateStickyBar, { passive: true });
  updateStickyBar();
})();
