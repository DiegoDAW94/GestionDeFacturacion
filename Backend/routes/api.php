<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\TaxController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Sesión y usuario autenticado
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    // Recursos principales (RESTful)
    Route::apiResource('companies', CompanyController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('items', ItemController::class);
    Route::apiResource('taxes', TaxController::class);

    // Vistas individuales por ID (opcional, ya incluidas en apiResource)
    Route::get('companies/{company}', [CompanyController::class, 'show']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::get('clients/{client}', [ClientController::class, 'show']);
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show']);
    Route::get('items/{item}', [ItemController::class, 'show']);

    // Gestión de roles de usuario
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole']);
    Route::put('users/{user}/update-role', [UserController::class, 'updateRole']);
    Route::delete('users/{user}/delete-role', [UserController::class, 'deleteRole']);

    // Consultas relacionadas con la compañía autenticada
    Route::get('/my-companies', [CompanyController::class, 'myCompanies']);
    Route::get('/companies/{company}/items', [ItemController::class, 'itemsByCompany']);
    Route::get('/companies/{company}/invoices', [InvoiceController::class, 'invoicesByCompany']);
    Route::get('/companies/{company}/clients', [ClientController::class, 'clientsByCompany']);

    Route::post('/users/register-worker', [UserController::class, 'registerAndAssignWorker']);
}
    
);