<!DOCTYPE html>
<?php
	
	$dates = array_map(fn($d)=>date('j/n/Y',strtotime("$d day")),['-1','+0','+1']);
	$seeds = array_map(fn($d)=>date('z',strtotime("$d day"))+(365*(date('Y',strtotime("$d day"))-2024)),['-1','+0','+1']);

	$language_codes = ['ar','de','en','es','fr','ja','ko','pt','ru','ta','zh'];

	// generate random words of varying frequency ranges
	$word_distributions = ["Easy"=>[6,0,0],"Medium"=>[1,6,0],"Hard"=>[0,2,6]];

	//begin SQL
    $servername = "localhost";
	$database = "word_game_database";
	$username = "debian-sys-maint";
	$password= "3c95785d1fa9a0de0f9f4f27daebd3c8dcb9772bb9de6046";
	try{
		$conn = mysqli_connect($servername,$username,$password,$database);
	}
	catch (Exception $e){
		echo $e;
		$conn = null;
	}
	
	if (!$conn){
		die("Connection failed " . mysqli_connect_error());
	}

	function get_words_from_indices($conn,$inds){
		$sql = sprintf("SELECT * FROM word_data WHERE `rank` IN (%s)",implode(',',$inds));
		$result = $conn->query($sql)->fetch_all(1);
		return call_user_func_array('array_merge_recursive',$result);
	}

	function gen_puzzle_data($seed){
		global $conn,$word_distributions;
		srand($seed);
		$puzzle_word_data=[];
		$word_ranges = array_map(fn($num)=>floor(1000*$num),[0,.5,.35,.15]);
		foreach ($word_distributions as $key => $word_distribution){
			$temp_indices =[];
			for ($i=0;$i<3;$i++){
				$j = $word_distribution[$i];
				while ($j>0){
					$temp_ind = floor(rand(0,$word_ranges[$i+1])+$word_ranges[$i]);
					if (!in_array($temp_ind,$temp_indices)){
						array_push($temp_indices,$temp_ind);
						$j--;
					}
				}
			}
			$puzzle_word_data[$key]=get_words_from_indices($conn,$temp_indices);
		}
		return $puzzle_word_data;
	}
	$all_puzzles_data = [];
	$puzzle_numbers = [];
	for ($i=0; $i<3;$i++){
		$all_puzzles_data[$dates[$i]] = gen_puzzle_data($seeds[$i]);
		$puzzle_numbers [$dates[$i]] = $seeds[$i];
	}
	mysqli_close($conn); //close SQL
	$json_word_data = json_encode($all_puzzles_data,JSON_UNESCAPED_UNICODE);
	$json_puzzle_numbers = json_encode($puzzle_numbers);
	//echo $json;
	echo "<script> var daily_word_data = $json_word_data; var puzzle_numbers = $json_puzzle_numbers</script>"
?>

<html>
	<head>
		<link href="main.css" rel="stylesheet">
		<title>word.earth</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, height=device-height,user-scalable=no">
	</head>
	<body>
		<nav>
			<select id='source-language-listbox' class='language-selector'></select>
			<div id='title-container'><h1 id='title'>word.earth</h1><h2 id='puzzle-number'></h2></div>
			<select id='target-language-listbox' class='language-selector'></select>
		</nav>
		<div id='visit-alert'>
			<div id='alert-box'>
				<p>Welcome to word.earth, a daily word matching game across languages! Please use the language selectors on either side of the title to pick your native and target languages respectively. Have fun!</p>
				<button id='destroy-button' type='button'>Continue</button>
			</div>
		</div>
		<div id="puzzle-select-ribbon"></div>
		<div id="mid-section">
			<div id="cardbox"></div>
		</div>
		<div id='heart-box'>
			<img/>
			<img/>
			<img/>
		</div>
		<div id='icon-container'>
			<div id='coffee-icon-container' class='icon-container'>
				<a target='_blank' href="https://www.buymeacoffee.com/wordearth" id='coffee-button' class='icon-button' >
					<p class='tooltip'>Buy me a coffee!</p>
				</a>
			</div>
			<div id='share-icon-container' class='icon-container'>
				<div id='share-button' class='icon-button' >
					<p class='tooltip'>Share!</p>
				</div>
			</div>
		</div>
		<h2 id='endgame-messagebox'> </h2>
	</body>
	<script src="./main.js" type="text/javascript"></script>
</html>