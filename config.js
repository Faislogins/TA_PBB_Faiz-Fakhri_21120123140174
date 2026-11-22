// ====== PENGATURAN BUKUKU ======
const CONFIG = {
  // Alamat API PHP (tanpa garis miring di akhir).
  //  - Lokal (XAMPP)  : 'http://localhost/bukuku-api'
  //  - Hosting HTTPS  : 'https://domainkamu.com/bukuku-api'
  //  - Kosongkan ('') : pakai data lokal data/data.json saja
  // Jika server tidak bisa dihubungi, aplikasi otomatis memakai data lokal.
  API_URL: 'http://localhost/bukuku-api',

  // Identitas untuk halaman Profil
  PROFILE: {
    nama: '[Nama Anda]',
    nim: '[NIM Anda]',
    kelas: '[Kelas Anda]',
    github: 'github.com/[username]/bukuku-pwa'
  }
};
