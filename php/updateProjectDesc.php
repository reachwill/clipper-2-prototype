<?php
require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = "UPDATE  `projects` SET  `title` =  '".$_POST['title']."',`description` =  '".$_POST['description']."'     WHERE  `clipper_project_id` =  '".$_POST['clipper_project_id']."'";

$result = mysqli_query($conn,$sql);



echo $_POST['description'];

//tidy up
$conn->close();
?>
