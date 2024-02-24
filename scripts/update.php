<?php
include './connessione.php';
$idNota = $_REQUEST['idNota'];
$title = mysqli_real_escape_string($conn, $_REQUEST['title']);
$priority = (int)$_REQUEST['priority'];
$content = mysqli_real_escape_string($conn, $_REQUEST['content']);
$date = $_REQUEST['date'];
$modifyDate = $_REQUEST['modifyDate'];
$completed = $_REQUEST['completed'];
$completed = ($completed == '1') ? $completed=true : $completed=false;
$idUser = $_REQUEST['idUser'];

$sql = "UPDATE notes SET priorita=".$priority.', testo='.$content.', dataCreazione='.$date.', dataModifica='.$modifyDate.', completed='.$completed.' WHERE id='.$idNota.' AND idUser='.$idUser;
if (!$conn->query($sql)) {
    echo "Errore durante la registrazione: " . $conn->error;
}
$conn->close();