let currentOverlay = null;

export function openModal({ title, content, onClose }) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-handle"></div>
    ${title ? `<h2 class="modal-title">${title}</h2>` : ''}
    <div class="modal-body"></div>
  `;

  const body = modal.querySelector('.modal-body');
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof Node) {
    body.appendChild(content);
  }

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  currentOverlay = overlay;

  requestAnimationFrame(() => overlay.classList.add('open'));

  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => {
      overlay.remove();
      if (currentOverlay === overlay) currentOverlay = null;
      if (onClose) onClose();
    }, 280);
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', esc);
    }
  });

  return { close, overlay, body };
}

export function closeModal() {
  if (currentOverlay) {
    currentOverlay.classList.remove('open');
    const o = currentOverlay;
    setTimeout(() => o.remove(), 280);
    currentOverlay = null;
  }
}
