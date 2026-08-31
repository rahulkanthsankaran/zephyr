/* ============================================
   ZEPHYR — Admin Dashboard JS
   admin.html logic
   ============================================ */

'use strict';

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin';
const AUTH_KEY = 'zephyr_admin_auth';

// ── STATE ─────────────────────────────────────────────────────────────────────
let products = [];
let selectedIds = new Set();
let currentAdminFilter = 'all';
let currentStatusFilter = 'all';
let currentSort = 'newest';
let currentView = 'table'; // 'table' | 'grid'
let editingId = null;
let deleteTargetId = null;

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoginGate();
});

// ── LOGIN GATE ────────────────────────────────────────────────────────────────
function initLoginGate() {
  const overlay = document.getElementById('loginOverlay');
  const form = document.getElementById('loginForm');
  const passwordInput = document.getElementById('loginPassword');
  const errorEl = document.getElementById('loginError');

  // Check if already authenticated
  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    overlay.classList.add('hidden');
    initDashboard();
    return;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwd = passwordInput.value.trim();

    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      overlay.classList.add('hidden');
      errorEl.textContent = '';
      initDashboard();
    } else {
      errorEl.textContent = 'Incorrect password. Please try again.';
      passwordInput.value = '';
      passwordInput.focus();
      // Shake animation
      const card = overlay.querySelector('.login-card');
      card.style.animation = 'none';
      card.offsetHeight; // trigger reflow
      card.style.animation = 'login-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  });
}

function initDashboard() {
  products = ProductStore.getAll();
  renderTable();
  renderDashboard();
  renderOrders();
  initSidebar();
  initTopbar();
  initNotifications();
  renderNotifications();
  initModal();
  initDeleteModal();
  initOrderModal();
  initOrderSearch();
  initFilters();
  initViewToggle();
  initSearch();
  initSelectAll();
  initImagePreview();
  initAnalytics();
  initSettings();
}

// ── SIDEBAR & TABS ────────────────────────────────────────────────────────────
function initSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');

  menuToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
  sidebarClose?.addEventListener('click', () => sidebar.classList.remove('open'));

  document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.tab);
      sidebar.classList.remove('open');
    });
  });
}

function switchTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar-link[data-tab]').forEach(l => l.classList.remove('active'));

  const tab = document.getElementById('tab-' + tabName);
  const link = document.querySelector(`.sidebar-link[data-tab="${tabName}"]`);

  if (tab) tab.classList.add('active');
  if (link) link.classList.add('active');

  const breadcrumb = document.getElementById('breadcrumbCurrent');
  if (breadcrumb) breadcrumb.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
}

// Make switchTab globally available (called from HTML onclick)
window.switchTab = switchTab;

// ── TOP BAR & NOTIFICATIONS ───────────────────────────────────────────────────
let lastKnownOrderCount = null;

function getReadOrders() {
  try {
    return new Set(JSON.parse(localStorage.getItem('zephyr_read_orders') || '[]'));
  } catch {
    return new Set();
  }
}

function saveReadOrders(readSet) {
  localStorage.setItem('zephyr_read_orders', JSON.stringify([...readSet]));
}

function initTopbar() {
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    const overlay = document.getElementById('loginOverlay');
    overlay.classList.remove('hidden');
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginPassword').focus();
    showAdminToast('🔒', 'Logged out successfully');
  });
}

function initNotifications() {
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifClearBtn = document.getElementById('notifClearBtn');
  const notifViewOrdersBtn = document.getElementById('notifViewOrdersBtn');

  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    renderNotifications();
    notifDropdown?.classList.toggle('open');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#topbarNotifWrap')) {
      notifDropdown?.classList.remove('open');
    }
  });

  notifClearBtn?.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
    const readSet = new Set(orders.map(o => o.id));
    saveReadOrders(readSet);
    renderNotifications();
    showAdminToast('✓', 'All notifications marked as read');
  });

  notifViewOrdersBtn?.addEventListener('click', () => {
    switchTab('orders');
    notifDropdown?.classList.remove('open');
  });

  // Real-time storage listener (detects new orders when placed in another tab/window)
  window.addEventListener('storage', (e) => {
    if (e.key === 'zephyr_orders') {
      handleNewOrderArrival();
    }
  });

  // Background heartbeat polling (every 2.5s) to catch same-session updates
  const orders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  lastKnownOrderCount = orders.length;

  setInterval(() => {
    const currentOrders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
    if (lastKnownOrderCount !== null && currentOrders.length > lastKnownOrderCount) {
      handleNewOrderArrival();
    }
    lastKnownOrderCount = currentOrders.length;
  }, 2500);
}

function handleNewOrderArrival() {
  const orders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  lastKnownOrderCount = orders.length;
  renderOrders();
  renderDashboard();
  renderNotifications();

  if (orders.length > 0) {
    const latest = orders[0];
    showAdminToast('🔔', `New Order #${latest.id} from ${latest.customer} (${formatAdminPrice(latest.total)})`);
  }
}

