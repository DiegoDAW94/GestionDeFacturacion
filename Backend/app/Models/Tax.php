<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    use HasFactory;

    protected $table = 'taxes';

    protected $fillable = [
        'company_id',
        'name',
        'percentage',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function invoices()
    {
        return $this->belongsToMany(Invoice::class, 'invoice_taxes')
                    ->withPivot('amount')
                    ->withTimestamps();
    }
}