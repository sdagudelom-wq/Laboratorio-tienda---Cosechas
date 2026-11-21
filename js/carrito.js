/* Carrito en localStorage, cupón, ítems de GA4 y tarifas de envío. */
(function () {
  var K = "cosechas_carrito", CUPON = "BIENVENIDA10", PCT = 0.10;
  var TARIFAS = {
    "Nacional - Estándar": 12000, "Nacional - Express": 25000,
    "Internacional - Estándar": 95000, "Internacional - Express": 160000
  };
  function leer() {
    try { var d = JSON.parse(localStorage.getItem(K)); if (d && d.items) return d; } catch (e) {}
    return { items: {}, cupon: null };
  }
  function guardar(d) { try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} }

  var C = {
    CUPON: CUPON,
    cupon: function () { return leer().cupon; },
    aplicarCupon: function (c) {
      if (String(c || "").trim().toUpperCase() !== CUPON) return false;
      var d = leer(); d.cupon = CUPON; guardar(d); return true;
    },
    quitarCupon: function () { var d = leer(); d.cupon = null; guardar(d); },
    cantidad: function () {
      var d = leer(), n = 0; for (var k in d.items) n += d.items[k]; return n;
    },
    lineas: function () {
      var d = leer(), r = [];
      Object.keys(d.items).forEach(function (id) {
        var p = window.buscarProducto(id); if (p && d.items[id] > 0) r.push({ producto: p, cantidad: d.items[id] });
      });
      return r;
    },
    agregar: function (id, n) {
      var d = leer(); d.items[id] = (d.items[id] || 0) + n; guardar(d);
    },
    /* Quita hasta n unidades; devuelve las unidades quitadas realmente. */
    quitar: function (id, n) {
      var d = leer(), t = d.items[id] || 0, q = Math.min(n, t);
      if (t - q <= 0) delete d.items[id]; else d.items[id] = t - q;
      guardar(d); return q;
    },
    vaciar: function () { var d = leer(); d.items = {}; guardar(d); },
    /* Ítem GA4. 'cup' fuerza un cupón (para el banner); si no, usa el activo. */
    itemDe: function (p, cantidad, index, extra, cup) {
      var c = cup || C.cupon(), d = c ? Math.round(p.precio * PCT) : 0;
      var it = { item_id: p.id, item_name: p.nombre, item_brand: "Cosechas", item_category: p.categoria,
                 price: p.precio - d, quantity: cantidad, index: index };
      if (c) { it.discount = d; it.coupon = c; }
      for (var k in (extra || {})) it[k] = extra[k];
      return it;
    },
    itemsCarrito: function () {
      return C.lineas().map(function (l, i) { return C.itemDe(l.producto, l.cantidad, i); });
    },
    valor: function (items) {
      return items.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
    },
    envio: function (nacional, servicio, subtotal) {
      if (nacional && servicio === "Estándar" && subtotal >= 150000) return 0;
      return TARIFAS[(nacional ? "Nacional" : "Internacional") + " - " + servicio];
    },
    formato: function (n) {
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
    },
    actualizarBadge: function () {
      var b = document.getElementById("badge");
      if (b) {
        b.textContent = C.cantidad();
        b.classList.remove("bump");
        void b.offsetWidth;
        b.classList.add("bump");
      }
    }
  };
  window.Carrito = C;
  document.addEventListener("DOMContentLoaded", C.actualizarBadge);
  C.actualizarBadge();
})();