function renderNotifications() {
  const listEl = document.getElementById('notifList');
  const dotEl = document.getElementById('notifDot');
  const countEl = document.getElementById('notifUnreadCount');
  if (!listEl) return;

  const orders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  const readSet = getReadOrders();
  const unreadOrders = orders.filter(o => !readSet.has(o.id));

  // Pulse dot if unread orders exist
  if (dotEl) {
    dotEl.classList.toggle('active', unreadOrders.length > 0);
  }

  // Header unread count
  if (countEl) {
    countEl.textContent = unreadOrders.length > 0 
      ? `${unreadOrders.length} new order${unreadOrders.length === 1 ? '' : 's'}`
      : 'All caught up';
  }

  if (orders.length === 0) {
    listEl.innerHTML = `
      <div class="notif-empty">
        <div class="notif-empty-icon">🔔</div>
        <p>No new orders yet.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = orders.map(order => {
    const isUnread = !readSet.has(order.id);
    const date = new Date(order.date).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return `
      <div class="notif-item ${isUnread ? 'unread' : ''}" onclick="openOrderFromNotif('${order.id}')">
        <div class="notif-item-icon">🛍️</div>
        <div class="notif-item-content">
          <div class="notif-item-title">New Order: ${order.id} ${isUnread ? '🔴' : ''}</div>
          <div class="notif-item-sub">${order.customer} • ${order.items} item(s) • ${formatAdminPrice(order.total)}</div>
          <div class="notif-item-time">${date}</div>
        </div>
      </div>
    `;
  }).join('');
}

window.openOrderFromNotif = function(orderId) {
  const readSet = getReadOrders();
  readSet.add(orderId);
  saveReadOrders(readSet);
  renderNotifications();
  switchTab('orders');
  document.getElementById('notifDropdown')?.classList.remove('open');
};

// ── ADD/EDIT MODAL ────────────────────────────────────────────────────────────
// ── BACKGROUND REMOVAL & IMAGE PROCESSING ─────────────────────────────────────
let originalImageDataUrl = '';

/**
 * Smart Client-Side Background Removal using HTML5 Canvas & Flood Fill Matting
 * Analyzes border colors, detects background luminance/chroma, and creates transparent PNGs.
 */
function removeImageBackground(imgSrc, callback, tolerance = 38) {
  if (!imgSrc) {
    callback('');
    return;
  }

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const maxDim = 800;
    let w = img.width;
    let h = img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);

    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Sample boundary pixels
      const samples = [];
      const stepX = Math.max(1, Math.floor(w / 15));
      const stepY = Math.max(1, Math.floor(h / 15));

      for (let x = 0; x < w; x += stepX) {
        samples.push(getPixel(x, 0, w, data));
        samples.push(getPixel(x, h - 1, w, data));
      }
      for (let y = 0; y < h; y += stepY) {
        samples.push(getPixel(0, y, w, data));
        samples.push(getPixel(w - 1, y, w, data));
      }

      let bgR = 0, bgG = 0, bgB = 0, count = 0;
      samples.forEach(s => {
        if (s.a > 30) {
          bgR += s.r;
          bgG += s.g;
          bgB += s.b;
          count++;
        }
      });

      if (count === 0) {
        callback(canvas.toDataURL('image/png'));
        return;
      }

      bgR = Math.round(bgR / count);
      bgG = Math.round(bgG / count);
      bgB = Math.round(bgB / count);

      // BFS Flood-fill background pixels from borders
      const visited = new Uint8Array(w * h);
      const queue = [];

      for (let x = 0; x < w; x++) {
        queue.push(x, 0);
        queue.push(x, h - 1);
      }
      for (let y = 0; y < h; y++) {
        queue.push(0, y);
        queue.push(w - 1, y);
      }

      let head = 0;
      while (head < queue.length) {
        const x = queue[head++];
        const y = queue[head++];
        const idx = y * w + x;

        if (visited[idx]) continue;
        visited[idx] = 1;

        const pIdx = idx * 4;
        const r = data[pIdx];
        const g = data[pIdx + 1];
        const b = data[pIdx + 2];
        const a = data[pIdx + 3];

        if (a < 10) continue;

        const dist = Math.sqrt(
          (r - bgR) ** 2 +
          (g - bgG) ** 2 +
          (b - bgB) ** 2
        );

        const isStudioWhite = (bgR > 215 && bgG > 215 && bgB > 215) && (r > 210 && g > 210 && b > 210);

        if (dist <= tolerance || isStudioWhite) {
          if (dist > tolerance * 0.7 && !isStudioWhite) {
            const factor = (dist - tolerance * 0.7) / (tolerance * 0.3);
            data[pIdx + 3] = Math.round(255 * factor);
          } else {
            data[pIdx + 3] = 0; // Transparent
          }

          if (x > 0 && !visited[idx - 1]) queue.push(x - 1, y);
          if (x < w - 1 && !visited[idx + 1]) queue.push(x + 1, y);
          if (y > 0 && !visited[idx - w]) queue.push(x, y - 1);
          if (y < h - 1 && !visited[idx + w]) queue.push(x, y + 1);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      callback(canvas.toDataURL('image/png'));
    } catch (e) {
      console.warn('Canvas pixel processing fallback:', e);
      callback(canvas.toDataURL('image/png'));
    }
  };

  img.onerror = () => {
    callback(imgSrc);
  };

  img.src = imgSrc;
}

function getPixel(x, y, w, data) {
  const i = (y * w + x) * 4;
  return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
}

// ── MULTI-PHOTOS GALLERY & IMAGE PROCESSING ──────────────────────────────────
let currentProductImages = [];

/**
 * Render the multi-photos gallery cards inside the product modal.
 */
function renderMultiPhotosGallery() {
  const container = document.getElementById('multiPhotosGallery');
  if (!container) return;

  if (currentProductImages.length === 0) {
    container.innerHTML = `
      <div class="empty-photos-placeholder transparency-grid">
        <span class="empty-icon">🖼️</span>
        <p>No photos added yet. Upload files or paste URLs below to add multi-angle product views.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = currentProductImages.map((imgUrl, idx) => {
    const isMain = idx === 0;
    return `
      <div class="photo-card transparency-grid ${isMain ? 'is-main' : ''}" data-idx="${idx}">
        <div class="photo-img-wrap">
          <img src="${imgUrl}" alt="Product angle ${idx + 1}" />
          ${isMain ? `<span class="photo-main-badge">★ Cover</span>` : `<span class="photo-angle-badge">View #${idx + 1}</span>`}
        </div>
        <div class="photo-card-actions">
          <button type="button" class="photo-action-btn btn-photo-bg" onclick="removeSinglePhotoBg(${idx})" title="Remove background from this photo">
            🪄 BG
          </button>
          ${!isMain ? `
            <button type="button" class="photo-action-btn btn-photo-main" onclick="setMainPhoto(${idx})" title="Set as main cover photo">
              ★ Cover
            </button>
          ` : ''}
          <button type="button" class="photo-action-btn btn-photo-del" onclick="deletePhoto(${idx})" title="Delete this photo angle">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Sync hidden input
  const hiddenImgInput = document.getElementById('productImage');
  if (hiddenImgInput) {
    hiddenImgInput.value = currentProductImages[0] || 'images/White T.png';
  }
}

window.setMainPhoto = function(idx) {
  if (idx > 0 && idx < currentProductImages.length) {
    const chosen = currentProductImages.splice(idx, 1)[0];
    currentProductImages.unshift(chosen);
    renderMultiPhotosGallery();
    showAdminToast('★', 'Main cover photo updated!');
  }
};

window.deletePhoto = function(idx) {
  if (idx >= 0 && idx < currentProductImages.length) {
    currentProductImages.splice(idx, 1);
    renderMultiPhotosGallery();
    showAdminToast('✓', 'Photo removed.');
  }
};

window.removeSinglePhotoBg = function(idx) {
  if (idx >= 0 && idx < currentProductImages.length) {
    showAdminToast('🪄', `Removing background from photo #${idx + 1}...`);
    removeImageBackground(currentProductImages[idx], (cleanUrl) => {
      currentProductImages[idx] = cleanUrl;
      renderMultiPhotosGallery();
      showAdminToast('✨', `Background removed for photo #${idx + 1}!`);
    });
  }
};

/**
 * Compress an image file to a lightweight data URL (<50KB) via HTML5 Canvas
 */
function compressImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const rawDataUrl = event.target.result;
    const img = new Image();
    img.onload = () => {
      const maxDim = 800;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
        else { w = Math.round((w * maxDim) / h); h = maxDim; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL('image/jpeg', 0.85);
      callback(compressed);
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
}

function initModal() {
  const addBtn = document.getElementById('addProductBtn');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('modalCancel');
  const form = document.getElementById('productForm');

  addBtn?.addEventListener('click', () => openModal(null));
  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  form?.addEventListener('submit', handleFormSubmit);

  // Multi-Image Upload & Management
  const uploadImageBtn = document.getElementById('uploadImageBtn');
  const imageFileInput = document.getElementById('imageFileInput');
  const btnAddPhotoUrl = document.getElementById('btnAddPhotoUrl');
  const addPhotoUrlInput = document.getElementById('addPhotoUrlInput');
  const btnRemoveAllBg = document.getElementById('btnRemoveAllBg');

  uploadImageBtn?.addEventListener('click', () => {
    imageFileInput?.click();
  });

  imageFileInput?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    showAdminToast('⏳', `Processing ${files.length} image(s)...`);
    const autoRemove = Boolean(document.getElementById('autoRemoveBg')?.checked);

    let processed = 0;
    files.forEach(file => {
      compressImageFile(file, (compressedUrl) => {
        if (autoRemove) {
          removeImageBackground(compressedUrl, (cleanUrl) => {
            currentProductImages.push(cleanUrl);
            processed++;
            if (processed === files.length) {
              renderMultiPhotosGallery();
              showAdminToast('✨', `${files.length} photo(s) added with transparent background!`);
            }
          });
        } else {
          currentProductImages.push(compressedUrl);
          processed++;
          if (processed === files.length) {
            renderMultiPhotosGallery();
            showAdminToast('✓', `${files.length} photo(s) added!`);
          }
        }
      });
    });

    // Reset input so same files can be re-selected if needed
    imageFileInput.value = '';
  });

  function addUrlPhoto() {
    const url = addPhotoUrlInput?.value.trim();
    if (!url) {
      showAdminToast('⚠️', 'Please enter an image URL first.');
      return;
    }

    const autoRemove = Boolean(document.getElementById('autoRemoveBg')?.checked);
    if (autoRemove) {
      showAdminToast('🪄', 'Removing background from URL image...');
      removeImageBackground(url, (cleanUrl) => {
        currentProductImages.push(cleanUrl);
        addPhotoUrlInput.value = '';
        renderMultiPhotosGallery();
        showAdminToast('✨', 'Photo added with transparent background!');
      });
    } else {
      currentProductImages.push(url);
      addPhotoUrlInput.value = '';
      renderMultiPhotosGallery();
      showAdminToast('✓', 'Photo added!');
    }
  }

  btnAddPhotoUrl?.addEventListener('click', addUrlPhoto);
  addPhotoUrlInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUrlPhoto();
    }
  });

  const autoRemoveToggle = document.getElementById('autoRemoveBg');
  autoRemoveToggle?.addEventListener('change', (e) => {
    if (e.target.checked) {
      showAdminToast('🪄', 'Auto-remove background is ON');
    } else {
      showAdminToast('ℹ️', 'Auto-remove background is OFF');
    }
  });

  btnRemoveAllBg?.addEventListener('click', () => {
    if (currentProductImages.length === 0) {
      showAdminToast('⚠️', 'No product photos to process.');
      return;
    }
    showAdminToast('🪄', 'Removing background from all photos...');
    let done = 0;
    currentProductImages.forEach((img, idx) => {
      removeImageBackground(img, (clean) => {
        currentProductImages[idx] = clean;
        done++;
        if (done === currentProductImages.length) {
          renderMultiPhotosGallery();
          showAdminToast('✨', 'All product photos updated with clean cutouts!');
        }
      });
    });
  });
}

