<?php 
  //Código absolutamente desorganizado e confuso
$xx=5;$yy=10;echo$xx*$yy; $d = array(1, 2,3,4, 5,6,7,8,9); foreach($d as $k=> $v){if($k%2==0){echo$v." - even ";}else{echo$v." - odd";}}function strangeFunc( $c,$zz=null){global $xx;if($zz){for($i=0;$i<$c;$i++){echo"<p>".$xx*$i."</p>";}}else{for($i=0;$i<$c;$i++)echo"<span>".$xx+$i."</span>";}}strangeFunc(3, true);if(true){echo "<br> This is true";if(false){echo "Wait, this will never show up!";}}for($i=0;$i<3;$i++)for($j=0;$j<2;$j++)echo"<div>".$i.$j."</div>"; ?>
