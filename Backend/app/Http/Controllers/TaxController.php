<?php
namespace App\Http\Controllers;

use App\Models\Tax;
use Illuminate\Http\Request;

class TaxController extends Controller
{
    public function index()
    {
        return Tax::all(); // Devuelve todos los impuestos
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|max:50',
            'percentage' => 'required|numeric|min:0|max:100',
        ]);

        return Tax::create($validated); // Crea un nuevo impuesto
    }

    public function show(Tax $tax)
    {
        return $tax; // Devuelve un impuesto específico
    }

    public function update(Request $request, Tax $tax)
    {
        $validated = $request->validate([
            'company_id' => 'exists:companies,id',
            'name' => 'string|max:50',
            'percentage' => 'numeric|min:0|max:100',
        ]);

        $tax->update($validated); // Actualiza el impuesto
        return $tax;
    }

    public function destroy(Tax $tax)
    {
        $tax->delete(); // Elimina el impuesto
        return response()->noContent();
    }
}