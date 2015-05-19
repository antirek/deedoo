<?php

$str = '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';

$data = base64_decode($str);

file_put_contents('image.png', $data);

?>