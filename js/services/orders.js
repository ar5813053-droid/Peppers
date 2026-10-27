import { getItem, setItem } from './storage.js';

const ORDERS_KEY = 'orders';

let orders = getItem(ORDERS_KEY, []);
const listeners = new Set();

function persist() {
  setItem(ORDERS_KEY, orders);
  notify();
}

function notify() {
  listeners.forEach((fn) => fn(orders));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getOrders() {
  return [...orders].sort((a, b) => b.createdAt - a.createdAt);
}

export function getOrderById(id) {
  return orders.find((o) => o.id === id) || null;
}

export function createOrder(orderData) {
  const order = {
    id: `PP${Date.now().toString(36).toUpperCase()}`,
    createdAt: Date.now(),
    status: 'placed',
    statusHistory: [
      { status: 'placed', at: Date.now(), label: 'Order Placed' },
    ],
    ...orderData,
  };
  orders.unshift(order);
  persist();
  return order;
}

export function updateOrderStatus(orderId, newStatus) {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return false;

  const labels = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    out: 'Out for Delivery',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  order.status = newStatus;
  order.statusHistory.push({
    status: newStatus,
    at: Date.now(),
    label: labels[newStatus] || newStatus,
  });
  persist();
  return true;
}

export function getDemoSalesTotal() {
  return orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.grandTotal || 0), 0);
}
