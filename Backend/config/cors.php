<?php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        '*',
    ],
    'allowed_headers' => ['*', 'Content-Type', 'X-Requested-With', 'Accept', 'Origin', 'Authorization'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
