<?php
require 'connessione.php';
$idUser = $_REQUEST['idUser'];

$query = 'SELECT * FROM utente WHERE idUtente == '.$idUser;
$result = $conn->query($query);
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}
$mysqli->close();
echo json_encode($rows);