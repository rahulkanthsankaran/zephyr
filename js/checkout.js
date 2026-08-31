/* ============================================
   ZEPHYR — Checkout Page JS
   checkout.html logic
   ============================================ */

'use strict';

// ── STATE ────────────────────────────────────────────────────────────────────
let checkoutCart = [];
let storeSettings = {
  shippingRate: 99,
  freeShippingThreshold: 1999
};

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  try {
    const savedSettings = JSON.parse(localStorage.getItem('zephyr_settings')) || {};
    storeSettings = { ...storeSettings, ...savedSettings };
  } catch (e) {
    // defaults
  }
  loadCart();
  renderSummary();
  initFormNavigation();
  initPaymentMethods();
  initFormValidation();
  initConfirmationModal();
});

function initPaymentMethods() {
  const codOpt = document.getElementById('codOption');
  const cardOpt = document.getElementById('cardOption');
  const upiOpt = document.getElementById('upiOption');
  
  if (codOpt) codOpt.style.display = storeSettings.codEnable !== false ? 'flex' : 'none';
  if (cardOpt) cardOpt.style.display = storeSettings.cardEnable ? 'flex' : 'none';
  if (upiOpt) upiOpt.style.display = storeSettings.upiEnable ? 'flex' : 'none';

  const options = document.querySelectorAll('.payment-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => {
        o.classList.remove('selected');
        const dot = o.querySelector('.radio-dot');
        if (dot) dot.remove();
      });
      opt.classList.add('selected');
      opt.querySelector('.payment-radio').innerHTML = '<div class="radio-dot"></div>';
    });
  });
}

// ── CART PERSISTENCE ─────────────────────────────────────────────────────────
function loadCart() {
  try {
    checkoutCart = JSON.parse(localStorage.getItem('zephyr-cart')) || [];
  } catch {
    checkoutCart = [];
  }

  // If cart is empty, redirect back
  if (checkoutCart.length === 0) {
    window.location.href = 'index.html';
  }
}

// ── RENDER ORDER SUMMARY ─────────────────────────────────────────────────────
function renderSummary() {
  const itemsEl = document.getElementById('summaryItems');
  const subtotalEl = document.getElementById('summarySubtotal');
  const shippingEl = document.getElementById('summaryShipping');
  const totalEl = document.getElementById('summaryTotal');

  if (!itemsEl) return;

  const subtotal = checkoutCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.shippingRate;
  const total = subtotal + shipping;

  itemsEl.innerHTML = checkoutCart.map(item => `
    <div class="summary-item">
      <div class="summary-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='images/White T.png'" />
        <span class="summary-item-qty">${item.qty}</span>
      </div>
      <div class="summary-item-info">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-size">Size: <span>${item.size || 'M'}</span></div>
        <div class="summary-item-price">${formatPrice(item.price * item.qty)}</div>
      </div>
    </div>
  `).join('');

  subtotalEl.textContent = formatPrice(subtotal);
  shippingEl.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  if (shipping === 0) shippingEl.classList.add('free');
  totalEl.textContent = formatPrice(total);
}

// ── MULTI-STEP NAVIGATION ────────────────────────────────────────────────────
function initFormNavigation() {
  const toPaymentBtn = document.getElementById('toPaymentBtn');
  const backToShippingBtn = document.getElementById('backToShippingBtn');

  toPaymentBtn?.addEventListener('click', () => {
    if (validateShipping()) {
      goToStep(2);
    }
  });

  backToShippingBtn?.addEventListener('click', () => {
    goToStep(1);
  });
}

