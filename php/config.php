<?php //header('Access-Control-Allow-Origin: *'); ?>
<?php
//change variables to reflect db settings created for this application
$db = 'reachwil_clipper_phase2';
$user = 'reachwil_cp2';
$pwd = 's(gTP.=35rZh';


function getDBCon(){
	return mysqli_connect("localhost",$user,$pwd,$db);
}

?>