function openModal(product) {
  editingId = product ? product.id : null;
  const modal = document.getElementById('productModal');
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');

  title.textContent = product ? 'Edit Product' : 'Add New Product';

  // Load existing images or fallback to default
  if (product && Array.isArray(product.images) && product.images.length > 0) {
    currentProductImages = [...product.images];
  } else if (product && product.image) {
    currentProductImages = [product.image];
  } else {
    currentProductImages = ['images/White T.png'];
  }

  renderMultiPhotosGallery();

  // Reset / fill form
  document.getElementById('productId').value = product?.id || '';
  document.getElementById('productName').value = product?.name || '';
  document.getElementById('productDesc').value = product?.desc || '';
  document.getElementById('productPrice').value = product?.price || '';
  document.getElementById('productOrigPrice').value = product?.origPrice || '';
  document.getElementById('productCategory').value = product?.category || '';
  document.getElementById('productStock').value = product?.stock ?? '';
  document.getElementById('productStatus').value = product?.status || 'active';
  document.getElementById('productBadge').value = product?.badge || '';
  document.getElementById('productImage').value = currentProductImages[0] || '';
  document.getElementById('productTags').value = (product?.tags || []).join(', ');
  document.getElementById('productFeatured').checked = product?.featured || false;

  const autoBgCheck = document.getElementById('autoRemoveBg');
  if (autoBgCheck) autoBgCheck.checked = false;

  const urlInput = document.getElementById('addPhotoUrlInput');
  if (urlInput) urlInput.value = '';

  // Set Size checkboxes
  const prodSizes = product ? (product.sizes || ['S', 'M', 'L', 'XL']) : ['S', 'M', 'L', 'XL'];
  document.querySelectorAll('input[name="productSize"]').forEach(cb => {
    cb.checked = prodSizes.includes(cb.value);
  });

  // Set Color checkboxes
  const prodColors = product ? (product.colors || []) : [];
  document.querySelectorAll('input[name="productColor"]').forEach(cb => {
    cb.checked = prodColors.includes(cb.value);
  });

  modal.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('productName')?.focus(), 100);
}

function closeModal() {
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  editingId = null;
  currentProductImages = [];
  const urlInput = document.getElementById('addPhotoUrlInput');
  if (urlInput) urlInput.value = '';
}

function handleFormSubmit(e) {
  e.preventDefault();

  const selectedSizes = Array.from(document.querySelectorAll('input[name="productSize"]:checked')).map(cb => cb.value);
  const selectedColors = Array.from(document.querySelectorAll('input[name="productColor"]:checked')).map(cb => cb.value);

  const finalImages = currentProductImages.length > 0
    ? currentProductImages
    : ['images/White T.png'];

  const data = {
    name: document.getElementById('productName').value.trim(),
    desc: document.getElementById('productDesc').value.trim(),
    price: parseFloat(document.getElementById('productPrice').value) || 0,
    origPrice: parseFloat(document.getElementById('productOrigPrice').value) || null,
    category: document.getElementById('productCategory').value || 'fashion',
    stock: parseInt(document.getElementById('productStock').value) || 0,
    status: document.getElementById('productStatus').value || 'active',
    badge: document.getElementById('productBadge').value.trim() || null,
    image: finalImages[0],
    images: finalImages,
    tags: document.getElementById('productTags').value.split(',').map(t => t.trim()).filter(Boolean),
    sizes: selectedSizes.length > 0 ? selectedSizes : ['S', 'M', 'L', 'XL'],
    colors: selectedColors,
    featured: document.getElementById('productFeatured').checked
  };

  if (editingId) {
    ProductStore.update(editingId, data);
    showAdminToast('✓', 'Product updated successfully!');
  } else {
    ProductStore.add(data);
    showAdminToast('✓', 'Product added successfully!');
  }

  // Reset filters to show the newly added item
  currentStatusFilter = 'all';
  currentAdminFilter = 'all';
  document.querySelectorAll('.admin-filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.status === 'all');
  });
  const catFilter = document.getElementById('categoryFilter');
  if (catFilter) catFilter.value = 'all';

  products = ProductStore.getAll();
  renderTable();
  renderDashboard();
  closeModal();
}

// ── IMAGE PREVIEW ─────────────────────────────────────────────────────────────
function initImagePreview() {
  // Legacy stub for backward compatibility
}

