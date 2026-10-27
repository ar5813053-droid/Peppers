import { getCartCount, subscribe } from '../services/cart.js';
import { navigate, getCurrentPath } from '../router.js';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/discover', label: 'Discover', icon: 'discover' },
  { path: '/cart', label: 'Cart', icon: 'cart' },
  { path: '/orders', label: 'Orders', icon: 'orders' },
  { path: '/profile', label: 'Profile', icon: 'profile' },
];

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>`,
  discover: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M6 6L5 3H2"/></svg>`,
  orders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>`,
};

export function initNavigation() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  nav.innerHTML = NAV_ITEMS.map(
    (item) => `
    <button class="nav-item" data-path="${item.path}" aria-label="${item.label}">
      <span class="nav-icon">${ICONS[item.icon]}</span>
      <span class="nav-label">${item.label}</span>
      ${item.path === '/cart' ? '<span class="cart-badge" id="cart-badge">0</span>' : ''}
    </button>
  `
  ).join('');

  nav.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.path);
    });
  });

  updateActive();
  updateBadge(getCartCount());

  window.addEventListener('hashchange', updateActive);
  subscribe((cart) => {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    updateBadge(count);
  });
}

function updateActive() {
  const path = getCurrentPath();
  document.querySelectorAll('.nav-item').forEach((btn) => {
    const p = btn.dataset.path;
    const active =
      p === path ||
      (p === '/discover' && path.startsWith('/product')) ||
      (p === '/orders' && path.startsWith('/tracking'));
    btn.classList.toggle('active', active);
  });

  // Desktop nav
  document.querySelectorAll('.desktop-nav a').forEach((a) => {
    const p = a.getAttribute('href')?.replace('#', '') || '/';
    a.classList.toggle('active', p === path || (p === '/discover' && path.startsWith('/product')));
  });
}

function updateBadge(count) {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent = count > 99 ? '99+' : count;
  badge.classList.toggle('visible', count > 0);
  if (count > 0) {
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  }
}

export function updateNavBadge() {
  updateBadge(getCartCount());
}
