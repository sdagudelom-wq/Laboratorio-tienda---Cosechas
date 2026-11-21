/* Monitor de eventos (ayuda didáctica). */
(function () {
  var KE = "cosechas_eventos", KO = "cosechas_origen", KH = "cosechas_monitor_oculto";
  function sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function lget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function fmt(n) { return window.Carrito ? window.Carrito.formato(n) : n; }
  function leer() { try { return JSON.parse(sget(KE)) || []; } catch (e) { return []; } }

  function resumen(n, p) {
    p = p || {}; var r = [];
    if (n === "page_view") return p.page_location || "";
    if (p.item_list_name) r.push("lista: " + p.item_list_name);
    if (p.promotion_id) r.push("promo: " + p.promotion_id);
    if (p.transaction_id) r.push(p.transaction_id);
    if (p.items && p.items.length) {
      r.push(p.items.length === 1 ? p.items[0].item_name + " ×" + p.items[0].quantity : p.items.length + " ítems");
    }
    if (p.value !== undefined) r.push("valor " + fmt(p.value));
    if (p.shipping !== undefined) r.push("envío " + fmt(p.shipping));
    if (p.coupon) r.push("cupón " + p.coupon);
    if (p.shipping_tier) r.push(p.shipping_tier);
    if (p.payment_type) r.push(p.payment_type);
    if (p.tipo_cliente) r.push("cliente " + p.tipo_cliente);
    return r.join(" · ");
  }
  function hora() { return new Date().toLocaleTimeString("es-CO", { hour12: false }); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Origen de la visita: solo la primera página de la sesión */
  if (!sget(KO)) {
    var q = new URLSearchParams(location.search);
    var s = q.get("utm_source"), m = q.get("utm_medium"), c = q.get("utm_campaign");
    sset(KO, (s || m || c) ? (s || "(sin source)") + " / " + (m || "(sin medium)") + " · " + (c || "(sin campaign)") : "directo (sin UTM)");
  }

  var el = document.createElement("aside");
  el.id = "monitor"; el.setAttribute("aria-label", "Monitor de eventos");
  el.innerHTML = '<div class="m-cab"><strong>Monitor de eventos</strong><button id="m-toggle" type="button">Ocultar</button></div>' +
    '<div class="m-cuerpo"><div id="m-estado" class="m-estado"></div>' +
    '<div class="m-bloque"><span class="m-et">Origen de la visita</span><div id="m-origen"></div></div>' +
    '<div class="m-bloque m-grow"><span class="m-et">Últimos 12 eventos</span><ol id="m-lista"></ol></div>' +
    '<button id="m-reset" type="button">Simular nuevo visitante</button></div>';
  document.body.appendChild(el);

  var cfg = window.TIENDA_CONFIG || {}, est = document.getElementById("m-estado");
  if (window.GA_ACTIVO) {
    est.className = "m-estado ok";
    est.textContent = "Conectado a " + cfg.GA_MEASUREMENT_ID + (cfg.DEBUG_MODE === true ? " · modo depuración" : "");
  } else {
    est.className = "m-estado error";
    est.textContent = "Sin ID de medición: los eventos solo se muestran aquí. Edita js/config.js.";
  }
  document.getElementById("m-origen").textContent = sget(KO);

  function pintar() {
    document.getElementById("m-lista").innerHTML = leer().map(function (e) {
      return '<li><span class="m-h">' + esc(e.h) + '</span> <b>' + esc(e.n) + '</b><div>' + esc(e.r) + '</div></li>';
    }).join("") || '<li class="m-vacio">Aún no hay eventos.</li>';
  }
  function aplicarEstado() {
    var o = lget(KH) === "1";
    el.classList.toggle("oculto", o);
    document.body.classList.toggle("mon-oculto", o);
    document.getElementById("m-toggle").textContent = o ? "Mostrar" : "Ocultar";
  }
  document.getElementById("m-toggle").addEventListener("click", function () {
    lset(KH, lget(KH) === "1" ? "0" : "1"); aplicarEstado();
  });

  function borrarCookiesGA() {
    var host = location.hostname, partes = host.split("."), doms = [null, host];
    for (var i = 0; i < partes.length - 1; i++) doms.push("." + partes.slice(i).join("."));
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (/^_ga/.test(n)) doms.forEach(function (d) {
        document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
      });
    });
  }
  document.getElementById("m-reset").addEventListener("click", function () {
    borrarCookiesGA();
    try { localStorage.removeItem("cosechas_carrito"); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    location.href = "index.html";
  });

  window.Monitor = {
    registrar: function (n, p) {
      var l = leer(); l.unshift({ h: hora(), n: n, r: resumen(n, p) });
      sset(KE, JSON.stringify(l.slice(0, 12))); pintar();
    }
  };
  aplicarEstado(); pintar();
  window.Monitor.registrar("page_view", { page_location: location.pathname.replace(/^.*\//, "") + location.search || "index.html" });
})();
