<?php
require './connessione.php';
$idNota = $_REQUEST['idNota'];

$query = 'DELETE FROM notes WHERE id='.$idNota;
if (!$conn->query($query)) {
    echo "Errore durante la registrazione: " . $conn->error;
}
$conn->close();