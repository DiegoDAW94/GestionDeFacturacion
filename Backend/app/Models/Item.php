<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\InvoiceItem;

class Item extends Model
{
    use HasFactory;

    protected $table = 'items';

    protected $fillable = [
        'company_id',
        'name',
        'description',
        'price',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function invoices()
    {
        return $this->belongsToMany(Invoice::class, 'invoice_items')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }

    public function invoiceItems()
    {
    return $this->hasMany(\App\Models\InvoiceItem::class);
}
}