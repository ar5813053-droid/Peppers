export function renderPrivacy(container) {
  container.innerHTML = `
    <div style="padding: var(--space-4);">
      <button class="btn btn-ghost btn-sm" id="back" style="margin-bottom:12px;">← Back</button>
      <h1 class="font-bold" style="font-size:1.4rem;margin-bottom:var(--space-4);">Privacy Policy</h1>
      <div class="card" style="padding: var(--space-5);">
        <p class="text-sm" style="line-height:1.6;margin-bottom:12px;">
          This is a frontend demo application. Data such as cart, orders and profile is stored only in your browser's localStorage and never sent to a server.
        </p>
        <p class="text-sm text-muted" style="line-height:1.6;">
          No analytics, tracking or third-party advertising scripts are included in this demo.
          For a production app you must publish a full privacy policy covering data collection, cookies and user rights.
        </p>
      </div>
    </div>
  `;
  container.querySelector('#back')?.addEventListener('click', () => history.back());
}
