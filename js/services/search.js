import { PRODUCTS } from '../data/products.js';

export function searchProducts(query, filters = {}) {
  const q = (query || '').trim().toLowerCase();
  let results = PRODUCTS.filter((p) => p.available);

  if (q) {
    results = results.filter((p) => {
      const haystack = [
        p.name,
        p.description,
        p.shortDesc,
        p.category,
        ...(p.ingredients || []),
        ...(p.tags || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }

  if (filters.vegOnly) {
    results = results.filter((p) => p.isVeg);
  }

  if (filters.nonVegOnly) {
    results = results.filter((p) => !p.isVeg);
  }

  if (filters.minPrice != null) {
    results = results.filter((p) => {
      const price = p.sizes[p.defaultSize]?.price ?? 0;
      return price >= filters.minPrice;
    });
  }

  if (filters.maxPrice != null) {
    results = results.filter((p) => {
      const price = p.sizes[p.defaultSize]?.price ?? 0;
      return price <= filters.maxPrice;
    });
  }

  const sort = filters.sort || 'popularity';
  if (sort === 'price-asc') {
    results.sort((a, b) => (a.sizes[a.defaultSize]?.price || 0) - (b.sizes[b.defaultSize]?.price || 0));
  } else if (sort === 'price-desc') {
    results.sort((a, b) => (b.sizes[b.defaultSize]?.price || 0) - (a.sizes[a.defaultSize]?.price || 0));
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else {
    results.sort((a, b) => b.popularity - a.popularity);
  }

  return results;
}
