const container = document.createElement('div');
container.className = 'toast-container';
document.body.appendChild(container);

export function showToast(message, type = 'default', duration = 2800) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  container.appendChild(toast);

  const timer = setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 260);
  }, duration);

  toast.addEventListener('click', () => {
    clearTimeout(timer);
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 260);
  });
}
