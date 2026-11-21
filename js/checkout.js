/* Checkout en dos pasos (simulado). */
(function () {
  var PAISES = ["Colombia", "Estados Unidos", "México", "España", "Chile", "Perú", "Argentina", "Panamá"];
  var F = Carrito.formato;
  if (!Carrito.lineas().length) { location.replace("carrito.html"); return; }
  var cup = Carrito.cupon(), items = Carrito.itemsCarrito(), sub = Carrito.valor(items);
  function conCupon(o) { if (cup) o.coupon = cup; return o; }

  enviarEvento("begin_checkout", conCupon({ value: sub, items: items }));

  var selPais = document.getElementById("pais");
  selPais.innerHTML = PAISES.map(function (p) { return "<option>" + p + "</option>"; }).join("");

  function estado() {
    var pais = selPais.value, nac = pais === "Colombia";
    var serv = document.querySelector('input[name="servicio"]:checked').value;
    var tipo = nac ? "Nacional" : "Internacional";
    return { pais: pais, tipo: tipo, servicio: serv, tier: tipo + " - " + serv, costo: Carrito.envio(nac, serv, sub), nac: nac };
  }
  function tarifa(n) { return n === 0 ? "Gratis" : F(n); }
  function resumen() {
    var e = estado();
    document.getElementById("t-std").textContent = tarifa(Carrito.envio(e.nac, "Estándar", sub));
    document.getElementById("t-exp").textContent = tarifa(Carrito.envio(e.nac, "Express", sub));
    document.getElementById("res-lineas").innerHTML = Carrito.lineas().map(function (l, i) {
      return '<div class="r-l"><span>' + l.producto.nombre + ' ×' + l.cantidad + '</span><span>' + F(items[i].price * l.cantidad) + '</span></div>';
    }).join("");
    document.getElementById("res-tot").innerHTML = '<dt>Productos' + (cup ? " (cupón " + cup + ")" : "") + '</dt><dd>' + F(sub) + '</dd>' +
      '<dt>Envío</dt><dd>' + tarifa(e.costo) + '</dd><dt class="fuerte">Total</dt><dd class="fuerte">' + F(sub + e.costo) + '</dd>';
  }
  selPais.addEventListener("change", resumen);
  Array.prototype.forEach.call(document.querySelectorAll('input[name="servicio"]'), function (r) { r.addEventListener("change", resumen); });
  resumen();

  function paso(n) {
    document.getElementById("paso1").hidden = n !== 1;
    document.getElementById("paso2").hidden = n !== 2;
    document.getElementById("p1").className = "paso" + (n === 1 ? " activo" : "");
    document.getElementById("p2").className = "paso" + (n === 2 ? " activo" : "");
  }

  document.getElementById("btn-envio").addEventListener("click", function () {
    var err = document.getElementById("err1");
    if (!document.getElementById("nombre").value.trim()) { err.hidden = false; err.textContent = "Escribe un nombre ficticio para continuar."; return; }
    err.hidden = true;
    var e = estado();
    try { sessionStorage.setItem("cosechas_envio", JSON.stringify({ tipo: e.tipo, tier: e.tier, costo: e.costo, pais: e.pais })); } catch (x) {}
    window.gtag("set", "user_properties", { tipo_cliente: e.tipo });
    enviarEvento("add_shipping_info", conCupon({ value: sub, shipping_tier: e.tier, items: items }));
    paso(2);
  });
  document.getElementById("volver").addEventListener("click", function () { paso(1); });

  var btnPago = document.getElementById("btn-pago");
  btnPago.addEventListener("click", function () {
    btnPago.disabled = true;
    var e = estado(), pago = document.querySelector('input[name="pago"]:checked').value;
    var pedido = {
      transaction_id: "COS-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
      value: sub, shipping: e.costo, coupon: cup || null, tipo_cliente: e.tipo, pais: e.pais, pago: pago, items: items, enviado: false
    };
    try { sessionStorage.setItem("cosechas_pedido", JSON.stringify(pedido)); } catch (x) {}
    Carrito.vaciar();
    enviarYNavegar("add_payment_info", conCupon({ value: sub, payment_type: pago, items: items }), "gracias.html");
  });
})();
