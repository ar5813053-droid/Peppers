import { getItem, setItem } from './storage.js';
import { getProductById } from '../data/products.js';
import { CONFIG } from '../data/config.js';

const CART_KEY = 'cart';

let cart = getItem(CART_KEY, []);
const listeners = new Set();

function persist() {
  setItem(CART_KEY, cart);
  notify();
}

function notify() {
  listeners.forEach((fn) => fn(cart));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getCart() {
  return [...cart];
}

export function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

export function getDeliveryFee(subtotal = getCartSubtotal()) {
  if (subtotal >= CONFIG.freeDeliveryMin) return 0;
  return CONFIG.deliveryFee;
}

export function clearCart() {
  cart = [];
  persist();
}

export function addToCart({ productId, size, qty = 1, crust = null, extras = [], unitPrice }) {
  const product = getProductById(productId);
  if (!product) return false;

  const extrasKey = extras
    .map((e) => e.id)
    .sort()
    .join(',');
  const existing = cart.find(
    (item) =>
      item.productId === productId &&
      item.size === size &&
      item.crust === crust &&
      item.extras.map((e) => e.id).sort().join(',') === extrasKey
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: `ci_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      productId,
      name: product.name,
      image: product.image,
      size,
      sizeLabel: product.sizes[size]?.label || size,
      crust,
      extras: [...extras],
      qty,
      unitPrice,
      isVeg: product.isVeg,
    });
  }
  persist();
  return true;
}

export function updateQty(cartItemId, qty) {
  const item = cart.find((i) => i.id === cartItemId);
  if (!item) return;
  if (qty < 1) {
    removeItem(cartItemId);
    return;
  }
  item.qty = qty;
  persist();
}

export function removeItem(cartItemId) {
  cart = cart.filter((i) => i.id !== cartItemId);
  persist();
}

export function applyCoupon(code, subtotal) {
  // handled in checkout
  return null;
}
