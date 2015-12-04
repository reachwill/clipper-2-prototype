<?php
require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = "DELETE FROM resources WHERE  `videoid` =  '".$_POST['videoid']."' AND `parent_project_id` = '".$_POST['parent_project_id']."'";

$result = mysqli_query($conn,$sql);



echo 'deleted';

//tidy up
$conn->close();
?>
