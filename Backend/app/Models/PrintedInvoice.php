<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrintedInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'invoice_id',
        'printed_at',
        'batch_id',
    ];

    // Relación con la factura
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}