/* ============================================
   ZEPHYR — Main Store Frontend JS
   index.html logic
   ============================================ */

'use strict';

// ── STATE ────────────────────────────────────────────────────────────────────
let cart = [];
let wishlist = new Set();
let currentFilter = 'all';
let allProducts = [];
let quickViewQty = 1;

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  loadWishlist();
  allProducts = ProductStore.getAll();
  renderProducts(allProducts);
  initNavbar();
  initCart();
  initWishlist();
  initFilters();
  initScrollReveal();
  initNewsletterForm();
  initLookbook();
  initSearch();
  initQuickView();
  initBackToTop();
  updateProductCount();
  initKeyboard();
  initLiveSync();
});

function initLiveSync() {
  function syncProducts() {
    allProducts = ProductStore.getAll();
    let filtered;
    if (currentFilter === 'all') {
      filtered = allProducts.filter(p => p.status === 'active');
    } else if (currentFilter === 'wishlist') {
      filtered = allProducts.filter(p => wishlist.has(p.id) && p.status === 'active');
    } else {
      filtered = allProducts.filter(p => p.category === currentFilter && p.status === 'active');
    }
    renderProducts(filtered);
    updateProductCount();
  }

  // Cross-tab storage updates from admin page
  window.addEventListener('storage', (e) => {
    if (e.key === 'zephyr_products_v4') {
      syncProducts();
      renderLookbook();
    }
  });

  // Same-tab updates
  window.addEventListener('zephyr_products_updated', () => {
    syncProducts();
    renderLookbook();
  });
}

// ── LOOKBOOK COLLAGE ─────────────────────────────────────────────────────────
function initLookbook() {
  renderLookbook();
}

function renderLookbook() {
  const grid = document.getElementById('lookbookGrid');
  if (!grid) return;

  // Lifestyle / editorial images (non-product)
  const lifestyleImages = [
    { src: 'model/model1.png', alt: 'Zephyr Streetwear Lookbook', label: 'Street Culture' },
    { src: 'model/model2.png', alt: 'Zephyr Model Shot', label: 'Urban Edge' },
    { src: 'images/shoes.png', alt: 'Zephyr Street Kicks', label: 'Footwear Collection' }
  ];

  // Pick active products for the collage, prioritizing featured items
  const active = allProducts.filter(p => p.status === 'active');
  const featured = active.filter(p => p.featured);
  const others = active.filter(p => !p.featured);
  const productItems = [...featured, ...others].slice(0, 6);

  // Build interleaved grid: lifestyle shots + product shots
  // Layout order: product, lifestyle, product, product, lifestyle, product, product, lifestyle, product
  const cells = [];

  // Position 1: First featured product (large, spans 2x2)
  if (productItems[0]) cells.push({ type: 'product', data: productItems[0] });
  // Position 2: Lifestyle editorial
  cells.push({ type: 'lifestyle', data: lifestyleImages[0] });
  // Position 3: Product
  if (productItems[1]) cells.push({ type: 'product', data: productItems[1] });
  // Position 4: Lifestyle editorial (spans 2 rows)
  cells.push({ type: 'lifestyle', data: lifestyleImages[1] });
  // Position 5-6: Products
  if (productItems[2]) cells.push({ type: 'product', data: productItems[2] });
  if (productItems[3]) cells.push({ type: 'product', data: productItems[3] });
  // Position 7: Lifestyle editorial (spans 2 cols)
  cells.push({ type: 'lifestyle', data: lifestyleImages[2] });
  // Position 8-9: Products
  if (productItems[4]) cells.push({ type: 'product', data: productItems[4] });
  if (productItems[5]) cells.push({ type: 'product', data: productItems[5] });

  grid.innerHTML = cells.map(cell => {
    if (cell.type === 'lifestyle') {
      return `
        <div class="lookbook-item lookbook-lifestyle">
          <img src="${cell.data.src}" alt="${cell.data.alt}" loading="lazy" />
          <div class="lookbook-item-overlay">
            <span class="lookbook-item-name">${cell.data.label}</span>
          </div>
        </div>
      `;
    } else {
      const p = cell.data;
      const badgeHTML = p.badge
        ? `<span class="lookbook-item-badge">${p.badge}</span>`
        : '';
      return `
        <div class="lookbook-item" data-id="${p.id}" onclick="openQuickView('${p.id}')">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          ${badgeHTML}
          <div class="lookbook-item-overlay">
            <span class="lookbook-item-name">${p.name}</span>
            <span class="lookbook-item-price">${formatPrice(p.price)}</span>
          </div>
          <div class="lookbook-cta-wrap">
            <button class="lookbook-view-btn" title="Quick View" onclick="event.stopPropagation(); openQuickView('${p.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
      `;
    }
  }).join('');

  // Stagger entrance animation
  grid.querySelectorAll('.lookbook-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    setTimeout(() => {
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, i * 80);
  });
}

