<?php
require 'koneksi.php';

if (isset($_GET['id'])) {                       // GET penulis.php?id=1
    $id = (int)$_GET['id'];
    $stmt = $conn->prepare("SELECT id, nama, biografi, negara FROM penulis WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $p = $stmt->get_result()->fetch_assoc();
    if (!$p) kirim(["error" => "Penulis tidak ditemukan"], 404);

    // sertakan daftar buku milik penulis ini
    $stmt = $conn->prepare("SELECT id, judul, genre, tahun FROM buku WHERE penulis_id = ? ORDER BY tahun");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $p['buku'] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    kirim($p);
}

$q = mysqli_query($conn, "SELECT id, nama, biografi, negara FROM penulis ORDER BY nama");
kirim(mysqli_fetch_all($q, MYSQLI_ASSOC));      // GET penulis.php
