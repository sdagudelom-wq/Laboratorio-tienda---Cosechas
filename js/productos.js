/* Catálogo ficticio de Cosechas. Precios enteros en COP. */
window.PRODUCTOS = [
  { id: "BAT-001", nombre: "Batido Verde Vital", categoria: "Batidos", precio: 14900, sigla: "VV", color: "#0F766E", color2: "#16A34A", descripcion: "Espinaca, piña y jengibre. Fresco, cítrico y lleno de energía para empezar el día." },
  { id: "BAT-002", nombre: "Batido Mango Tropical", categoria: "Batidos", precio: 15900, sigla: "MT", color: "#EA580C", color2: "#F59E0B", descripcion: "Mango maduro, maracuyá y un toque de limón. Sabor de tierra caliente." },
  { id: "BAT-003", nombre: "Batido Fresa y Avena", categoria: "Batidos", precio: 16900, sigla: "FA", color: "#BE123C", color2: "#E11D48", descripcion: "Fresa, avena y leche de almendras. Cremoso y saciante, ideal de media mañana." },
  { id: "BAT-004", nombre: "Batido Cacao y Banano", categoria: "Batidos", precio: 17900, sigla: "CB", color: "#4A2511", color2: "#854D27", descripcion: "Cacao colombiano, banano y mantequilla de maní. Un postre que sí te cuida." },
  { id: "WRP-005", nombre: "Wrap de Pollo y Aguacate", categoria: "Wraps", precio: 24900, sigla: "PA", color: "#365314", color2: "#65A30D", descripcion: "Pollo desmechado, aguacate, lechuga y yogur natural en tortilla integral." },
  { id: "WRP-006", nombre: "Wrap Vegano de Garbanzo", categoria: "Wraps", precio: 22900, sigla: "VG", color: "#854D0E", color2: "#CA8A04", descripcion: "Garbanzos especiados, hummus, zanahoria y rúcula. 100 % vegetal." },
  { id: "SNK-007", nombre: "Mix de Frutos Secos", categoria: "Snacks", precio: 12900, sigla: "FS", color: "#78350F", color2: "#A16207", descripcion: "Almendras, maní, uvas pasas y arándanos. Bolsa de 150 g sin azúcar añadida." },
  { id: "SNK-008", nombre: "Barras de Avena y Miel (x6)", categoria: "Snacks", precio: 28900, sigla: "AM", color: "#9A3412", color2: "#D97706", descripcion: "Seis barras horneadas con avena, miel de abejas y semillas de girasol." }
];
window.buscarProducto = function (id) {
  for (var i = 0; i < window.PRODUCTOS.length; i++) if (window.PRODUCTOS[i].id === id) return window.PRODUCTOS[i];
  return null;
};
