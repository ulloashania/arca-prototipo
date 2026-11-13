// PRECIOS DE PRUEBA — cámbialos cuando Rocío nos dé los suyos.
// Para cada tipo de pieza: cuánto cuesta (en USD) a 10, 20 y 30 cm.
// Entre medias, la calculadora reparte la diferencia de forma proporcional.
// min y max: el tamaño más pequeño y más grande que Rocío hace de ese tipo.
window.ARCA_PRECIOS = {
  moneda: 'USD',
  margen: 0.15, // el aproximado se enseña como un rango de ±15 %
  tipos: [
    { id: 'figura',     nombre: 'Figura o adorno',               min: 5,  max: 30, precios: { 10: 15, 20: 30, 30: 50 } },
    { id: 'mascota',    nombre: 'Figura de tu mascota',          min: 8,  max: 30, precios: { 10: 18, 20: 35, 30: 55 } },
    { id: 'accesorios', nombre: 'Porta accesorios u organizador', min: 8,  max: 30, precios: { 10: 10, 20: 18, 30: 28 } },
    { id: 'incienso',   nombre: 'Porta incienso o porta velas',  min: 8,  max: 25, precios: { 10: 10, 20: 16, 30: 24 } },
    { id: 'jarron',     nombre: 'Jarrón o maceta',               min: 10, max: 40, precios: { 10: 12, 20: 20, 30: 32 } },
    { id: 'joyero',     nombre: 'Joyero o porta joyas',          min: 8,  max: 25, precios: { 10: 12, 20: 20, 30: 30 } },
    { id: 'cenicero',   nombre: 'Cenicero',                      min: 8,  max: 20, precios: { 10: 8,  20: 14, 30: 20 } },
    { id: 'otra',       nombre: 'Otra idea',                     min: 5,  max: 40, precios: { 10: 15, 20: 28, 30: 45 } }
  ],
  // Lo que sube el precio. "porcentaje" se suma sobre el precio de la pieza; "fijo", en USD por pieza.
  extras: {
    colores: [
      { id: 'pocos',    nombre: '1 o 2 colores',              porcentaje: 0 },
      { id: 'varios',   nombre: 'Varios colores',             porcentaje: 15 },
      { id: 'detalle',  nombre: 'Pintura con mucho detalle',  porcentaje: 35 }
    ],
    parecido: { nombre: 'Que se parezca a una foto real (mascota, persona, objeto)', porcentaje: 25 },
    texto:    { nombre: 'Con nombre, fecha o frase escrita', fijo: 3 },
    urgente:  { nombre: 'Lo necesito urgente', porcentaje: 20 }
  }
};
