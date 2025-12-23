<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

  $data = [
    "name"     => $_POST['full_name'],
    "email"    => $_POST['email'],
    "phone"    => $_POST['country_code'].$_POST['phone'],
    "interest" => $_POST['interest']
  ];

  // 🔹 Send to CRM (example)
  /*
  $url = "https://your-crm-endpoint.com/lead";
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
  curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_exec($ch);
  curl_close($ch);
  */

  echo "Thank you for registering your interest.";
}
