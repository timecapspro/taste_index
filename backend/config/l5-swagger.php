<?php

return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'Taste Index API'
            ],
            'routes' => [
                'api' => 'api/documentation',
            ],
            'paths' => [
                'docs' => 'storage/api-docs',
                'annotations' => [base_path('app'), base_path('routes')],
            ],
        ],
    ],
];
