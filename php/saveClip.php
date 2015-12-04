<?php
require_once('config.php');
// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//check if the clip exists
$query = mysqli_query($conn, "SELECT * FROM clips WHERE clipper_clip_id='".$_POST['clipper_clip_id']."'");
//echo mysqli_num_rows($query);
//if it does update it
$_POST['title'] = mysqli_real_escape_string($conn, $_POST['title']);
$_POST['description'] = mysqli_real_escape_string($conn, $_POST['description']);
$_POST['tags'] = mysqli_real_escape_string($conn, $_POST['tags']);

if(mysqli_num_rows($query) > 0){
	$result = mysqli_query($conn,"UPDATE clips SET title='".$_POST['title']."', description='".$_POST['description']."',  authors='".$_POST['authors']."',  owner='".$_POST['owner']."',  parent_cliplist_id='".$_POST['parent_cliplist_id']."', parent_project_id='".$_POST['parent_project_id']."', start='".$_POST['start']."', end='".$_POST['end']."', date_created='".$_POST['dateCreated']."', last_modified='".$_POST['lastModified']."', tags='".$_POST['tags']."' WHERE clipper_clip_id='".$_POST['clipper_clip_id']."' ");
	//echo '{"success":"updated'.$_POST['title'].'"}';
}
//else insert it as a new clip
else{
	$result = mysqli_query($conn,"INSERT INTO clips (thumbnail,type,resource_uri,title,clipper_clip_id,description,authors,owner,parent_cliplist_id,parent_project_id,start,end,date_created,last_modified,tags) VALUES ('".$_POST['thumbnail']."','".$_POST['sourceType']."','".$_POST['resource_uri']."','".$_POST['title']."','".$_POST['id']."','".$_POST['description']."','".$_POST['authors']."','".$_POST['owner']."','".$_POST['parent_cliplist_id']."','".$_POST['parent_project_id']."','".$_POST['start']."','".$_POST['end']."','".$_POST['date_created']."','".$_POST['last_modified']."','".$_POST['tags']."')");
	//echo '{"success":inserted'.$_POST['clipper_clip_id'].'}';
}




//tidy up
$conn->close();
?>