// ── DELETE MODAL ──────────────────────────────────────────────────────────────
function initDeleteModal() {
  document.getElementById('deleteCancelBtn')?.addEventListener('click', closeDeleteModal);
  document.getElementById('deleteOverlay')?.addEventListener('click', closeDeleteModal);
  document.getElementById('deleteConfirmBtn')?.addEventListener('click', confirmDelete);
}

function openDeleteModal(id) {
  deleteTargetId = id;
  const product = ProductStore.getById(id);
  document.getElementById('deleteProductName').textContent = product?.name || 'this product';
  document.getElementById('deleteModal').classList.add('open');
  document.getElementById('deleteOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('open');
  document.getElementById('deleteOverlay').classList.remove('open');
  document.body.style.overflow = '';
  deleteTargetId = null;
}

function confirmDelete() {
  if (!deleteTargetId) return;
  ProductStore.delete(deleteTargetId);
  products = ProductStore.getAll();
  selectedIds.delete(deleteTargetId);
  renderTable();
  renderDashboard();
  closeDeleteModal();
  showAdminToast('✓', 'Product deleted.');
}

// ── FILTERS ───────────────────────────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.admin-filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentStatusFilter = tab.dataset.status;
      renderTable();
    });
  });

  document.getElementById('categoryFilter')?.addEventListener('change', e => {
    currentAdminFilter = e.target.value;
    renderTable();
  });

  document.getElementById('sortFilter')?.addEventListener('change', e => {
    currentSort = e.target.value;
    renderTable();
  });
}

// ── SEARCH ────────────────────────────────────────────────────────────────────
let searchDebounce;
function initSearch() {
  document.getElementById('adminSearch')?.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      const q = e.target.value;
      const isOrdersTab = document.getElementById('tab-orders')?.classList.contains('active');
      if (isOrdersTab) {
        const orderInput = document.getElementById('orderSearchInput');
        if (orderInput) orderInput.value = q;
        const clearBtn = document.getElementById('orderClearSearchBtn');
        if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
        filterOrders();
      } else {
        renderTable(q.toLowerCase());
      }
    }, 200);
  });
}

// ── VIEW TOGGLE ───────────────────────────────────────────────────────────────
function initViewToggle() {
  document.getElementById('viewTable')?.addEventListener('click', () => {
    setView('table');
  });
  document.getElementById('viewGrid')?.addEventListener('click', () => {
    setView('grid');
  });
}

function setView(view) {
  currentView = view;
  const tableWrap = document.getElementById('adminTableWrap');
  const gridWrap = document.getElementById('adminProductsGrid');
  const tableBtn = document.getElementById('viewTable');
  const gridBtn = document.getElementById('viewGrid');

  if (view === 'table') {
    tableWrap.style.display = '';
    gridWrap.style.display = 'none';
    tableBtn?.classList.add('active');
    gridBtn?.classList.remove('active');
  } else {
    tableWrap.style.display = 'none';
    gridWrap.style.display = 'grid';
    tableBtn?.classList.remove('active');
    gridBtn?.classList.add('active');
    renderGrid();
  }
}

// ── SELECT ALL ────────────────────────────────────────────────────────────────
function initSelectAll() {
  document.getElementById('selectAll')?.addEventListener('change', (e) => {
    const visible = getFilteredProducts();
    if (e.target.checked) {
      visible.forEach(p => selectedIds.add(p.id));
    } else {
      visible.forEach(p => selectedIds.delete(p.id));
    }
    renderTable();
  });
}

// ── BULK ACTIONS ──────────────────────────────────────────────────────────────
function updateBulkBar() {
  const bar = document.getElementById('bulkActions');
  const countEl = document.getElementById('selectedCount');
  if (!bar || !countEl) return;

  if (selectedIds.size > 0) {
    bar.style.display = 'flex';
    countEl.textContent = selectedIds.size;
  } else {
    bar.style.display = 'none';
  }
}

window.bulkDelete = function() {
  if (!selectedIds.size) return;
  const count = selectedIds.size;
  ProductStore.deleteMany([...selectedIds]);
  products = ProductStore.getAll();
  selectedIds.clear();
  renderTable();
  renderDashboard();
  updateBulkBar();
  showAdminToast('✓', `${count} product(s) deleted.`);
};

window.bulkSetStatus = function(status) {
  if (!selectedIds.size) return;
  ProductStore.setStatusMany([...selectedIds], status);
  products = ProductStore.getAll();
  renderTable();
  renderDashboard();
  showAdminToast('✓', `Status updated to ${status}.`);
};

window.clearSelection = function() {
  selectedIds.clear();
  renderTable();
  updateBulkBar();
};

// ── FILTERED PRODUCTS ─────────────────────────────────────────────────────────
function getFilteredProducts(searchQuery = '') {
  let result = [...products];

  if (currentStatusFilter !== 'all') {
    result = result.filter(p => p.status === currentStatusFilter);
  }

  if (currentAdminFilter !== 'all') {
    result = result.filter(p => p.category === currentAdminFilter);
  }

  if (searchQuery) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      (p.tags || []).some(t => t.toLowerCase().includes(searchQuery))
    );
  }

  // Sort
  switch (currentSort) {
    case 'oldest':    result.sort((a, b) => a.createdAt - b.createdAt); break;
    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'name':      result.sort((a, b) => a.name.localeCompare(b.name)); break;
    default:          result.sort((a, b) => b.createdAt - a.createdAt);
  }

  return result;
}

// ── RENDER TABLE ──────────────────────────────────────────────────────────────
function renderTable(searchQuery = '') {
  const filtered = getFilteredProducts(searchQuery);
  const tbody = document.getElementById('adminTableBody');
  const emptyEl = document.getElementById('tableEmpty');
  const tableEl = document.getElementById('adminTable');

  // Update status counts
  updateStatusCounts();

  if (!tbody) return;

  if (filtered.length === 0) {
    if (tableEl) tableEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (tableEl) tableEl.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';

  tbody.innerHTML = filtered.map(p => {
    const checked = selectedIds.has(p.id);
    const stockClass = p.stock < 10 ? 'stock-low' : 'stock-ok';
    const statusClass = `status-${p.status}`;
    const priceStr = formatAdminPrice(p.price);
    const photoCount = (p.images && p.images.length) ? p.images.length : 1;
    return `
      <tr class="${checked ? 'row-selected' : ''}">
        <td>
          <input type="checkbox" class="admin-checkbox row-check" data-id="${p.id}" ${checked ? 'checked' : ''} />
        </td>
        <td>
          <div class="table-product-cell">
            <img class="table-product-img" src="${p.image}" alt="${p.name}" loading="lazy" />
            <div>
              <div class="table-product-name">${p.name}</div>
              <div class="table-product-id">#${p.id} ${photoCount > 1 ? `<span class="badge-photo-count" title="${photoCount} photo views">📷 ${photoCount}</span>` : ''}</div>
            </div>
          </div>
        </td>
        <td><span class="category-tag">${p.category}</span></td>
        <td class="price-cell">${priceStr}</td>
        <td>
          <div class="table-sizes-cell">
            ${(p.sizes || ['S', 'M', 'L', 'XL']).map(s => `<span class="size-badge-pill">${s}</span>`).join('')}
          </div>
        </td>
        <td class="stock-cell ${stockClass}">${p.stock}</td>
        <td><span class="status-badge ${statusClass}">${p.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="action-btn" onclick="editProduct('${p.id}')" title="Edit">✏️</button>
            <button class="action-btn delete" onclick="openDeleteModal('${p.id}')" title="Delete">🗑</button>
          </div>
        </td>
      </tr>`;
  }).join('');

  // Wire checkboxes
  tbody.querySelectorAll('.row-check').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) selectedIds.add(cb.dataset.id);
      else selectedIds.delete(cb.dataset.id);
      updateBulkBar();
    });
  });

  updateBulkBar();

  // Update grid if visible
  if (currentView === 'grid') renderGrid(filtered);
}

