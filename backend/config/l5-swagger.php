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
                'docs_json' => 'api-docs.json',
            ],
            'paths' => [
                'docs' => 'storage/api-docs',
                'annotations' => [base_path('app'), base_path('routes')],
                'views' => resource_path('views/vendor/l5-swagger'),
            ],
            'generate_always' => true,
        ],
    ],
];
