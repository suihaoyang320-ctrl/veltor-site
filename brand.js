(function () {
  'use strict';

  function resolveAsset(path) {
    var base = window.VELTOR_BASE || '';
    return base + String(path).replace(/^\//, '').replace(/^\.\//, '');
  }

  function logoImgPath() {
    if (window.veltorLogoImg) return window.veltorLogoImg;
    var p = location.pathname;
    var repo = '/veltor-site';
    var isGhPages = p === repo || p.indexOf(repo + '/') === 0;
    return isGhPages ? 'images/logo-main.png' : 'public/images/logo-main.png';
  }

  document.querySelectorAll('img[data-veltor-logo]').forEach(function (img) {
    img.src = resolveAsset(logoImgPath());
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      var fallback = resolveAsset('images/logo-main.png');
      if (img.src !== fallback) img.src = fallback;
    });
  });
})();
