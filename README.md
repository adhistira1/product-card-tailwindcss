# Toko Urban / Budarpa Store (Tailwind CSS v4.3)

Proyek e-commerce toko online produk kasual urban (Sepatu, Tas Ransel, Jaket Windbreaker, dan Jam Tangan Chrono) yang telah dimigrasikan sepenuhnya ke **Tailwind CSS v4.3** dengan arsitektur CSS-first modern.

---

## 🚀 Fitur Utama
- **Tailwind CSS v4.3 Architecture**: Konfigurasi tema CSS-first melalui `@theme` di `src/input.css` tanpa file legacy `tailwind.config.js`.
- **Desain Estetik & Konsisten**: Efek ambient luminous orbs, glassmorphism dengan backdrop blur, gradasi zamrud teal, serta running announcement text (marquee) infinite loop.
- **Katalog & Detail Multi-Sudut**: Halaman detail untuk 4 produk utama lengkap dengan slider foto multi-sudut, pemilih varian ukuran/warna, tabs keunggulan, size guide, dan form review pelanggan.
- **Keranjang Belanja Real-Time ([cart.js](cart.js))**: Perhitungan otomatis kuantitas, kode voucher kupon (`DISKON10`, `URBAN30`), promo gratis ongkir otomatis, dan modal konfirmasi pemesanan terintegrasi dengan `localStorage`.
- **100% Responsif**: Tampilan optimal untuk mobile, tablet, dan desktop dengan navigasi drawer menu interaktif.

---

## 📁 Struktur Direktori
```text
├── index.html                 # Halaman utama katalog & beranda
├── keranjang.html             # Halaman keranjang belanja & modal checkout
├── detail-produk.html         # Detail produk Sepatu Urban
├── detail-jaket-urban.html    # Detail produk Jaket Windbreaker
├── detail-jam-urban.html      # Detail produk Jam Tangan Chrono
├── detail-tas-ransel.html     # Detail produk Tas Ransel Urban
├── tentang-kami.html          # Halaman profil toko & nilai filosofi
├── cara-belanja.html          # Panduan 4 langkah order & tabel ukuran
├── faq.html                   # Accordion pusat bantuan & FAQ
├── kontak.html                # Saluran CS, jam buka, direct WA & form
├── cart.js                    # Logika keranjang belanja & dynamic DOM
├── server.js                  # Local static development HTTP server
├── src/
│   └── input.css              # Input styling Tailwind CSS v4 (@theme & keyframes)
├── dist/
│   └── output.css             # Output CSS minified siap produksi
├── images/                    # Seluruh aset foto produk & ikon
├── package.json               # Konfigurasi npm scripts & Tailwind v4 dependencies
└── .gitignore                 # Daftar file/folder yang diabaikan Git
```

---

## 🛠️ Cara Menjalankan

### 1. Menjalankan Server Lokal
Untuk melihat website di browser:
```powershell
npm start
```
Buka browser dan akses: **`http://localhost:3000/`**

### 2. Mode Pengembangan Tailwind (Watch Mode)
Untuk mengedit class utility HTML/JS dan mengompilasi CSS secara otomatis:
```powershell
npm run dev
```

### 3. Kompilasi Produksi (Minified Build)
Untuk membuat CSS minified produksi:
```powershell
npm run build
```

---

## 🎨 Kupon Promo Tersedia
- `DISKON10` : Potongan diskon 10%
- `URBAN30`  : Potongan diskon Rp 30.000
- *Gratis Ongkir otomatis berlaku jika subtotal belanja >= Rp 150.000*

