// PRECIOS DE PRUEBA — cámbialos cuando Rocío nos dé los suyos.
// Cada tipo de pieza va "de tanto a tanto", como lo piensa Rocío:
//   min / max:     el tamaño más pequeño y el más grande que hace (en cm)
//   desde / hasta: lo que cobra por el más pequeño y por el más grande (en USD)
// Entre medias, la calculadora reparte la diferencia según el tamaño.
window.ARCA_PRECIOS = {
  moneda: 'USD',
  margen: 0.15, // el aproximado se enseña como un rango de ±15 %
  tipos: [
    { id: 'figura',     nombre: 'Figura o adorno',                min: 5,  max: 30, desde: 5, hasta: 30 },
    { id: 'mascota',    nombre: 'Figura de tu mascota',           min: 8,  max: 30, desde: 8, hasta: 35 },
    { id: 'accesorios', nombre: 'Porta accesorios u organizador', min: 8,  max: 30, desde: 5, hasta: 18 },
    { id: 'incienso',   nombre: 'Porta incienso o porta velas',   min: 8,  max: 25, desde: 5, hasta: 15 },
    { id: 'jarron',     nombre: 'Jarrón o maceta',                min: 10, max: 40, desde: 7, hasta: 25 },
    { id: 'joyero',     nombre: 'Joyero o porta joyas',           min: 8,  max: 25, desde: 6, hasta: 18 },
    { id: 'cenicero',   nombre: 'Cenicero',                       min: 8,  max: 20, desde: 4, hasta: 10 },
    { id: 'otra',       nombre: 'Otra idea',                      min: 5,  max: 40, desde: 5, hasta: 30 }
  ],
  // Lo que sube el precio. "porcentaje" se suma sobre el precio de la pieza; "fijo", en USD por pieza.
  extras: {
    colores: [
      { id: 'pocos',    nombre: '1 o 2 colores',              porcentaje: 0 },
      { id: 'varios',   nombre: 'Varios colores',             porcentaje: 15 },
      { id: 'detalle',  nombre: 'Pintura con mucho detalle',  porcentaje: 35 }
    ],
    parecido: { nombre: 'Que se parezca a una foto real (mascota, persona, objeto)', porcentaje: 25 },
    texto:    { nombre: 'Con nombre, fecha o frase escrita', fijo: 2 }
  }
};
