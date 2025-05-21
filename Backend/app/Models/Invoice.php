<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';

    protected $fillable = [
        'company_id',
        'user_id',
        'client_id',
        'number',
        'date',
        'operation_date',
        'custom_items',
        'base_amount',
        'tax_amount',
        'total',
    ];

    protected $casts = [
    'custom_items' => 'array',
];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->belongsToMany(Item::class, 'invoice_items')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }

    public function taxes()
    {
        return $this->belongsToMany(Tax::class, 'invoice_taxes')
                    ->withPivot('amount')
                    ->withTimestamps();
    }
}