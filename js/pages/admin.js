import { CONFIG } from '../data/config.js';
import { PRODUCTS } from '../data/products.js';
import { getOrders, updateOrderStatus, getDemoSalesTotal } from '../services/orders.js';
import { clearAllDemoData } from '../services/storage.js';
import { showToast } from '../components/toast.js';
import { openModal } from '../components/modal.js';
import { navigate } from '../router.js';

export function renderAdmin(container) {
  const orders = getOrders();
  const sales = getDemoSalesTotal();

  container.innerHTML = `
    <div style="padding: var(--space-4);">
      <div class="card" style="padding: var(--space-4); margin-bottom: var(--space-4); background: #FFF3E0; border: 1px solid #FFB74D;">
        <p class="font-semibold text-sm" style="color:#E65100;">⚠️ DEMO ADMIN ONLY</p>
        <p class="text-xs" style="margin-top:4px;color:#BF360C;">This is a local frontend demonstration. There is no real authentication or server. Do not use for production. Real systems require server-side auth, authorization and a database.</p>
      </div>

      <h1 class="font-bold" style="font-size:1.35rem;margin-bottom:var(--space-4);">Admin Dashboard</h1>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:var(--space-5);">
        <div class="card" style="padding:var(--space-4);">
          <div class="text-xs text-muted">Demo Sales</div>
          <div class="font-bold" style="font-size:1.3rem;">${CONFIG.currency}${sales}</div>
        </div>
        <div class="card" style="padding:var(--space-4);">
          <div class="text-xs text-muted">Orders</div>
          <div class="font-bold" style="font-size:1.3rem;">${orders.length}</div>
        </div>
      </div>

      <h2 class="font-semibold text-sm" style="margin-bottom:12px;">Recent Orders</h2>
      <div style="margin-bottom:var(--space-5);">
        ${
          orders.length === 0
            ? `<p class="text-sm text-muted">No demo orders yet.</p>`
            : orders
                .slice(0, 8)
                .map(
                  (o) => `
            <div class="card" style="padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <div>
                <div class="text-sm font-medium">${o.id}</div>
                <div class="text-xs text-muted">${CONFIG.currency}${o.grandTotal} · ${o.status}</div>
              </div>
              <select class="form-select status-select" data-id="${o.id}" style="width:auto;padding:4px 8px;font-size:0.75rem;">
                ${['placed', 'confirmed', 'preparing', 'ready', 'out', 'completed', 'cancelled']
                  .map((s) => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`)
                  .join('')}
              </select>
            </div>
          `
                )
                .join('')
        }
      </div>

      <h2 class="font-semibold text-sm" style="margin-bottom:12px;">Products (${PRODUCTS.length})</h2>
      <p class="text-xs text-muted" style="margin-bottom:12px;">Product data lives in <code>js/data/products.js</code>. Editing here updates local view only for this session unless you persist changes yourself.</p>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:var(--space-5);">
        ${PRODUCTS.slice(0, 12)
          .map(
            (p) => `
          <div class="flex items-center gap-2" style="padding:8px 0;border-bottom:1px solid var(--color-border);">
            <img src="${p.image}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" alt="" />
            <div style="flex:1;min-width:0;">
              <div class="text-sm font-medium truncate">${p.name}</div>
              <div class="text-xs text-muted">${p.category} · ${CONFIG.currency}${p.sizes[p.defaultSize]?.price}</div>
            </div>
            <span class="text-xs ${p.available ? 'text-primary' : 'text-muted'}">${p.available ? 'Active' : 'Off'}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <button class="btn btn-secondary" id="reset-demo" style="width:100%;margin-bottom:12px;">Reset All Demo Data</button>
      <button class="btn btn-ghost" id="back-home" style="width:100%;">← Back to App</button>
    </div>
  `;

  container.querySelectorAll('.status-select').forEach((sel) => {
    sel.addEventListener('change', () => {
      updateOrderStatus(sel.dataset.id, sel.value);
      showToast(`Order status → ${sel.value}`, 'success');
    });
  });

  container.querySelector('#reset-demo')?.addEventListener('click', () => {
    openModal({
      title: 'Reset demo data?',
      content: `
        <p class="text-sm text-muted" style="margin-bottom:20px;">This clears cart, orders, profile, wishlist and notifications from localStorage.</p>
        <div class="flex gap-3">
          <button class="btn btn-secondary" style="flex:1;" id="cancel-reset">Cancel</button>
          <button class="btn btn-primary" style="flex:1;background:var(--color-error);" id="confirm-reset">Reset</button>
        </div>
      `,
    });
    setTimeout(() => {
      document.getElementById('cancel-reset')?.addEventListener('click', () => {
        document.querySelector('.modal-overlay')?.remove();
      });
      document.getElementById('confirm-reset')?.addEventListener('click', () => {
        clearAllDemoData();
        document.querySelector('.modal-overlay')?.remove();
        showToast('Demo data cleared', 'success');
        setTimeout(() => location.reload(), 500);
      });
    }, 50);
  });

  container.querySelector('#back-home')?.addEventListener('click', () => navigate('/'));
}