window.renderLookbook = renderLookbook;

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile menu
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close on link click
  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('active');
    });
  });
}

// ── FILTERS ───────────────────────────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      let filtered;
      if (currentFilter === 'all') {
        filtered = allProducts.filter(p => p.status === 'active');
      } else if (currentFilter === 'wishlist') {
        filtered = allProducts.filter(p => wishlist.has(p.id) && p.status === 'active');
      } else {
        filtered = allProducts.filter(p => p.category === currentFilter && p.status === 'active');
      }
      renderProducts(filtered);
    });
  });
}

// ── DYNAMIC PRODUCT COUNT ─────────────────────────────────────────────────────
function updateProductCount() {
  const count = allProducts.filter(p => p.status === 'active').length;
  const countEl = document.getElementById('productCount');
  if (countEl) countEl.textContent = `${count} pieces`;
}

// ── RENDER PRODUCTS ───────────────────────────────────────────────────────────
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const active = products.filter(p => p.status === 'active');

  if (active.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--ink-60)">
        <div style="font-size:3rem;margin-bottom:1rem">🛍️</div>
        <p>No products found in this category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = active.map(product => createProductCard(product)).join('');

  // Wire up add-to-cart buttons
  grid.querySelectorAll('.product-add-btn, .quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('.product-card').dataset.id;
      addToCart(id);
    });
  });

  // Wire up wishlist buttons
  grid.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('.product-card').dataset.id;
      toggleWishlist(id, btn);
    });
  });

  // Wire up card click for quick view
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open quickview when clicking buttons
      if (e.target.closest('button')) return;
      const id = card.dataset.id;
      openQuickView(id);
    });
  });

  // Stagger animation
  grid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

function createProductCard(product) {
  const isWished = wishlist.has(product.id);
  const badgeHTML = product.badge
    ? `<span class="badge badge-${getBadgeClass(product.badge)}">${product.badge}</span>`
    : '';
  const origPriceHTML = product.origPrice
    ? `<span class="product-orig-price">${formatPrice(product.origPrice)}</span>`
    : '';

  const images = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : ['images/White T.png']);
  const primaryImg = images[0];
  const secondaryImg = images.length > 1 ? images[1] : null;

  const viewsBadge = images.length > 1
    ? `<span class="badge badge-views">📷 ${images.length} Views</span>`
    : '';

  const colorSwatches = (product.colors || []).map((c, i) =>
    `<span class="color-swatch ${i === 0 ? 'active' : ''}" style="background:${c}" title="${c}"></span>`
  ).join('');

  return `
    <div class="product-card ${secondaryImg ? 'has-hover-view' : ''}" data-id="${product.id}">
      <div class="product-img-wrap transparency-grid">
        <img class="product-main-img" src="${primaryImg}" alt="${product.name}" loading="lazy" />
        ${secondaryImg ? `<img class="product-hover-img" src="${secondaryImg}" alt="${product.name} alternate view" loading="lazy" />` : ''}
        <div class="product-badges">
          ${badgeHTML}
          ${viewsBadge}
        </div>
        <button class="product-wishlist ${isWished ? 'active' : ''}" title="Add to wishlist">
          ${isWished ? '❤️' : '🤍'}
        </button>
        <button class="quick-add-btn">Quick View / Add +</button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        ${colorSwatches ? `<div class="product-colors">${colorSwatches}</div>` : ''}
        <div class="product-footer">
          <div>
            <span class="product-price">${formatPrice(product.price)}</span>
            ${origPriceHTML}
          </div>
          <button class="product-add-btn" title="Add to cart">+</button>
        </div>
      </div>
    </div>`;
}

function getBadgeClass(badge) {
  const map = { 'NEW': 'new', 'SALE': 'sale', 'HOT': 'new', 'BESTSELLER': 'featured' };
  return map[badge] || 'new';
}

