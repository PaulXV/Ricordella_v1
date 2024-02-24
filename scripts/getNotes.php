<?php
require './connessione.php';
$idUser = $_REQUEST['idUser'];
$queryDB = 'SELECT * FROM notes WHERE idUtente='.$idUser;
$rows = array();

$result = $conn->query($queryDB,0);
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

$conn->close();
echo json_encode($rows);