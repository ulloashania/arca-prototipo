// PRECIOS DE ROCÍO (17/11/2026), siempre en USD: ella lo pasa a CUP con cada cliente.
// Cada tipo de pieza va "de tanto a tanto", como lo piensa Rocío:
//   min / max:     el tamaño más pequeño y el más grande que hace (en cm)
//   desde / hasta: lo que cobra por el más pequeño y por el más grande (en USD)
// Entre medias, la calculadora reparte la diferencia según el tamaño.
window.ARCA_PRECIOS = {
  moneda: 'USD',
  margen: 0.15, // el aproximado se enseña como un rango de ±15 %
  tipos: [
    { id: 'adorno',     nombre: 'Figura, adorno u otra idea',                                    min: 8,  max: 30, desde: 8,  hasta: 20 },
    { id: 'mascota',    nombre: 'Figura de tu mascota',                                          min: 10, max: 20, desde: 10, hasta: 20 },
    { id: 'accesorios', nombre: 'Porta accesorios, joyero, porta incienso, porta velas o cenicero', min: 8,  max: 30, desde: 7,  hasta: 15 },
    { id: 'maceta',     nombre: 'Organizador o maceta',                                          min: 8,  max: 30, desde: 8,  hasta: 20 },
    { id: 'fotos',      nombre: 'Porta fotos',                                                   min: 5,  max: 10, desde: 3,  hasta: 5 }
  ],
  // Lo que sube el precio, en USD por pieza: "extra: [de, a]".
  // Lo que no lleva "extra" se apunta en el encargo pero no cambia el precio.
  extras: {
    colores: [
      { id: 'pocos',    nombre: '1 o 2 colores' },
      { id: 'varios',   nombre: 'Varios colores',             extra: [1, 2] },
      { id: 'detalle',  nombre: 'Pintura con mucho detalle',  extra: [1, 2] }
    ],
    parecido: { nombre: 'Que se parezca a una foto real (mascota, persona, objeto)' },
    texto:    { nombre: 'Con nombre, fecha o frase escrita' }
  }
};
