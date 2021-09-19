<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$country = $_REQUEST['country'];

  if($country === 'AU') {
    $lat = -27;
    $lon = 133;
  } elseif ($country === 'BE') {
   $lat = 50;
   $lon = 4.4;
  } elseif ($country === 'CA') {
    $lat = 7.36;
    $lon = 12.3;
  } elseif ($country === 'DO') {
     $lat = 18.48;
     $lon = -69.92;
  } elseif ($country === 'EG') {
     $lat = 26.82;
   $lon = 30.08;
  } elseif ($country === 'FR') {
    $lat = 50;
    $lon = 4;
  } elseif ($country === 'GH') {
    $lat = 8;
    $lon = -2;
  } elseif ($country === 'HU') {
    $lat = 47;
    $lon = 19;
  } elseif ($country === 'IN') {
    $lat = 20;
    $lon = 78;
  } elseif ($country === 'IN') {
    $lat = 20;
    $lon = 78;
  } elseif ($country === 'JA') {
    $lat = 36.2;
    $lon = 138.2;
  };

  $url='http://api.geonames.org/timezoneJSON?formatted=true&lat='.$lat.'&lng='.$lon.'&username=dougiehawes&style=full';


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
	$output['data'] = $decode;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
?>
