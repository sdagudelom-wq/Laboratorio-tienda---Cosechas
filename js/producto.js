/* Detalle de producto. */
(function () {
  var id = new URLSearchParams(location.search).get("id");
  var p = buscarProducto(id), cont = document.getElementById("detalle");
  if (!p) { cont.innerHTML = '<div class="panel"><h1>Producto no encontrado</h1><p><a href="index.html">Volver al catálogo</a></p></div>'; return; }
  document.title = p.nombre + " · Cosechas";
  var precio = Carrito.itemDe(p, 1, 0).price;
  cont.innerHTML = '<div class="thumb grande" style="background:linear-gradient(135deg,' + p.color + ',' + p.color2 + ')"><span>' + p.sigla + '</span></div>' +
    '<div><span class="cat">' + p.categoria + '</span><h1>' + p.nombre + '</h1><p class="desc">' + p.descripcion + '</p>' +
    '<p class="precio grande-p">' + Carrito.formato(precio) + (Carrito.cupon() ? ' <s class="tachado">' + Carrito.formato(p.precio) + '</s>' : '') + '</p>' +
    '<button id="agregar" class="btn">Agregar al carrito</button> <a class="btn-sec" href="carrito.html">Ver carrito</a>' +
    '<p id="ok" class="ok-msg" hidden>✓ Agregado al carrito exitosamente.</p></div>';

  enviarEvento("view_item", { value: precio, items: [Carrito.itemDe(p, 1, 0)] });

  document.getElementById("agregar").addEventListener("click", function () {
    Carrito.agregar(p.id, 1); Carrito.actualizarBadge();
    var it = Carrito.itemDe(p, 1, 0);
    enviarEvento("add_to_cart", { value: it.price * it.quantity, items: [it] });
    var ok = document.getElementById("ok");
    ok.hidden = false;
    ok.classList.remove("ok-anim");
    void ok.offsetWidth;
    ok.classList.add("ok-anim");
  });
})();
