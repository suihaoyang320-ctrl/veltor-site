(function () {
  'use strict';

  function getOrder() {
    try {
      var raw = sessionStorage.getItem('veltor_order');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  var order = getOrder();
  if (!order) {
    window.location.replace('index.html');
    return;
  }

  function formatPrice(n) {
    return '¥' + n.toLocaleString('zh-CN');
  }

  var elOrderId = document.getElementById('successOrderId');
  var elDelivery = document.getElementById('successDelivery');
  var elProduct = document.getElementById('successProduct');
  var elScent = document.getElementById('successScent');
  var elQty = document.getElementById('successQty');
  var elTotal = document.getElementById('successTotal');

  if (elOrderId) elOrderId.textContent = '订单号 ' + order.id;
  if (elDelivery) elDelivery.textContent = order.deliveryText || '—';
  if (elProduct) elProduct.textContent = order.product;
  if (elScent) elScent.textContent = order.scentName;
  if (elQty) elQty.textContent = String(order.qty);
  if (elTotal) elTotal.textContent = formatPrice(order.total);
})();
