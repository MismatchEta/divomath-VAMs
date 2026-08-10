<?php
// insert.php - test endpoint

header("Content-Type: application/json; charset=utf-8");

// Für Tests ggf. nötig, wenn Lernumgebung von anderer Domain kommt.
// Später restriktiver setzen!
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Preflight-Anfrage beantworten
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Nur POST erlauben
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "error" => "Only POST requests are allowed."
    ]);
    exit;
}

// Raw JSON einlesen
$rawInput = file_get_contents("php://input");

// JSON dekodieren
$data = json_decode($rawInput, true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "error" => "Invalid JSON.",
        "raw" => $rawInput
    ]);
    exit;
}

// Testweise in Datei schreiben
$logLine = date("Y-m-d H:i:s") . " | " . $rawInput . PHP_EOL;
file_put_contents(__DIR__ . "/received.log", $logLine, FILE_APPEND);

// Zusätzlich ins PHP-Error-Log
error_log("insert.php received: " . $rawInput);

// Antwort an Browser / JavaScript
echo json_encode([
    "ok" => true,
    "message" => "Data received.",
    "received" => $data
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);