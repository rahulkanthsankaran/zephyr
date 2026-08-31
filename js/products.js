/* ============================================
   ZEPHYR — Product Data Store
   Shared between index.html and admin.html
   ============================================ */

'use strict';

// ── DEFAULT PRODUCTS (using actual images) ──────────────────────────────────
const DEFAULT_PRODUCTS = [
  {
    id: 'zph-001',
    name: 'Sniper Cherub Hoodie',
    desc: 'A bold streetwear hoodie featuring a Banksy-inspired cherub sniper graphic. Heavyweight 400gsm fleece, oversized fit.',
    price: 2499,
    origPrice: 3199,
    category: 'fashion',
    stock: 18,
    status: 'active',
    featured: true,
    image: 'images/hoodie.png',
    images: ['images/hoodie.png', 'images/Black T.png'],
    tags: ['hoodie', 'streetwear', 'limited'],
    badge: 'HOT',
    colors: ['#2e7d32', '#000000', '#1a1a1a'],
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'zph-002',
    name: 'No Place To Hide Tee',
    desc: 'Premium heavyweight tee with distressed grim reaper & rottweiler print. 100% ring-spun cotton, pre-shrunk.',
    price: 1299,
    origPrice: 1799,
    category: 'fashion',
    stock: 35,
    status: 'active',
    featured: true,
    image: 'images/no-place-to-hide.png',
    images: ['images/no-place-to-hide.png', 'images/Black T.png'],
    tags: ['tshirt', 'graphic', 'dark'],
    badge: 'BESTSELLER',
    colors: ['#000000'],
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'zph-004',
    name: 'Nothing Happened Tee — Flat',
    desc: 'Flat-lay edition of the iconic Zoro Nothing Happened shirt. Identical premium quality, different mockup.',
    price: 1399,
    origPrice: null,
    category: 'fashion',
    stock: 30,
    status: 'active',
    featured: false,
    image: 'images/nothing-happened-flat.png',
    images: ['images/nothing-happened-flat.png', 'images/White T.png'],
    tags: ['anime', 'onepiece', 'tshirt'],
    badge: null,
    colors: ['#00838f'],
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'zph-005',
    name: 'Fallen Angel Rises — Grey',
    desc: '"In the Shadows of Despair, a Fallen Angel Rises." Gothic skeleton wing artwork on ash grey cotton tee.',
    price: 1499,
    origPrice: 1999,
    category: 'fashion',
    stock: 14,
    status: 'active',
    featured: true,
    image: 'images/fallen-angel-grey.png',
    images: ['images/fallen-angel-grey.png', 'images/Grey T.png'],
    tags: ['gothic', 'darkart', 'tshirt'],
    badge: 'SALE',
    colors: ['#9e9e9e'],
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'zph-006',
    name: 'Crook Vicinity Tee',
    desc: 'Downtown groove vibes. Hand-drawn "Crook Vicinity" graphic with sepia-tone street scene. Premium black cotton.',
    price: 1599,
    origPrice: null,
    category: 'fashion',
    stock: 28,
    status: 'active',
    featured: false,
    image: 'images/crook-vicinity.png',
    images: ['images/crook-vicinity.png', 'images/Grey T.png'],
    tags: ['streetwear', 'urban', 'tshirt'],
    badge: 'NEW',
    colors: ['#000000'],
    createdAt: Date.now() - 86400000 * 0.5
  },
  {
    id: 'zph-007',
    name: 'We Bare Bears Tee',
    desc: 'Bring the wholesome cartoon energy. We Bare Bears stack print on crisp white 180gsm cotton.',
    price: 999,
    origPrice: 1299,
    category: 'lifestyle',
    stock: 50,
    status: 'active',
    featured: false,
    image: 'images/we-bare-bears.png',
    images: ['images/we-bare-bears.png', 'images/Pink T.png'],
    tags: ['cartoon', 'cute', 'tshirt'],
    badge: 'SALE',
    colors: ['#ffffff'],
    createdAt: Date.now() - 86400000 * 10
  },
  {
    id: 'zph-008',
    name: 'Luffy Wanted — Terracotta',
    desc: 'Monkey D. Luffy Gear 5 Wanted poster printed on a terracotta tee. One Piece collection.',
    price: 1499,
    origPrice: null,
    category: 'fashion',
    stock: 19,
    status: 'active',
    featured: true,
    image: 'images/luffy-wanted-terracotta.png',
    images: ['images/luffy-wanted-terracotta.png', 'images/White T.png'],
    tags: ['onepiece', 'anime', 'luffy'],
    badge: 'HOT',
    colors: ['#b5541a'],
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'zph-009',
    name: 'Shanks Wanted — Sand',
    desc: 'Red-Haired Shanks Wanted Poster. 4,048,900,000 Berries bounty. Vintage-wash sand cotton tee.',
    price: 1499,
    origPrice: null,
    category: 'fashion',
    stock: 12,
    status: 'active',
    featured: false,
    image: 'images/shanks-wanted-sand.png',
    images: ['images/shanks-wanted-sand.png', 'images/Beige T.png'],
    tags: ['onepiece', 'anime', 'shanks'],
    badge: null,
    colors: ['#e8d5b7'],
    createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'zph-011',
    name: 'Eren AOT Panel Tee',
    desc: 'Attack on Titan manga panel collage — Eren Rumbling scene. Monochrome print on white unisex tee.',
    price: 1399,
    origPrice: null,
    category: 'fashion',
    stock: 25,
    status: 'active',
    featured: false,
    image: 'images/eren-aot-panel.png',
    images: ['images/eren-aot-panel.png', 'images/White T.png'],
    tags: ['aot', 'anime', 'manga'],
    badge: 'NEW',
    colors: ['#ffffff'],
    createdAt: Date.now() - 86400000 * 1.5
  },
  {
    id: 'zph-013',
    name: 'Classic Pink Tee',
    desc: 'The essential plain tee in soft pink. 220gsm ring-spun cotton, ribbed collar, retail-fit cut.',
    price: 799,
    origPrice: null,
    category: 'fashion',
    stock: 60,
    status: 'active',
    featured: false,
    image: 'images/Pink T.png',
    images: ['images/Pink T.png', 'images/White T.png'],
    tags: ['basics', 'plain', 'pink'],
    badge: null,
    colors: ['#f48fb1'],
    createdAt: Date.now() - 86400000 * 11
  },
  {
    id: 'zph-014',
    name: 'Soft Beige Tee',
    desc: 'Neutral earth-tone luxury. Pure combed cotton in a warm aesthetic beige.',
    price: 799,
    origPrice: null,
    category: 'fashion',
    stock: 45,
    status: 'active',
    featured: false,
    image: 'images/Beige T.png',
    images: ['images/Beige T.png', 'images/White T.png'],
    tags: ['basics', 'plain', 'beige'],
    badge: null,
    colors: ['#d7ccc8'],
    createdAt: Date.now() - 86400000 * 12
  },
  {
    id: 'zph-015',
    name: 'Sky Blue Tee',
    desc: 'Vibrant sky blue minimal tee. Breathable summer weight, pre-washed for zero shrinkage.',
    price: 799,
    origPrice: null,
    category: 'fashion',
    stock: 38,
    status: 'active',
    featured: false,
    image: 'images/Blue T.png',
    images: ['images/Blue T.png', 'images/White T.png'],
    tags: ['basics', 'plain', 'blue'],
    badge: null,
    colors: ['#81d4fa'],
    createdAt: Date.now() - 86400000 * 13
  },
  {
    id: 'zph-016',
    name: 'Heather Grey Tee',
    desc: 'The timeless grey melange tee. Ultra-soft jersey knit, reinforced shoulder taping.',
    price: 799,
    origPrice: null,
    category: 'fashion',
    stock: 55,
    status: 'active',
    featured: false,
    image: 'images/Grey T.png',
    images: ['images/Grey T.png', 'images/White T.png'],
    tags: ['basics', 'plain', 'grey'],
    badge: null,
    colors: ['#bdbdbd'],
    createdAt: Date.now() - 86400000 * 14
  },
  {
    id: 'zph-017',
    name: 'Crisp White Tee',
    desc: 'The ultimate wardrobe foundation. Pure optical white tee, clean neckline, relaxed streetwear drape.',
    price: 799,
    origPrice: null,
    category: 'fashion',
    stock: 70,
    status: 'active',
    featured: false,
    image: 'images/White T.png',
    images: ['images/White T.png', 'images/Grey T.png'],
    tags: ['basics', 'plain', 'white'],
    badge: null,
    colors: ['#ffffff'],
    createdAt: Date.now() - 86400000 * 14.5
  },
  {
    id: 'zph-018',
    name: 'Onyx Black Tee',
    desc: 'Deep jet black minimal tee. Reactive-dyed to prevent fading, premium midweight hand-feel.',
    price: 799,
    origPrice: null,
    category: 'fashion',
    stock: 80,
    status: 'active',
    featured: false,
    image: 'images/Black T.png',
    images: ['images/Black T.png', 'images/Grey T.png'],
    tags: ['basics', 'plain', 'black'],
    badge: null,
    colors: ['#000000'],
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: 'zph-019',
    name: 'Zephyr Classic Cap',
    desc: 'Premium dad hat with embroidered Zephyr logo. Adjustable strap, 100% cotton.',
    price: 699,
    origPrice: 999,
    category: 'accessories',
    stock: 45,
    status: 'active',
    featured: true,
    image: 'images/cap.jpg',
    images: ['images/cap.jpg'],
    tags: ['cap', 'accessories', 'headwear'],
    badge: 'NEW',
    colors: ['#000000'],
    createdAt: Date.now() - 86400000 * 0.1
  },
  {
    id: 'zph-020',
    name: 'Zephyr Street Kicks',
    desc: 'Classic streetwear sneakers. High-top design, premium vegan leather, cushioned sole.',
    price: 3499,
    origPrice: 4299,
    category: 'shoes',
    stock: 20,
    status: 'active',
    featured: true,
    image: 'images/shoes.jpeg',
    images: ['images/shoes.jpeg'],
    tags: ['shoes', 'sneakers', 'footwear'],
    badge: 'HOT',
    colors: ['#ffffff', '#000000'],
    createdAt: Date.now() - 86400000 * 0.2
  },
  {
    id: 'zph-021',
    name: 'Fox Graphic Tee',
    desc: 'Minimalist fox line-art on premium cotton.',
    price: 1199,
    origPrice: null,
    category: 'fashion',
    stock: 35,
    status: 'active',
    featured: false,
    image: 'images/fox T.png',
    images: ['images/fox T.png', 'images/Black T.png'],
    tags: ['graphic', 'tshirt', 'fox'],
    badge: null,
    colors: ['#000000'],
    createdAt: Date.now() - 86400000 * 0.3
  },
  {
    id: 'zph-022',
    name: 'Kick Graphic Tee',
    desc: 'Dynamic kick action graphic tee. Heavyweight fabric.',
    price: 1299,
    origPrice: 1599,
    category: 'fashion',
    stock: 40,
    status: 'active',
    featured: false,
    image: 'images/Kick T.png',
    images: ['images/Kick T.png', 'images/White T.png'],
    tags: ['graphic', 'tshirt', 'action'],
    badge: 'SALE',
    colors: ['#ffffff'],
    createdAt: Date.now() - 86400000 * 0.4
  },
  {
    id: 'zph-023',
    name: 'Mini Graphic Tee',
    desc: 'Subtle mini embroidered graphic tee. Perfect for layering.',
    price: 999,
    origPrice: null,
    category: 'fashion',
    stock: 50,
    status: 'active',
    featured: false,
    image: 'images/mini T.png',
    images: ['images/mini T.png', 'images/Grey T.png'],
    tags: ['minimal', 'tshirt'],
    badge: null,
    colors: ['#9e9e9e'],
    createdAt: Date.now() - 86400000 * 0.5
  }
];

