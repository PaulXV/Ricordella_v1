<?php
include './connessione.php';

$idNota = $_REQUEST['idNota'];
$title = mysqli_real_escape_string($conn, $_REQUEST['title']);
$priority = $_REQUEST['priority'];
$content = mysqli_real_escape_string($conn, $_REQUEST['content']);
$date = $_REQUEST['date'];
$modifyDate = $_REQUEST['modifyDate'];
$completed = $_REQUEST['completed'];
$idUser = $_REQUEST['idUser'];;

$sql = "INSERT INTO notes VALUES ('$idNota', '$title','$priority','$content','$date','$modifyDate','$completed','$idUser')";

if (!$conn->query($sql)) {
    echo "Errore durante la registrazione: " . $conn->error;
}

$conn->close();
?>