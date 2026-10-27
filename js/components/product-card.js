import { CONFIG } from '../data/config.js';
import { addToCart } from '../services/cart.js';
import { showToast } from './toast.js';
import { navigate } from '../router.js';

export function createProductCard(product, { onAdd } = {}) {
  const price = product.sizes[product.defaultSize]?.price ?? 0;
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('role', 'button');
  card.tabIndex = 0;
  card.dataset.id = product.id;

  card.innerHTML = `
    <div class="product-card-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop'" />
      <span class="${product.isVeg ? 'veg-badge' : 'nonveg-badge'}" title="${product.isVeg ? 'Vegetarian' : 'Non-vegetarian'}"></span>
    </div>
    <div class="product-card-body">
      <h3 class="product-card-title">${product.name}</h3>
      <p class="product-card-desc">${product.shortDesc}</p>
      <div class="product-card-meta">
        <span class="product-card-price">${CONFIG.currency}${price}</span>
        <span class="product-card-rating">
          <span class="star">★</span> ${product.rating}
        </span>
      </div>
      <button class="btn btn-primary btn-sm add-btn" style="width:100%;margin-top:8px;" data-id="${product.id}">
        ADD
      </button>
    </div>
  `;

  const goToDetail = () => navigate(`/product/${product.id}`);

  card.addEventListener('click', (e) => {
    if (e.target.closest('.add-btn')) return;
    goToDetail();
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToDetail();
    }
  });

  card.querySelector('.add-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const size = product.defaultSize;
    const unitPrice = product.sizes[size].price;
    addToCart({
      productId: product.id,
      size,
      qty: 1,
      crust: product.crusts?.[0] || null,
      extras: [],
      unitPrice,
    });
    showToast(`${product.name} added to cart`, 'success');
    if (onAdd) onAdd(product);
  });

  return card;
}
