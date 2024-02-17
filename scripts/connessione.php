<?php
    $servername = "localhost";
    $username = "bru_pao_user_3";
    $password = "F3C890OV";
    $dbname = "bru_pao_db_3";

    // Creazione della connessione
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica della connessione
    if ($conn->connect_error) {
        die("Connessione fallita: " . $conn->connect_error);
    }
?>
