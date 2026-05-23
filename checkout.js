(function () {
  'use strict';

  var CART_KEY = 'veltor_cart';
  var UNIT_PRICE = 699;

  function formatPrice(n) {
    return '¥' + n.toLocaleString('zh-CN');
  }

  function getCart() {
    try {
      var raw = sessionStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function pageUrl(path) {
    return (window.veltorPage || function (p) { return p; })(path);
  }

  var cart = getCart();
  if (!cart || !cart.qty) {
    window.location.replace(pageUrl('index.html'));
    return;
  }

  var summaryName = document.getElementById('summaryName');
  var summaryScent = document.getElementById('summaryScent');
  var summaryQty = document.getElementById('summaryQty');
  var summaryTotal = document.getElementById('summaryTotal');
  var submitTotal = document.getElementById('submitTotal');
  var form = document.getElementById('checkoutForm');

  var total = UNIT_PRICE * cart.qty;

  if (summaryName) summaryName.textContent = cart.name || 'VELTOR 车载香薰';
  if (summaryScent) summaryScent.textContent = cart.scentName || '';
  if (summaryQty) summaryQty.textContent = String(cart.qty);
  if (summaryTotal) summaryTotal.textContent = formatPrice(total);
  if (submitTotal) submitTotal.textContent = formatPrice(total);

  function addBusinessDays(days) {
    var d = new Date();
    var added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      var day = d.getDay();
      if (day !== 0 && day !== 6) added += 1;
    }
    return d;
  }

  function formatDate(d) {
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }

  function getDeliveryRange(shipping) {
    if (shipping === 'express') {
      return { min: 1, max: 2, label: '极速配送' };
    }
    return { min: 3, max: 5, label: '标准配送' };
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var shipping = form.querySelector('input[name="shipping"]:checked');
      var payment = form.querySelector('input[name="payment"]:checked');
      var shippingVal = shipping ? shipping.value : 'standard';
      var range = getDeliveryRange(shippingVal);
      var deliveryMin = addBusinessDays(range.min);
      var deliveryMax = addBusinessDays(range.max);
      var deliveryText =
        formatDate(deliveryMin) +
        (range.min !== range.max ? ' – ' + formatDate(deliveryMax) : '');

      var order = {
        id: 'VEL-' + Date.now().toString().slice(-8),
        product: cart.name || 'VELTOR 车载香薰',
        scentName: cart.scentName,
        qty: cart.qty,
        total: total,
        shipping: shippingVal,
        shippingLabel: range.label,
        payment: payment ? payment.value : 'apple',
        customer: {
          name: document.getElementById('fieldName').value.trim(),
          phone: document.getElementById('fieldPhone').value.trim(),
          address: document.getElementById('fieldAddress').value.trim(),
        },
        deliveryText: deliveryText,
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem('veltor_order', JSON.stringify(order));
      sessionStorage.removeItem(CART_KEY);
      window.location.href = pageUrl('success.html');
    });
  }
})();
