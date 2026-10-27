export function renderFaq(container) {
  const faqs = [
    {
      q: 'Is this a real restaurant?',
      a: 'No. Pepper\'s Pizza – Bilaspur is a frontend demo. No real orders are processed.',
    },
    {
      q: 'Why do I need a local server?',
      a: 'ES modules require HTTP(S). Opening index.html via file:// may block scripts. Use python -m http.server 8000.',
    },
    {
      q: 'Where is my data stored?',
      a: 'Cart, orders and profile live in your browser localStorage only. Clearing site data removes them.',
    },
    {
      q: 'Can I use this in production?',
      a: 'Not as-is. You need a real backend, authentication, payment gateway and legal pages before launch.',
    },
  ];

  container.innerHTML = `
    <div style="padding: var(--space-4);">
      <button class="btn btn-ghost btn-sm" id="back" style="margin-bottom:12px;">← Back</button>
      <h1 class="font-bold" style="font-size:1.4rem;margin-bottom:var(--space-4);">Help & FAQ</h1>
      ${faqs
        .map(
          (f) => `
        <div class="card" style="padding: var(--space-4); margin-bottom: 12px;">
          <div class="font-semibold text-sm" style="margin-bottom:6px;">${f.q}</div>
          <p class="text-sm text-muted">${f.a}</p>
        </div>
      `
        )
        .join('')}
    </div>
  `;
  container.querySelector('#back')?.addEventListener('click', () => history.back());
}
