<?php
require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$result = mysqli_query($conn,"UPDATE projects SET is_archived=1 WHERE clipper_project_id='".$_POST['clipper_project_id']."' ");



//tidy up
$conn->close();
?>
