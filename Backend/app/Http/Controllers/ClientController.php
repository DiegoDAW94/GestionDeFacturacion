<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return Client::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nif' => 'nullable|string|max:50',
            'fiscal_address' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:10',
            'province' => 'required|string|max:100',
            'email' => 'nullable|email|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        return Client::create($validated);
    }

    public function show(Client $client)
    {
        return $client;
    }

    public function update(Request $request, Client $client)
{
    $user = $request->user();
    $isAdmin = $user->roles()->where('roles.id', 1)->exists();

    // Verifica que la relación company existe
    if (!$isAdmin) {
        $company = $client->company;
        if (!$company || $company->owner_id !== $user->id) {
            return response()->json(['error' => 'No tienes permiso para actualizar este cliente.'], 403);
        }
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'nif' => 'nullable|string|max:50',
        'fiscal_address' => 'required|string',
        'city' => 'required|string|max:100',
        'postal_code' => 'required|string|max:10',
        'province' => 'required|string|max:100',
        'email' => 'nullable|email|max:255',
    ]);

    $client->update($validated);

    return $client;
}
public function destroy(Request $request, Client $client)
{
    $user = $request->user();
    $isAdmin = $user->roles()->where('roles.id', 1)->exists();

    // Permitir solo al admin o al owner de la compañía del cliente
    if (!$isAdmin && $client->company->owner_id !== $user->id) {
        return response()->json(['error' => 'No tienes permiso para eliminar este cliente.'], 403);
    }

    $client->delete();

    return response()->noContent();
}
    public function clientsByCompany($companyId)
{
    return Client::where('company_id', $companyId)->get();
}
public function allClients(Request $request)
{
    // Solo admin (role_id = 1)
    $isAdmin = $request->user()->roles()->where('roles.id', 1)->exists();
    if (!$isAdmin) {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    return Client::all();
}
}