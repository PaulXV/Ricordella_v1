<?php
require './connessione.php';
$idUser = $_REQUEST['idUser'];
$queryDB = 'SELECT * FROM notes WHERE idUtente='.$idUser.' ORDER BY dataCreazione DESC';
$rows = array();
$result = $conn->query($queryDB);
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}
$conn->close();
echo json_encode($rows);