<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'logout'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'https://bindcanvas.softcredible.com',
        'https://studio.expouse.com',
        'https://webbuilder.expouse.com',
    ],

    'allowed_origins_patterns' => [
        '#^https?://[a-z0-9-]+\.localhost(:\d+)?$#',
        '#^https?://[a-z0-9-]+\.' . preg_quote(env('PLATFORM_DOMAIN', 'expouse.com'), '#') . '(:\d+)?$#',
        '#^https?://[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}(:\d+)?$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
