/* Página del carrito. */
(function () {
  var cont = document.getElementById("contenido"), F = Carrito.formato;
  var enviadoView = false;

  function ev(nombre, linea, indice, unidades) {
    var it = Carrito.itemDe(linea.producto, unidades, indice);
    enviarEvento(nombre, { value: it.price * it.quantity, items: [it] });
  }

  function pintar() {
    var ls = Carrito.lineas(), cup = Carrito.cupon();
    Carrito.actualizarBadge();
    if (!ls.length) {
      cont.innerHTML = '<div class="panel vacio"><h2>Tu carrito está vacío</h2><p>Agrega batidos, wraps o snacks para empezar.</p><a class="btn" href="index.html">Ver catálogo</a></div>';
      return;
    }
    var items = Carrito.itemsCarrito(), total = Carrito.valor(items);
    var bruto = ls.reduce(function (s, l) { return s + l.producto.precio * l.cantidad; }, 0);
    var html = '<div class="dos-col"><div class="panel">';
    ls.forEach(function (l, i) {
      var pu = items[i].price;
      html += '<div class="linea"><div class="thumb mini" style="background:linear-gradient(135deg,' + l.producto.color + ',' + l.producto.color2 + ')"><span>' + l.producto.sigla + '</span></div>' +
        '<div class="l-info"><b>' + l.producto.nombre + '</b><div class="sec">' + F(pu) + ' c/u</div></div>' +
        '<div class="cant"><button data-a="menos" data-i="' + i + '" aria-label="Disminuir">−</button><span>' + l.cantidad + '</span><button data-a="mas" data-i="' + i + '" aria-label="Aumentar">+</button></div>' +
        '<div class="l-sub">' + F(pu * l.cantidad) + '</div><button class="quitar" data-a="quitar" data-i="' + i + '">Quitar</button></div>';
    });
    html += '</div><aside class="panel resumen"><h2>Resumen</h2>' +
      '<div class="cupon"><input id="cupon-in" type="text" placeholder="Código de cupón" value="' + (cup || "") + '" ' + (cup ? "disabled" : "") + '>' +
      (cup ? '<button id="cupon-q" class="btn-sec">Quitar</button>' : '<button id="cupon-a" class="btn-sec">Aplicar</button>') + '</div>' +
      '<p id="cupon-msg" class="' + (cup ? "ok-msg" : "sec") + '">' + (cup ? "Cupón " + cup + " aplicado (10 %)." : "Prueba con BIENVENIDA10.") + '</p>' +
      '<dl class="tot"><dt>Productos</dt><dd>' + F(bruto) + '</dd>' +
      (cup ? '<dt>Descuento</dt><dd>−' + F(bruto - total) + '</dd>' : '') +
      '<dt class="fuerte">Subtotal</dt><dd class="fuerte">' + F(total) + '</dd></dl>' +
      '<p class="sec">El envío se calcula en el checkout.</p><a class="btn ancho" href="checkout.html">Ir al checkout</a></aside></div>';
    cont.innerHTML = html;

    if (!enviadoView) {
      enviadoView = true;
      var p = { value: total, items: items }; if (cup) p.coupon = cup;
      enviarEvento("view_cart", p);
    }
  }

  cont.addEventListener("click", function (e) {
    var t = e.target, a = t.getAttribute && t.getAttribute("data-a");
    if (a) {
      var i = +t.getAttribute("data-i"), l = Carrito.lineas()[i]; if (!l) return;
      if (a === "mas") { Carrito.agregar(l.producto.id, 1); ev("add_to_cart", l, i, 1); }
      else if (a === "menos") { var q = Carrito.quitar(l.producto.id, 1); if (q) ev("remove_from_cart", l, i, q); }
      else { var n = Carrito.quitar(l.producto.id, l.cantidad); if (n) ev("remove_from_cart", l, i, n); }
      pintar();
    } else if (t.id === "cupon-a") {
      if (Carrito.aplicarCupon(document.getElementById("cupon-in").value)) pintar();
      else { var m = document.getElementById("cupon-msg"); m.className = "error"; m.textContent = "Cupón no válido."; }
    } else if (t.id === "cupon-q") { Carrito.quitarCupon(); pintar(); }
  });
  pintar();
})();
