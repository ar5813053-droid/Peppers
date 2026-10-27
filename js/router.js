const routes = {};
let currentPath = '/';

export function register(path, handler) {
  routes[path] = handler;
}

export function navigate(path, replace = false) {
  if (!path.startsWith('/')) path = '/' + path;
  const hash = '#' + path;
  if (replace) {
    history.replaceState(null, '', hash);
  } else {
    history.pushState(null, '', hash);
  }
  handleRoute();
}

export function getCurrentPath() {
  const hash = window.location.hash.slice(1) || '/';
  return hash.split('?')[0];
}

export function getQuery() {
  const hash = window.location.hash.slice(1) || '/';
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return {};
  const params = new URLSearchParams(hash.slice(qIndex + 1));
  const obj = {};
  params.forEach((v, k) => (obj[k] = v));
  return obj;
}

function matchRoute(path) {
  // Exact match
  if (routes[path]) return { handler: routes[path], params: {} };

  // Parameterized: /product/:id
  for (const pattern of Object.keys(routes)) {
    if (!pattern.includes(':')) continue;
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) continue;

    const params = {};
    let match = true;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }
    if (match) return { handler: routes[pattern], params };
  }
  return null;
}

export function handleRoute() {
  const path = getCurrentPath();
  currentPath = path;
  const matched = matchRoute(path);
  const main = document.getElementById('main-content');

  if (!main) return;

  if (matched) {
    main.innerHTML = '';
    const page = document.createElement('div');
    page.className = 'page';
    main.appendChild(page);
    matched.handler(page, matched.params);
  } else {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
        </div>
        <h2 class="empty-state-title">Page not found</h2>
        <p class="empty-state-text">The page you're looking for doesn't exist.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#/'">Go Home</button>
      </div>
    `;
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Update desktop nav active state via custom event
  window.dispatchEvent(new CustomEvent('routechange', { detail: { path } }));
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('popstate', handleRoute);
  // Initial
  if (!window.location.hash) {
    history.replaceState(null, '', '#/');
  }
  handleRoute();
}
