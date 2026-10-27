# Pepper's Pizza – Bilaspur

Premium frontend demo of a food-ordering app inspired by modern pizza delivery UIs (mobile-first).

**This is a demo only.** No real payments, kitchen or delivery. All data is stored in the browser (`localStorage`).

## Features

- Home with search, categories, featured products, promo & last order
- Full menu (Discover) with filters & sort
- Product detail with size selector animation, crust, extras, quantity
- Cart with coupons, delivery fee logic
- Demo checkout (no payment fields)
- Order history & tracking with status simulator
- Profile / wishlist / notifications
- Demo admin dashboard
- About, Contact, Privacy, Terms, FAQ
- Mobile bottom nav + desktop header
- localStorage persistence
- Responsive layouts


## Upgrade notes (logo, burgers, size animation)

- Official Pepper's Pizza logo integrated in desktop header, mobile home header area, and footer.
- Transparent PNG pizza and burger product images under `assets/images/products/`.
- New **Burgers** category with Classic Pepper, Cheese Melt, and Veggie Crunch burgers (S/M/L = Single/Double/Triple).
- Product detail page: **orbital circular S · M · L selectors** arranged on an arc under the product image.
- Signature **curved size-change animation**: current item exits down-left; next enters from lower-right with scale.
- Same animation system for pizza and burger detail pages.
- Demo prices remain configurable in `js/data/products.js`.

### Size selector & animation checklist

- [ ] Open any pizza or burger with S/M/L sizes
- [ ] Three circular buttons appear in an arc (M lowest)
- [ ] Active size is dark charcoal with white letter
- [ ] Tapping S/M/L updates price
- [ ] Image animates on a curved path (respects reduced-motion)
- [ ] Add to cart stores the selected size and price
- [ ] Cart and checkout show correct size label and amount

## Run on Android (Termux)

### A. Extract the project

```bash
# If you have the ZIP:
unzip peppers-pizza.zip
cd peppers-pizza
```

### B. Start a local server

From the project root (folder that contains `index.html`):

```bash
python -m http.server 8000
```

If `python` is not found:

```bash
python3 -m http.server 8000
```

### C. Open in the phone browser

```
http://127.0.0.1:8000
```

or

```
http://localhost:8000
```

### D. Stop the server

Press `Ctrl + C` in Termux.

### E. Upload to GitHub

**Option 1 – Git in Termux**

```bash
pkg install git
cd peppers-pizza
git init
git add .
git commit -m "Pepper's Pizza demo"
# Create an empty repo on GitHub, then:
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

**Option 2 – GitHub website**

Create a new repository on github.com → Upload files → drag the project folder contents.

### F. Publish with GitHub Pages

1. Repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` (or `gh-pages`), folder: `/ (root)`
4. Save. Site will be at `https://YOUR_USER.github.io/YOUR_REPO/`

### G. Why not `file://`?

Modern browsers block ES modules (`type="module"`) on `file://` for security. Always use a local HTTP server.

## Project structure

```
peppers-pizza/
├── index.html
├── README.md
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
└── js/
    ├── app.js
    ├── router.js
    ├── data/
    │   ├── config.js
    │   ├── categories.js
    │   └── products.js
    ├── services/
    │   ├── storage.js
    │   ├── cart.js
    │   ├── orders.js
    │   └── search.js
    ├── components/
    │   ├── navigation.js
    │   ├── product-card.js
    │   ├── modal.js
    │   └── toast.js
    └── pages/
        ├── home.js
        ├── discover.js
        ├── product-detail.js
        ├── cart-page.js
        ├── checkout.js
        ├── tracking.js
        ├── orders.js
        ├── profile.js
        ├── notifications.js
        ├── admin.js
        ├── about.js
        ├── contact.js
        ├── privacy.js
        ├── terms.js
        └── faq.js
```

## Demo coupons

| Code     | Offer                          |
|----------|--------------------------------|
| PEPPER50 | ₹50 off above ₹299             |
| FIRST100 | ₹100 off above ₹499            |
| SAVE20   | 20% off (max ₹80) above ₹249   |

## Implemented pages & interactions

| Page            | Interactions                                      |
|-----------------|---------------------------------------------------|
| Home            | Search, categories, add to cart, reorder          |
| Discover        | Search, filter, sort, product cards               |
| Product detail  | Size animation, crust, extras, qty, wishlist, cart|
| Cart            | Qty, remove, clear, coupons, checkout             |
| Checkout        | Delivery/pickup, validation, place demo order     |
| Orders          | List, track, reorder                              |
| Tracking        | Timeline, demo status simulator                   |
| Profile         | Sign-in (local), wishlist, sign-out               |
| Notifications   | Mark read                                         |
| Admin           | Sales overview, status update, reset data         |
| About / etc.    | Static content                                    |

## Testing checklist

- [ ] Home loads with products
- [ ] Bottom nav switches pages
- [ ] Search filters products
- [ ] Category chips navigate / filter
- [ ] Product detail opens
- [ ] Size S/M/L updates price and animates image
- [ ] Add to cart + badge updates
- [ ] Cart qty / remove / persist after refresh
- [ ] Coupon applies
- [ ] Checkout validates and creates order
- [ ] Order appears in history
- [ ] Tracking status simulator works
- [ ] Admin can change order status
- [ ] No horizontal overflow on 360px width

## Limitations

- Frontend-only; no real backend or payments
- Product edits in admin are not persisted to the JS data files
- Images load from Unsplash (requires network)
- No offline service worker
- Auth is localStorage only (not secure)

## Image attribution

Food photos are loaded from Unsplash. For production, host your own licensed images and update URLs in `js/data/products.js`.

---

Built as a complete static demo for Android / Termux workflows.
