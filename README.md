# BukuKu — Aplikasi Katalog Buku & Penulis (PWA)

- Nama   : Faiz Fakhri
- NIM    : 21120123140174
- Kelas  : Prak PPB
- Platform : PWA (HTML + CSS + JavaScript murni)
- Web Service : PHP Native + MySQL (Modul 1)
- Demo   : https://USERNAME.github.io/bukuku-pwa/

## Fitur
- Bottom Navigation: Home | Buku | Penulis | Profil
- 6 halaman: Home, Daftar Buku, Detail Buku, Daftar Penulis, Detail Penulis, Profil
- Pencarian di daftar buku dan penulis
- Installable (Add to Home Screen) dan bisa dipakai offline (Service Worker)
- Data dari API PHP + MySQL; otomatis memakai data lokal bila server tidak terjangkau

## Struktur
```
bukuku-pwa/
├── index.html · style.css · app.js · config.js
├── sw.js · manifest.webmanifest
├── data/data.json      → data cadangan
├── icons/              → ikon PWA 192 & 512
├── api/                → koneksi.php, buku.php, penulis.php
└── database/bukuku.sql
```

## Endpoint API
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | /buku.php | Semua buku |
| GET | /buku.php?id=1 | Detail buku |
| GET | /penulis.php | Semua penulis |
| GET | /penulis.php?id=1 | Detail penulis + daftar bukunya |

## Menjalankan Lokal (XAMPP)
1. Start Apache + MySQL, import `database/bukuku.sql` lewat phpMyAdmin.
2. Salin folder `api/` ke `htdocs/bukuku-api/`.
3. Salin seluruh folder PWA ini ke `htdocs/bukuku-pwa/`.
4. Buka `http://localhost/bukuku-pwa/`.

## Deploy (GitHub Pages)
Settings → Pages → Branch `main` / folder `/ (root)` → Save.
Catatan: API harus berupa **HTTPS** agar bisa dipanggil dari situs HTTPS.
Isi `API_URL` di `config.js` dengan alamat API hosting HTTPS kamu.

## Screenshot
(Tempel screenshot 6 halaman di sini)
