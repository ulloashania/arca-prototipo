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