// ── RENDER GRID ───────────────────────────────────────────────────────────────
function renderGrid(filtered) {
  const grid = document.getElementById('adminProductsGrid');
  if (!grid) return;
  const data = filtered || getFilteredProducts();

  grid.innerHTML = data.map(p => `
    <div class="admin-grid-card">
      <div class="admin-grid-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/White T.png'" />
        <span class="admin-card-badge status-${p.status}">${p.badge || p.status.toUpperCase()}</span>
      </div>
      <div class="admin-grid-info">
        <div class="admin-grid-name">${p.name}</div>
        <div class="admin-grid-price">${formatAdminPrice(p.price)}</div>
        <div class="admin-grid-actions">
          <button class="action-btn" onclick="editProduct('${p.id}')" title="Edit">✏️ Edit</button>
          <button class="action-btn delete" onclick="openDeleteModal('${p.id}')" title="Delete">🗑</button>
        </div>
      </div>
    </div>`).join('');
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function renderDashboard() {
  const all = ProductStore.getAll();
  const count = all.length;

  const badge = document.getElementById('productCountBadge');
  if (badge) badge.textContent = count;

  const dashCount = document.getElementById('dashProductCount');
  if (dashCount) dashCount.textContent = count;

  // Sync orders stats & badge
  const orders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  const orderCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const orderBadge = document.getElementById('orderCountBadge');
  if (orderBadge) orderBadge.textContent = orderCount;

  const dashOrderCount = document.getElementById('dashOrderCount');
  if (dashOrderCount) dashOrderCount.textContent = orderCount;

  const dashRevenue = document.getElementById('dashTotalRevenue');
  if (dashRevenue) dashRevenue.textContent = formatAdminPrice(totalRevenue);

  // Recent products
  const recentEl = document.getElementById('recentProductsList');
  if (recentEl) {
    const recent = [...all].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    recentEl.innerHTML = recent.map(p => `
      <div class="recent-product-row">
        <img class="recent-product-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/White T.png'" />
        <div>
          <div class="recent-product-name">${p.name}</div>
          <div class="recent-product-cat">${p.category}</div>
        </div>
        <div class="recent-product-price">${formatAdminPrice(p.price)}</div>
      </div>`).join('');
  }
}

// ── STATUS COUNTS ─────────────────────────────────────────────────────────────
function updateStatusCounts() {
  const all = products;
  document.getElementById('countAll').textContent = all.length;
  document.getElementById('countActive').textContent = all.filter(p => p.status === 'active').length;
  document.getElementById('countDraft').textContent = all.filter(p => p.status === 'draft').length;
  document.getElementById('countArchived').textContent = all.filter(p => p.status === 'archived').length;
}

// ── EDIT ──────────────────────────────────────────────────────────────────────
window.editProduct = function(id) {
  const product = ProductStore.getById(id);
  if (product) openModal(product);
};

window.openDeleteModal = openDeleteModal;

// ── ADMIN TOAST ───────────────────────────────────────────────────────────────
let adminToastTimer;
function showAdminToast(icon, msg) {
  const toast = document.getElementById('adminToast');
  const iconEl = document.getElementById('adminToastIcon');
  const msgEl = document.getElementById('adminToastMsg');
  if (!toast) return;

  iconEl.textContent = icon;
  msgEl.textContent = msg;
  toast.classList.add('show');

  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function formatAdminPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ── RENDER ORDERS ─────────────────────────────────────────────────────────────
function renderOrders(filteredData) {
  const ordersTableBody = document.getElementById('ordersTableBody');
  const ordersTable = document.getElementById('ordersTable');
  const emptyEl = document.getElementById('orderTableEmpty');
  const allOrders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');

  // Update order count badge and stats
  const orderBadge = document.getElementById('orderCountBadge');
  if (orderBadge) orderBadge.textContent = allOrders.length;

  const dashOrderCount = document.getElementById('dashOrderCount');
  if (dashOrderCount) dashOrderCount.textContent = allOrders.length;

  const dashRevenue = document.getElementById('dashTotalRevenue');
  if (dashRevenue) {
    const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    dashRevenue.textContent = formatAdminPrice(totalRevenue);
  }

  if (!ordersTableBody) return;
  
  const orders = filteredData !== undefined ? filteredData : allOrders;

  if (orders.length === 0) {
    ordersTableBody.innerHTML = '';
    if (ordersTable) ordersTable.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }

  if (ordersTable) ordersTable.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';

  ordersTableBody.innerHTML = orders.map(order => {
    const date = new Date(order.date).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    
    return `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>${order.customer}</td>
        <td>${date}</td>
        <td>${order.items}</td>
        <td>${'₹' + Number(order.total).toLocaleString('en-IN')}</td>
        <td><span class="status-badge status-${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
        <td>
          <button class="action-btn" title="View Order Details" onclick="viewOrderDetails('${order.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ── ORDER SEARCH & FILTERS ───────────────────────────────────────────────────
function initOrderSearch() {
  const searchInput = document.getElementById('orderSearchInput');
  const searchBtn = document.getElementById('orderSearchBtn');
  const clearBtn = document.getElementById('orderClearSearchBtn');
  const statusFilter = document.getElementById('orderStatusFilter');
  const sortFilter = document.getElementById('orderSortFilter');

  function triggerFilter() {
    const q = searchInput?.value.trim() || '';
    if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
    filterOrders();
  }

  searchInput?.addEventListener('input', triggerFilter);
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerFilter();
    }
  });

  searchBtn?.addEventListener('click', () => {
    triggerFilter();
    searchInput?.focus();
  });

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    filterOrders();
    searchInput?.focus();
  });

  statusFilter?.addEventListener('change', filterOrders);
  sortFilter?.addEventListener('change', filterOrders);
}

function filterOrders() {
  const allOrders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  const query = (document.getElementById('orderSearchInput')?.value || '').toLowerCase().trim();
  const status = (document.getElementById('orderStatusFilter')?.value || 'all').toLowerCase();
  const sort = document.getElementById('orderSortFilter')?.value || 'newest';

  let filtered = allOrders.filter(order => {
    // Status filter
    if (status !== 'all' && (order.status || 'pending').toLowerCase() !== status) {
      return false;
    }

    // Query filter (matches Order ID, Customer name, Email, Phone, or products)
    if (query) {
      const matchId = (order.id || '').toLowerCase().includes(query);
      const matchCust = (order.customer || '').toLowerCase().includes(query);
      const matchEmail = (order.email || '').toLowerCase().includes(query);
      const matchPhone = (order.phone || '').toLowerCase().includes(query);
      const matchProduct = (order.products || []).some(p => (p.name || '').toLowerCase().includes(query));

      if (!matchId && !matchCust && !matchEmail && !matchPhone && !matchProduct) {
        return false;
      }
    }

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sort === 'newest') return new Date(b.date) - new Date(a.date);
    if (sort === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sort === 'total-desc') return Number(b.total) - Number(a.total);
    if (sort === 'total-asc') return Number(a.total) - Number(b.total);
    return 0;
  });

  renderOrders(filtered);
}

window.resetOrderSearch = function() {
  const searchInput = document.getElementById('orderSearchInput');
  const clearBtn = document.getElementById('orderClearSearchBtn');
  const statusFilter = document.getElementById('orderStatusFilter');
  const sortFilter = document.getElementById('orderSortFilter');

  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  if (statusFilter) statusFilter.value = 'all';
  if (sortFilter) sortFilter.value = 'newest';

  filterOrders();
};

// ── ORDER DETAILS MODAL ───────────────────────────────────────────────────────
let currentViewingOrderId = null;

function closeOrderModal() {
  document.getElementById('orderModal')?.classList.remove('open');
  document.getElementById('orderModalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

window.closeOrderModal = closeOrderModal;

function initOrderModal() {
  const overlay = document.getElementById('orderModalOverlay');
  const closeBtn = document.getElementById('orderModalClose');
  const saveBtn = document.getElementById('orderSaveStatusBtn');
  const statusSelect = document.getElementById('orderStatusSelect');

  overlay?.addEventListener('click', closeOrderModal);
  closeBtn?.addEventListener('click', closeOrderModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('orderModal')?.classList.contains('open')) {
      closeOrderModal();
    }
  });

  saveBtn?.addEventListener('click', () => {
    if (currentViewingOrderId && statusSelect) {
      const newStatus = statusSelect.value;
      const orders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
      const target = orders.find(o => o.id === currentViewingOrderId);
      if (target) {
        target.status = newStatus;
        localStorage.setItem('zephyr_orders', JSON.stringify(orders));
        renderOrders();
        renderDashboard();
        showAdminToast('✓', `Order #${currentViewingOrderId} status updated to ${newStatus}`);
      }
    }
    closeOrderModal();
  });
}

