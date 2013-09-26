<?php

header('Content-type: application/json');

$response = array();
$clips = array();
$audio_clips = array();
$copy_clips = array();

if ($handle = opendir('../media/video/source')) {
    while (false !== ($entry = readdir($handle))) {

        if (strrpos($entry, ".webm") !== false) {
 
            $fileArray = explode('.',$entry);
            $clips[] = array('fileName'=> $fileArray[0]);

        }
     }
 

    $response['children'] = $clips;
    closedir($handle);
}
/*
if ($handle = opendir('audio/soundfx')) {
    while (false !== ($entry = readdir($handle))) {

			if (strrpos($entry, ".mp3") !== false) { 
				// $entry_array = split(".",$entry);
				$audio_file = $entry; 
				$audio_clips[] = array('title'=> substr($audio_file,0,-4),'is_audio'=> true, 'audio'=> substr($audio_file,0,-4), 'hex_value' => $hexes[rand(0,count($hexes)-1)], 'length'=> $audio_lengths[$audio_file]);
			}            	 

        }
    
    $response['audio_clips'] = $audio_clips;
    closedir($handle);
}
*/

    echo json_encode($response);
    
?>