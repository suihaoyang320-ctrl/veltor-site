(function (REPO) {
  'use strict';

  var p = location.pathname;
  var base;

  if (p === REPO || p.indexOf(REPO + '/') === 0) {
    base = REPO + '/';
  } else if (p.indexOf('.') > -1) {
    base = p.slice(0, p.lastIndexOf('/') + 1);
  } else if (p.endsWith('/')) {
    base = p;
  } else {
    base = p + '/';
  }

  var el = document.createElement('base');
  el.href = base;
  document.head.insertBefore(el, document.head.firstChild);
  window.VELTOR_BASE = base;
  window.veltorPage = function (path) {
    return base + String(path).replace(/^\//, '');
  };
})('/veltor-site');
