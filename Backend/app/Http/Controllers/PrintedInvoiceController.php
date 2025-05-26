<?php

namespace App\Http\Controllers;

use App\Models\PrintedInvoice;
use Illuminate\Http\Request;

class PrintedInvoiceController extends Controller
{
    // Registrar impresiones en lote
    public function store(Request $request)
{
    $validated = $request->validate([
        'invoice_ids' => 'required|array',
        'invoice_ids.*' => 'exists:invoices,id',
    ]);

    $batchId = uniqid('batch_', true);
    $printed = [];

    foreach ($validated['invoice_ids'] as $invoiceId) {
        // Solo registrar si no existe ya
        if (!PrintedInvoice::where('invoice_id', $invoiceId)->exists()) {
            $invoice = \App\Models\Invoice::findOrFail($invoiceId);
            $company = \App\Models\Company::findOrFail($invoice->company_id);
            $prefix = ($company->invoice_prefix ?: 'F');

            // Busca el último PrintedInvoice de la empresa con ese prefijo
            $lastPrinted = PrintedInvoice::whereHas('invoice', function($q) use ($company) {
                    $q->where('company_id', $company->id);
                })
                ->where('number', 'like', $prefix . '-%')
                ->orderByDesc('id')
                ->first();

            if ($lastPrinted && preg_match('/^' . preg_quote($prefix, '/') . '-(\d+)$/', $lastPrinted->number, $matches)) {
                $nextNumber = intval($matches[1]) + 1;
            } else {
                $nextNumber = 1;
            }

            $number = $prefix . '-' . $nextNumber;

            $printed[] = PrintedInvoice::create([
                'invoice_id' => $invoiceId,
                'batch_id' => $batchId,
                'printed_at' => now(),
                'number' => $number,
            ]);
        }
    }

    return response()->json([
        'batch_id' => $batchId,
        'printed' => PrintedInvoice::where('batch_id', $batchId)->orderBy('id')->get(),
    ]);
}
    // Ver todas las impresiones
    public function index()
    {
        return PrintedInvoice::orderBy('id')->get();
    }

    // Ver una impresión por id
    public function show($id)
    {
        $printed = PrintedInvoice::findOrFail($id);
        return response()->json($printed);
    }

    public function destroy($id)
{
    $printed = \App\Models\PrintedInvoice::findOrFail($id);

    // Guarda datos para recalcular
    $company = $printed->invoice->company;
    $prefix = ($company->invoice_prefix ?: 'F');

    // Elimina la factura impresa
    $printed->delete();

    // Obtén todas las impresiones de esa empresa, ordenadas por id
    $allPrinted = \App\Models\PrintedInvoice::whereHas('invoice', function($q) use ($company) {
            $q->where('company_id', $company->id);
        })
        ->where('number', 'like', $prefix . '-%')
        ->orderBy('id')
        ->get();

    // Reasigna la numeración correlativa
    $counter = 1;
    foreach ($allPrinted as $pi) {
        $pi->number = $prefix . '-' . $counter;
        $pi->save();
        $counter++;
    }

    return response()->json(['message' => 'Factura impresa eliminada y numeración ajustada']);
}
}