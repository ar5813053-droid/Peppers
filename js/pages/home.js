import { CONFIG, DEMO_ADDRESSES } from '../data/config.js';
import { CATEGORIES } from '../data/categories.js';
import { getFeaturedProducts } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';
import { searchProducts } from '../services/search.js';
import { getOrders } from '../services/orders.js';
import { addToCart } from '../services/cart.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../router.js';
import { getItem } from '../services/storage.js';

const CATEGORY_ICONS = {
  pizza: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 00-9 9"/><path d="M7 8h.01M12 7h.01M16 10h.01M9 13h.01M14 14h.01"/></svg>`,
  bread: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12c0-3 2-5 4-5h8c2 0 4 2 4 5v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z"/><path d="M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"/></svg>`,
  fries: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 10v10h12V10"/><path d="M8 10V6M12 10V4M16 10V7"/><rect x="5" y="20" width="14" height="2" rx="1"/></svg>`,
  pasta: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16M6 8h12M8 16h8"/><circle cx="12" cy="12" r="9"/></svg>`,
  dessert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v4M8 7h8l1 4H7l1-4z"/><path d="M6 11v7a2 2 0 002 2h8a2 2 0 002-2v-7"/></svg>`,
  drink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3h8l-1 9H9L8 3z"/><path d="M9 12v7a1 1 0 001 1h4a1 1 0 001-1v-7"/><path d="M12 3v2"/></svg>`,
  burger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16M5 9h14a2 2 0 012 2v0a2 2 0 01-2 2H5a2 2 0 01-2-2v0a2 2 0 012-2z"/><path d="M5 15h14v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2z"/><path d="M5 9V7a3 3 0 013-3h8a3 3 0 013 3v2"/></svg>`,
};

