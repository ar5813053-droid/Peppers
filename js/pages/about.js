import { CONFIG } from '../data/config.js';
import { navigate } from '../router.js';

export function renderAbout(container) {
  container.innerHTML = `
    <div style="padding: var(--space-4);">
      <button class="btn btn-ghost btn-sm" id="back" style="margin-bottom:12px;">← Back</button>
      <h1 class="font-bold" style="font-size:1.4rem;margin-bottom:var(--space-4);">About ${CONFIG.brandName}</h1>
      <div class="card" style="padding: var(--space-5);">
        <p class="text-sm" style="line-height:1.6;margin-bottom:16px;">
          ${CONFIG.brandName} is a demo food-ordering experience set in ${CONFIG.location}.
          This website is a frontend-only demonstration built for portfolio and learning purposes.
        </p>
        <p class="text-sm text-muted" style="line-height:1.6;">
          All products, prices, ratings and orders are fictional demo data.
          No real restaurant is affiliated unless explicitly stated by the project owner.
        </p>
      </div>
    </div>
  `;
  container.querySelector('#back')?.addEventListener('click', () => history.back());
}
