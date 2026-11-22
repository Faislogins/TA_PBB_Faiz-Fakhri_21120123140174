CREATE DATABASE IF NOT EXISTS bukuku CHARACTER SET utf8mb4;
USE bukuku;

DROP TABLE IF EXISTS buku;
DROP TABLE IF EXISTS penulis;

CREATE TABLE penulis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  biografi TEXT,
  negara VARCHAR(100)
);

CREATE TABLE buku (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  penulis_id INT NOT NULL,
  genre VARCHAR(100),
  tahun INT,
  sinopsis TEXT,
  FOREIGN KEY (penulis_id) REFERENCES penulis(id) ON DELETE CASCADE
);

INSERT INTO penulis (nama, biografi, negara) VALUES
('Andrea Hirata', 'Penulis novel Laskar Pelangi yang terinspirasi dari kisah masa kecilnya di Belitung.', 'Indonesia'),
('Pramoedya Ananta Toer', 'Sastrawan besar Indonesia, penulis Tetralogi Buru.', 'Indonesia'),
('Tere Liye', 'Penulis produktif dengan banyak novel best-seller.', 'Indonesia'),
('Habiburrahman El Shirazy', 'Novelis Indonesia yang dikenal lewat novel religi Ayat-Ayat Cinta.', 'Indonesia'),
('Dee Lestari', 'Penulis dan penyanyi Indonesia, pencipta serial Supernova.', 'Indonesia');

INSERT INTO buku (judul, penulis_id, genre, tahun, sinopsis) VALUES
('Laskar Pelangi', 1, 'Novel', 2005, 'Kisah 10 anak Belitung yang bersekolah di SD Muhammadiyah dengan segala keterbatasannya.'),
('Sang Pemimpi', 1, 'Novel', 2006, 'Kelanjutan kisah Ikal dan Arai yang bermimpi melanjutkan sekolah hingga ke Eropa.'),
('Edensor', 1, 'Novel', 2007, 'Lanjutan kisah Ikal mengembara ke Eropa.'),
('Bumi Manusia', 2, 'Novel Sejarah', 1980, 'Kisah Minke di era kolonial Hindia Belanda.'),
('Anak Semua Bangsa', 2, 'Novel Sejarah', 1980, 'Lanjutan kisah Minke yang mulai memahami nasib bangsanya.'),
('Bumi', 3, 'Fantasi', 2014, 'Petualangan Raib, Ali, dan Seli di dunia paralel.'),
('Hujan', 3, 'Fiksi Ilmiah', 2016, 'Kisah Lail dan Esok di masa depan setelah bencana besar.'),
('Ayat-Ayat Cinta', 4, 'Novel Religi', 2004, 'Perjalanan Fahri, mahasiswa Indonesia di Kairo, dalam menghadapi cinta dan ujian hidup.'),
('Supernova: Ksatria, Puteri, dan Bintang Jatuh', 5, 'Fiksi Ilmiah', 2001, 'Kisah Dimas dan Reuben yang menulis kisah cinta berlatar sains.');
