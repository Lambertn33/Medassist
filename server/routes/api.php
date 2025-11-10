<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\auth\AuthController;

use App\Http\Controllers\admin\UsersController as AdminUsersController;

use App\Http\Controllers\common\PatientsController as CommonPatientsController;
use App\Http\Controllers\common\EncountersController as CommonEncountersController;
use App\Http\Controllers\common\ObservationsController as CommonObservationsController;
use App\Http\Controllers\common\DiagnosesController as CommonDiagnosesController;

// Auth Routes
Route::controller(AuthController::class)->prefix('auth')->group(function () {
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
});


Route::prefix('admin')->middleware('auth:sanctum', 'can:admin')->group(function () {
    Route::controller(AdminUsersController::class)->prefix('users')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
    });
});

Route::prefix('common')->middleware('auth:sanctum')->group(function () {
    Route::controller(CommonPatientsController::class)->prefix('patients')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::prefix('{id}')->group(function () {
            Route::get('/', 'show');
            Route::put('/', 'update');
            Route::delete('/', 'destroy')->middleware('can:admin');
        });
    });
    Route::prefix('encounters')->middleware('auth:sanctum')->group(function () {
        Route::controller(CommonEncountersController::class)->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::prefix('{id}')->group(function () {
                Route::get('/', 'show');
                Route::put('/start-consultation', 'startConsultation');
                Route::put('/end-consultation', 'endConsultation');
            });
        });

        Route::prefix('{encounterId}')->group(function () {
            Route::controller(CommonObservationsController::class)->prefix('observations')->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
            });
            Route::controller(CommonDiagnosesController::class)->prefix('diagnoses')->group(function () {
                Route::get('/', 'index');
            });
        });
    });
});