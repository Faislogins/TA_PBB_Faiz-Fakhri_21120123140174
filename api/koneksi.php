<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

mysqli_report(MYSQLI_REPORT_OFF);
// Sesuaikan jika user/password MySQL berbeda (XAMPP default: root, tanpa password)
$conn = @mysqli_connect("localhost", "root", "", "bukuku");
if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Koneksi database gagal"]);
    exit;
}
mysqli_set_charset($conn, "utf8mb4");

function kirim($data, $kode = 200) {
    http_response_code($kode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
