(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var buySection = document.getElementById('buy');
  var heroProduct = document.getElementById('heroProduct');
  var heroVisual = document.getElementById('heroVisual');

  function resolveAsset(path) {
    var base = window.VELTOR_BASE || '';
    return base + String(path).replace(/^\//, '').replace(/^\.\//, '');
  }

  function productImgPath() {
    if (window.veltorProductImg) return window.veltorProductImg;
    var p = location.pathname;
    var repo = '/veltor-site';
    var isGhPages = p === repo || p.indexOf(repo + '/') === 0;
    return isGhPages ? 'images/car-diffuser-hero.png' : 'public/images/car-diffuser-hero.png';
  }

  document.querySelectorAll('img[data-veltor-product]').forEach(function (img) {
    img.src = resolveAsset(productImgPath());
    if (!img.hasAttribute('data-veltor-hero')) {
      img.loading = img.getAttribute('loading') || 'lazy';
    }
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      var fallback = resolveAsset('images/car-diffuser-hero.png');
      if (img.src !== fallback) img.src = fallback;
    });
  });

  /* Nav scroll */
  function handleNavScroll() {
    if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay * 120);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* Hero mouse parallax — disabled to preserve float animation */

  /* Scent selection */
  function scrollToBuy() {
    if (!buySection) return;
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 56;
    window.scrollTo({
      top: buySection.getBoundingClientRect().top + window.scrollY - navH,
      behavior: 'smooth',
    });
  }

  function setScent(scent) {
    document.querySelectorAll('.scent-lg').forEach(function (card) {
      var active = card.getAttribute('data-scent') === scent;
      card.classList.toggle('active', active);
      card.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.scent-lg').forEach(function (card) {
    card.addEventListener('click', function () {
      setScent(card.getAttribute('data-scent'));
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setScent(card.getAttribute('data-scent'));
      }
    });
  });

  /* Smooth anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      if (anchor.classList.contains('js-open-purchase')) return;
      var id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 56;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth',
      });
    });
  });

  document.body.classList.add('has-mobile-bar');
})();
