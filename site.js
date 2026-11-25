const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }));
}

// Guardar la web en el móvil para la mala conexión (ver sw.js)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

const requestForm = document.getElementById('request-form');
if (requestForm) {
  const params = new URLSearchParams(window.location.search);
  const requestType = document.getElementById('request-type');
  const requestPiece = document.getElementById('request-piece');
  if (requestType && params.has('tipo')) requestType.value = params.get('tipo');
  if (requestPiece && params.has('pieza')) requestPiece.value = params.get('pieza');

  requestForm.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = document.getElementById('form-result');
    result.textContent = `Gracias, ${form.get('nombre')}. Esta maqueta aún no envía ni guarda la solicitud; Arca confirmará disponibilidad, precio y entrega cuando el formulario esté conectado.`;
    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// Que las partes de la portada aparezcan suaves al bajar (ver «Animaciones suaves» en styles.css).
// Con ahorro de datos o «reducir movimiento», no se anima nada.
(() => {
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData);
  if (quieto || !('IntersectionObserver' in window)) return;
  const partes = document.querySelectorAll('.section-heading, .product-card, .custom-art, .custom-copy, .step, .workshop-copy, .story > div, '
    + '.nos-historia > h2, .nos-historia > p:not(.nos-etapas), .nos-etapas > *, .nos-cita, .nos-contacto, ' // Nosotros
    + '.workshop-facts > div, .dark-callout, .faq-list details, ' // Talleres
    + '.condiciones'); // Encargar
  if (!partes.length) return;
  const io = new IntersectionObserver(entradas => entradas.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  partes.forEach(el => {
    // Las que van juntas (tarjetas, pasos) salen una detrás de otra
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--retraso', `${Math.min(i, 4) * 0.12}s`);
    el.classList.add('aparecer');
    io.observe(el);
  });
  document.documentElement.classList.add('animar');
})();
// Tarjetas de la portada: segunda foto al pasar el ratón. Solo en ordenador (con ratón) y sin
// ahorro de datos, y se descarga cuando la página ya ha cargado: en el móvil no cuesta nada.
(() => {
  const cajas = document.querySelectorAll('[data-foto-2]');
  if (!cajas.length || !matchMedia('(hover: hover) and (pointer: fine)').matches || (navigator.connection && navigator.connection.saveData)) return;
  const poner = () => cajas.forEach(caja => {
    const img = new Image();
    img.className = 'foto-2'; img.alt = ''; img.decoding = 'async'; img.src = caja.getAttribute('data-foto-2');
    caja.appendChild(img);
  });
  if (document.readyState === 'complete') setTimeout(poner, 1500);
  else addEventListener('load', () => setTimeout(poner, 1500));
})();