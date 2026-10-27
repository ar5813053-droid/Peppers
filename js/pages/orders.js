import { CONFIG } from '../data/config.js';
import { getOrders } from '../services/orders.js';
import { addToCart } from '../services/cart.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../router.js';

const STATUS_CLASS = {
  placed: 'status-placed',
  confirmed: 'status-confirmed',
  preparing: 'status-preparing',
  ready: 'status-ready',
  out: 'status-out',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
};

const STATUS_LABEL = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  out: 'Out for delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function renderOrders(container) {
  const orders = getOrders();

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding-top:80px;">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        </div>
        <h2 class="empty-state-title">No orders yet</h2>
        <p class="empty-state-text">Your demo order history will appear here after you place an order.</p>
        <button class="btn btn-primary" id="browse-btn">Browse Menu</button>
      </div>
    `;
    container.querySelector('#browse-btn')?.addEventListener('click', () => navigate('/discover'));
    return;
  }

  container.innerHTML = `
    <div style="padding: var(--space-4);">
      <h1 class="font-bold" style="font-size:1.35rem;margin-bottom:var(--space-4);">Orders</h1>
      <div class="flex-col gap-3" style="display:flex;flex-direction:column;gap:12px;">
        ${orders
          .map(
            (o) => `
          <div class="card" style="padding: var(--space-4);">
            <div class="flex items-center justify-between" style="margin-bottom:8px;">
              <span class="font-semibold text-sm">${o.id}</span>
              <span class="status-badge ${STATUS_CLASS[o.status] || ''}">${STATUS_LABEL[o.status] || o.status}</span>
            </div>
            <div class="text-xs text-muted" style="margin-bottom:8px;">
              ${new Date(o.createdAt).toLocaleString()} · ${o.type === 'pickup' ? 'Pickup' : 'Delivery'}
            </div>
            <div class="text-sm" style="margin-bottom:12px;">
              ${o.items
                ?.slice(0, 3)
                .map((i) => `${i.qty}× ${i.name}`)
                .join(', ')}
              ${o.items?.length > 3 ? '…' : ''}
            </div>
            <div class="flex items-center justify-between">
              <span class="font-semibold">${CONFIG.currency}${o.grandTotal}</span>
              <div class="flex gap-2">
                <button class="btn btn-outline btn-sm track-btn" data-id="${o.id}">Track</button>
                <button class="btn btn-secondary btn-sm reorder-btn" data-id="${o.id}">Reorder</button>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.track-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigate(`/tracking/${btn.dataset.id}`));
  });

  container.querySelectorAll('.reorder-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const order = orders.find((o) => o.id === btn.dataset.id);
      if (!order?.items) return;
      order.items.forEach((item) => {
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
  });
}
