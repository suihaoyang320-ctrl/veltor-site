(function () {
  'use strict';

  var PRODUCT_NAME = 'VELTOR 车载香薰';
  var UNIT_PRICE = 699;

  var SCENTS = {
    fir: '冷杉木质',
    cedar: '雪松琥珀',
    ebony: '黑檀沉香',
  };

  var purchaseModal = document.getElementById('purchaseModal');
  var purchaseClose = document.getElementById('purchaseClose');
  var purchaseAddCart = document.getElementById('purchaseAddCart');
  var purchaseScentBtns = document.querySelectorAll('.purchase-scent');
  var qtyMinus = document.getElementById('qtyMinus');
  var qtyPlus = document.getElementById('qtyPlus');
  var qtyValue = document.getElementById('qtyValue');

  var cartDrawer = document.getElementById('cartDrawer');
  var cartDrawerClose = document.getElementById('cartDrawerClose');
  var cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  var cartDrawerName = document.getElementById('cartDrawerName');
  var cartDrawerScent = document.getElementById('cartDrawerScent');
  var cartDrawerQty = document.getElementById('cartDrawerQty');
  var cartDrawerTotal = document.getElementById('cartDrawerTotal');
  var cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

  if (!purchaseModal || !cartDrawer) return;

  var purchaseScent = 'fir';
  var purchaseQty = 1;
  var cart = {
    scent: 'fir',
    scentName: SCENTS.fir,
    qty: 1,
  };

  function formatPrice(n) {
    return '¥' + n.toLocaleString('zh-CN');
  }

  function lockBody() {
    document.body.style.overflow = 'hidden';
  }

  function unlockBody() {
    if (
      !purchaseModal.classList.contains('open') &&
      !cartDrawer.classList.contains('open')
    ) {
      document.body.style.overflow = '';
    }
  }

  function syncPurchaseUI() {
    purchaseScentBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-scent') === purchaseScent);
    });
    if (qtyValue) qtyValue.textContent = purchaseQty;
  }

  function openPurchaseModal(presetScent) {
    if (presetScent && SCENTS[presetScent]) {
      purchaseScent = presetScent;
    } else {
      var activePageScent = document.querySelector('.scent-btn.active, .detail-scent.active');
      if (activePageScent) {
        var key = activePageScent.getAttribute('data-scent');
        if (SCENTS[key]) purchaseScent = key;
      }
    }
    purchaseQty = 1;
    syncPurchaseUI();
    purchaseModal.classList.add('open');
    purchaseModal.setAttribute('aria-hidden', 'false');
    lockBody();
  }

  function closePurchaseModal() {
    purchaseModal.classList.remove('open');
    purchaseModal.setAttribute('aria-hidden', 'true');
    unlockBody();
  }

  function updateCartDrawerUI() {
    if (cartDrawerName) cartDrawerName.textContent = PRODUCT_NAME;
    if (cartDrawerScent) cartDrawerScent.textContent = cart.scentName;
    if (cartDrawerQty) cartDrawerQty.textContent = String(cart.qty);
    if (cartDrawerTotal) cartDrawerTotal.textContent = formatPrice(UNIT_PRICE * cart.qty);
  }

  function openCartDrawer() {
    updateCartDrawerUI();
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    lockBody();
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    unlockBody();
  }

  function saveCart() {
    sessionStorage.setItem('veltor_cart', JSON.stringify({
      name: PRODUCT_NAME,
      scent: cart.scent,
      scentName: cart.scentName,
      qty: cart.qty,
      price: UNIT_PRICE,
    }));
  }

  function addToCart() {
    cart.scent = purchaseScent;
    cart.scentName = SCENTS[purchaseScent];
    cart.qty = purchaseQty;
    saveCart();
    closePurchaseModal();
    openCartDrawer();
  }

  document.querySelectorAll('.js-open-purchase').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openPurchaseModal();
    });
  });

  purchaseScentBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      purchaseScent = btn.getAttribute('data-scent');
      syncPurchaseUI();
    });
  });

  if (qtyMinus) {
    qtyMinus.addEventListener('click', function () {
      if (purchaseQty > 1) {
        purchaseQty -= 1;
        syncPurchaseUI();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', function () {
      if (purchaseQty < 99) {
        purchaseQty += 1;
        syncPurchaseUI();
      }
    });
  }

  if (purchaseClose) purchaseClose.addEventListener('click', closePurchaseModal);
  if (purchaseModal.querySelector('.purchase-modal__backdrop')) {
    purchaseModal.querySelector('.purchase-modal__backdrop').addEventListener('click', closePurchaseModal);
  }
  if (purchaseAddCart) purchaseAddCart.addEventListener('click', addToCart);

  if (cartDrawerClose) cartDrawerClose.addEventListener('click', closeCartDrawer);
  if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener('click', closeCartDrawer);
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', function () {
      saveCart();
      window.location.href = (window.veltorPage || function (p) { return p; })('checkout.html');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (purchaseModal.classList.contains('open')) closePurchaseModal();
    else if (cartDrawer.classList.contains('open')) closeCartDrawer();
  });

  window.VELTORCart = {
    openPurchaseModal: openPurchaseModal,
    SCENTS: SCENTS,
    getCart: function () { return cart; },
    saveCart: saveCart,
  };
})();
