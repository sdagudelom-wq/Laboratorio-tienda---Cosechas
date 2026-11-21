/* Carga de GA4 y envío de eventos. */
(function () {
  var cfg = window.TIENDA_CONFIG || {};
  var id = String(cfg.GA_MEASUREMENT_ID || "");
  var activo = /^G-[A-Z0-9]+$/i.test(id) && id !== "G-XXXXXXXXXX";
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.GA_ACTIVO = activo;

  if (activo) {
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    if (cfg.DEBUG_MODE === true) window.gtag("config", id, { debug_mode: true });
    else window.gtag("config", id);
  }

  function preparar(params) {
    var p = {}; for (var k in (params || {})) p[k] = params[k];
    if (!p.currency) p.currency = "COP";
    return p;
  }
  function registrar(nombre, p) { if (window.Monitor) window.Monitor.registrar(nombre, p); }

  /* Envía un evento. */
  window.enviarEvento = function (nombre, params) {
    var p = preparar(params);
    registrar(nombre, p);
    if (activo) window.gtag("event", nombre, p);
  };

  /* Envía un evento y navega cuando GA confirma (o por tiempo de espera). */
  window.enviarYNavegar = function (nombre, params, url) {
    var p = preparar(params), listo = false;
    function ir() { if (!listo) { listo = true; window.location.href = url; } }
    registrar(nombre, p);
    if (!activo) { ir(); return; }
    var conCb = preparar(p);
    conCb.event_callback = ir;
    conCb.event_timeout = 1000;
    window.gtag("event", nombre, conCb);
    setTimeout(ir, 1200);
  };
})();
