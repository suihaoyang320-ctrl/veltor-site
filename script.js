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

  document.querySelectorAll('img[data-veltor-asset]').forEach(function (img) {
    img.src = resolveAsset(img.getAttribute('data-veltor-asset'));
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

  /* Hero mouse parallax */
  var heroImg = heroProduct ? heroProduct.querySelector('.hero__img') : null;
  if (heroVisual && heroImg && window.matchMedia('(min-width: 769px)').matches) {
    heroVisual.addEventListener('mousemove', function (e) {
      var rect = heroVisual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImg.style.transform =
        'scale(1.18) translate(' + (x * 12) + 'px, ' + (y * 8) + 'px)';
    });
    heroVisual.addEventListener('mouseleave', function () {
      heroImg.style.transform = 'scale(1.18)';
    });
  }

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