function viewOrderDetails(orderId) {
  const orders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    showAdminToast('⚠️', 'Order not found');
    return;
  }

  currentViewingOrderId = orderId;

  // Mark as read in notifications
  const readSet = getReadOrders();
  readSet.add(orderId);
  saveReadOrders(readSet);
  renderNotifications();

  // Populate Order Modal Data
  const idEl = document.getElementById('orderModalId');
  const dateEl = document.getElementById('orderModalDate');
  const nameEl = document.getElementById('orderCustName');
  const phoneEl = document.getElementById('orderCustPhone');
  const emailEl = document.getElementById('orderCustEmail');
  const addressEl = document.getElementById('orderCustAddress');
  const statusSelect = document.getElementById('orderStatusSelect');
  const itemCountEl = document.getElementById('orderItemCount');
  const itemsListEl = document.getElementById('orderItemsList');
  const subtotalEl = document.getElementById('orderSubtotal');
  const shippingEl = document.getElementById('orderShipping');
  const grandTotalEl = document.getElementById('orderGrandTotal');

  const formattedDate = new Date(order.date).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (idEl) idEl.textContent = `Order #${order.id}`;
  if (dateEl) dateEl.textContent = formattedDate;
  if (nameEl) nameEl.textContent = order.customer || '—';
  
  if (phoneEl) {
    phoneEl.textContent = order.phone || '—';
    phoneEl.href = order.phone ? `tel:${order.phone}` : '#';
  }

  if (emailEl) {
    emailEl.textContent = order.email || '—';
    emailEl.href = order.email ? `mailto:${order.email}` : '#';
  }

  if (addressEl) addressEl.textContent = order.address || '—';
  if (statusSelect) statusSelect.value = order.status || 'Pending';
  if (itemCountEl) itemCountEl.textContent = order.items || (order.products ? order.products.length : 1);

  // Render ordered products
  const products = order.products && order.products.length > 0 ? order.products : [{
    name: 'Custom Streetwear Order Item',
    price: order.total,
    qty: order.items || 1,
    image: 'images/White T.png'
  }];

  if (itemsListEl) {
    itemsListEl.innerHTML = products.map(item => `
      <div class="order-modal-item">
        <img src="${item.image || 'images/White T.png'}" alt="${item.name}" class="order-modal-item-img" onerror="this.src='images/White T.png'" />
        <div class="order-modal-item-info">
          <div class="order-modal-item-name">${item.name}</div>
          <div class="order-modal-item-sub">Qty: ${item.qty || 1} × ${formatAdminPrice(item.price)} • Size: <strong style="color:var(--text-primary)">${item.size || 'M'}</strong></div>
        </div>
        <div class="order-modal-item-total">
          ${formatAdminPrice((item.price || 0) * (item.qty || 1))}
        </div>
      </div>
    `).join('');
  }

  const subtotal = Number(order.total) >= 1999 ? Number(order.total) : Math.max(0, Number(order.total) - 99);
  const shipping = Number(order.total) >= 1999 ? 0 : 99;

  if (subtotalEl) subtotalEl.textContent = formatAdminPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : formatAdminPrice(shipping);
  if (grandTotalEl) grandTotalEl.textContent = formatAdminPrice(order.total);

  // Open modal
  document.getElementById('orderModal')?.classList.add('open');
  document.getElementById('orderModalOverlay')?.classList.add('open');
}

window.viewOrderDetails = viewOrderDetails;

window.printOrderInvoice = function() {
  window.print();
};

// ══════════════════════════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

let analyticsPeriod = '7d';

function initAnalytics() {
  // Period selector
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      analyticsPeriod = btn.dataset.period;
      renderAnalytics();
    });
  });

  renderAnalytics();
}

function getFilteredOrders() {
  const all = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  if (analyticsPeriod === 'all') return all;

  const now = Date.now();
  const days = analyticsPeriod === '7d' ? 7 : 30;
  const cutoff = now - days * 86400000;
  return all.filter(o => new Date(o.date).getTime() >= cutoff);
}

function renderAnalytics() {
  const orders = getFilteredOrders();
  const allOrders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  const allProducts = ProductStore.getAll();

  renderKPIs(orders);
  renderRevenueChart(allOrders);
  renderOrderStatusChart(orders);
  renderTopProducts(orders);
  renderCategoryBars(orders);
  renderStockAlerts(allProducts);
  renderActivityTimeline(allOrders);
}

// ── KPIs ───────────────────────────────────────────────────────────────────
function renderKPIs(orders) {
  const totalRevenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const itemsSold = orders.reduce((s, o) => s + (Number(o.items) || 0), 0);

  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  setVal('kpiRevenue', formatAdminPrice(totalRevenue));
  setVal('kpiOrders', totalOrders);
  setVal('kpiAOV', formatAdminPrice(aov));
  setVal('kpiItemsSold', itemsSold);

  // Change labels
  const periodLabel = analyticsPeriod === 'all' ? 'All time' : analyticsPeriod === '7d' ? 'Last 7 days' : 'Last 30 days';
  const setChange = (id, cls, text) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text;
      el.className = 'kpi-change ' + cls;
    }
  };

  if (totalOrders > 0) {
    setChange('kpiRevenueChange', 'up', `↑ ${periodLabel}`);
    setChange('kpiOrdersChange', 'up', `↑ ${periodLabel}`);
    setChange('kpiAOVChange', '', periodLabel);
    setChange('kpiItemsChange', 'up', `↑ ${periodLabel}`);
  } else {
    setChange('kpiRevenueChange', '', 'No orders yet');
    setChange('kpiOrdersChange', '', 'No orders yet');
    setChange('kpiAOVChange', '', '—');
    setChange('kpiItemsChange', '', 'No sales yet');
  }
}

