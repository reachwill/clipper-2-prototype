<?php
require_once('config.php');

// Create connection
$conn = new mysqli("localhost",$user,$pwd,$db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$_POST['projectTitle'] = mysqli_real_escape_string($conn, $_POST['projectTitle']);
$_POST['projectDesc'] = mysqli_real_escape_string($conn, $_POST['projectDesc']);



//Prepare sql statement
$sql = "INSERT INTO projects (`clipper_project_id`, `title`, `description`,`authors`,`owner`,`date_created`,`last_modified`) VALUES ('".$_POST['projectId']."','".$_POST['projectTitle']."','".$_POST['projectDesc']."','".$_POST['authors']."','".$_POST['owner']."','".$_POST['dateCreated']."','".$_POST['lastModified']."') ";

//try insert project operation
if ($conn->query($sql) === TRUE) {
	echo 'Project inserted';
    //now insert new default cliplist for new project
	//Prepare sql statement
	$sql = "INSERT INTO cliplists (`clipper_cliplist_id`, `title`, `description`,`parent_project_id`,`authors`,`owner`,`date_created`,`last_modified`) VALUES ('".$_POST['cliplists'][0]['id']."','".$_POST['cliplists'][0]['title']."','".$_POST['cliplists'][0]['description']."','".$_POST['cliplists'][0]['parentProject']."','".$_POST['cliplists'][0]['authors']."','".$_POST['cliplists'][0]['owner']."','".$_POST['cliplists'][0]['dateCreated']."','".$_POST['cliplists'][0]['lastModified']."') ";
	if ($conn->query($sql) === TRUE) {
		echo '---------Default cliplist inserted';
	}else{
		echo "Error inserting default cliplist: " . $sql . "<br>" . $conn->error;
	}

	//echo json_encode($_POST['cliplists'][0]['id']);
} else {
    echo "Error inserting project: " . $sql . "<br>" . $conn->error;
}

//create new project folder structure in user's folder on the server
$src = '../users/projectFiles';
$dst = '../users/'.$_POST['owner'].'/'.$_POST['projectId'];
//mkdir('../users/'.$_POST['owner'].'/'.$_POST['projectId']);
if (!file_exists($dst)) {
    mkdir($dst, 0777, true);
}
recurse_copy($src,$dst);

function recurse_copy($src,$dst) {
    $dir = opendir($src);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if ( is_dir($src . '/' . $file) ) {
                recurse_copy($src . '/' . $file,$dst . '/' . $file);
            }
            else {
				echo $src . '/' . $file,$dst . '/' . $file;
                copy($src . '/' . $file,$dst . '/' . $file);
            }
        }

    }
    closedir($dir);
}




//tidy up
$conn->close();
?>
