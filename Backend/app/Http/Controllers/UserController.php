<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function assignRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'company_id' => 'required|exists:companies,id',
        ]);

        $user->roles()->attach($validated['role_id'], ['company_id' => $validated['company_id']]);

        return response()->json([
            'message' => 'Rol asignado correctamente',
            'user' => $user->load('roles'),
        ]);
    }
    public function show($id)
{
    $user = User::with(['roles', 'companies'])->find($id);

    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    return response()->json($user);
}
protected function createUser(array $data)
{
    return User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => bcrypt($data['password']),
    ]);
}
public function registerAndAssignWorker(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8', // Puedes pedir confirmación si quieres
        'company_id' => 'required|exists:companies,id',
    ]);
    $user = $this->createUser($validated);
    $user->roles()->attach(3, ['company_id' => $validated['company_id']]);
    return response()->json([
        'message' => 'Usuario registrado y asignado como Trabajador',
        'user' => $user->load('roles', 'companies'),
    ], 201);
}
}