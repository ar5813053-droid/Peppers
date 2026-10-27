export function renderTerms(container) {
  container.innerHTML = `
    <div style="padding: var(--space-4);">
      <button class="btn btn-ghost btn-sm" id="back" style="margin-bottom:12px;">← Back</button>
      <h1 class="font-bold" style="font-size:1.4rem;margin-bottom:var(--space-4);">Terms of Use</h1>
      <div class="card" style="padding: var(--space-5);">
        <p class="text-sm" style="line-height:1.6;margin-bottom:12px;">
          This website is provided as a non-commercial demonstration. Orders placed here are simulated and do not create any contract with a real restaurant or delivery service.
        </p>
        <p class="text-sm text-muted" style="line-height:1.6;">
          Product names, prices and images are for illustration. Do not rely on this demo for actual purchases or business decisions.
        </p>
      </div>
    </div>
  `;
  container.querySelector('#back')?.addEventListener('click', () => history.back());
}
