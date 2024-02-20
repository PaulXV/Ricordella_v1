<?php
require 'connessione.php';
$idNota = $_REQUEST['idNota'];

$query = 'DELETE * FROM notes WHERE idNota =='.$idNota;
$mysqli->close();