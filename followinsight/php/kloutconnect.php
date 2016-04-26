<?php
require_once("lib/kloutapiv2php/KloutAPIv2.class.php");
// Set your Klout app key
$kloutapi_key = "6vmh7zhxfbmtem5puk4s6whb";
// Load the Klout API library
$klout = new KloutAPIv2($kloutapi_key);

$network = "tw";
$a = array( 1);
$KloutScore = null;
$KloutArray = [];

if (isset($_POST['id'])) {
	$idTwitter = $_POST['id'];
} else if (isset($_GET['id'])) {
	$idTwitter = $_GET['id'];
}

if (isset($idTwitter)) {
	if (is_numeric($idTwitter)) {
		$kloutid = $klout->KloutIDLookupByID($network,$idTwitter);
	} else {
		$kloutid = $klout->KloutIDLookupByName($network,$idTwitter);
	}
} else {
	echo 'The twitter id is not found';
}
// returns rounded up whole number
$KloutScore = ceil($klout->KloutScore($kloutid));

class KloutObj {
	public $score;
}

function AddScore($kloutscore) {
	$userObj = new KloutObj();
	$userObj->score = $kloutscore;
	return $userObj;
}
$userKloutScore = AddScore($KloutScore);

echo json_encode($userKloutScore);
?>