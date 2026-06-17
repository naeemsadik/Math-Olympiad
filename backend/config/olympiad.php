<?php

return [

    'admin' => [
        'email' => env('ADMIN_EMAIL', 'admin@uiu.ac.bd'),
        'password' => env('ADMIN_PASSWORD', 'UIUAdmin2024'),
    ],

    'diagnostic' => [
        'advanced_threshold' => (int) env('DIAGNOSTIC_ADVANCED_THRESHOLD', 50),
        'expert_threshold' => (int) env('DIAGNOSTIC_EXPERT_THRESHOLD', 80),
    ],

    'leaderboard' => [
        'monthly_window_days' => (int) env('LEADERBOARD_MONTHLY_WINDOW_DAYS', 30),
    ],

    'class_years' => [
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
        'Class 11', 'Class 12',
        '1st Year', '2nd Year', '3rd Year', '4th Year',
        'Masters', 'PhD', 'Post-Doc',
        'All Classes',
    ],
];
