<?php
require 'connessione.php';
$idNota = $_REQUEST['idNota'];
$idUser = $_REQUEST['idUser'];

$query = 'DELETE * FROM notes WHERE idUtente == '.$idUser.' AND idNota =='.$idNota;
$mysqli->close();