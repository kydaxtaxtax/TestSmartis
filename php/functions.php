<?php
if (isset($_POST["start"]) && isset($_POST["end"])) {
  $start_date = $_POST['start'];
  $end_date = $_POST['end'];
}

//собираем url
$scripturl = "http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1={$start_date}&date_req2={$end_date}&VAL_NM_RQ=R01235&d=1";

//получаем hml
$obj = simplexml_load_file($scripturl);

//форматируем строку в нормальный массив
$json_str = json_encode($obj);
$arr = json_decode($json_str, TRUE);

//собираем json  с нужными знаениями и форматированием
$json_res = "[";
foreach($arr['Record'] as $key => $value) {
  $value_new = str_replace(',', '.', $value['Value']);
  $date_new = strtotime($value['@attributes']['Date']) . "000";

  $json_res .= "[" . $date_new . "," . $value_new . "],";
}
$json_res = rtrim($json_res, ',');
$json_res .= "]";

echo $json_res;
?>
