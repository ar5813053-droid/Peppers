import { CONFIG } from '../data/config.js';
import { getItem, setItem } from '../services/storage.js';
import { getProductById } from '../data/products.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../router.js';

export function renderProfile(container) {
  let profile = getItem('profile', { name: '', email: '', phone: '', isLoggedIn: false });
  const wishlist = getItem('wishlist', []) || [];

  function render() {
    if (!profile.isLoggedIn) {
      container.innerHTML = `
        <div style="padding: var(--space-4); max-width:400px;margin:0 auto;">
          <h1 class="font-bold" style="font-size:1.35rem;margin-bottom:var(--space-2);">Account</h1>
          <p class="text-sm text-muted" style="margin-bottom:var(--space-5);">Demo sign-in — data stored only in this browser.</p>

          <div class="card" style="padding: var(--space-5);">
            <div class="form-group">
              <label class="form-label" for="login-name">Name</label>
              <input class="form-input" id="login-name" placeholder="Your name" value="${profile.name || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="login-phone">Phone</label>
              <input class="form-input" id="login-phone" type="tel" placeholder="10-digit mobile" value="${profile.phone || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="login-email">Email (optional)</label>
              <input class="form-input" id="login-email" type="email" placeholder="email@example.com" value="${profile.email || ''}" />
            </div>
            <button class="btn btn-primary" id="signin-btn" style="width:100%;margin-top:8px;">Continue as Guest / Sign In</button>
            <p class="text-xs text-muted" style="margin-top:12px;text-align:center;">No password needed. This is a local demo only.</p>
          </div>
        </div>
      `;

      container.querySelector('#signin-btn').addEventListener('click', () => {
        const name = container.querySelector('#login-name').value.trim() || 'Guest';
        const phone = container.querySelector('#login-phone').value.trim();
        const email = container.querySelector('#login-email').value.trim();
        profile = { name, phone, email, isLoggedIn: true };
        setItem('profile', profile);
        showToast(`Welcome, ${name}!`, 'success');
        render();
      });
      return;
    }

    container.innerHTML = `
      <div style="padding: var(--space-4);">
        <div class="flex items-center gap-3" style="margin-bottom: var(--space-5);">
          <div style="width:56px;height:56px;border-radius:50%;background:var(--color-primary);color:white;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:700;">
            ${(profile.name || 'G')[0].toUpperCase()}
          </div>
          <div>
            <div class="font-bold" style="font-size:1.15rem;">${profile.name}</div>
            <div class="text-sm text-muted">${profile.phone || profile.email || 'Demo account'}</div>
          </div>
        </div>

        <div class="card" style="padding:0;margin-bottom:var(--space-4);overflow:hidden;">
          <button class="profile-link" id="edit-profile" style="width:100%;padding:14px 16px;text-align:left;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center;">
            <span class="text-sm font-medium">Edit Profile</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <button class="profile-link" id="go-orders" style="width:100%;padding:14px 16px;text-align:left;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center;">
            <span class="text-sm font-medium">Order History</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <button class="profile-link" id="go-wishlist" style="width:100%;padding:14px 16px;text-align:left;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center;">
            <span class="text-sm font-medium">Wishlist (${wishlist.length})</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <button class="profile-link" id="go-notif" style="width:100%;padding:14px 16px;text-align:left;display:flex;justify-content:space-between;align-items:center;">
            <span class="text-sm font-medium">Notifications</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div id="wishlist-section" class="hidden" style="margin-bottom:var(--space-4);">
          <h3 class="font-semibold text-sm" style="margin-bottom:12px;">Wishlist</h3>
          <div id="wishlist-items"></div>
        </div>

        <div class="card" style="padding:0;margin-bottom:var(--space-4);overflow:hidden;">
          <a href="#/about" style="display:block;padding:14px 16px;border-bottom:1px solid var(--color-border);" class="text-sm">About</a>
          <a href="#/faq" style="display:block;padding:14px 16px;border-bottom:1px solid var(--color-border);" class="text-sm">Help & FAQ</a>
          <a href="#/privacy" style="display:block;padding:14px 16px;border-bottom:1px solid var(--color-border);" class="text-sm">Privacy</a>
          <a href="#/terms" style="display:block;padding:14px 16px;" class="text-sm">Terms</a>
        </div>

        <button class="btn btn-secondary" id="signout-btn" style="width:100%;">Sign Out</button>
        <p class="text-xs text-muted" style="text-align:center;margin-top:16px;">Accounts are stored locally for demo purposes only.</p>
      </div>
    `;

    container.querySelector('#edit-profile')?.addEventListener('click', () => {
      const name = prompt('Name', profile.name);
      if (name != null) {
        profile.name = name.trim() || profile.name;
        setItem('profile', profile);
        showToast('Profile updated');
        render();
      }
    });
    container.querySelector('#go-orders')?.addEventListener('click', () => navigate('/orders'));
    container.querySelector('#go-notif')?.addEventListener('click', () => navigate('/notifications'));
    container.querySelector('#go-wishlist')?.addEventListener('click', () => {
      const sec = container.querySelector('#wishlist-section');
      sec.classList.toggle('hidden');
      const list = container.querySelector('#wishlist-items');
      if (!sec.classList.contains('hidden')) {
        if (wishlist.length === 0) {
          list.innerHTML = `<p class="text-sm text-muted">No items in wishlist.</p>`;
        } else {
          list.innerHTML = wishlist
            .map((id) => {
              const p = getProductById(id);
              if (!p) return '';
              return `<button class="flex items-center gap-3" style="width:100%;padding:8px 0;text-align:left;" data-id="${p.id}">
                <img src="${p.image}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;" alt="" />
                <span class="text-sm font-medium">${p.name}</span>
              </button>`;
            })
            .join('');
          list.querySelectorAll('[data-id]').forEach((b) =>
            b.addEventListener('click', () => navigate(`/product/${b.dataset.id}`))
          );
        }
      }
    });
    container.querySelector('#signout-btn')?.addEventListener('click', () => {
      profile = { name: '', email: '', phone: '', isLoggedIn: false };
      setItem('profile', profile);
      showToast('Signed out');
      render();
    });
  }

  render();
}
