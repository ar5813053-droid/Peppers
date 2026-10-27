import { getItem, setItem } from '../services/storage.js';
import { navigate } from '../router.js';

const DEFAULT_NOTIFS = [
  {
    id: 'n1',
    title: 'Welcome to Pepper\'s Pizza!',
    body: 'Explore our demo menu and place a demo order anytime.',
    time: Date.now() - 3600000,
    read: false,
    type: 'promo',
  },
  {
    id: 'n2',
    title: 'Flat ₹50 OFF',
    body: 'Use code PEPPER50 on orders above ₹299. Demo coupon.',
    time: Date.now() - 7200000,
    read: false,
    type: 'promo',
  },
];

export function renderNotifications(container) {
  let notifs = getItem('notifications', DEFAULT_NOTIFS);

  function save() {
    setItem('notifications', notifs);
  }

  function render() {
    const unread = notifs.filter((n) => !n.read).length;

    container.innerHTML = `
      <div style="padding: var(--space-4);">
        <div class="flex items-center justify-between" style="margin-bottom: var(--space-4);">
          <h1 class="font-bold" style="font-size:1.35rem;">Notifications</h1>
          ${unread > 0 ? `<button class="text-sm text-primary" id="mark-all">Mark all read</button>` : ''}
        </div>

        ${
          notifs.length === 0
            ? `
          <div class="empty-state">
            <h2 class="empty-state-title">All caught up</h2>
            <p class="empty-state-text">No notifications right now.</p>
          </div>
        `
            : `
          <div class="flex-col gap-2" style="display:flex;flex-direction:column;gap:8px;">
            ${notifs
              .map(
                (n) => `
              <button class="card" style="padding: var(--space-4); text-align:left; width:100%; ${n.read ? 'opacity:0.7;' : 'border-left:3px solid var(--color-primary);'}" data-id="${n.id}">
                <div class="font-semibold text-sm">${n.title}</div>
                <div class="text-xs text-muted" style="margin-top:4px;">${n.body}</div>
                <div class="text-xs text-muted" style="margin-top:6px;">${formatTime(n.time)}</div>
              </button>
            `
              )
              .join('')}
          </div>
        `
        }
      </div>
    `;

    container.querySelector('#mark-all')?.addEventListener('click', () => {
      notifs = notifs.map((n) => ({ ...n, read: true }));
      save();
      render();
    });

    container.querySelectorAll('[data-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        notifs = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
        save();
        render();
      });
    });
  }

  function formatTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
    return new Date(ts).toLocaleDateString();
  }

  render();
}