export function renderHome(container) {
  const profile = getItem('profile', { name: 'Guest' });
  const address = DEMO_ADDRESSES[0];
  const featured = getFeaturedProducts(6);
  const orders = getOrders();
  const lastOrder = orders[0] || null;

  container.innerHTML = `
    <div class="home-page">
      <!-- Mobile Header -->
      <header class="home-header-mobile" style="padding: var(--space-4) var(--space-4) var(--space-2);">
        <div class="flex items-center justify-between" style="margin-bottom: var(--space-3);">
          <div class="flex items-center gap-2">
            <button class="btn-icon" id="profile-btn" aria-label="Profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
            </button>
            <div>
              <div class="text-xs text-muted">Deliver to</div>
              <button class="font-semibold text-sm flex items-center gap-1" id="address-btn" style="color:var(--color-text)">
                ${address?.line1?.split(',')[0] || 'Select address'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-icon" id="notif-btn" aria-label="Notifications" style="position:relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span style="position:absolute;top:6px;right:6px;width:8px;height:8px;background:var(--color-primary);border-radius:50%;border:2px solid white;"></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Welcome + Search -->
      <section style="padding: 0 var(--space-4) var(--space-4);">
        <div class="card" style="padding: var(--space-4); background: var(--color-surface); border-radius: var(--radius-lg);">
          <div class="flex items-center gap-3" style="margin-bottom: var(--space-3);">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--color-primary-light);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--color-primary);">
              ${(profile.name || 'G')[0].toUpperCase()}
            </div>
            <div>
              <div class="font-semibold">Welcome, ${profile.name || 'Guest'}!</div>
              <div class="text-xs text-muted">Craving pizza today?</div>
            </div>
          </div>
          <div class="search-wrap">
            <span class="search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            </span>
            <input type="search" class="search-input" id="home-search" placeholder="Search Pizzas, Garlic Bread..." autocomplete="off" />
            <button class="search-clear" id="search-clear" aria-label="Clear search">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div id="search-results" class="hidden" style="margin-top: var(--space-3);"></div>
        </div>
      </section>

      <!-- Categories -->
      <section style="margin-bottom: var(--space-5);">
        <div class="category-scroll" id="category-scroll" role="tablist" aria-label="Categories">
          ${CATEGORIES.map(
            (c, i) => `
            <button class="category-chip ${i === 0 ? 'active' : ''}" data-category="${c.id}" role="tab" aria-selected="${i === 0}">
              <span class="category-chip-icon">${CATEGORY_ICONS[c.icon] || CATEGORY_ICONS.pizza}</span>
              <span class="category-chip-label">${c.name}</span>
            </button>
          `
          ).join('')}
        </div>
      </section>

      <!-- Featured -->
      <section style="margin-bottom: var(--space-6);">
        <div class="section-header">
          <h2 class="section-title">Featured Favourites</h2>
          <button class="text-sm text-primary font-medium" id="view-all-btn">View all</button>
        </div>
        <div class="product-grid stagger-enter" id="featured-grid"></div>
      </section>

      <!-- Promo -->
      <section style="padding: 0 var(--space-4); margin-bottom: var(--space-6);">
        <div class="promo-banner">
          <div class="font-bold" style="font-size:1.1rem;margin-bottom:4px;">Flat ₹50 OFF</div>
          <div class="text-sm" style="opacity:0.9;margin-bottom:12px;">Use code PEPPER50 on orders above ₹299</div>
          <button class="btn btn-sm" style="background:white;color:var(--color-primary);" id="promo-menu-btn">View Menu</button>
        </div>
      </section>

      <!-- Last Order -->
      ${
        lastOrder
          ? `
      <section style="padding: 0 var(--space-4); margin-bottom: var(--space-6);">
        <div class="section-header" style="padding-inline:0;">
          <h2 class="section-title">Your Last Order</h2>
        </div>
        <div class="card" style="padding: var(--space-4); display:flex; align-items:center; gap: var(--space-3);">
          <img src="${lastOrder.items?.[0]?.image || featured[0]?.image}" alt="" style="width:56px;height:56px;border-radius:12px;object-fit:cover;" />
          <div style="flex:1;min-width:0;">
            <div class="font-semibold text-sm truncate">${lastOrder.items?.map((i) => i.name).slice(0, 2).join(', ') || 'Order'}</div>
            <div class="text-xs text-muted flex items-center gap-1" style="margin-top:2px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              ${new Date(lastOrder.createdAt).toLocaleDateString()} · ${CONFIG.currency}${lastOrder.grandTotal}
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="reorder-btn">REORDER</button>
        </div>
      </section>
      `
          : ''
      }

      <!-- Footer links -->
      <footer style="padding: var(--space-6) var(--space-4); text-align:center;">
        <img src="assets/images/logo/peppers-pizza-logo.png" alt="Pepper's Pizza" class="footer-logo" width="120" height="40" />
        <div class="flex justify-center gap-4 text-sm text-muted" style="flex-wrap:wrap;margin-bottom:var(--space-3);">
          <a href="#/about">About</a>
          <a href="#/contact">Contact</a>
          <a href="#/privacy">Privacy</a>
          <a href="#/terms">Terms</a>
          <a href="#/faq">Help</a>
          <a href="#/admin" class="text-xs">Admin Demo</a>
        </div>
        <p class="text-xs text-muted">${CONFIG.brandName} · ${CONFIG.location} · Demo Frontend</p>
      </footer>
    </div>
  `;

  // Render featured products
  const grid = container.querySelector('#featured-grid');
  featured.forEach((p) => grid.appendChild(createProductCard(p)));

  // Search
  const searchInput = container.querySelector('#home-search');
  const searchClear = container.querySelector('#search-clear');
  const searchResults = container.querySelector('#search-results');

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    searchClear.classList.toggle('visible', q.length > 0);
    if (!q) {
      searchResults.classList.add('hidden');
      searchResults.innerHTML = '';
      return;
    }
    const results = searchProducts(q).slice(0, 6);
    searchResults.classList.remove('hidden');
    if (results.length === 0) {
      searchResults.innerHTML = `<p class="text-sm text-muted" style="padding:8px 0;">No results for "${q}"</p>`;
      return;
    }
    searchResults.innerHTML = results
      .map(
        (p) => `
      <button class="flex items-center gap-3" style="width:100%;padding:8px 0;text-align:left;border-bottom:1px solid var(--color-border);" data-id="${p.id}">
        <img src="${p.image}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" />
        <div style="flex:1;min-width:0;">
          <div class="text-sm font-medium truncate">${p.name}</div>
          <div class="text-xs text-muted">${CONFIG.currency}${p.sizes[p.defaultSize]?.price}</div>
        </div>
      </button>
    `
      )
      .join('');
    searchResults.querySelectorAll('[data-id]').forEach((btn) => {
      btn.addEventListener('click', () => navigate(`/product/${btn.dataset.id}`));
    });
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    searchResults.classList.add('hidden');
    searchResults.innerHTML = '';
    searchInput.focus();
  });

  // Category chips
  container.querySelectorAll('.category-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.category-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      navigate(`/discover?category=${chip.dataset.category}`);
    });
  });

  // Buttons
  container.querySelector('#profile-btn')?.addEventListener('click', () => navigate('/profile'));
  container.querySelector('#notif-btn')?.addEventListener('click', () => navigate('/notifications'));
  container.querySelector('#view-all-btn')?.addEventListener('click', () => navigate('/discover'));
  container.querySelector('#promo-menu-btn')?.addEventListener('click', () => navigate('/discover'));
  container.querySelector('#address-btn')?.addEventListener('click', () => {
    showToast('Address selector – demo only. Edit in Profile.', 'default');
  });

  container.querySelector('#reorder-btn')?.addEventListener('click', () => {
    if (!lastOrder?.items) return;
    lastOrder.items.forEach((item) => {
      addToCart({
        productId: item.productId,
        size: item.size,
        qty: item.qty,
        crust: item.crust,
        extras: item.extras || [],
        unitPrice: item.unitPrice,
      });
    });
    showToast('Items added to cart', 'success');
    navigate('/cart');
  });
}
