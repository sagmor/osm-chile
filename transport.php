<?php
if (isset($_GET['find'])) 
{
$find = ($_GET['find']);
$vfile = "http://www.yournavigation.org/transport.php?url=http://gazetteer.openstreetmap.org/namefinder/search.xml&find=".urlencode($find)."&max=1";
header("Content-type: text/xml");
readfile($vfile);
}
else {
echo "No se encuentran presentes todas las variables necesarias. <br/>Por favor revise la consulta que se envio y recuerde las variables requeridas: url, find, max.";
}
?>