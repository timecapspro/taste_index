<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost:3000')),
    'guard' => ['web'],
    'expiration' => null,
    'token_prefix' => '',
];
