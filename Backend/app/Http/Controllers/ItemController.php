<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    // Obtener todos los ítems de la empresa del usuario autenticado
    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;

        if (!$companyId) {
            return response()->json(['error' => 'El usuario no está asociado a ninguna empresa.'], 403);
        }

        return Item::where('company_id', $companyId)->get();
    }

    // Crear un nuevo ítem
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $companyId = $request->user()->company_id;

        if (!$companyId) {
            return response()->json(['error' => 'El usuario no está asociado a ninguna empresa.'], 403);
        }

        $item = Item::create([
            'company_id' => $companyId,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
        ]);

        return response()->json($item, 201);
    }

    // Mostrar un ítem específico
    public function show(Request $request, Item $item)
    {
        $companyId = $request->user()->company_id;

        if ($item->company_id !== $companyId) {
            return response()->json(['error' => 'No tienes permiso para ver este ítem.'], 403);
        }

        return $item;
    }

    // Actualizar un ítem existente
    public function update(Request $request, Item $item)
    {
        $companyId = $request->user()->company_id;

        if ($item->company_id !== $companyId) {
            return response()->json(['error' => 'No tienes permiso para actualizar este ítem.'], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
        ]);

        $item->update($validated);

        return $item;
    }

    // Eliminar un ítem
    public function destroy(Request $request, Item $item)
    {
        $companyId = $request->user()->company_id;

        if ($item->company_id !== $companyId) {
            return response()->json(['error' => 'No tienes permiso para eliminar este ítem.'], 403);
        }

        $item->delete();

        return response()->noContent();
    }
}