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
}