<?php

use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return ['status' => 'ok'];
});
