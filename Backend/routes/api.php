<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\TaxController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']); // Ruta para registrar usuarios
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});
// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('companies', CompanyController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('items', ItemController::class);
    Route::apiResource('taxes', TaxController::class);

    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole']);
    Route::put('users/{user}/update-role', [UserController::class, 'updateRole']);
    Route::delete('users/{user}/delete-role', [UserController::class, 'deleteRole']);
    
});

Route::middleware('auth:sanctum')->get('/my-companies', [CompanyController::class, 'myCompanies']);

Route::middleware('auth:sanctum')->get('/companies/{company}/items', [ItemController::class, 'itemsByCompany']);