// ── SEARCH ────────────────────────────────────────────────────────────────────
function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  searchBtn?.addEventListener('click', () => {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 100);
  });

  searchClose?.addEventListener('click', closeSearch);
  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  let searchTimer;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const query = e.target.value.trim().toLowerCase();
      renderSearchResults(query);
    }, 200);
  });

  function closeSearch() {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = `<div class="search-placeholder"><span>🔍</span><p>Start typing to search products...</p></div>`;
  }

  window.closeSearch = closeSearch;
}

function renderSearchResults(query) {
  const searchResults = document.getElementById('searchResults');
  if (!searchResults) return;

  if (!query) {
    searchResults.innerHTML = `<div class="search-placeholder"><span>🔍</span><p>Start typing to search products...</p></div>`;
    return;
  }

  const results = allProducts.filter(p =>
    p.status === 'active' && (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      (p.tags || []).some(t => t.toLowerCase().includes(query))
    )
  );

  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="search-no-results">
        <span>😔</span>
        <p>No results for <span class="highlight">"${query}"</span></p>
      </div>`;
    return;
  }

  searchResults.innerHTML = `<div class="search-results-grid">${
    results.map(p => `
      <div class="search-result-card" onclick="closeSearch(); openQuickView('${p.id}')">
        <div class="search-result-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="search-result-info">
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-price">${formatPrice(p.price)}</div>
        </div>
      </div>
    `).join('')
  }</div>`;
}

// ── PRODUCT QUICK VIEW ────────────────────────────────────────────────────────
function initQuickView() {
  const overlay = document.getElementById('quickviewOverlay');
  const closeBtn = document.getElementById('quickviewClose');

  overlay?.addEventListener('click', closeQuickView);
  closeBtn?.addEventListener('click', closeQuickView);
}

let currentQvImages = [];
let currentQvIndex = 0;

window.switchQvImage = function(index) {
  if (index >= 0 && index < currentQvImages.length) {
    currentQvIndex = index;
    const mainImg = document.getElementById('qvMainImg');
    if (mainImg) {
      mainImg.style.opacity = '0';
      mainImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        mainImg.src = currentQvImages[index];
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
      }, 150);
    }
    const counter = document.getElementById('qvImageCounter');
    if (counter) counter.textContent = `${index + 1} / ${currentQvImages.length}`;

    document.querySelectorAll('.qv-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }
};

window.navigateQvGallery = function(delta) {
  if (!currentQvImages.length) return;
  let next = currentQvIndex + delta;
  if (next < 0) next = currentQvImages.length - 1;
  if (next >= currentQvImages.length) next = 0;
  window.switchQvImage(next);
};

function openQuickView(id) {
  const product = ProductStore.getById(id);
  if (!product) return;

  quickViewQty = 1;

  const imageEl = document.getElementById('quickviewImage');
  const infoEl = document.getElementById('quickviewInfo');
  const modal = document.getElementById('quickviewModal');
  const overlay = document.getElementById('quickviewOverlay');

  const images = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : ['images/White T.png']);
  currentQvImages = images;
  currentQvIndex = 0;

  // Render multi-photo gallery in quickview
  imageEl.innerHTML = `
    <div class="qv-gallery-wrap">
      <div class="qv-main-viewport transparency-grid">
        <img id="qvMainImg" src="${images[0]}" alt="${product.name}" />
        ${images.length > 1 ? `
          <button type="button" class="qv-nav-arrow prev" onclick="navigateQvGallery(-1)" aria-label="Previous view">‹</button>
          <button type="button" class="qv-nav-arrow next" onclick="navigateQvGallery(1)" aria-label="Next view">›</button>
          <span class="qv-image-counter" id="qvImageCounter">1 / ${images.length}</span>
        ` : ''}
      </div>
      ${images.length > 1 ? `
        <div class="qv-thumbnails-strip">
          ${images.map((img, idx) => `
            <button type="button" class="qv-thumb ${idx === 0 ? 'active' : ''}" onclick="switchQvImage(${idx})" title="View angle ${idx + 1}">
              <img src="${img}" alt="Angle ${idx + 1}" />
            </button>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  // Discount calculation
  let discountHTML = '';
  if (product.origPrice && product.origPrice > product.price) {
    const discount = Math.round((1 - product.price / product.origPrice) * 100);
    discountHTML = `<span class="qv-discount">-${discount}% OFF</span>`;
  }

  // Colors
  const colorsHTML = (product.colors || []).map(c =>
    `<span class="qv-color-swatch" style="background:${c}"></span>`
  ).join('');

  // Tags
  const tagsHTML = (product.tags || []).map(t =>
    `<span class="qv-tag">${t}</span>`
  ).join('');

  // Stock status
  const stockClass = product.stock < 10 ? 'low' : '';
  const stockText = product.stock < 10
    ? `Only ${product.stock} left in stock!`
    : `${product.stock} in stock`;

  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  quickViewSelectedSize = availableSizes.includes('M') ? 'M' : availableSizes[0];

  infoEl.innerHTML = `
    <div class="qv-category">${product.category}</div>
    <h2 class="qv-name">${product.name}</h2>
    <div class="qv-price-row">
      <span class="qv-price">${formatPrice(product.price)}</span>
      ${product.origPrice ? `<span class="qv-orig-price">${formatPrice(product.origPrice)}</span>` : ''}
      ${discountHTML}
    </div>
    <p class="qv-desc">${product.desc}</p>
    
    <div class="qv-size-row">
      <div class="qv-size-header">
        <span class="qv-size-label">Select Size</span>
        <span class="qv-selected-size-text">Selected: <strong id="qvSelectedSizeVal">${quickViewSelectedSize}</strong></span>
      </div>
      <div class="qv-sizes" id="qvSizesContainer">
        ${availableSizes.map(s => `
          <button type="button" class="qv-size-btn ${s === quickViewSelectedSize ? 'active' : ''}" onclick="selectQuickViewSize('${s}', this)">
            ${s}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="qv-meta">
      ${colorsHTML ? `<div class="qv-meta-row"><strong>Colors</strong><div class="qv-colors">${colorsHTML}</div></div>` : ''}
      ${tagsHTML ? `<div class="qv-meta-row"><strong>Tags</strong><div class="qv-tags">${tagsHTML}</div></div>` : ''}
    </div>
    <div class="qv-qty-row">
      <span class="qv-qty-label">Qty</span>
      <div class="qv-qty-controls">
        <button class="qv-qty-btn" onclick="updateQuickViewQty(-1)">−</button>
        <span class="qv-qty-num" id="qvQtyNum">1</span>
        <button class="qv-qty-btn" onclick="updateQuickViewQty(1)">+</button>
      </div>
    </div>
    <div class="qv-action-row" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button class="btn btn-primary qv-add-btn" style="flex: 1; min-width: 140px;" onclick="addToCartFromQV('${product.id}')">
        Add to Cart
      </button>
      <button class="btn btn-outline qv-buy-btn" style="flex: 1; min-width: 140px; background: var(--bg-secondary); color: var(--text-primary);" onclick="buyNowFromQV('${product.id}')">
        Buy Now — ${formatPrice(product.price)}
      </button>
      <button class="qv-wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}" id="qvWishlistBtn" data-id="${product.id}" onclick="toggleWishlist('${product.id}')" title="Save to Wishlist">
        ${wishlist.has(product.id) ? '❤️' : '🤍'}
      </button>
    </div>
    <div class="qv-stock ${stockClass}">${stockText}</div>
  `;

  modal.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('quickviewModal')?.classList.remove('open');
  document.getElementById('quickviewOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

window.openQuickView = openQuickView;

window.updateQuickViewQty = function(delta) {
  quickViewQty = Math.max(1, quickViewQty + delta);
  const el = document.getElementById('qvQtyNum');
  if (el) el.textContent = quickViewQty;
};

let quickViewSelectedSize = 'M';

window.selectQuickViewSize = function(size, btn) {
  quickViewSelectedSize = size;
  document.querySelectorAll('#qvSizesContainer .qv-size-btn').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');
  const valEl = document.getElementById('qvSelectedSizeVal');
  if (valEl) valEl.textContent = size;
};

window.addToCartFromQV = function(id) {
  const product = ProductStore.getById(id);
  if (!product) return;

  addToCart(id, quickViewQty, quickViewSelectedSize);
  closeQuickView();
};

window.buyNowFromQV = function(id) {
  const product = ProductStore.getById(id);
  if (!product) return;

  addToCart(id, quickViewQty, quickViewSelectedSize);
  window.location.href = 'checkout.html';
};

// ── CART ──────────────────────────────────────────────────────────────────────
function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const checkoutBtn = document.getElementById('checkoutBtn');

  cartBtn?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('🛒 Your cart is empty!');
      return;
    }
    localStorage.setItem('zephyr-cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
  });
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(id, qty = 1, size = 'M') {
  const product = ProductStore.getById(id);
  if (!product) return;

  const chosenSize = size || 'M';
  const existing = cart.find(i => i.id === id && (i.size || 'M') === chosenSize);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, size: chosenSize, qty, ...product });
  }

  renderCart();
  updateCartCount();
  showToast(`🛍️ ${product.name} (Size: ${chosenSize}) added to cart!`);
}

window.addToCart = addToCart;
window.openCart = openCart;

function removeFromCart(id, size = 'M') {
  cart = cart.filter(i => !(i.id === id && (i.size || 'M') === size));
  renderCart();
  updateCartCount();
}

function updateQty(id, size = 'M', delta = 1) {
  const item = cart.find(i => i.id === id && (i.size || 'M') === size);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
  updateCartCount();
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <a href="#products" class="btn btn-primary" style="margin-top:1rem;font-size:0.85rem;padding:0.6rem 1.4rem;" onclick="closeCart()">Start Shopping</a>
      </div>`;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}" data-size="${item.size || 'M'}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='images/White T.png'" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">Size: <span>${item.size || 'M'}</span></div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty('${item.id}', '${item.size || 'M'}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}', '${item.size || 'M'}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}', '${item.size || 'M'}')" title="Remove">✕</button>
    </div>
  `).join('');

  if (footerEl) footerEl.style.display = 'block';
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = count;
}

// ── WISHLIST ──────────────────────────────────────────────────────────────────
function loadWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem('zephyr-wishlist')) || [];
    wishlist = new Set(saved);
  } catch {
    wishlist = new Set();
  }
  updateWishlistCount();
}

function saveWishlist() {
  localStorage.setItem('zephyr-wishlist', JSON.stringify([...wishlist]));
  updateWishlistCount();
  renderWishlist();
}

function initWishlist() {
  const wishlistBtn = document.getElementById('wishlistBtn');
  const wishlistClose = document.getElementById('wishlistClose');
  const wishlistOverlay = document.getElementById('wishlistOverlay');
  const addAllBtn = document.getElementById('addAllWishlistToCartBtn');

  wishlistBtn?.addEventListener('click', openWishlist);
  wishlistClose?.addEventListener('click', closeWishlist);
  wishlistOverlay?.addEventListener('click', closeWishlist);

  addAllBtn?.addEventListener('click', () => {
    if (wishlist.size === 0) return;
    let addedCount = 0;
    wishlist.forEach(id => {
      const p = ProductStore.getById(id);
      if (p) {
        const existing = cart.find(i => i.id === id);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ id, qty: 1, ...p });
        }
        addedCount++;
      }
    });
    renderCart();
    updateCartCount();
    showToast(`🛍️ Added ${addedCount} saved items to your cart!`);
    closeWishlist();
    openCart();
  });
}

function openWishlist() {
  renderWishlist();
  document.getElementById('wishlistSidebar')?.classList.add('open');
  document.getElementById('wishlistOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWishlist() {
  document.getElementById('wishlistSidebar')?.classList.remove('open');
  document.getElementById('wishlistOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderWishlist() {
  const itemsEl = document.getElementById('wishlistItems');
  const footerEl = document.getElementById('wishlistFooter');
  if (!itemsEl) return;

  const wishedProducts = [...wishlist]
    .map(id => ProductStore.getById(id))
    .filter(p => p && p.status === 'active');

  if (wishedProducts.length === 0) {
    itemsEl.innerHTML = `
      <div class="wishlist-empty">
        <div class="wishlist-empty-icon">🤍</div>
        <h4>Your wishlist is empty</h4>
        <p>Explore our streetwear drops and tap the heart icon on any piece you love.</p>
        <a href="#products" onclick="closeWishlist()" class="btn btn-primary" style="margin-top:1rem;font-size:0.82rem;padding:0.6rem 1.4rem;">Explore Collection</a>
      </div>
    `;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = wishedProducts.map(item => `
    <div class="wishlist-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="wishlist-item-img" onerror="this.src='images/White T.png'" />
      <div class="wishlist-item-info">
        <div class="wishlist-item-cat">${item.category}</div>
        <div class="wishlist-item-name">${item.name}</div>
        <div class="wishlist-item-price">${formatPrice(item.price)}</div>
        <div class="wishlist-item-actions">
          <button class="wishlist-item-add" onclick="moveWishlistToCart('${item.id}')">
            Move to Cart 🛍️
          </button>
          <button class="wishlist-item-remove" onclick="removeWishlistItem('${item.id}')" title="Remove from wishlist">✕</button>
        </div>
      </div>
    </div>
  `).join('');

  if (footerEl) footerEl.style.display = 'block';
}

function updateWishlistCount() {
  const count = wishlist.size;
  const badge = document.getElementById('wishlistCount');
  const sub = document.getElementById('wishlistSubtitle');
  const filterBadge = document.getElementById('filterWishlistCount');

  if (badge) badge.textContent = count;
  if (sub) sub.textContent = `${count} saved piece${count === 1 ? '' : 's'}`;
  if (filterBadge) filterBadge.textContent = count;
}

function toggleWishlist(id, btn) {
  const p = ProductStore.getById(id);
  const wasWished = wishlist.has(id);

  if (wasWished) {
    wishlist.delete(id);
    showToast(`🤍 Removed from wishlist`);
  } else {
    wishlist.add(id);
    showToast(`❤️ ${p?.name || 'Item'} added to wishlist!`);
  }

  saveWishlist();

  // Sync heart buttons across all product cards and quickview modal
  document.querySelectorAll(`.product-card[data-id="${id}"] .product-wishlist, #qvWishlistBtn[data-id="${id}"]`).forEach(heartBtn => {
    const isWished = wishlist.has(id);
    heartBtn.classList.toggle('active', isWished);
    heartBtn.textContent = isWished ? '❤️' : '🤍';
  });

  // Re-render if viewing wishlist filter
  if (currentFilter === 'wishlist') {
    const filtered = allProducts.filter(prod => wishlist.has(prod.id) && prod.status === 'active');
    renderProducts(filtered);
  }
}

