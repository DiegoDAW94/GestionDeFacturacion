<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\TaxController;
use App\Http\Controllers\PrintedInvoiceController;
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

    // Consultas y vistas adicionales
    Route::get('/my-companies', [CompanyController::class, 'myCompanies']);
    Route::get('/admin/companies', [CompanyController::class, 'allCompanies']);
    Route::get('/admin/clients', [ClientController::class, 'allClients']);
    Route::get('/admin/items', [ItemController::class, 'allItems']);
    Route::get('/admin/invoices', [InvoiceController::class, 'allInvoices']);


    // Recursos relacionados con compañías
    Route::get('/companies/{company}/items', [ItemController::class, 'itemsByCompany']);
    Route::get('/companies/{company}/invoices', [InvoiceController::class, 'invoicesByCompany']);
    Route::get('/companies/{company}/clients', [ClientController::class, 'clientsByCompany']);

    // Gestión de roles de usuario
    Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole']);
    Route::put('/users/{user}/update-role', [UserController::class, 'updateRole']);
    Route::delete('/users/{user}/delete-role', [UserController::class, 'deleteRole']);

    // Printed invoices
    Route::get('/printed-invoices', [PrintedInvoiceController::class, 'index']);
    Route::get('/printed-invoices/{id}', [PrintedInvoiceController::class, 'show']);
    Route::post('/printed-invoices', [PrintedInvoiceController::class, 'store']);
    Route::delete('/printed-invoices/{id}', [PrintedInvoiceController::class, 'destroy']);

    // Registro de trabajadores
    Route::post('/users/register-worker', [UserController::class, 'registerAndAssignWorker']);
});