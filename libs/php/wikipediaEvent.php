<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$city = $_REQUEST['city'];

	if($city === 'CA') {
		$lat = 52.2;
		$lon = .12;
	} elseif ($city === 'BI') {
		$lat = 52.49;
		$lon = 1.89;
	} elseif ($city === 'EX') {
		$lat = 50.71;
		$lon = 3.53;
	} else {
		$lat = 51.75;
		$lon = 1.25;
	};

	$url='http://api.geonames.org/findNearbyWikipediaJSON?formatted=true&lat='.$lat.'&lng='.$lon.'&maxRows=1&username=dougiehawes&style=full';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['geonames'];

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
?>
