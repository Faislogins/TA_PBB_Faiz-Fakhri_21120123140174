<?php
require 'koneksi.php';

$sql = "SELECT b.id, b.judul, b.genre, b.tahun, b.sinopsis, p.nama AS penulis
        FROM buku b JOIN penulis p ON b.penulis_id = p.id";

if (isset($_GET['id'])) {                       // GET buku.php?id=1
    $id = (int)$_GET['id'];
    $stmt = $conn->prepare($sql . " WHERE b.id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if (!$row) kirim(["error" => "Buku tidak ditemukan"], 404);
    kirim($row);
}

$q = mysqli_query($conn, $sql . " ORDER BY b.judul");   // GET buku.php
kirim(mysqli_fetch_all($q, MYSQLI_ASSOC));
