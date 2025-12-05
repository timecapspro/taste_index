<?php

return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'Taste Index API'
            ],
            'securityDefinitions' => [
                'sanctum' => [
                    'type' => 'apiKey',
                    'description' => 'Введите Bearer {token}',
                    'name' => 'Authorization',
                    'in' => 'header',
                ],
            ],
            'security' => [
                ['sanctum' => []],
            ],
            'routes' => [
                'docs' => 'docs',
                'api' => 'api/documentation',
                'oauth2_callback' => 'api/oauth2-callback',
                'middleware' => [
                    'api' => [],
                    'asset' => [],
                    'docs' => [],
                    'oauth2_callback' => [],
                ],
            ],
            'paths' => [
                'docs' => storage_path('api-docs'),
                'docs_json' => 'api-docs.json',
                'docs_yaml' => 'api-docs.yaml',
                'annotations' => [
                    base_path('app'),
                    base_path('routes'),
                ],
                'views' => resource_path('views/vendor/l5-swagger'),
            ],
            'generate_always' => true,
        ],
    ],
];
