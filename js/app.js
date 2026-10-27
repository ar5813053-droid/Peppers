import { initRouter, register } from './router.js';
import { initNavigation } from './components/navigation.js';

// Pages
import { renderHome } from './pages/home.js';
import { renderDiscover } from './pages/discover.js';
import { renderProductDetail } from './pages/product-detail.js';
import { renderCart } from './pages/cart-page.js';
import { renderCheckout } from './pages/checkout.js';
import { renderTracking } from './pages/tracking.js';
import { renderOrders } from './pages/orders.js';
import { renderProfile } from './pages/profile.js';
import { renderNotifications } from './pages/notifications.js';
import { renderAdmin } from './pages/admin.js';
import { renderAbout } from './pages/about.js';
import { renderContact } from './pages/contact.js';
import { renderPrivacy } from './pages/privacy.js';
import { renderTerms } from './pages/terms.js';
import { renderFaq } from './pages/faq.js';

register('/', renderHome);
register('/discover', renderDiscover);
register('/product/:id', renderProductDetail);
register('/cart', renderCart);
register('/checkout', renderCheckout);
register('/tracking/:id', renderTracking);
register('/orders', renderOrders);
register('/profile', renderProfile);
register('/notifications', renderNotifications);
register('/admin', renderAdmin);
register('/about', renderAbout);
register('/contact', renderContact);
register('/privacy', renderPrivacy);
register('/terms', renderTerms);
register('/faq', renderFaq);

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRouter();

  // Desktop nav links
  document.querySelectorAll('.desktop-nav a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (href) window.location.hash = href;
    });
  });
});
