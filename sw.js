// Service worker: guarda la web en el mÃ³vil para que la segunda vez abra al instante
// y la calculadora funcione aunque se caiga internet. Al cambiar archivos, sube VERSION.
const VERSION = 'arca-v21';
const BASICO = [
  './', 'index.html', 'encargar.html', 'talleres.html', 'nosotros.html', 'piezas.html',
  'styles.css', 'site.js', 'precios.js', 'encargar.js', 'catalogo.js', 'catalogo-data.js',
  'public/fonts/dm-sans-latin-wght-normal.woff2', 'public/fonts/playfair-display-latin-wght-normal.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASICO)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  const guardar = res => {
    if (res.ok) { const copia = res.clone(); caches.open(VERSION).then(c => c.put(req, copia)); }
    return res;
  };
  // Fotos y fuentes: casi nunca cambian, primero lo guardado
  if (/\.(webp|png|jpe?g|svg|woff2)$/.test(url.pathname)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(guardar)));
    return;
  }
  // PÃ¡ginas, estilos y scripts: primero internet (para ver lo Ãºltimo). Si falla, o tarda
  // mÃ¡s de 4 segundos y ya lo tenemos guardado, lo guardado.
  const guardado = () => caches.match(req, { ignoreSearch: req.mode === 'navigate' });
  const red = fetch(req).then(guardar);
  e.respondWith(new Promise(resolve => {
    let hecho = false;
    const usar = r => { if (!hecho && r) { hecho = true; resolve(r); } };
    red.then(usar).catch(() => guardado().then(r => usar(r || Response.error())));
    setTimeout(() => guardado().then(usar), 4000);
  }));
});