// ── STORAGE KEY ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'zephyr_products_v5';

// ── PRODUCT STORE ───────────────────────────────────────────────────────────
const ProductStore = {
  /**
   * Load products from localStorage or return defaults.
   */
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => {
            const images = Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : (p.image ? [p.image] : ['images/White T.png']);
            return {
              ...p,
              image: images[0],
              images,
              sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL']
            };
          });
        }
      }
    } catch (e) {
      console.warn('Storage read fallback:', e);
    }
    // Seed defaults on first load
    const defaults = DEFAULT_PRODUCTS.map(p => {
      const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image];
      return {
        ...p,
        image: images[0],
        images,
        sizes: ['S', 'M', 'L', 'XL']
      };
    });
    this.save(defaults);
    return defaults;
  },

  /**
   * Persist products to localStorage.
   */
  save(products) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      // Dispatch event for instant same-tab reactive updates
      window.dispatchEvent(new CustomEvent('zephyr_products_updated', { detail: { products } }));
    } catch (e) {
      console.error('Storage error:', e);
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        alert('⚠️ Image is too large for browser storage. Please choose smaller images or URLs.');
      }
    }
  },

  /**
   * Get all products.
   */
  getAll() { return this.load(); },

  /**
   * Get a product by id.
   */
  getById(id) { return this.getAll().find(p => p.id === id) || null; },

  /**
   * Add a new product. Returns the created product.
   */
  add(data) {
    const products = this.getAll();
    const images = Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : (data.image ? [data.image] : ['images/White T.png']);
    const product = {
      id: 'zph-' + Date.now(),
      createdAt: Date.now(),
      image: images[0],
      images,
      badge: null,
      colors: ['#333333'],
      tags: [],
      sizes: data.sizes && data.sizes.length > 0 ? data.sizes : ['S', 'M', 'L', 'XL'],
      origPrice: data.origPrice || null,
      featured: data.featured || false,
      ...data,
      image: images[0],
      images
    };
    products.unshift(product);
    this.save(products);
    return product;
  },

  /**
   * Update an existing product by id.
   */
  update(id, data) {
    const products = this.getAll();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const images = Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : (data.image ? [data.image] : (products[idx].images || [products[idx].image]));
    products[idx] = {
      ...products[idx],
      ...data,
      image: images[0],
      images
    };
    this.save(products);
    return products[idx];
  },

  /**
   * Delete a product by id.
   */
  delete(id) {
    const products = this.getAll().filter(p => p.id !== id);
    this.save(products);
  },

  /**
   * Delete multiple products.
   */
  deleteMany(ids) {
    const products = this.getAll().filter(p => !ids.includes(p.id));
    this.save(products);
  },

  /**
   * Bulk update status.
   */
  setStatusMany(ids, status) {
    const products = this.getAll().map(p =>
      ids.includes(p.id) ? { ...p, status } : p
    );
    this.save(products);
  },

  /**
   * Reset to defaults.
   */
  reset() {
    this.save([...DEFAULT_PRODUCTS]);
    return [...DEFAULT_PRODUCTS];
  }
};

// Expose globally
window.ProductStore = ProductStore;
