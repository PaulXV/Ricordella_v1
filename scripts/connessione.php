<?php
    $servername = "localhost";
    $username = "your_username";
    $password = "your_password";
    $dbname = "your_db";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connessione fallita: " . $conn->connect_error);
    }
