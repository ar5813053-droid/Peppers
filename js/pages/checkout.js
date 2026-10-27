import { CONFIG, DEMO_ADDRESSES } from '../data/config.js';
import {
  getCart,
  getCartSubtotal,
  getDeliveryFee,
  clearCart,
} from '../services/cart.js';
import { createOrder } from '../services/orders.js';
import { getItem, setItem } from '../services/storage.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../router.js';

export function renderCheckout(container) {
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2 class="empty-state-title">Cart is empty</h2>
        <button class="btn btn-primary" id="go-menu">Browse Menu</button>
      </div>
    `;
    container.querySelector('#go-menu')?.addEventListener('click', () => navigate('/discover'));
    return;
  }

  let orderType = 'delivery';
  const profile = getItem('profile', { name: '', phone: '', email: '' });
  let coupon = null;
  try {
    const raw = sessionStorage.getItem('checkout_coupon');
    if (raw) coupon = JSON.parse(raw);
  } catch {}

  const subtotal = getCartSubtotal();
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'flat') discount = Math.min(coupon.value, subtotal);
    else discount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount || Infinity);
    if (subtotal < (coupon.minOrder || 0)) discount = 0;
  }
  const delivery = orderType === 'delivery' ? getDeliveryFee(subtotal) : 0;
  const grand = Math.max(0, subtotal - discount + delivery);

  container.innerHTML = `
    <div class="checkout-page" style="padding: var(--space-4); padding-bottom: 120px;">
      <h1 class="font-bold" style="font-size:1.35rem;margin-bottom:var(--space-4);">Checkout</h1>
      <p class="text-xs text-muted" style="margin-bottom:var(--space-4);background:var(--color-primary-light);padding:8px 12px;border-radius:8px;">
        Demo checkout only — no real payment or order is processed.
      </p>

      <!-- Order type -->
      <div class="flex gap-2" style="margin-bottom: var(--space-5);">
        <button class="option-chip active" data-type="delivery" id="type-delivery" style="flex:1;text-align:center;">Delivery</button>
        <button class="option-chip" data-type="pickup" id="type-pickup" style="flex:1;text-align:center;">Pickup</button>
      </div>

      <form id="checkout-form">
        <div class="form-group">
          <label class="form-label" for="cust-name">Name *</label>
          <input class="form-input" id="cust-name" name="name" required value="${profile.name || ''}" placeholder="Your name" />
          <div class="form-error hidden" id="err-name">Name is required</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="cust-phone">Phone *</label>
          <input class="form-input" id="cust-phone" name="phone" type="tel" required value="${profile.phone || ''}" placeholder="10-digit mobile" />
          <div class="form-error hidden" id="err-phone">Valid phone required</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="cust-email">Email</label>
          <input class="form-input" id="cust-email" name="email" type="email" value="${profile.email || ''}" placeholder="optional" />
        </div>

        <div id="delivery-fields">
          <div class="form-group">
            <label class="form-label" for="cust-address">Delivery Address *</label>
            <textarea class="form-textarea" id="cust-address" name="address" placeholder="House no, street, landmark">${DEMO_ADDRESSES[0]?.line1 || ''}</textarea>
            <div class="form-error hidden" id="err-address">Address is required for delivery</div>
          </div>
        </div>

        <div id="pickup-fields" class="hidden">
          <div class="card" style="padding:var(--space-4);margin-bottom:var(--space-4);background:var(--color-surface-alt);">
            <p class="text-sm">Pickup from <strong>Pepper's Pizza – Bilaspur</strong> (demo location). You'll receive a notification when ready.</p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="instructions">Instructions (optional)</label>
          <textarea class="form-textarea" id="instructions" name="instructions" placeholder="e.g. Extra napkins, ring the bell..."></textarea>
        </div>
      </form>

      <!-- Summary -->
      <div class="card" style="padding: var(--space-4); margin-top: var(--space-4);">
        <h3 class="font-semibold text-sm" style="margin-bottom:12px;">Order Summary</h3>
        ${cart
          .map(
            (i) => `
          <div class="flex justify-between text-sm" style="margin-bottom:6px;">
            <span class="text-muted">${i.qty}× ${i.name} (${i.sizeLabel})</span>
            <span>${CONFIG.currency}${i.unitPrice * i.qty}</span>
          </div>
        `
          )
          .join('')}
        <div style="border-top:1px solid var(--color-border);margin:10px 0;padding-top:10px;">
          <div class="flex justify-between text-sm" style="margin-bottom:4px;"><span class="text-muted">Subtotal</span><span>${CONFIG.currency}${subtotal}</span></div>
          ${discount ? `<div class="flex justify-between text-sm" style="margin-bottom:4px;color:var(--color-success);"><span>Discount</span><span>−${CONFIG.currency}${discount}</span></div>` : ''}
          <div class="flex justify-between text-sm" style="margin-bottom:4px;"><span class="text-muted">Delivery</span><span id="del-fee">${delivery === 0 ? 'FREE' : CONFIG.currency + delivery}</span></div>
          <div class="flex justify-between font-semibold" style="margin-top:8px;"><span>Total</span><span id="checkout-total">${CONFIG.currency}${grand}</span></div>
        </div>
      </div>
    </div>

    <div class="sticky-bottom">
      <button class="btn btn-primary btn-lg" id="place-order-btn" style="width:100%;">
        Place Demo Order · ${CONFIG.currency}${grand}
      </button>
    </div>
  `;

  // Order type toggle
  const updateType = (type) => {
    orderType = type;
    container.querySelector('#type-delivery').classList.toggle('active', type === 'delivery');
    container.querySelector('#type-pickup').classList.toggle('active', type === 'pickup');
    container.querySelector('#delivery-fields').classList.toggle('hidden', type !== 'delivery');
    container.querySelector('#pickup-fields').classList.toggle('hidden', type !== 'pickup');
    const del = type === 'delivery' ? getDeliveryFee(subtotal) : 0;
    const g = Math.max(0, subtotal - discount + del);
    container.querySelector('#del-fee').textContent = del === 0 ? 'FREE' : CONFIG.currency + del;
    container.querySelector('#checkout-total').textContent = CONFIG.currency + g;
    container.querySelector('#place-order-btn').textContent = `Place Demo Order · ${CONFIG.currency}${g}`;
  };

  container.querySelector('#type-delivery').addEventListener('click', () => updateType('delivery'));
  container.querySelector('#type-pickup').addEventListener('click', () => updateType('pickup'));

  container.querySelector('#place-order-btn').addEventListener('click', () => {
    const name = container.querySelector('#cust-name').value.trim();
    const phone = container.querySelector('#cust-phone').value.trim();
    const email = container.querySelector('#cust-email').value.trim();
    const address = container.querySelector('#cust-address')?.value.trim() || '';
    const instructions = container.querySelector('#instructions').value.trim();

    let valid = true;
    container.querySelector('#err-name').classList.toggle('hidden', !!name);
    container.querySelector('#cust-name').classList.toggle('error', !name);
    if (!name) valid = false;

    const phoneOk = /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
    container.querySelector('#err-phone').classList.toggle('hidden', phoneOk);
    container.querySelector('#cust-phone').classList.toggle('error', !phoneOk);
    if (!phoneOk) valid = false;

    if (orderType === 'delivery') {
      container.querySelector('#err-address').classList.toggle('hidden', !!address);
      container.querySelector('#cust-address').classList.toggle('error', !address);
      if (!address) valid = false;
    }

    if (!valid) {
      showToast('Please fill required fields', 'error');
      return;
    }

    // Save profile snippet
    setItem('profile', {
      ...profile,
      name,
      phone,
      email,
      isLoggedIn: true,
    });

    const finalDelivery = orderType === 'delivery' ? getDeliveryFee(subtotal) : 0;
    const finalGrand = Math.max(0, subtotal - discount + finalDelivery);

    const order = createOrder({
      type: orderType,
      items: cart.map((i) => ({ ...i })),
      subtotal,
      discount,
      deliveryFee: finalDelivery,
      grandTotal: finalGrand,
      coupon: coupon?.code || null,
      customer: { name, phone, email },
      address: orderType === 'delivery' ? address : null,
      instructions,
    });

    clearCart();
    sessionStorage.removeItem('checkout_coupon');

    // Success view
    container.innerHTML = `
      <div class="empty-state" style="padding-top:60px;">
        <div class="empty-state-icon" style="background:var(--color-primary-light);color:var(--color-primary);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="36" height="36"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 class="empty-state-title">Demo Order Placed!</h2>
        <p class="empty-state-text">Order ID: <strong>${order.id}</strong><br/>This is a frontend demo. No real order was sent.</p>
        <div class="flex gap-3" style="margin-top:16px;">
          <button class="btn btn-primary" id="track-btn">Track Order</button>
          <button class="btn btn-secondary" id="home-btn">Home</button>
        </div>
      </div>
    `;
    container.querySelector('#track-btn').addEventListener('click', () => navigate(`/tracking/${order.id}`));
    container.querySelector('#home-btn').addEventListener('click', () => navigate('/'));
  });
}
