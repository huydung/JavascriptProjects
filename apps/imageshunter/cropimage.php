<?php
if( !$_REQUEST['url'] || $_REQUEST['url'] == '' ){
  die;
}
$url = $_REQUEST['url'];
if( $_REQUEST['action'] == '' ){
  header('Location: '.$url);
}
$w  = $_REQUEST['width'];
$h  = $_REQUEST['height'];
//$scaled_width = $_REQUEST['scaled-width'];


$ext = split('\.', $url);
$ext = $ext[ sizeof($ext) - 1 ];
switch($ext){
  case 'jpg':
  case 'jpeg':
    $img = @imagecreatefromjpeg($url); break;
  case 'gif':
    $img = @imagecreatefromgif($url); break;
  case 'png':
    $img = @imagecreatefrompng($url); break;
  default:
    die('Image type ['. $ext .'] not supported!');
};

if(!is_resource($img)){
  die('Unable to load image!');
};

$originWidth = imagesx($img);
$originHeight = imagesy($img);

$startX = floor($originWidth * $_REQUEST['ratio-x-start']);
$startY = floor($originHeight * $_REQUEST['ratio-y-start']);
$endX = floor($originWidth * $_REQUEST['ratio-x-end']);
$endY = floor($originHeight * $_REQUEST['ratio-y-end']);

$selection_w = $endX - $startX;
$selection_h = $endY - $startY;
//                           
//$src_w = $w * $scale_ratio;
//$src_h = $h * $scale_ratio;

//print_r(array($startX, $startY));
$new_img = imagecreatetruecolor( $w, $h ); 

imagecopyresampled( $new_img, $img, 0, 0, $startX, $startY, $w, $h, $selection_w, $selection_h );

header('Content-type: image/jpeg');
imagejpeg( $new_img, null, 90 );

?>