/* Página de inicio: banner del cupón y catálogo. */
(function () {
  var LID = "catalogo_principal", LNAME = "Catálogo principal";
  var ctx = { item_list_id: LID, item_list_name: LNAME };
  var lista = document.getElementById("lista");

  PRODUCTOS.forEach(function (p, i) {
    var a = document.createElement("a");
    a.className = "tarjeta"; a.href = "producto.html?id=" + p.id;
    a.innerHTML = '<div class="thumb" style="background:linear-gradient(135deg,' + p.color + ',' + p.color2 + ')"><span>' + p.sigla + '</span></div>' +
      '<div class="t-info"><span class="cat">' + p.categoria + '</span><h3>' + p.nombre + '</h3><p class="precio">' + Carrito.formato(p.precio) + '</p></div>';
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      enviarYNavegar("select_item", { item_list_id: LID, item_list_name: LNAME, items: [Carrito.itemDe(p, 1, i, ctx)] }, a.href);
    });
    lista.appendChild(a);
  });

  enviarEvento("view_item_list", {
    item_list_id: LID, item_list_name: LNAME,
    items: PRODUCTOS.map(function (p, i) { return Carrito.itemDe(p, 1, i, ctx); })
  });

  /* Banner del cupón */
  var banner = document.getElementById("banner"), activo = document.getElementById("cupon-activo");
  function paramsPromo() {
    return {
      promotion_id: "BIENVENIDA10", promotion_name: "Cupón de bienvenida 10 %",
      creative_name: "banner_bienvenida_inicio", creative_slot: "inicio_superior",
      items: PRODUCTOS.map(function (p, i) { return Carrito.itemDe(p, 1, i, null, Carrito.CUPON); })
    };
  }
  if (Carrito.cupon()) {
    activo.hidden = false;
  } else {
    banner.hidden = false;
    enviarEvento("view_promotion", paramsPromo());
    document.getElementById("banner-btn").addEventListener("click", function () {
      Carrito.aplicarCupon(Carrito.CUPON);
      enviarYNavegar("select_promotion", paramsPromo(), "carrito.html");
    });
  }
})();
