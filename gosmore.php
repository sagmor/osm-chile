<?php
if (isset($_GET['flat'],$_GET['flon'],$_GET['tlat'],$_GET['tlon'],$_GET['v'],$_GET['fast'],$_GET['layer'])) 
{
$flat = addslashes($_GET['flat']);
$flon = addslashes($_GET['flon']);
$tlat = addslashes($_GET['tlat']);
$tlon = addslashes($_GET['tlon']);
$v = addslashes($_GET['v']);
$fast = addslashes($_GET['fast']);
$layer = addslashes($_GET['layer']);
$vfile = "http://www.yournavigation.org/gosmore.php?flat=$flat&flon=$flon&tlat=$tlat&tlon=$tlon&v=$v&fast=$fast&layer=$layer";
header("Content-type: text/xml");
readfile($vfile);
}
else {
echo "<a href=\"http://wiki.openstreetmap.org/wiki/YOURS#Parameters\" target=\"_blank\" title=\"Faltan Parametros\" style=\"color:#cccccc;\">Faltan Parametros</a>.";
}
?>