<?php
// lighttpd and nginx compatibility
if (!function_exists('getallheaders')) {
    function getallheaders() {
        foreach ($_SERVER as $name => $value){
            if (substr($name, 0, 5) == 'HTTP_') {
                $name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                $headers[$name] = $value;
            }
            else if ($name == "CONTENT_TYPE") {
                $headers["Content-Type"] = $value;
            }
            else if ($name == "CONTENT_LENGTH") {
                $headers["Content-Length"] = $value;
            }
        }
        return $headers;
    }
}
$headers = getallheaders();


if ($headers['Content-Type'] != 'multipart/form-data') {

    // create the object and assign property
    $file = new stdClass;
    $file->name = basename($headers['X-File-Name']);
    $file->size = $headers['X-File-Size'];
    $file->temp_location = $_FILES["file"]["tmp_name"];

    //if everything is ok, save the file somewhere
    //file_put_contents("files_1/".$file->name, $file->content)
}
else {
    $temp = file_get_contents("php://input");
    var_dump($temp);
}

// if there is an error this will be the output instead of "OK"
echo "<pre>";
print_r ($headers);
var_dump($_POST, $_FILES);

var_dump($file);


echo "</pre>";
?>
