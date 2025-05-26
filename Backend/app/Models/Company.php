<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $table = 'companies';

   protected $fillable = [
    'name',
    'legal_name',
    'cif',
    'fiscal_address',
    'social_address',
    'city',
    'postal_code',
    'province',
    'email',
    'telefono',
    'invoice_prefix',
    'owner_id',
];

    public function users()
    {
        return $this->hasMany(User::class);
    }

   public function owner()
{
    return $this->belongsTo(User::class, 'owner_id');
}
}