function goToStep(step) {
  const shipping = document.getElementById('shippingSection');
  const payment = document.getElementById('paymentSection');
  const step1 = document.getElementById('step1Indicator');
  const step2 = document.getElementById('step2Indicator');
  const step3 = document.getElementById('step3Indicator');

  if (step === 1) {
    shipping.classList.remove('checkout-section-hidden');
    payment.classList.add('checkout-section-hidden');
    step1.classList.add('active');
    step1.classList.remove('completed');
    step2.classList.remove('active');
  } else if (step === 2) {
    shipping.classList.add('checkout-section-hidden');
    payment.classList.remove('checkout-section-hidden');
    step1.classList.remove('active');
    step1.classList.add('completed');
    step2.classList.add('active');
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── FORM VALIDATION ──────────────────────────────────────────────────────────
function initFormValidation() {
  const form = document.getElementById('checkoutForm');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    placeOrder();
  });

  // Real-time validation
  const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
  fields.forEach(name => {
    const el = document.getElementById(name);
    el?.addEventListener('blur', () => validateField(name));
    el?.addEventListener('input', () => {
      const errEl = document.getElementById(name + 'Error');
      if (errEl && errEl.textContent) validateField(name);
    });
  });
}

function validateField(name) {
  const el = document.getElementById(name);
  const errEl = document.getElementById(name + 'Error');
  if (!el || !errEl) return true;

  let value = el.value.trim();
  let error = '';

  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!value) error = 'This field is required';
      else if (value.length < 2) error = 'Must be at least 2 characters';
      break;
    case 'email':
      if (!value) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address';
      break;
    case 'phone':
      if (!value) error = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(value)) error = 'Enter a valid 10-digit phone number';
      break;
    case 'address':
      if (!value) error = 'Address is required';
      else if (value.length < 5) error = 'Enter a complete address';
      break;
    case 'city':
      if (!value) error = 'City is required';
      break;
    case 'state':
      if (!value) error = 'Select your state';
      break;
    case 'pincode':
      if (!value) error = 'PIN code is required';
      else if (!/^\d{6}$/.test(value)) error = 'Enter a valid 6-digit PIN code';
      break;
  }

  errEl.textContent = error;
  el.classList.toggle('input-error', !!error);
  el.classList.toggle('input-valid', !error && !!value);
  return !error;
}

