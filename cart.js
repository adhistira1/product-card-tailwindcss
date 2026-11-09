// cart.js - Pengelola Keranjang Belanja Toko Urban / BUDARPA STORE

// Ambil data keranjang dari localStorage
function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  } catch (e) {
    return [];
  }
}

// Simpan data keranjang ke localStorage
function saveCartItems(items) {
  localStorage.setItem('cartItems', JSON.stringify(items));
  
  // Hitung total item untuk badge
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  localStorage.setItem('cartCount', totalCount.toString());
  
  updateCartUI();
}

// Tambah produk ke keranjang
function addToCart(item) {
  const items = getCartItems();
  const qtyToAdd = item.quantity || 1;
  
  // Cek apakah item dengan nama & varian yang sama sudah ada
  const existingIdx = items.findIndex(
    (i) => i.title === item.title && i.variant === item.variant
  );

  if (existingIdx > -1) {
    items[existingIdx].quantity = (items[existingIdx].quantity || 1) + qtyToAdd;
  } else {
    items.push({
      id: item.id || Date.now().toString(),
      title: item.title,
      priceNumber: item.priceNumber,
      priceFormatted: item.priceFormatted,
      image: item.image,
      variant: item.variant || 'Standar',
      quantity: qtyToAdd
    });
  }

  saveCartItems(items);

  // Tampilkan notifikasi konfirmasi
  showToastNotification(`✓ ${item.title} (${item.variant}) berhasil ditambahkan ke Keranjang!`);
}

// Ubah kuantitas produk (+ / -)
function changeQuantity(index, delta) {
  const items = getCartItems();
  if (!items[index]) return;

  items[index].quantity = (items[index].quantity || 1) + delta;

  if (items[index].quantity <= 0) {
    if (confirm(`Hapus "${items[index].title}" dari keranjang?`)) {
      items.splice(index, 1);
    } else {
      items[index].quantity = 1;
    }
  }

  saveCartItems(items);
}

// Hapus satu item dari keranjang
function removeFromCart(index) {
  const items = getCartItems();
  if (items[index]) {
    items.splice(index, 1);
    saveCartItems(items);
  }
}

// Kosongkan seluruh keranjang
function clearCart() {
  if (confirm('Apakah Anda yakin ingin mengosongkan keranjang belanja?')) {
    saveCartItems([]);
  }
}

