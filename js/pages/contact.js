import { CONFIG } from '../data/config.js';

export function renderContact(container) {
  container.innerHTML = `
    <div style="padding: var(--space-4);">
      <button class="btn btn-ghost btn-sm" id="back" style="margin-bottom:12px;">← Back</button>
      <h1 class="font-bold" style="font-size:1.4rem;margin-bottom:var(--space-4);">Contact</h1>
      <div class="card" style="padding: var(--space-5);">
        <p class="text-sm text-muted" style="margin-bottom:16px;">
          Contact details are placeholders for this demo. Replace with real information before any public launch.
        </p>
        <div class="form-group">
          <div class="form-label">Location (demo)</div>
          <p class="text-sm">${CONFIG.location}, India</p>
        </div>
        <div class="form-group">
          <div class="form-label">Email (placeholder)</div>
          <p class="text-sm">hello@pepperspizza.demo</p>
        </div>
        <p class="text-xs text-muted">No phone number is published in this demo to avoid fabricating business claims.</p>
      </div>
    </div>
  `;
  container.querySelector('#back')?.addEventListener('click', () => history.back());
}