window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
window.toggleWishlist = toggleWishlist;

window.moveWishlistToCart = function(id) {
  addToCart(id);
  toggleWishlist(id);
};

window.removeWishlistItem = function(id) {
  toggleWishlist(id);
};

// ── TOAST ─────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMsg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// Make showToast globally available
window.showToast = showToast;

// ── NEWSLETTER ────────────────────────────────────────────────────────────────
function initNewsletterForm() {
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    showToast(`✅ Welcome to Zephyr, ${input.value}!`);
    input.value = '';
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function initScrollReveal() {
  const targets = document.querySelectorAll('.feature-card, .section-header, .newsletter-card, .lookbook-header');
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── BACK TO TOP ───────────────────────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── KEYBOARD SUPPORT ──────────────────────────────────────────────────────────
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close search
      const searchOverlay = document.getElementById('searchOverlay');
      if (searchOverlay?.classList.contains('open')) {
        window.closeSearch?.();
        return;
      }
      // Close quick view
      const qvModal = document.getElementById('quickviewModal');
      if (qvModal?.classList.contains('open')) {
        closeQuickView();
        return;
      }
      // Close wishlist
      const wishlistSidebar = document.getElementById('wishlistSidebar');
      if (wishlistSidebar?.classList.contains('open')) {
        closeWishlist();
        return;
      }
      // Close cart
      const cartSidebar = document.getElementById('cartSidebar');
      if (cartSidebar?.classList.contains('open')) {
        closeCart();
        return;
      }
    }

    // Ctrl+K or Cmd+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchBtn')?.click();
    }
  });
}

// ── INTRO VIDEO ──────────────────────────────────────────────────────────────
function initIntro() {
  const overlay = document.getElementById('introOverlay');
  const video = document.getElementById('introVideo');

  if (!overlay || !video) return;

  // Only show intro once per session
  if (sessionStorage.getItem('zephyr-intro-seen-v2')) {
    overlay.classList.add('hidden');
    return;
  }

  // Lock scroll while intro plays
  document.body.classList.add('intro-active');

  function dismissIntro() {
    overlay.classList.add('fade-out');
    document.body.classList.remove('intro-active');
    sessionStorage.setItem('zephyr-intro-seen-v2', '1');
    setTimeout(() => {
      overlay.classList.add('hidden');
      video.pause();
      video.removeAttribute('src');
      video.load();
    }, 800);
  }

  // Start playback
  video.play().catch(() => {
    // If autoplay is blocked, dismiss immediately
    dismissIntro();
  });

  // Auto-dismiss when video ends
  video.addEventListener('ended', dismissIntro);
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}
