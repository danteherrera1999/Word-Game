<?php
    echo 'Hi';
    $servername = "localhost";
	$database = "word_game_database";
	$username = "debian-sys-maint";
	$password= "3c95785d1fa9a0de0f9f4f27daebd3c8dcb9772bb9de6046";
    echo 'Connection attempt';
    try{
        $conn = mysqli_connect($srvername,$username,$password,$database);
    }
    catch (Exception $e){
        echo $e;
    }
	
	if (!$conn){
		die("Connection failed " . mysqli_connect_error());
	}
    function get_words_from_indices($conn,$inds){
		$sql = sprintf("SELECT * FROM word_data WHERE `rank` IN (%s);",implode(',',$inds));
        echo $sql;
        try{
            $result = $conn->query($sql)->fetch_all();
            echo $result;
        }
        catch (Exception $e){
            echo $e;
        }
        echo $result;
		return call_user_func_array('array_merge_recursive',$result);
	}
    print_r(get_words_from_indices($conn,[1,2,3]));
    
?>

<!DOCTYPE html>
<html>
    <body>
        <h1>html stuff</h1>
    </body>
</html>
