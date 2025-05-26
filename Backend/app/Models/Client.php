<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = 'clients';

    protected $fillable = [
        'name',
        'nif',
        'fiscal_address',
        'city',
        'postal_code',
        'province',
        'email',
        'company_id',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
    public function company()
{
    return $this->belongsTo(Company::class);
}
}