// ── Revenue Chart (Pure Canvas) ───────────────────────────────────────────
function renderRevenueChart(allOrders) {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const container = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = container.offsetWidth * dpr;
  canvas.height = container.offsetHeight * dpr;
  ctx.scale(dpr, dpr);

  const w = container.offsetWidth;
  const h = container.offsetHeight;

  ctx.clearRect(0, 0, w, h);

  // Build daily revenue for last N days
  let numDays = 7;
  if (analyticsPeriod === '30d') {
    numDays = 30;
  } else if (analyticsPeriod === 'all') {
    if (allOrders.length > 0) {
      const earliest = Math.min(...allOrders.map(o => new Date(o.date).getTime()));
      const daysDiff = Math.ceil((Date.now() - earliest) / 86400000);
      numDays = Math.max(7, daysDiff + 1);
      // Cap at 365 days to prevent canvas overcrowding
      if (numDays > 365) numDays = 365;
    } else {
      numDays = 60;
    }
  }
  const now = new Date();
  const dailyData = [];

  for (let i = numDays - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayRevenue = allOrders
      .filter(o => {
        const d = new Date(o.date).getTime();
        return d >= day.getTime() && d < nextDay.getTime();
      })
      .reduce((s, o) => s + (Number(o.total) || 0), 0);

    dailyData.push({
      label: day.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: dayRevenue
    });
  }

  const maxVal = Math.max(...dailyData.map(d => d.value), 1);
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    // Y-axis labels
    const val = maxVal - (maxVal / gridLines) * i;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(val >= 1000 ? `₹${(val/1000).toFixed(1)}k` : `₹${Math.round(val)}`, padding.left - 8, y + 4);
  }

  if (dailyData.length < 2) return;

  const stepX = chartW / (dailyData.length - 1);

  // Build points
  const points = dailyData.map((d, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + chartH - (d.value / maxVal) * chartH
  }));

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  gradient.addColorStop(0, 'rgba(99,102,241,0.25)');
  gradient.addColorStop(1, 'rgba(99,102,241,0.01)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, h - padding.bottom);
  points.forEach((p, i) => {
    if (i === 0) { ctx.lineTo(p.x, p.y); return; }
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
  });
  ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) { ctx.moveTo(p.x, p.y); return; }
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
  });
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Data points
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // X-axis labels
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'center';
  const labelSkip = Math.ceil(dailyData.length / 10);
  dailyData.forEach((d, i) => {
    if (i % labelSkip === 0 || i === dailyData.length - 1) {
      ctx.fillText(d.label, padding.left + i * stepX, h - padding.bottom + 18);
    }
  });
}

// ── Order Status Donut (Pure Canvas) ──────────────────────────────────────
function renderOrderStatusChart(orders) {
  const canvas = document.getElementById('orderStatusChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  canvas.width = 180 * dpr;
  canvas.height = 180 * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, 180, 180);

  const cx = 90, cy = 90, outerR = 80, innerR = 52;

  const statusMap = { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
  orders.forEach(o => {
    const s = o.status || 'Pending';
    statusMap[s] = (statusMap[s] || 0) + 1;
  });

  const statusColors = {
    Pending: '#f59e0b',
    Processing: '#6366f1',
    Shipped: '#0ea5e9',
    Delivered: '#10b981',
    Cancelled: '#ef4444'
  };

  const total = orders.length;
  document.getElementById('donutTotal').textContent = total;

  if (total === 0) {
    // Empty ring
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fill();
  } else {
    let startAngle = -Math.PI / 2;
    Object.entries(statusMap).forEach(([status, count]) => {
      if (count === 0) return;
      const sliceAngle = (count / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = statusColors[status] || '#ccc';
      ctx.fill();
      startAngle += sliceAngle;
    });
  }

  // Legend
  const legendEl = document.getElementById('donutLegend');
  if (legendEl) {
    legendEl.innerHTML = Object.entries(statusMap)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => `
        <div class="donut-legend-item">
          <span class="donut-legend-dot" style="background:${statusColors[status]}"></span>
          ${status} (${count})
        </div>
      `).join('');

    if (total === 0) {
      legendEl.innerHTML = '<div class="donut-legend-item" style="color:var(--text-muted)">No orders in this period</div>';
    }
  }
}

// ── Top Selling Products ──────────────────────────────────────────────────
function renderTopProducts(orders) {
  const listEl = document.getElementById('topProductsList');
  if (!listEl) return;

  // Aggregate product sales
  const productSales = {};
  orders.forEach(o => {
    (o.products || []).forEach(p => {
      const key = p.id || p.name;
      if (!productSales[key]) {
        productSales[key] = { name: p.name, image: p.image, qty: 0, revenue: 0, category: '' };
      }
      productSales[key].qty += (p.qty || 1);
      productSales[key].revenue += (p.price || 0) * (p.qty || 1);
    });
  });

  // Match categories from product store
  const allProds = ProductStore.getAll();
  Object.keys(productSales).forEach(key => {
    const match = allProds.find(p => p.id === key || p.name === productSales[key].name);
    if (match) {
      productSales[key].category = match.category;
      if (!productSales[key].image || productSales[key].image === 'undefined') {
        productSales[key].image = match.image;
      }
    }
  });

  const sorted = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 6);
  const maxQty = sorted.length > 0 ? sorted[0].qty : 1;

  if (sorted.length === 0) {
    listEl.innerHTML = `
      <div class="analytics-empty">
        <div class="analytics-empty-icon">🛍️</div>
        <h4>No product sales yet</h4>
        <p>Sales data will appear here as orders come in.</p>
      </div>`;
    return;
  }

  listEl.innerHTML = sorted.map((p, i) => {
    const rankClass = i < 3 ? `rank-${i + 1}` : 'rank-other';
    const barPct = Math.max(5, (p.qty / maxQty) * 100);
    return `
      <div class="top-product-row">
        <div class="top-product-rank ${rankClass}">${i + 1}</div>
        <img class="top-product-img" src="${p.image || 'images/White T.png'}" alt="${p.name}" onerror="this.src='images/White T.png'" />
        <div class="top-product-info">
          <div class="top-product-name">${p.name}</div>
          <div class="top-product-cat">${p.category || 'fashion'}</div>
        </div>
        <div class="top-product-bar-wrap">
          <div class="top-product-bar" style="width:${barPct}%"></div>
        </div>
        <div class="top-product-stats">
          <div class="top-product-sold">${p.qty} sold</div>
          <div class="top-product-revenue">${formatAdminPrice(p.revenue)}</div>
        </div>
      </div>`;
  }).join('');
}

