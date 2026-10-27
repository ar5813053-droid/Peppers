import { CONFIG } from '../data/config.js';
import { getProductById } from '../data/products.js';
import { addToCart } from '../services/cart.js';
import { getItem, setItem } from '../services/storage.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../router.js';

const SIZE_SCALE = { S: 0.82, M: 0.95, L: 1.08 };

export function renderProductDetail(container, params) {
  const product = getProductById(params.id);
  if (!product) {
    container.innerHTML = `
      <div class="empty-state">
        <h2 class="empty-state-title">Product not found</h2>
        <button class="btn btn-primary" id="back-home">Go Home</button>
      </div>
    `;
    container.querySelector('#back-home').addEventListener('click', () => navigate('/'));
    return;
  }

  const sizes = Object.keys(product.sizes);
  let selectedSize = product.defaultSize || sizes[0];
  let qty = 1;
  let selectedCrust = product.crusts?.[0] || null;
  let selectedExtras = [];
  let isWishlisted = (getItem('wishlist', []) || []).includes(product.id);
  let animating = false;

  function calcPrice() {
    let price = product.sizes[selectedSize]?.price || 0;
    selectedExtras.forEach((id) => {
      const extra = product.extras?.find((x) => x.id === id);
      if (extra) price += extra.price;
    });
    return price;
  }

  function imageForSize() {
    // Same transparent image; scale conveys size. Extend here if size-specific assets exist.
    return product.image;
  }

  function render() {
    const price = calcPrice();
    const sizeData = product.sizes[selectedSize];
    const hasMultiSize = sizes.length > 1;

    container.innerHTML = `
      <div class="product-detail-page" style="padding-bottom: 110px;">
        <div style="position:relative;padding: var(--space-3) var(--space-4) 0;">
          <div class="flex items-center justify-between" style="z-index:10;position:relative;">
            <button class="btn-icon" id="back-btn" aria-label="Back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button class="btn-icon wishlist-btn ${isWishlisted ? 'active' : ''}" id="wishlist-btn" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
          </div>
        </div>

        <div class="product-stage" id="product-stage">
          <div class="product-stage-bg" aria-hidden="true"></div>
          <div class="product-image-stage" id="image-stage">
            <div class="product-image-layer is-active" data-role="current" data-size="${selectedSize}">
              <img src="${imageForSize()}" alt="${product.name}"
                   onerror="this.src='assets/images/products/pizza/pizza-classic-transparent.png'" />
            </div>
            <div class="product-image-layer" data-role="next" style="opacity:0;pointer-events:none;" data-size="${selectedSize}">
              <img src="${imageForSize()}" alt="" />
            </div>
          </div>

          ${
            hasMultiSize
              ? `
          <div class="size-orbit" role="group" aria-label="Size">
            <div class="size-orbit-arc" aria-hidden="true"></div>
            ${sizes
              .map(
                (s) => `
              <button type="button" class="size-orbit-btn ${s === selectedSize ? 'active' : ''}" data-size="${s}" aria-label="Size ${s}" aria-pressed="${s === selectedSize}">
                ${s}
              </button>
            `
              )
              .join('')}
          </div>
          `
              : ''
          }
        </div>

        <div style="padding: 0 var(--space-5);">
          <div class="flex items-center justify-between" style="margin-bottom: var(--space-2);">
            <span class="text-sm font-medium text-primary">Free Delivery*</span>
            <div class="qty-selector">
              <button class="qty-btn" id="qty-minus" aria-label="Decrease">−</button>
              <span class="qty-value" id="qty-value">${String(qty).padStart(2, '0')}</span>
              <button class="qty-btn" id="qty-plus" aria-label="Increase">+</button>
            </div>
          </div>

          <h1 class="font-bold" style="font-size:1.4rem;margin-bottom:4px;">${product.name}</h1>
          <div class="flex items-center gap-3" style="margin-bottom: var(--space-3);">
            <span class="font-bold price-display" id="price-display" style="font-size:1.25rem;">${CONFIG.currency}${price}</span>
            <span class="text-xs text-muted">Demo · ${sizeData?.label || selectedSize}</span>
          </div>
          <p class="text-sm text-muted" style="margin-bottom: var(--space-4); line-height:1.55;">${product.description}</p>

          <div class="info-chips" style="margin-bottom: var(--space-5);">
            <div class="info-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              ${product.calories || '—'} Kcal
            </div>
            <div class="info-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ${product.rating} <span class="text-xs text-muted">(${product.reviewCount} demo)</span>
            </div>
            <div class="info-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              ~${product.prepTime} min <span class="text-xs text-muted">(est.)</span>
            </div>
          </div>

          ${
            product.ingredients?.length
              ? `
          <div style="margin-bottom: var(--space-5);">
            <h3 class="font-semibold text-sm" style="margin-bottom: var(--space-3);">Ingredients</h3>
            <div class="ingredient-list">
              ${product.ingredients
                .map(
                  (ing) => `
                <div class="ingredient-pill" title="${ing}">
                  <span style="font-size:0.65rem;font-weight:600;color:var(--color-text-secondary);">${ing.slice(0, 4)}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
          `
              : ''
          }

          ${
            product.crusts?.length
              ? `
          <div style="margin-bottom: var(--space-5);">
            <h3 class="font-semibold text-sm" style="margin-bottom: var(--space-3);">Crust</h3>
            <div class="option-chips" id="crust-options">
              ${product.crusts
                .map(
                  (c) => `
                <button class="option-chip ${c === selectedCrust ? 'active' : ''}" data-crust="${c}">${c}</button>
              `
                )
                .join('')}
            </div>
          </div>
          `
              : ''
          }

          ${
            product.extras?.length
              ? `
          <div style="margin-bottom: var(--space-5);">
            <h3 class="font-semibold text-sm" style="margin-bottom: var(--space-3);">Extras</h3>
            <div class="option-chips" id="extra-options">
              ${product.extras
                .map(
                  (e) => `
                <button class="option-chip ${selectedExtras.includes(e.id) ? 'active' : ''}" data-extra="${e.id}">
                  ${e.name} (+${CONFIG.currency}${e.price})
                </button>
              `
                )
                .join('')}
            </div>
          </div>
          `
              : ''
          }

          <p class="text-xs text-muted" style="margin-bottom: var(--space-4);">*Free delivery on orders above ${CONFIG.currency}${CONFIG.freeDeliveryMin}. Demo data only.</p>
        </div>

        <div class="sticky-bottom product-detail-bar">
          <div class="flex items-center gap-3">
            <div style="flex:1;">
              <div class="text-xs text-muted">Total</div>
              <div class="font-bold" id="total-price" style="font-size:1.2rem;">${CONFIG.currency}${price * qty}</div>
            </div>
            <button class="btn btn-primary btn-lg" id="add-cart-btn" style="flex:1.5;">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function animateSizeChange(newSize) {
    if (animating || newSize === selectedSize) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    selectedSize = newSize;
    updateSizeButtons();
    updateTotals();

    if (prefersReduced || sizes.length <= 1) {
      const current = container.querySelector('[data-role="current"]');
      if (current) {
        current.dataset.size = newSize;
        const img = current.querySelector('img');
        if (img) img.src = imageForSize();
      }
      return;
    }

    animating = true;
    const current = container.querySelector('[data-role="current"]');
    const next = container.querySelector('[data-role="next"]');
    if (!current || !next) {
      animating = false;
      return;
    }

    next.dataset.size = newSize;
    const nextImg = next.querySelector('img');
    if (nextImg) nextImg.src = imageForSize();

    next.classList.remove('anim-out', 'anim-in');
    current.classList.remove('anim-out', 'anim-in');
    void next.offsetWidth;

    current.classList.add('anim-out');
    next.style.opacity = '';
    next.classList.add('anim-in');
    next.classList.add('is-active');
    current.classList.remove('is-active');

    const onEnd = () => {
      current.classList.remove('anim-out');
      next.classList.remove('anim-in');
      // Swap roles for next transition
      current.dataset.role = 'next';
      next.dataset.role = 'current';
      current.style.opacity = '0';
      current.classList.remove('is-active');
      next.style.opacity = '';
      next.classList.add('is-active');
      animating = false;
    };

    next.addEventListener('animationend', onEnd, { once: true });
    // Safety timeout
    setTimeout(() => {
      if (animating) onEnd();
    }, 600);
  }

  function updateSizeButtons() {
    container.querySelectorAll('.size-orbit-btn').forEach((btn) => {
      const active = btn.dataset.size === selectedSize;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function updateTotals() {
    const price = calcPrice();
    const priceEl = container.querySelector('#price-display');
    const totalEl = container.querySelector('#total-price');
    const qtyEl = container.querySelector('#qty-value');
    if (priceEl) {
      priceEl.textContent = `${CONFIG.currency}${price}`;
      priceEl.classList.remove('price-update');
      void priceEl.offsetWidth;
      priceEl.classList.add('price-update');
    }
    if (totalEl) totalEl.textContent = `${CONFIG.currency}${price * qty}`;
    if (qtyEl) qtyEl.textContent = String(qty).padStart(2, '0');
  }

  function bindEvents() {
    container.querySelector('#back-btn')?.addEventListener('click', () => history.back());

    container.querySelector('#wishlist-btn')?.addEventListener('click', () => {
      const list = getItem('wishlist', []) || [];
      if (isWishlisted) {
        setItem('wishlist', list.filter((id) => id !== product.id));
        isWishlisted = false;
      } else {
        list.push(product.id);
        setItem('wishlist', list);
        isWishlisted = true;
      }
      const btn = container.querySelector('#wishlist-btn');
      btn.classList.toggle('active', isWishlisted);
      btn.classList.add('pop');
      setTimeout(() => btn.classList.remove('pop'), 400);
      const svg = btn.querySelector('svg');
      svg.setAttribute('fill', isWishlisted ? 'currentColor' : 'none');
      showToast(isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
    });

    container.querySelectorAll('.size-orbit-btn').forEach((btn) => {
      btn.addEventListener('click', () => animateSizeChange(btn.dataset.size));
    });

    container.querySelector('#qty-minus')?.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        updateTotals();
      }
    });
    container.querySelector('#qty-plus')?.addEventListener('click', () => {
      qty++;
      updateTotals();
    });

    container.querySelectorAll('#crust-options .option-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedCrust = btn.dataset.crust;
        container.querySelectorAll('#crust-options .option-chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    container.querySelectorAll('#extra-options .option-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.extra;
        if (selectedExtras.includes(id)) {
          selectedExtras = selectedExtras.filter((x) => x !== id);
          btn.classList.remove('active');
        } else {
          selectedExtras.push(id);
          btn.classList.add('active');
        }
        updateTotals();
      });
    });

    container.querySelector('#add-cart-btn')?.addEventListener('click', () => {
      const unitPrice = calcPrice();
      const extrasData = selectedExtras.map((id) => {
        const e = product.extras.find((x) => x.id === id);
        return { id, name: e.name, price: e.price };
      });
      addToCart({
        productId: product.id,
        size: selectedSize,
        qty,
        crust: selectedCrust,
        extras: extrasData,
        unitPrice,
      });
      showToast(`${product.name} added to cart`, 'success');
    });
  }

  render();
}
