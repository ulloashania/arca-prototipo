(() => {
  const P = window.ARCA_PRECIOS;
  const WHATSAPP = '5354638470'; // confirmar con Rocío
  const form = document.getElementById('encargo');
  if (!P || !form) return;

  const $ = id => document.getElementById(id);
  const tiposBox = $('tipos');
  const coloresBox = $('colores');
  const tamano = $('tamano');
  const tamanoValor = $('tamano-valor');

  // Pintar las opciones a partir de precios.js
  tiposBox.innerHTML = P.tipos.map((t, i) =>
    `<label class="chip"><input type="radio" name="tipo" value="${t.id}"${i === 0 ? ' checked' : ''}><span>${t.nombre}</span></label>`).join('');
  coloresBox.innerHTML = P.extras.colores.map((c, i) =>
    `<label class="chip"><input type="radio" name="colores" value="${c.id}"${i === 0 ? ' checked' : ''}><span>${c.nombre}</span></label>`).join('');
  $('lbl-parecido').textContent = P.extras.parecido.nombre;
  $('lbl-texto').textContent = P.extras.texto.nombre;

  const tipoActual = () => P.tipos.find(t => t.id === form.tipo.value) || P.tipos[0];

  // Precio base de un tipo a un tamaño: "de tanto a tanto", repartido según el tamaño
  function precioBase(tipo, cm) {
    const t = Math.min(1, Math.max(0, (cm - tipo.min) / (tipo.max - tipo.min)));
    return tipo.desde + (tipo.hasta - tipo.desde) * t;
  }

  function calcular(cm) {
    const tipo = tipoActual();
    const color = P.extras.colores.find(c => c.id === form.colores.value) || P.extras.colores[0];
    // Extras en USD por pieza ("de tanto a tanto"); los que no tienen precio no suman
    const elegidos = [color, form.parecido.checked && P.extras.parecido, form.texto.checked && P.extras.texto].filter(Boolean);
    const extraMin = elegidos.reduce((s, x) => s + (x.extra ? x.extra[0] : 0), 0);
    const extraMax = elegidos.reduce((s, x) => s + (x.extra ? x.extra[1] : 0), 0);
    const base = precioBase(tipo, cm);
    const cantidad = Math.max(1, parseInt(form.cantidad.value, 10) || 1);
    return {
      min: redondear((base * (1 - P.margen) + extraMin) * cantidad),
      max: redondear((base * (1 + P.margen) + extraMax) * cantidad)
    };
  }
  const redondear = n => Math.max(1, Math.round(n));
  const rango = r => r.min === r.max ? `${r.min} ${P.moneda}` : `${r.min}–${r.max} ${P.moneda}`;

  function actualizar() {
    const tipo = tipoActual();
    tamano.min = tipo.min; tamano.max = tipo.max;
    const cm = Number(tamano.value);
    tamanoValor.textContent = `${cm} cm`;
    $('precio').textContent = rango(calcular(cm));
    $('precio-detalle').textContent = `${tipo.nombre} · ${cm} cm · ${Math.max(1, parseInt(form.cantidad.value, 10) || 1)} ud.`;
    // Comparar con otros tamaños, para ver qué pasa si se hace más pequeña o más grande
    const otros = [...new Set([tipo.min, 10, 15, 20, 30, tipo.max])]
      .filter(n => n >= tipo.min && n <= tipo.max && n !== cm).sort((a, b) => a - b).slice(0, 4);
    $('comparar').innerHTML = otros.map(n =>
      `<button type="button" class="comparar-op" data-cm="${n}">${n} cm <b>${rango(calcular(n))}</b></button>`).join('');
  }

  $('comparar').addEventListener('click', e => {
    const b = e.target.closest('[data-cm]');
    if (b) { tamano.value = b.dataset.cm; actualizar(); }
  });
  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);

  // Si viene de una pieza de referencia (?pieza=…), apuntarla en la descripción
  const params = new URLSearchParams(location.search);
  if (params.get('pieza')) form.detalles.value = `Me inspira la pieza «${params.get('pieza')}». `;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const tipo = tipoActual();
    const color = P.extras.colores.find(c => c.id === form.colores.value);
    const extras = [form.parecido.checked && P.extras.parecido.nombre, form.texto.checked && P.extras.texto.nombre].filter(Boolean);
    const lineas = [
      'Hola Arca, quiero hacer un encargo:',
      `• Pieza: ${tipo.nombre}`,
      `• Tamaño: ${tamano.value} cm`,
      `• Cantidad: ${form.cantidad.value || 1}`,
      `• Colores: ${color.nombre}`,
      extras.length ? `• Extras: ${extras.join(', ')}` : '',
      form.detalles.value.trim() ? `• Mi idea: ${form.detalles.value.trim()}` : '',
      `• Entrega: ${form.entrega.value}${form.zona.value.trim() ? ' (' + form.zona.value.trim() + ')' : ''}`,
      `• Precio aproximado de la web: ${$('precio').textContent}`,
      `• Me llamo ${form.nombre.value.trim()}`,
      form.parecido.checked ? 'Ahora te mando las fotos de referencia.' : ''
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    $('enviado').hidden = false;
  });

  actualizar();
})();
