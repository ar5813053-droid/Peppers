import { CONFIG } from '../data/config.js';
import { CATEGORIES } from '../data/categories.js';
import { searchProducts } from '../services/search.js';
import { createProductCard } from '../components/product-card.js';
import { getQuery, navigate } from '../router.js';

export function renderDiscover(container) {
  const query = getQuery();
  let filters = {
    category: query.category || '',
    vegOnly: false,
    sort: 'popularity',
    q: '',
  };

  container.innerHTML = `
    <div class="discover-page" style="padding-top: var(--space-4);">
      <div style="padding: 0 var(--space-4) var(--space-3);">
        <h1 class="font-bold" style="font-size:1.4rem;margin-bottom:var(--space-3);">Menu</h1>
        <div class="search-wrap">
          <span class="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </span>
          <input type="search" class="search-input" id="discover-search" placeholder="Search menu..." autocomplete="off" />
        </div>
      </div>

      <div class="category-scroll" style="margin-bottom: var(--space-3);" id="discover-cats">
        <button class="category-chip ${!filters.category ? 'active' : ''}" data-category="">
          <span class="category-chip-label">All</span>
        </button>
        ${CATEGORIES.map(
          (c) => `
          <button class="category-chip ${filters.category === c.id ? 'active' : ''}" data-category="${c.id}">
            <span class="category-chip-label">${c.name}</span>
          </button>
        `
        ).join('')}
      </div>

      <div style="padding: 0 var(--space-4); margin-bottom: var(--space-3); display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <select id="sort-select" class="form-select" style="width:auto;padding:6px 12px;font-size:0.8rem;border-radius:999px;">
          <option value="popularity">Popular</option>
          <option value="rating">Top Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <button class="option-chip" id="veg-filter">Veg Only</button>
        <button class="text-xs text-muted" id="clear-filters">Clear filters</button>
        <span class="text-xs text-muted" id="product-count" style="margin-left:auto;"></span>
      </div>

      <div class="product-grid stagger-enter" id="discover-grid"></div>
      <div id="discover-empty" class="hidden"></div>
    </div>
  `;

  const grid = container.querySelector('#discover-grid');
  const empty = container.querySelector('#discover-empty');
  const countEl = container.querySelector('#product-count');

  function render() {
    const results = searchProducts(filters.q, {
      category: filters.category || undefined,
      vegOnly: filters.vegOnly,
      sort: filters.sort,
    });

    grid.innerHTML = '';
    if (results.length === 0) {
      empty.classList.remove('hidden');
      empty.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </div>
          <h2 class="empty-state-title">No items found</h2>
          <p class="empty-state-text">Try a different search or clear filters.</p>
        </div>
      `;
      countEl.textContent = '0 items';
      return;
    }
    empty.classList.add('hidden');
    results.forEach((p) => grid.appendChild(createProductCard(p)));
    countEl.textContent = `${results.length} item${results.length !== 1 ? 's' : ''}`;
  }

  render();

  // Search
  let searchTimer;
  container.querySelector('#discover-search').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      filters.q = e.target.value;
      render();
    }, 200);
  });

  // Categories
  container.querySelectorAll('#discover-cats .category-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('#discover-cats .category-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      filters.category = chip.dataset.category;
      render();
    });
  });

  // Sort
  container.querySelector('#sort-select').addEventListener('change', (e) => {
    filters.sort = e.target.value;
    render();
  });

  // Veg filter
  const vegBtn = container.querySelector('#veg-filter');
  vegBtn.addEventListener('click', () => {
    filters.vegOnly = !filters.vegOnly;
    vegBtn.classList.toggle('active', filters.vegOnly);
    render();
  });

  // Clear
  container.querySelector('#clear-filters').addEventListener('click', () => {
    filters = { category: '', vegOnly: false, sort: 'popularity', q: '' };
    container.querySelector('#discover-search').value = '';
    container.querySelector('#sort-select').value = 'popularity';
    vegBtn.classList.remove('active');
    container.querySelectorAll('#discover-cats .category-chip').forEach((c) => {
      c.classList.toggle('active', c.dataset.category === '');
    });
    render();
  });
}
