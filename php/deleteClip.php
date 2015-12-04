<?php
require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = "DELETE FROM clips WHERE  `clipper_clip_id` =  '".$_POST['clipper_clip_id']."'";

$result = mysqli_query($conn,$sql);



echo 'deleted';

//tidy up
$conn->close();
?>
