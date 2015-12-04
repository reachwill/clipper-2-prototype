<?php
require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//check if the clip exists
$query = mysqli_query($conn, "SELECT * FROM annotations WHERE clipper_anno_id='".$_POST['clipper_anno_id']."'");
//echo mysqli_num_rows($query);
//if it does update it
$_POST['text'] = mysqli_real_escape_string($conn, $_POST['text']);

if(mysqli_num_rows($query) > 0){
	$result = mysqli_query($conn,"UPDATE annotations SET parent_clip='".$_POST['parentClip']."', parent_project='".$_POST['parentProject']."',  clipper_anno_id='".$_POST['clipper_anno_id']."',  authors='".$_POST['owner']."',  text='".$_POST['text']."', start='".$_POST['start']."', end='".$_POST['end']."', date_created='".$_POST['date_created']."', last_modified='".$_POST['last_modified']."' WHERE clipper_anno_id='".$_POST['clipper_anno_id']."' ");
	echo '{"success":"updated'.$_POST['parentClip'].'"}';
}
//else insert it as a new clip
else{
	$result = mysqli_query($conn,"INSERT INTO annotations (authors,clipper_anno_id,date_created,end,parent_clip,parent_project,start,text,last_modified) VALUES ('".$_POST['owner']."','".$_POST['clipper_anno_id']."','".$_POST['date_created']."','".$_POST['end']."','".$_POST['parentClip']."','".$_POST['parentProject']."','".$_POST['start']."','".$_POST['text']."','".$_POST['last_modified']."')");
	echo '{"success":inserted'.$_POST['clipper_clip_id'].'}';
}

//send back latest collection of clips to refresh the view
/*$query = mysqli_query($conn, "SELECT * FROM clips WHERE parent_cliplist_id='1442410274202'");

$rows= array();
while($row = mysqli_fetch_array($query))
{
	array_push($rows, $row);
}
echo json_encode($rows);*/




//tidy up
$conn->close();
?>
