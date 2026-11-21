# Cosechas · Tienda ficticia para el laboratorio de GA4

Tienda en línea **ficticia** (batidos naturales, wraps y snacks saludables) para el Diplomado en E-commerce y Negocios Internacionales Digitales. Solo HTML, CSS y JavaScript puros: sin servidor, sin base de datos, sin npm y sin pagos reales.

> Sitio académico de simulación: no procesa pagos ni guarda datos personales. Usa Google Analytics 4.

## 1. Configurar tu ID de GA4

Edita **solo** `js/config.js`:

```js
window.TIENDA_CONFIG = { GA_MEASUREMENT_ID: "G-XXXXXXXXXX", DEBUG_MODE: true };
```

- Pega tu ID de medición (GA4 > Administrar > Flujos de datos > tu flujo web).
- Con `G-XXXXXXXXXX` no se carga gtag.js y el monitor muestra el aviso rojo.
- `DEBUG_MODE: true` envía `debug_mode` y los eventos aparecen en **DebugView**. Con `false` no se envía.

## 2. Probar en tu computador

Abre `index.html` con doble clic, o mejor, con un servidor local (`python3 -m http.server`) y entra a `http://localhost:8000`.

## 3. Publicar (GitHub + Vercel)

1. En github.com: **New repository** > nombre `cosechas` > Public > **Create repository**.
2. Clic en **uploading an existing file** y arrastra el **contenido** de la carpeta `Cosechas` (index.html debe quedar en la raíz del repositorio, junto a `css/` y `js/`). Clic en **Commit changes**.
3. En vercel.com: inicia sesión con GitHub > **Add New… > Project** > importa `cosechas`.
4. En **Framework Preset** elige **Other**. Deja vacíos Build Command y Output Directory > **Deploy**.
5. Para cambiar el ID más tarde: edita `js/config.js` en GitHub (lápiz) y haz commit; Vercel republica solo.

## 4. Datos de la simulación

- **Cupón:** `BIENVENIDA10` (10 %). Se aplica en el carrito o con el banner del inicio.
- **Envío (COP):** Nacional Estándar 12.000 · Nacional Express 25.000 · Internacional Estándar 95.000 · Internacional Express 160.000. Nacional Estándar es gratis si los productos (ya con descuento) suman 150.000 o más.
- **Países:** Colombia (Nacional); Estados Unidos, México, España, Chile, Perú, Argentina y Panamá (Internacional).
- **Pago simulado:** Tarjeta de crédito, PSE, Nequi o PayPal. No se piden ni guardan correo, teléfono, documento ni tarjeta.

## 5. Eventos GA4 (todos con `currency: "COP"`)

| Evento | Cuándo |
|---|---|
| `view_item_list` | Al cargar el catálogo (`catalogo_principal`) |
| `view_promotion` / `select_promotion` | Al mostrar / hacer clic en el banner del cupón |
| `select_item` | Clic en un producto, antes de navegar |
| `view_item` | Al abrir el detalle |
| `add_to_cart` / `remove_from_cart` | Al agregar o quitar unidades |
| `view_cart` | Al abrir el carrito con productos |
| `begin_checkout` | Al abrir checkout.html |
| `add_shipping_info` | Clic en "Continuar al pago" (`shipping_tier`) |
| `add_payment_info` | Clic en "Pagar (simulado)" (`payment_type`) |
| `purchase` | Al cargar gracias.html, una vez por pedido |

Con cupón, cada ítem lleva `price` con descuento, `discount` por unidad y `coupon`. `purchase.value` = suma de price × quantity (sin envío). `tipo_cliente` ("Nacional" o "Internacional") va como propiedad de usuario y como parámetro de `purchase`. Para usarlo en informes, regístralo en GA4 como dimensión personalizada.

## 6. Monitor de eventos

Panel a la derecha (abajo en pantallas de menos de 820 px) con el estado de conexión, el origen de la visita (UTM de la primera página de la sesión), los últimos 12 eventos y el botón **Simular nuevo visitante** (borra cookies `_ga*`, carrito y sessionStorage). Prueba UTM con: `index.html?utm_source=curso&utm_medium=lab&utm_campaign=ga4`.

## Estructura

```
index.html  producto.html  carrito.html  checkout.html  gracias.html
css/estilos.css
js/config.js  productos.js  carrito.js  analytics.js  monitor.js
js/inicio.js  producto.js  carrito-pagina.js  checkout.js  gracias.js
```
