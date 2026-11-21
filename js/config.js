/* ============================================================
   CONFIGURACIÓN DE COSECHAS  (único archivo que debes editar)
   ============================================================
   1) Entra a GA4 > Administrar > Flujos de datos > tu flujo web.
   2) Copia el "ID de medición" (empieza por G-).
   3) Pégalo abajo, reemplazando G-XXXXXXXXXX, entre las comillas.
   4) DEBUG_MODE: true  = los eventos aparecen en GA4 > DebugView.
                  false = modo normal (sin debug_mode).
   Mientras el ID siga siendo G-XXXXXXXXXX no se carga Google Analytics
   y los eventos solo se muestran en el monitor de la derecha.
   ============================================================ */
window.TIENDA_CONFIG = {
  GA_MEASUREMENT_ID: "G-3NRV6LBPBE", // <-- PEGA AQUÍ TU ID DE MEDICIÓN
  DEBUG_MODE: true                   // true para DebugView, false para producción
};
