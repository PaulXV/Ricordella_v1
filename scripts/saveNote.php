<?php
include './connessione.php';
$idNota = $_REQUEST['idNota'];
$date = $_REQUEST['date'];
$idUser = $_REQUEST['idUser'];

$sql = "INSERT INTO notes (id, dataCreazione, idUtente) VALUES ('$idNota','$date','$idUser')";

if (!$conn->query($sql)) {
    echo "Errore durante la registrazione: " . $conn->error;
}

$conn->close();