
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
$sql = "SELECT * FROM projects WHERE clipper_project_id = '".$_POST['projectId']."'";

$result=$conn->query($sql);

$resultObjs = array();

$rows= array();
while($row = mysqli_fetch_array($result))
{
	//start to create resultObj
	$object = new stdClass();
   	$object->project = $row;//all top level project data

	//get all the cliplists for the project
	$cliplistsSQL = "SELECT * FROM cliplists WHERE parent_project_id = '".$_POST['projectId']."'";
	$cliplists=$conn->query($cliplistsSQL);
	$cliplistsArray = array();
	while($cl = mysqli_fetch_array($cliplists)){
		$cliplistObj = new stdClass();
		$cliplistObj->cliplist = $cl;
		//get all the clips for the cliplist
		$clId = $cl['clipper_cliplist_id'];
		$clipsSQL = "SELECT * FROM clips WHERE parent_cliplist_id = '".$_POST['projectId']."' ORDER BY orderIndex ASC";
		$clips=$conn->query($clipsSQL);
		$clipsArray = array();
		while($c = mysqli_fetch_array($clips)){
			//get all the annotations for each clip
			$clipObj = new stdClass();
			$clipObj->clip = $c;
			$annosArray = array();
			$annosSQL = "SELECT * FROM annotations WHERE parent_clip = '".$c['clipper_clip_id']."' ORDER BY start ASC";
			$annos=$conn->query($annosSQL);
			while($anno = mysqli_fetch_array($annos)){
				array_push($annosArray, $anno);
			}
			$clipObj->annos = $annosArray;
			array_push($clipsArray, $clipObj);
		}
		$cliplistObj->clips = $clipsArray;
		array_push($cliplistsArray, $cliplistObj);
	}
	$object->cliplists = $cliplistsArray;

	//get all the resources for the project
	$resourcesSQL = "SELECT * FROM resources WHERE parent_project_id = '".$_POST['projectId']."'";
	$resources=$conn->query($resourcesSQL);
	$resourcesArray = array();
	while($res = mysqli_fetch_array($resources)){
		array_push($resourcesArray, $res);
	}
	$object->resources = $resourcesArray;


	array_push($rows, $object);
}
echo json_encode($rows);
//tidy up
$conn->close();
?>
