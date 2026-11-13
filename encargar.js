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
  $('lbl-urgente').textContent = P.extras.urgente.nombre;

  const tipoActual = () => P.tipos.find(t => t.id === form.tipo.value) || P.tipos[0];

  // Precio base de un tipo a un tamaño, repartiendo entre los puntos 10/20/30 cm
  function precioBase(tipo, cm) {
    const puntos = Object.keys(tipo.precios).map(Number).sort((a, b) => a - b);
    if (cm <= puntos[0]) return tipo.precios[puntos[0]] * (cm / puntos[0]) ** 0.5;
    for (let i = 1; i < puntos.length; i++) {
      if (cm <= puntos[i]) {
        const a = puntos[i - 1], b = puntos[i];
        return tipo.precios[a] + (tipo.precios[b] - tipo.precios[a]) * (cm - a) / (b - a);
      }
    }
    const a = puntos[puntos.length - 2], b = puntos[puntos.length - 1];
    return tipo.precios[b] + (tipo.precios[b] - tipo.precios[a]) * (cm - b) / (b - a);
  }

  function calcular(cm) {
    const tipo = tipoActual();
    const color = P.extras.colores.find(c => c.id === form.colores.value) || P.extras.colores[0];
    let porcentaje = color.porcentaje;
    if (form.parecido.checked) porcentaje += P.extras.parecido.porcentaje;
    if (form.urgente.checked) porcentaje += P.extras.urgente.porcentaje;
    let pieza = precioBase(tipo, cm) * (1 + porcentaje / 100);
    if (form.texto.checked) pieza += P.extras.texto.fijo;
    const cantidad = Math.max(1, parseInt(form.cantidad.value, 10) || 1);
    const total = pieza * cantidad;
    return { min: redondear(total * (1 - P.margen)), max: redondear(total * (1 + P.margen)) };
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
    const extras = [form.parecido.checked && P.extras.parecido.nombre, form.texto.checked && P.extras.texto.nombre, form.urgente.checked && 'Urgente'].filter(Boolean);
    const lineas = [
      'Hola Arca, quiero hacer un encargo:',
      `• Pieza: ${tipo.nombre}`,
      `• Tamaño: ${tamano.value} cm`,
      `• Cantidad: ${form.cantidad.value || 1}`,
      `• Colores: ${color.nombre}`,
      extras.length ? `• Extras: ${extras.join(', ')}` : '',
      form.detalles.value.trim() ? `• Mi idea: ${form.detalles.value.trim()}` : '',
      form.fecha.value.trim() ? `• Para cuándo: ${form.fecha.value.trim()}` : '',
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
