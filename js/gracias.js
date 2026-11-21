/* Confirmación: el evento purchase se envía una sola vez por pedido. */
(function () {
  var cont = document.getElementById("confirmacion"), F = Carrito.formato, pedido = null;
  try { pedido = JSON.parse(sessionStorage.getItem("cosechas_pedido")); } catch (e) {}
  if (!pedido) {
    cont.innerHTML = '<h1>No hay un pedido reciente</h1><p class="sec">Haz una compra simulada desde el catálogo.</p><a class="btn" href="index.html">Ir al catálogo</a>';
    return;
  }
  cont.innerHTML = '<div class="check-anim">✓</div>' +
    '<h1>¡Gracias por tu compra simulada!</h1><p class="sec">Pedido ficticio <b>' + pedido.transaction_id + '</b></p>' +
    '<dl class="tot centrado"><dt>Productos</dt><dd>' + F(pedido.value) + '</dd><dt>Envío (' + pedido.tipo_cliente + ')</dt><dd>' + (pedido.shipping === 0 ? "Gratis" : F(pedido.shipping)) + '</dd>' +
    '<dt class="fuerte">Total</dt><dd class="fuerte">' + F(pedido.value + pedido.shipping) + '</dd></dl>' +
    '<p class="sec">No se realizó ningún cobro real.</p><a class="btn" href="index.html">Seguir explorando</a>';

  if (!pedido.enviado) {
    window.gtag("set", "user_properties", { tipo_cliente: pedido.tipo_cliente });
    var p = {
      transaction_id: pedido.transaction_id, affiliation: "Cosechas Tienda Online",
      value: pedido.value, shipping: pedido.shipping, tipo_cliente: pedido.tipo_cliente, items: pedido.items
    };
    if (pedido.coupon) p.coupon = pedido.coupon;
    enviarEvento("purchase", p);
    pedido.enviado = true;
    try { sessionStorage.setItem("cosechas_pedido", JSON.stringify(pedido)); } catch (e) {}
  }
})();
