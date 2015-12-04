<?php
require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//Prepare sql statement
//$sql = "SELECT * FROM projects,cliplists WHERE projects.owner = '".$_POST['owner']."' AND cliplists.parent_project_id = projects.clipper_project_id";
$sql = "SELECT * FROM projects WHERE projects.owner = '".$_POST['owner']."' AND is_archived!=1";

$result=$conn->query($sql);

$rows= array();
while($row = mysqli_fetch_array($result))
{
	//start to create resultObj
	$object = new stdClass();
   	$object->project = $row;//all top level project data

	//how many cliplists in project
	$cliplistsSQL = "SELECT * FROM cliplists WHERE parent_project_id = '".$row['clipper_project_id']."'";
	$cliplistCount=$conn->query($cliplistsSQL);
	$object->numCliplists = mysqli_num_rows($cliplistCount);

	//how many resources in project
	$resourcesSQL = "SELECT * FROM resources WHERE parent_project_id = '".$row['clipper_project_id']."'";
	$resourcesCount=$conn->query($resourcesSQL);
	$object->numResources = mysqli_num_rows($resourcesCount);

	//how many clips in project
	$clipsSQL = "SELECT * FROM clips WHERE parent_project_id = '".$row['clipper_project_id']."'";
	$clipsCount=$conn->query($clipsSQL);
	$object->numClips = mysqli_num_rows($clipsCount);


	array_push($rows, $object);
}
echo json_encode($rows);
//tidy up
$conn->close();
?>
