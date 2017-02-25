<?php
require "gump.class.php";
date_default_timezone_set ( 'Europe/Moscow' );

$validator = new GUMP();

$_POST = $validator->sanitize($_POST);
$rules = array(
    'username'    => 'required|alpha_numeric|max_len,100|min_len,6',
    'password'    => 'required|max_len,100|min_len,6',
    'email'       => 'required|valid_email',
    'gender'      => 'required|exact_len,1',
    'credit_card' => 'required|valid_cc',
    'bio'		  => 'required',
    'birth'		  => 'required|date'
);

$validated = $validator->validate(
    $_POST, $rules
);
if($validated === TRUE) {
    $result["result"] = true;
    die(json_encode($result));
} else {
    $result['error'] = $validator->get_errors_array();
    $result["result"] = false;
    die(json_encode($result));
}