// ── Category Breakdown Bars ───────────────────────────────────────────────
function renderCategoryBars(orders) {
  const listEl = document.getElementById('categoryBarsList');
  if (!listEl) return;

  const catRevenue = {};
  const allProds = ProductStore.getAll();

  orders.forEach(o => {
    (o.products || []).forEach(p => {
      const match = allProds.find(pr => pr.id === p.id || pr.name === p.name);
      const cat = match?.category || 'other';
      catRevenue[cat] = (catRevenue[cat] || 0) + (p.price || 0) * (p.qty || 1);
    });
  });

  const entries = Object.entries(catRevenue).sort((a, b) => b[1] - a[1]);
  const maxRev = entries.length > 0 ? entries[0][1] : 1;

  const barColors = {
    fashion: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    lifestyle: 'linear-gradient(90deg, #10b981, #059669)',
    electronics: 'linear-gradient(90deg, #0ea5e9, #06b6d4)',
    accessories: 'linear-gradient(90deg, #f59e0b, #ef4444)',
    other: 'linear-gradient(90deg, #9ca3af, #6b7280)'
  };

  if (entries.length === 0) {
    listEl.innerHTML = `
      <div class="analytics-empty">
        <div class="analytics-empty-icon">📂</div>
        <h4>No category data</h4>
        <p>Category breakdown appears after orders are placed.</p>
      </div>`;
    return;
  }

  listEl.innerHTML = entries.map(([cat, rev]) => {
    const pct = Math.max(5, (rev / maxRev) * 100);
    return `
      <div class="category-bar-item">
        <div class="category-bar-header">
          <span class="category-bar-name">${cat}</span>
          <span class="category-bar-value">${formatAdminPrice(rev)}</span>
        </div>
        <div class="category-bar-track">
          <div class="category-bar-fill" style="width:${pct}%;background:${barColors[cat] || barColors.other}"></div>
        </div>
      </div>`;
  }).join('');
}

// ── Stock Alerts ──────────────────────────────────────────────────────────
function renderStockAlerts(allProducts) {
  const listEl = document.getElementById('stockAlertsList');
  const countEl = document.getElementById('stockAlertCount');
  if (!listEl) return;

  const lowStock = allProducts
    .filter(p => p.status === 'active' && p.stock < 15)
    .sort((a, b) => a.stock - b.stock);

  if (countEl) countEl.textContent = `${lowStock.length} low stock`;

  if (lowStock.length === 0) {
    listEl.innerHTML = `
      <div class="analytics-empty">
        <div class="analytics-empty-icon">✅</div>
        <h4>All stocked up!</h4>
        <p>No products are running low on inventory.</p>
      </div>`;
    return;
  }

  listEl.innerHTML = lowStock.map(p => {
    const severity = p.stock < 5 ? 'critical' : 'warning';
    return `
      <div class="stock-alert-row ${severity}">
        <img class="stock-alert-img" src="${p.image}" alt="${p.name}" onerror="this.src='images/White T.png'" />
        <div class="stock-alert-info">
          <div class="stock-alert-name">${p.name}</div>
          <div class="stock-alert-count ${severity}">
            ${p.stock < 5 ? '🔴' : '🟡'} ${p.stock} units remaining
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── Activity Timeline ─────────────────────────────────────────────────────
function renderActivityTimeline(allOrders) {
  const timelineEl = document.getElementById('activityTimeline');
  if (!timelineEl) return;

  const recent = allOrders.slice(0, 10);

  if (recent.length === 0) {
    timelineEl.innerHTML = `
      <div class="analytics-empty">
        <div class="analytics-empty-icon">📋</div>
        <h4>No recent activity</h4>
        <p>Orders and events will appear here in real-time.</p>
      </div>`;
    return;
  }

  const statusIcons = {
    Pending: '🕐',
    Processing: '⚙️',
    Shipped: '🚚',
    Delivered: '✅',
    Cancelled: '❌'
  };

  timelineEl.innerHTML = recent.map(o => {
    const date = new Date(o.date);
    const ago = getTimeAgo(date);
    const icon = statusIcons[o.status] || '🛍️';
    const itemCount = o.items || (o.products ? o.products.length : 1);

    return `
      <div class="activity-item">
        <div class="activity-icon">${icon}</div>
        <div class="activity-content">
          <div class="activity-text">
            <strong>${o.customer || 'Customer'}</strong> placed an order
            <span style="color:var(--text-muted)">#${o.id}</span>
            — ${itemCount} item${itemCount > 1 ? 's' : ''}
          </div>
          <div class="activity-time">${ago}</div>
        </div>
        <div class="activity-amount">${formatAdminPrice(o.total)}</div>
      </div>`;
  }).join('');
}

function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

// ══════════════════════════════════════════════════════════════════════════════
// STORE SETTINGS
// ══════════════════════════════════════════════════════════════════════════════

function initSettings() {
  const saveBtn = document.getElementById('btnSaveSettings');
  if (!saveBtn) return;

  // Load current settings
  const defaultSettings = {
    storeName: 'Zephyr',
    supportEmail: 'support@zephyr.in',
    currency: '₹',
    address: 'New Delhi, India',
    shippingRate: 99,
    freeShippingThreshold: 1999,
    codEnable: true,
    cardEnable: false,
    upiEnable: false,
    taxRate: 18
  };

  let savedSettings = {};
  try {
    savedSettings = JSON.parse(localStorage.getItem('zephyr_settings')) || {};
  } catch (e) {
    savedSettings = {};
  }

  const settings = { ...defaultSettings, ...savedSettings };

  // Populate form
  const setVal = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.value = settings[key];
  };
  const setCheck = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.checked = settings[key];
  };

  setVal('settingStoreName', 'storeName');
  setVal('settingSupportEmail', 'supportEmail');
  setVal('settingCurrency', 'currency');
  setVal('settingAddress', 'address');
  setVal('settingShippingRate', 'shippingRate');
  setVal('settingFreeShippingThreshold', 'freeShippingThreshold');
  setVal('settingTaxRate', 'taxRate');

  setCheck('settingCodEnable', 'codEnable');
  setCheck('settingCardEnable', 'cardEnable');
  setCheck('settingUpiEnable', 'upiEnable');

  // Save settings on click
  saveBtn.addEventListener('click', () => {
    const newSettings = {
      storeName: document.getElementById('settingStoreName')?.value || 'Zephyr',
      supportEmail: document.getElementById('settingSupportEmail')?.value || '',
      currency: document.getElementById('settingCurrency')?.value || '₹',
      address: document.getElementById('settingAddress')?.value || '',
      shippingRate: Number(document.getElementById('settingShippingRate')?.value || 0),
      freeShippingThreshold: Number(document.getElementById('settingFreeShippingThreshold')?.value || 0),
      taxRate: Number(document.getElementById('settingTaxRate')?.value || 0),
      codEnable: document.getElementById('settingCodEnable')?.checked || false,
      cardEnable: document.getElementById('settingCardEnable')?.checked || false,
      upiEnable: document.getElementById('settingUpiEnable')?.checked || false,
    };

    localStorage.setItem('zephyr_settings', JSON.stringify(newSettings));
    showAdminToast('💾', 'Settings saved successfully');
  });
}
