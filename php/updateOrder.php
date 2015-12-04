<?php
require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$clips = $_POST['clips'];
foreach($clips as $clip){
	$orderIndex = $clip['orderIndex'];
	$clipper_clip_id = $clip['clipId'];
	$sql = "UPDATE clips SET orderIndex = ".$orderIndex." WHERE clipper_clip_id = '".$clipper_clip_id."'";
	$result = mysqli_query($conn,$sql);
}



//echo json_encode($clips);




echo 'clip order updated';
//tidy up
$conn->close();
?>
