import { CONFIG, DEMO_COUPONS } from '../data/config.js';
import {
  getCart,
  updateQty,
  removeItem,
  clearCart,
  getCartSubtotal,
  getDeliveryFee,
  subscribe,
} from '../services/cart.js';
import { showToast } from '../components/toast.js';
import { openModal } from '../components/modal.js';
import { navigate } from '../router.js';

export function renderCart(container) {
  let appliedCoupon = null;

  function render() {
    const cart = getCart();
    const subtotal = getCartSubtotal();
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'flat') {
        discount = Math.min(appliedCoupon.value, subtotal);
      } else {
        discount = Math.min(
          Math.round((subtotal * appliedCoupon.value) / 100),
          appliedCoupon.maxDiscount || Infinity
        );
      }
      if (subtotal < (appliedCoupon.minOrder || 0)) discount = 0;
    }
    const delivery = getDeliveryFee(subtotal);
    const grand = Math.max(0, subtotal - discount + delivery);

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding-top:80px;">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M6 6L5 3H2"/></svg>
          </div>
          <h2 class="empty-state-title">Your cart is empty</h2>
          <p class="empty-state-text">Looks like you haven't added anything yet. Explore our menu!</p>
          <button class="btn btn-primary" id="continue-btn">Continue Shopping</button>
        </div>
      `;
      container.querySelector('#continue-btn')?.addEventListener('click', () => navigate('/discover'));
      return;
    }

    container.innerHTML = `
      <div class="cart-page" style="padding: var(--space-4); padding-bottom: 140px;">
        <div class="flex items-center justify-between" style="margin-bottom: var(--space-4);">
          <h1 class="font-bold" style="font-size:1.35rem;">Your Cart</h1>
          <button class="text-sm text-muted" id="clear-cart">Clear all</button>
        </div>

        <div id="cart-items" class="flex-col gap-3" style="display:flex;flex-direction:column;gap:12px;margin-bottom:var(--space-5);">
          ${cart
            .map(
              (item) => `
            <div class="card" style="padding: var(--space-3); display:flex; gap:12px; align-items:flex-start;" data-id="${item.id}">
              <img src="${item.image}" alt="${item.name}" style="width:72px;height:72px;border-radius:12px;object-fit:cover;flex-shrink:0;"
                   onerror="this.src='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop'" />
              <div style="flex:1;min-width:0;">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="font-semibold text-sm">${item.name}</div>
                    <div class="text-xs text-muted">${item.sizeLabel}${item.crust ? ' · ' + item.crust : ''}</div>
                    ${
                      item.extras?.length
                        ? `<div class="text-xs text-muted">${item.extras.map((e) => e.name).join(', ')}</div>`
                        : ''
                    }
                  </div>
                  <button class="text-muted remove-item" data-id="${item.id}" aria-label="Remove" style="padding:4px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="flex items-center justify-between" style="margin-top:8px;">
                  <span class="font-semibold text-sm">${CONFIG.currency}${item.unitPrice * item.qty}</span>
                  <div class="qty-selector">
                    <button class="qty-btn qty-dec" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn qty-inc" data-id="${item.id}">+</button>
                  </div>
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Coupon -->
        <div class="card" style="padding: var(--space-4); margin-bottom: var(--space-4);">
          <div class="flex gap-2">
            <input type="text" class="form-input" id="coupon-input" placeholder="Coupon code" style="flex:1;text-transform:uppercase;" value="${appliedCoupon?.code || ''}" />
            <button class="btn btn-secondary" id="apply-coupon">${appliedCoupon ? 'Change' : 'Apply'}</button>
          </div>
          ${appliedCoupon ? `<p class="text-xs text-primary" style="margin-top:8px;">${appliedCoupon.description}</p>` : ''}
          <div class="text-xs text-muted" style="margin-top:8px;">Try: PEPPER50, FIRST100, SAVE20</div>
        </div>

        <!-- Summary -->
        <div class="card" style="padding: var(--space-4);">
          <div class="flex justify-between text-sm" style="margin-bottom:8px;">
            <span class="text-muted">Subtotal</span>
            <span>${CONFIG.currency}${subtotal}</span>
          </div>
          ${
            discount > 0
              ? `<div class="flex justify-between text-sm" style="margin-bottom:8px;color:var(--color-success);">
            <span>Discount</span>
            <span>−${CONFIG.currency}${discount}</span>
          </div>`
              : ''
          }
          <div class="flex justify-between text-sm" style="margin-bottom:8px;">
            <span class="text-muted">Delivery</span>
            <span>${delivery === 0 ? 'FREE' : CONFIG.currency + delivery}</span>
          </div>
          <div style="border-top:1px solid var(--color-border);padding-top:10px;margin-top:4px;" class="flex justify-between font-semibold">
            <span>Total</span>
            <span id="grand-total">${CONFIG.currency}${grand}</span>
          </div>
          ${
            subtotal < CONFIG.minOrder
              ? `<p class="text-xs" style="color:var(--color-error);margin-top:8px;">Minimum order ${CONFIG.currency}${CONFIG.minOrder}</p>`
              : ''
          }
        </div>
      </div>

      <div class="sticky-bottom">
        <button class="btn btn-primary btn-lg" id="checkout-btn" style="width:100%;" ${subtotal < CONFIG.minOrder ? 'disabled' : ''}>
          Proceed to Checkout · ${CONFIG.currency}${grand}
        </button>
      </div>
    `;

    // Events
    container.querySelectorAll('.qty-inc').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = cart.find((i) => i.id === btn.dataset.id);
        if (item) updateQty(item.id, item.qty + 1);
      });
    });
    container.querySelectorAll('.qty-dec').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = cart.find((i) => i.id === btn.dataset.id);
        if (item) updateQty(item.id, item.qty - 1);
      });
    });
    container.querySelectorAll('.remove-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        removeItem(btn.dataset.id);
        showToast('Item removed');
      });
    });
    container.querySelector('#clear-cart')?.addEventListener('click', () => {
      openModal({
        title: 'Clear cart?',
        content: `
          <p class="text-sm text-muted" style="margin-bottom:20px;">This will remove all items from your cart.</p>
          <div class="flex gap-3">
            <button class="btn btn-secondary" style="flex:1;" id="modal-cancel">Cancel</button>
            <button class="btn btn-primary" style="flex:1;background:var(--color-error);" id="modal-confirm">Clear</button>
          </div>
        `,
      });
      setTimeout(() => {
        document.getElementById('modal-cancel')?.addEventListener('click', () => {
          document.querySelector('.modal-overlay')?.classList.remove('open');
          setTimeout(() => document.querySelector('.modal-overlay')?.remove(), 280);
        });
        document.getElementById('modal-confirm')?.addEventListener('click', () => {
          clearCart();
          appliedCoupon = null;
          document.querySelector('.modal-overlay')?.classList.remove('open');
          setTimeout(() => document.querySelector('.modal-overlay')?.remove(), 280);
          showToast('Cart cleared');
        });
      }, 50);
    });

    container.querySelector('#apply-coupon')?.addEventListener('click', () => {
      const code = (container.querySelector('#coupon-input')?.value || '').trim().toUpperCase();
      if (!code) {
        appliedCoupon = null;
        render();
        return;
      }
      const coupon = DEMO_COUPONS.find((c) => c.code === code);
      if (!coupon) {
        showToast('Invalid coupon code', 'error');
        return;
      }
      if (subtotal < coupon.minOrder) {
        showToast(`Min order ${CONFIG.currency}${coupon.minOrder} required`, 'error');
        return;
      }
      appliedCoupon = coupon;
      showToast(`Coupon ${code} applied`, 'success');
      render();
    });

    container.querySelector('#checkout-btn')?.addEventListener('click', () => {
      sessionStorage.setItem(
        'checkout_coupon',
        appliedCoupon ? JSON.stringify(appliedCoupon) : ''
      );
      navigate('/checkout');
    });
  }

  render();
  const unsub = subscribe(() => render());
  // Cleanup when navigating away is handled by page replace
}
