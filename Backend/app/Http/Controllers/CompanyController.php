<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
     public function index(Request $request)
    {
        $companies = Company::where('owner_id', $request->user()->id)->get();
        return response()->json(['companies' => $companies], 200);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'legal_name' => 'nullable|string|max:255',
        'cif' => 'required|string|max:50|unique:companies,cif',
        'email' => 'required|email|max:255|unique:companies,email',
        'telefono' => 'nullable|string|max:20',
        'fiscal_address' => 'nullable|string|max:255',
        'social_address' => 'nullable|string|max:255',
        'city' => 'nullable|string|max:100',
        'postal_code' => 'nullable|string|max:10',
        'province' => 'nullable|string|max:100',
        'invoice_prefix' => 'nullable|string|max:10',
    ]);

    $company = Company::create(array_merge(
        $validated,
        ['owner_id' => auth()->id()]
    ));

    // Crear relación en user_roles como gerente (rol_id = 2)
    \DB::table('user_roles')->insert([
        'user_id' => auth()->id(),
        'role_id' => 2, // gerente
        'company_id' => $company->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json(['company' => $company], 201);
}

    public function show(Request $request, Company $company)
{
    $user = $request->user();

    // Permitir si es owner o si está en user_roles
    $isAssociated = $company->owner_id === $user->id ||
        $user->companies()->where('companies.id', $company->id)->exists();

    if (!$isAssociated) {
        return response()->json(['error' => 'No tienes permiso para ver esta compañía.'], 403);
    }

    return response()->json(['company' => $company], 200);
}

    public function update(Request $request, Company $company)
    {
        if ($company->owner_id !== $request->user()->id) {
            return response()->json(['error' => 'No tienes permiso para actualizar esta compañía.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'cif' => 'required|string|max:50|unique:companies,cif,' . $company->id,
            'email' => 'required|email|max:255|unique:companies,email,' . $company->id,
            'telefono' => 'nullable|string|max:20',
        ]);

        $company->update($validated);

        return response()->json(['company' => $company], 200);
    }

    public function destroy(Request $request, Company $company)
    {
        if ($company->owner_id !== $request->user()->id) {
            return response()->json(['error' => 'No tienes permiso para eliminar esta compañía.'], 403);
        }

        $company->delete();

        return response()->json(['message' => 'Compañía eliminada exitosamente.'], 200);
    }

    public function myCompanies(Request $request)
{
    // Devuelve todas las compañías asociadas al usuario (por user_roles)
    $companies = $request->user()->companies()->get();
    return response()->json(['companies' => $companies], 200);
}
}