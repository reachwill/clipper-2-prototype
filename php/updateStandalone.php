<?php
require_once('config.php');
$username = $_POST['username'];
$projectId = $_POST['projectId'];
$data = $_POST['data'];
$my_file = '../users/'.$username.'/'.$projectId.'/cliplist.txt';
$handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
//$data = 'This is the data';
fwrite($handle, $data);
echo $handle;
?>
