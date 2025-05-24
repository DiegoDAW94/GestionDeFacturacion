<?php
namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
   public function index()
{
    // Devuelve todos los roles excepto el de ID 1
    return Role::where('id', '!=', 1)->get();
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
        ]);

        return Role::create($validated); // Crea un nuevo rol
    }

    public function show(Role $role)
    {
        return $role; // Devuelve un rol específico
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'string|max:50',
        ]);

        $role->update($validated); // Actualiza el rol
        return $role;
    }

    public function destroy(Role $role)
    {
        $role->delete(); // Elimina el rol
        return response()->noContent();
    }
}