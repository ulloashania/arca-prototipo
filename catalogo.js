(() => {
  const catalog = window.ARCA_CATALOG || [];
  const grid = document.getElementById('reference-grid');
  const countLabel = document.getElementById('reference-count');
  const search = document.getElementById('catalog-search');
  const filters = [...document.querySelectorAll('[data-catalog-filter]')];
  const moreButton = document.getElementById('catalog-more');
  const emptyMessage = document.getElementById('catalog-empty');
  if (!grid || !countLabel) return;

  const batchSize = 24;
  let activeCategory = 'all';
  let query = '';
  let visibleCount = batchSize;
  let anteriores = 0; // tarjetas que ya estaban antes de «Ver más» (esas no se animan otra vez)
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function currentItems() {
    const needle = normalize(query.trim());
    return catalog.filter(item => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const textMatch = !needle || normalize(`${item.name} ${item.categoryLabel} ${item.ref || ''}`).includes(needle);
      return categoryMatch && textMatch;
    });
  }

  function updateFilterCounts() {
    const needle = normalize(query.trim());
    const base = catalog.filter(item => !needle || normalize(`${item.name} ${item.categoryLabel}`).includes(needle));
    filters.forEach(button => {
      const key = button.dataset.catalogFilter;
      const amount = key === 'all' ? base.length : base.filter(item => item.category === key).length;
      const label = button.dataset.label;
      button.textContent = `${label} (${amount})`;
    });
  }

  function render() {
    const matches = currentItems();
    const shown = matches.slice(0, visibleCount);
    // Las tarjetas nuevas (al cargar, filtrar o tocar «Ver más») entran en cascada
    const desde = anteriores; anteriores = 0;
    grid.innerHTML = shown.map((item, i) => {
      const nueva = i >= desde ? ` nueva" style="--i:${Math.min(i - desde, 12)}` : '';
      const source = item.source === 'studio' ? 'studio' : (item.source === 'original' ? 'original' : 'cutout');
      // A la calculadora le llega la pieza exacta: nombre, referencia, tipo y foto
      const href = `encargar.html?pieza=${encodeURIComponent(item.name)}${item.ref ? '&ref=' + encodeURIComponent(item.ref) : ''}&tipo=${encodeURIComponent(item.category)}&foto=${encodeURIComponent(item.image)}#encargo`;
      return `<article class="reference-card${nueva}" data-source="${source}" data-category="${escapeHtml(item.category)}" data-id="${escapeHtml(item.id)}">
        <div class="reference-image"><img loading="lazy" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)} de cerámica, pieza de referencia de Arca"></div>
        <div class="reference-info"><small>${escapeHtml(item.categoryLabel)} · Por encargo${item.ref ? ' · Ref. ' + escapeHtml(item.ref) : ''}</small><h3>${escapeHtml(item.name)}</h3><a href="${href}" data-pieza="${escapeHtml(item.name)}">Encargar algo así ↗︎</a></div>
      </article>`;
    }).join('');
    countLabel.textContent = matches.length ? `Mostrando ${shown.length} de ${matches.length} piezas` : 'No encontramos piezas con esa búsqueda';
    emptyMessage.style.display = matches.length ? 'none' : 'block';
    moreButton.hidden = shown.length >= matches.length;
    moreButton.textContent = `Ver más piezas (${matches.length - shown.length})`;
    updateFilterCounts();
  }

  filters.forEach(button => button.addEventListener('click', () => {
    activeCategory = button.dataset.catalogFilter;
    visibleCount = batchSize;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    render();
  }));
  search.addEventListener('input', () => { query = search.value; visibleCount = batchSize; render(); });
  moreButton.addEventListener('click', () => { anteriores = visibleCount; visibleCount += batchSize; render(); });
  render();
})();
