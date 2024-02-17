<?php
include './connessione.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $idNota = $_POST['id'];
    $title = mysqli_real_escape_string($conn, $_POST['title']);
    $priority = $_POST['priority'];
    $content = mysqli_real_escape_string($conn, $_POST['testo']);
    $date = $_POST['date'];
    $userId = $_POST['userID'];

    $sql = "INSERT INTO notes VALUES ('$idNota', '$title','$priority','$content','$date','$userId')";

    if (!$conn->query($sql)) {
        echo "Errore durante la registrazione: " . $conn->error;
    }
}

$conn->close();
?>