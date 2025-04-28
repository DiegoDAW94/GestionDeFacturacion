<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $companies = Company::where('created_by', $request->user()->id)->get();
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
        ]);

        $company = Company::create([
            'name' => $validated['name'],
            'legal_name' => $validated['legal_name'],
            'cif' => $validated['cif'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'],
            'created_by' => auth()->id(),
        ]);

        return response()->json(['company' => $company], 201);
    }

    public function show(Request $request, Company $company)
    {
        if ($company->created_by !== $request->user()->id) {
            return response()->json(['error' => 'No tienes permiso para ver esta compañía.'], 403);
        }

        return response()->json(['company' => $company], 200);
    }

    public function update(Request $request, Company $company)
    {
        if ($company->created_by !== $request->user()->id) {
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
        if ($company->created_by !== $request->user()->id) {
            return response()->json(['error' => 'No tienes permiso para eliminar esta compañía.'], 403);
        }

        $company->delete();

        return response()->json(['message' => 'Compañía eliminada exitosamente.'], 200);
    }
}