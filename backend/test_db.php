<?php
try {
    $db = new PDO('pgsql:host=aws-1-ap-southeast-1.pooler.supabase.com;port=6543;dbname=postgres', 'postgres.oyptikhfzfycpxzmvykh', 'ilyas.ahmad1');
    echo 'Pooler 1 Connected 6543';
} catch (Exception $e) {
    echo 'Pooler 1 6543 failed: ' . $e->getMessage() . PHP_EOL;
}

