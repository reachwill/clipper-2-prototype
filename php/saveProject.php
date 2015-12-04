<?php
require_once('config.php');

$_POST['title'] = mysqli_real_escape_string($conn, $_POST['title']);
$_POST['description'] = mysqli_real_escape_string($conn, $_POST['description']);

// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//Prepare sql statement
$sql = "INSERT INTO projects (`clipper_project_id`, `title`, `description`,`authors`,`owner`,`date_created`,`last_modified`) VALUES (".$_POST['projectId'].",'".$_POST['projectTitle']."','".$_POST['projectDesc']."','".$_POST['authors']."','".$_POST['owner']."','".$_POST['dateCreated']."','".$_POST['lastModified']."') ";

//try database operation
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
	echo $_POST['authors'];
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}







//tidy up
$conn->close();
?>