function validateShipping() {
  const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
  let allValid = true;

  fields.forEach(name => {
    if (!validateField(name)) allValid = false;
  });

  if (!allValid) {
    // Scroll to first error
    const firstError = document.querySelector('.input-error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return allValid;
}

// ── PLACE ORDER ──────────────────────────────────────────────────────────────
let currentConfirmedOrderId = '';

function placeOrder() {
  if (!validateShipping()) {
    goToStep(1);
    return;
  }

  // Generate unique order ID
  const orderId = 'ZPH-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
  currentConfirmedOrderId = orderId;

  const subtotal = checkoutCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.shippingRate;
  const total = subtotal + shipping;

  // Safe field value retrievals
  const firstName = document.getElementById('firstName')?.value.trim() || '';
  const lastName = document.getElementById('lastName')?.value.trim() || '';
  const name = `${firstName} ${lastName}`.trim() || 'Valued Customer';
  const email = document.getElementById('email')?.value.trim() || '';
  const phone = document.getElementById('phone')?.value.trim() || '';
  const address = document.getElementById('address')?.value.trim() || '';
  const city = document.getElementById('city')?.value.trim() || '';
  const stateEl = document.getElementById('state');
  const stateName = (stateEl && stateEl.selectedIndex >= 0 && stateEl.options[stateEl.selectedIndex]) 
    ? stateEl.options[stateEl.selectedIndex].text 
    : '';
  const pincode = document.getElementById('pincode')?.value.trim() || '';

  // Delivery estimation: 4-6 business days
  const now = new Date();
  const deliveryStart = new Date(now);
  deliveryStart.setDate(deliveryStart.getDate() + 4);
  const deliveryEnd = new Date(now);
  deliveryEnd.setDate(deliveryEnd.getDate() + 7);
  const deliveryStr = `${deliveryStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – ${deliveryEnd.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  // Save order to localStorage
  const newOrder = {
    id: orderId,
    customer: name,
    email: email,
    phone: phone,
    address: `${address}, ${city}, ${stateName} — ${pincode}`,
    date: new Date().toISOString(),
    total: total,
    status: 'Pending',
    items: checkoutCart.reduce((s, i) => s + i.qty, 0),
    products: checkoutCart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      size: item.size || 'M',
      image: item.image
    }))
  };

  const existingOrders = JSON.parse(localStorage.getItem('zephyr_orders') || '[]');
  existingOrders.unshift(newOrder);
  localStorage.setItem('zephyr_orders', JSON.stringify(existingOrders));

  // Populate confirmation modal texts
  const idEl = document.getElementById('orderConfirmId');
  if (idEl) idEl.textContent = `Order #${orderId}`;
  
  const totalEl = document.getElementById('orderConfirmTotal');
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Render items list inside modal
  const itemsHtml = checkoutCart.map(item => `
    <div class="confirm-item-row">
      <img src="${item.image}" alt="${item.name}" class="confirm-item-thumb" onerror="this.src='images/White T.png'" />
      <div class="confirm-item-info">
        <div class="confirm-item-name">${item.name}</div>
        <div class="confirm-item-qty">Qty: ${item.qty} × ${formatPrice(item.price)} • Size: ${item.size || 'M'}</div>
      </div>
      <div class="confirm-item-total">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  const detailsEl = document.getElementById('orderConfirmDetails');
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div class="confirm-items-list">
        ${itemsHtml}
      </div>
      <div class="confirm-divider"></div>
      <div class="confirm-detail-row">
        <span class="confirm-label">Estimated Delivery</span>
        <span class="confirm-value text-success">🚚 ${deliveryStr}</span>
      </div>
      <div class="confirm-detail-row">
        <span class="confirm-label">Customer</span>
        <span class="confirm-value">${name}</span>
      </div>
      <div class="confirm-detail-row">
        <span class="confirm-label">Delivery Address</span>
        <span class="confirm-value">${address}, ${city}, ${stateName} — ${pincode}</span>
      </div>
      <div class="confirm-detail-row">
        <span class="confirm-label">Contact Phone</span>
        <span class="confirm-value">+91 ${phone}</span>
      </div>
      <div class="confirm-detail-row">
        <span class="confirm-label">Payment Method</span>
        <span class="confirm-value">Cash on Delivery</span>
      </div>
      <div class="confirm-detail-row confirm-total-row">
        <span class="confirm-label">Amount Payable</span>
        <span class="confirm-value confirm-price-highlight">${formatPrice(total)}</span>
      </div>
    `;
  }

  // Show confirmation modal
  const overlay = document.getElementById('orderConfirmOverlay');
  const modal = document.getElementById('orderConfirmModal');
  overlay?.classList.add('open');
  modal?.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Update step indicators
  document.getElementById('step2Indicator')?.classList.remove('active');
  document.getElementById('step2Indicator')?.classList.add('completed');
  document.getElementById('step3Indicator')?.classList.add('active', 'completed');

  // Clear cart
  localStorage.removeItem('zephyr-cart');
}

// ── CONFIRMATION MODAL ACTIONS ───────────────────────────────────────────────
function initConfirmationModal() {
  const overlay = document.getElementById('orderConfirmOverlay');
  const closeBtn = document.getElementById('orderConfirmClose');
  const copyBtn = document.getElementById('copyOrderBtn');
  const printBtn = document.getElementById('printReceiptBtn');

  function closeAndRedirect() {
    window.location.href = 'index.html';
  }

  overlay?.addEventListener('click', closeAndRedirect);
  closeBtn?.addEventListener('click', closeAndRedirect);

  copyBtn?.addEventListener('click', () => {
    if (currentConfirmedOrderId) {
      navigator.clipboard.writeText(currentConfirmedOrderId).then(() => {
        showToast('📋 Order ID copied to clipboard!');
      }).catch(() => {
        showToast(`📋 Order #${currentConfirmedOrderId}`);
      });
    }
  });

  printBtn?.addEventListener('click', () => {
    window.print();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('orderConfirmModal')?.classList.contains('open')) {
      closeAndRedirect();
    }
  });
}

// ── HELPERS & TOAST ──────────────────────────────────────────────────────────
function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
