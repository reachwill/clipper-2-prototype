<?php

require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}



$_POST['title'] = mysqli_real_escape_string($conn, $_POST['title']);
$_POST['description'] = mysqli_real_escape_string($conn, $_POST['description']);
$_POST['thumbnail'] = mysqli_real_escape_string($conn, $_POST['thumbnail']);
$_POST['videoid'] = mysqli_real_escape_string($conn, $_POST['videoid']);

//check if the resource exists
$query = mysqli_query($conn, "SELECT * FROM resources WHERE videoid='".$_POST['videoid']."' AND parent_project_id = '".$_POST['parent_project_id']."'");







//if it does update it
if(mysqli_num_rows($query) > 0){
	$result = mysqli_query($conn,"UPDATE resources SET title='".$_POST['title']."', videoid='".$_POST['videoid']."', description='".$_POST['description']."', parent_project_id='".$_POST['parent_project_id']."' WHERE videoid='".$_POST['videoid']."' ");
	echo 'exists';
}
//else insert it as a new clip
else{
	$result = mysqli_query($conn,"INSERT INTO resources (title,videoid,parent_project_id,sourcetype,description,thumbnail) VALUES ('".$_POST['title']."','".$_POST['videoid']."','".$_POST['parent_project_id']."','".$_POST['sourcetype']."','".$_POST['description']."','".$_POST['thumbnail']."')");
	echo 'inserted';
}





//send back latest collection of resources to refresh the view
/*$query = mysqli_query($conn, "SELECT * FROM resources WHERE videoid='".$_POST['video']."'");

$rows= array();
while($row = mysqli_fetch_array($query))
{
	array_push($rows, $row);
}
echo json_encode($rows);*/




//tidy up
$conn->close();
?>
