<?php
$destinatario = $_REQUEST["destinatario"];
$oggetto = $_REQUEST["oggetto"];
$testo = $_REQUEST["testo"];
$header = "From: note@app.com";
echo mail($destinatario, $oggetto, $testo, $header);