// Notifikasi toast halus di pojok kanan atas
function showToastNotification(message) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f766e;
      color: #ffffff;
      padding: 14px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(15, 118, 110, 0.35);
      font-size: 14px;
      font-weight: 700;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span>${message}</span>
    <a href="keranjang.html" style="color: #a7f3d0; text-decoration: underline; margin-left: 8px;">Lihat Keranjang &rarr;</a>
  `;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(window._cartToastTimeout);
  window._cartToastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 4500);
}

// State voucher diskon
let activeDiscountPercent = 0;
let activeDiscountNominal = 0;
let appliedCouponCode = '';

// Terapkan kupon diskon
function applyCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'DISKON10') {
    activeDiscountPercent = 10;
    activeDiscountNominal = 0;
    appliedCouponCode = code;
    alert('Kupon DISKON10 berhasil diterapkan! Diskon 10% untuk pesanan Anda.');
  } else if (code === 'URBAN30') {
    activeDiscountPercent = 0;
    activeDiscountNominal = 30000;
    appliedCouponCode = code;
    alert('Kupon URBAN30 berhasil diterapkan! Diskon potongan Rp 30.000.');
  } else if (code === '') {
    alert('Silakan masukkan kode kupon terlebih dahulu.');
    return;
  } else {
    alert('Kode kupon tidak valid. Gunakan "DISKON10" atau "URBAN30".');
    return;
  }
  updateCartUI();
}

// Update tampilan UI keranjang
function updateCartUI() {
  const items = getCartItems();
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // 1. Update semua elemen badge
  document.querySelectorAll('.cart-badge').forEach((badge) => {
    badge.textContent = totalCount;
  });

  // 2. Jika berada di halaman keranjang.html
  const cartTableList = document.getElementById('cart-table-list');
  const cartSummaryBox = document.getElementById('cart-summary-box');
  const emptyCartState = document.getElementById('empty-cart-state');
  const cartItemsCountLabel = document.getElementById('cart-items-count-label');

  if (cartTableList) {
    if (cartItemsCountLabel) {
      cartItemsCountLabel.textContent = `(${totalCount} produk)`;
    }

    if (items.length === 0) {
      if (emptyCartState) emptyCartState.style.display = 'block';
      if (cartTableList) cartTableList.style.display = 'none';
      if (cartSummaryBox) cartSummaryBox.style.display = 'none';
      return;
    }

    if (emptyCartState) emptyCartState.style.display = 'none';
    if (cartTableList) cartTableList.style.display = 'flex';
    if (cartSummaryBox) cartSummaryBox.style.display = 'flex';

    let subtotal = 0;

    cartTableList.innerHTML = items
      .map((item, idx) => {
        const qty = item.quantity || 1;
        const itemTotal = (item.priceNumber || 0) * qty;
        subtotal += itemTotal;

        return `
          <div class="cart-page-item flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-teal-100 shadow-sm transition-all hover:shadow-md">
            <img class="cart-page-item-img w-20 h-20 object-cover rounded-lg border border-teal-100" src="${item.image}" alt="${item.title}" />
            
            <div class="cart-page-item-info flex-1 min-w-0 text-center sm:text-left">
              <h3 class="cart-page-item-title font-bold text-gray-900 text-base line-clamp-1">${item.title}</h3>
              <p class="cart-page-item-variant text-xs text-gray-500 mt-1">Varian / Ukuran: <strong class="text-teal-800">${item.variant}</strong></p>
              <p class="cart-page-item-price font-bold text-teal-700 mt-1">${item.priceFormatted}</p>
            </div>

            <div class="cart-qty-control inline-flex items-center gap-2 bg-gray-50 border border-teal-100 rounded-lg p-1.5">
              <button class="cart-qty-btn w-8 h-8 flex items-center justify-center rounded bg-white text-teal-800 hover:bg-teal-50 font-bold border border-teal-200 cursor-pointer transition-colors shadow-sm" type="button" onclick="changeQuantity(${idx}, -1)" aria-label="Kurangi kuantitas">&minus;</button>
              <span class="cart-qty-num text-sm font-semibold w-8 text-center text-gray-800">${qty}</span>
              <button class="cart-qty-btn w-8 h-8 flex items-center justify-center rounded bg-white text-teal-800 hover:bg-teal-50 font-bold border border-teal-200 cursor-pointer transition-colors shadow-sm" type="button" onclick="changeQuantity(${idx}, 1)" aria-label="Tambah kuantitas">&plus;</button>
            </div>

            <button class="cart-item-delete-btn p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" type="button" onclick="removeFromCart(${idx})" title="Hapus produk" aria-label="Hapus produk">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        `;
      })
      .join('');

    // Hitung ongkir (Gratis jika subtotal >= Rp 150.000)
    const isFreeShipping = subtotal >= 150000;
    const shippingFee = isFreeShipping ? 0 : 15000;

    // Hitung diskon
    let discountAmount = 0;
    if (activeDiscountPercent > 0) {
      discountAmount = Math.round((subtotal * activeDiscountPercent) / 100);
    } else if (activeDiscountNominal > 0) {
      discountAmount = activeDiscountNominal;
    }
    if (discountAmount > subtotal) discountAmount = subtotal;

    const grandTotal = subtotal + shippingFee - discountAmount;

    // Update elemen rincian harga
    const elSubtotal = document.getElementById('cart-subtotal-val');
    const elShipping = document.getElementById('cart-shipping-val');
    const elDiscountRow = document.getElementById('cart-discount-row');
    const elDiscountVal = document.getElementById('cart-discount-val');
    const elGrandTotal = document.getElementById('cart-grandtotal-val');

    if (elSubtotal) elSubtotal.textContent = 'Rp' + subtotal.toLocaleString('id-ID');
    if (elShipping) {
      elShipping.innerHTML = isFreeShipping
        ? '<span class="free-shipping-tag inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">GRATIS ONGKIR</span>'
        : 'Rp' + shippingFee.toLocaleString('id-ID');
    }
    if (elDiscountRow && elDiscountVal) {
      if (discountAmount > 0) {
        elDiscountRow.style.display = 'flex';
        elDiscountVal.textContent = '- Rp' + discountAmount.toLocaleString('id-ID');
      } else {
        elDiscountRow.style.display = 'none';
      }
    }
    if (elGrandTotal) elGrandTotal.textContent = 'Rp' + grandTotal.toLocaleString('id-ID');
  }
}

// Buka Modal Checkout
function openCheckoutModal() {
  const items = getCartItems();
  if (items.length === 0) {
    alert('Keranjang belanja Anda masih kosong!');
    return;
  }
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('is-active');
  }
}

// Tutup Modal Checkout
function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('is-active');
  }
}

// Proses Submit Checkout Form
function handleCheckoutSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('buyer-name')?.value || 'Pelanggan';
  const phone = document.getElementById('buyer-phone')?.value || '-';
  const paymentMethod = document.getElementById('buyer-payment')?.value || 'QRIS';

  alert(`Selamat ${name}! Pesanan Anda berhasil dibuat.\nNomor Invoice: UB-${Date.now().toString().slice(-6)}\nMetode Pembayaran: ${paymentMethod}\nTim kami akan mengirim konfirmasi resi ke WhatsApp ${phone}.`);

  // Kosongkan keranjang setelah checkout berhasil
  saveCartItems([]);
  closeCheckoutModal();
  updateCartUI();
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Handler tombol checkout di halaman keranjang
  const checkoutBtn = document.getElementById('checkout-page-btn');
  checkoutBtn?.addEventListener('click', openCheckoutModal);

  // Close modal checkout
  document.getElementById('checkout-modal-close')?.addEventListener('click', closeCheckoutModal);
  document.getElementById('checkout-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'checkout-modal') closeCheckoutModal();
  });
});
