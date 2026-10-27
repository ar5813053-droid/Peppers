import { CONFIG } from '../data/config.js';
import { getOrderById, updateOrderStatus } from '../services/orders.js';
import { navigate } from '../router.js';

const STEPS_DELIVERY = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'out', label: 'Out for Delivery' },
  { key: 'completed', label: 'Delivered' },
];

const STEPS_PICKUP = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready for Pickup' },
  { key: 'completed', label: 'Picked Up' },
];

export function renderTracking(container, params) {
  const order = getOrderById(params.id);

  if (!order) {
    container.innerHTML = `
      <div class="empty-state">
        <h2 class="empty-state-title">Order not found</h2>
        <button class="btn btn-primary" id="back-orders">Back to Orders</button>
      </div>
    `;
    container.querySelector('#back-orders')?.addEventListener('click', () => navigate('/orders'));
    return;
  }

  const steps = order.type === 'pickup' ? STEPS_PICKUP : STEPS_DELIVERY;
  const currentIdx = steps.findIndex((s) => s.key === order.status);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  container.innerHTML = `
    <div style="padding: var(--space-4);">
      <button class="btn btn-ghost btn-sm" id="back-btn" style="margin-bottom:var(--space-3);">← Orders</button>
      <h1 class="font-bold" style="font-size:1.35rem;margin-bottom:4px;">Track Order</h1>
      <p class="text-sm text-muted" style="margin-bottom:var(--space-4);">${order.id}</p>

      <div class="card" style="padding: var(--space-4); margin-bottom: var(--space-5); background: var(--color-primary-light);">
        <p class="text-sm font-medium" style="color:var(--color-primary);">DEMO MODE</p>
        <p class="text-xs text-muted" style="margin-top:4px;">This is a frontend simulation. No real kitchen or delivery is involved. Use the buttons below to simulate status changes.</p>
      </div>

      <div class="card" style="padding: var(--space-5); margin-bottom: var(--space-5);">
        <div class="timeline">
          ${steps
            .map((step, i) => {
              let cls = '';
              if (i < activeIdx) cls = 'completed';
              else if (i === activeIdx) cls = 'active';
              return `
              <div class="timeline-item ${cls}">
                <div class="timeline-dot"></div>
                <div class="timeline-label">${step.label}</div>
                ${
                  i === activeIdx
                    ? `<div class="timeline-time">Current · Est. ${CONFIG.demoPrepTimeMin}–${CONFIG.demoPrepTimeMax} min (demo)</div>`
                    : ''
                }
              </div>
            `;
            })
            .join('')}
        </div>
      </div>

      <div class="card" style="padding: var(--space-4); margin-bottom: var(--space-5);">
        <h3 class="font-semibold text-sm" style="margin-bottom:12px;">Order Summary</h3>
        ${order.items
          ?.map(
            (i) => `
          <div class="flex justify-between text-sm" style="margin-bottom:6px;">
            <span>${i.qty}× ${i.name}</span>
            <span>${CONFIG.currency}${i.unitPrice * i.qty}</span>
          </div>
        `
          )
          .join('')}
        <div class="flex justify-between font-semibold" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--color-border);">
          <span>Total</span>
          <span>${CONFIG.currency}${order.grandTotal}</span>
        </div>
      </div>

      <div class="card" style="padding: var(--space-4);">
        <h3 class="font-semibold text-sm" style="margin-bottom:12px;">Simulate Status (Demo)</h3>
        <div class="flex gap-2" style="flex-wrap:wrap;">
          ${steps
            .map(
              (s) => `
            <button class="btn btn-sm ${s.key === order.status ? 'btn-primary' : 'btn-secondary'} sim-status" data-status="${s.key}">
              ${s.label}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;

  container.querySelector('#back-btn')?.addEventListener('click', () => navigate('/orders'));

  container.querySelectorAll('.sim-status').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateOrderStatus(order.id, btn.dataset.status);
      renderTracking(container, params);
    });
  });
}
