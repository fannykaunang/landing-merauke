# 🏛️ Portal Website & Aplikasi Kabupaten Merauke

Landing page modern untuk menampilkan daftar website dan aplikasi yang dikelola oleh Dinas Komunikasi dan Informatika Kabupaten Merauke.

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?logo=tailwind-css)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

## ✨ Fitur

- 🎨 **Desain Modern** - UI/UX responsif dengan dark mode
- 🔍 **Pencarian** - Cari website berdasarkan nama atau deskripsi
- 📂 **Kategori** - Filter berdasarkan kategori (Social Media, Productivity, Development, dll)
- 📱 **Responsif** - Tampilan optimal di semua device
- ⚡ **Fast Performance** - Dibangun dengan Next.js App Router & Turbopack
- 🌙 **Dark Mode** - Toggle tema gelap/terang

## 📋 Persyaratan

- Node.js 18.17 atau lebih baru
- MySQL 8.0 atau lebih baru
- npm atau yarn

## 🚀 Panduan Instalasi

### Step 1: Clone atau Extract Project

```bash
# Jika menggunakan git
git clone <repository-url>
cd landing-merauke

# Atau extract file ZIP ke folder landing-merauke
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Database MySQL

1. **Login ke MySQL:**
```bash
mysql -u root -p
```

2. **Buat database:**
```sql
CREATE DATABASE landing;
USE landing;
```

3. **Import SQL schema dan data:**
```sql
-- Jalankan file SQL yang sudah disediakan
SOURCE /path/to/landing_merauke.sql;
```

Atau gunakan HeidiSQL/phpMyAdmin untuk import file `landing_merauke.sql`.

### Step 4: Konfigurasi Environment

Buat file `.env.local` di root project:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=landing

# App Configuration
NEXT_PUBLIC_APP_NAME="Portal Website & Aplikasi Kabupaten Merauke"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
landing-merauke/
├── app/
│   ├── api/
│   │   ├── categories/
│   │   │   └── route.ts       # API endpoint kategori
│   │   └── websites/
│   │       └── route.ts       # API endpoint websites
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   ├── separator.tsx
│   │   └── sheet.tsx
│   ├── header.tsx             # Header navigation
│   ├── hero-section.tsx       # Hero section
│   ├── category-filter.tsx    # Category filter buttons
│   ├── website-card.tsx       # Website card component
│   ├── website-grid.tsx       # Website grid with pagination
│   ├── footer.tsx             # Footer
│   ├── theme-provider.tsx     # Theme provider
│   └── theme-toggle.tsx       # Dark mode toggle
├── lib/
│   ├── db.ts                  # Database connection
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── public/
│   └── grid.svg               # Background pattern
├── .env.local                 # Environment variables
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🎨 Kustomisasi

### Mengubah Warna Tema

Edit file `app/globals.css` untuk mengubah warna tema:

```css
:root {
  --primary: oklch(...);
  /* Ubah warna lain sesuai kebutuhan */
}
```

### Menambah Kategori Baru

Insert ke database:

```sql
INSERT INTO categories (name, slug, description, icon) VALUES
('Nama Kategori', 'slug-kategori', 'Deskripsi', 'icon-name');
```

Icon yang tersedia: `users`, `briefcase`, `code`, `palette`, `shopping-cart`

### Menambah Website Baru

Insert ke database:

```sql
INSERT INTO websites (title, description, url, image_url, category_id, tags, featured, is_active) VALUES
('Nama Website', 'Deskripsi website', 'https://example.com', 'https://image-url.com/image.jpg', 1, '["tag1","tag2"]', 0, 1);
```

## 🔧 Scripts

```bash
# Development dengan Turbopack
npm run dev

# Build untuk production
npm run build

# Jalankan production server
npm start

# Linting
npm run lint
```

## 📱 Responsif Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 API Endpoints

### GET /api/categories
Mendapatkan semua kategori dengan jumlah website.

### GET /api/websites
Mendapatkan daftar website dengan filter dan pagination.

**Query Parameters:**
- `search` - Kata kunci pencarian
- `category` - Slug kategori
- `featured` - `true` untuk website featured
- `page` - Nomor halaman (default: 1)
- `limit` - Jumlah per halaman (default: 12)

## 📄 Lisensi

© 2025 Pemerintah Kabupaten Merauke. All rights reserved.

Dikelola oleh Dinas Komunikasi dan Informatika Kabupaten Merauke.
