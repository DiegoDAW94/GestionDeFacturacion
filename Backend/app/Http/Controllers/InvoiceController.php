<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        return Invoice::with(['items', 'taxes'])->get();
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'company_id' => 'required|exists:companies,id',
        'user_id' => 'required|exists:users,id',
        'client_id' => 'required|exists:clients,id',
        'number' => 'nullable|string|max:20',
        'date' => 'required|date',
        'operation_date' => 'nullable|date',
        'custom_items' => 'nullable|array',
    ]);

    if (empty($validated['number'])) {
    $validated['number'] = 'F-' . time();
}
$validated['base_amount'] = 0;
$validated['tax_amount'] = 0;
$validated['total'] = 0;

$invoice = Invoice::create($validated);

    // Relacionar ítems reutilizables
    if ($request->has('items')) {
        $syncData = [];
        foreach ($request->input('items') as $item) {
            $syncData[$item['id']] = [
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ];
        }
        $invoice->items()->sync($syncData);
    }

    // Relacionar impuestos
    if ($request->has('taxes')) {
        $invoice->taxes()->sync($request->input('taxes'));
    }

    // Cargar relaciones antes de calcular totales
    $invoice->load(['items', 'taxes']);
    $this->calculateTotals($invoice);

    return $invoice->load(['items', 'taxes']);
}

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'user_id' => 'required|exists:users,id',
            'client_id' => 'required|exists:clients,id',
            'number' => 'required|string|max:20',
            'date' => 'required|date',
            'operation_date' => 'nullable|date',
            'custom_items' => 'nullable|array',
        ]);

        // Actualizar la factura
        $invoice->update($validated);

        // Actualizar relaciones
        if ($request->has('items')) {
            $invoice->items()->sync($request->input('items'));
        }

        if ($request->has('taxes')) {
            $invoice->taxes()->sync($request->input('taxes'));
        }

        // Recalcular los totales
        $this->calculateTotals($invoice);

        return $invoice->load(['items', 'taxes']);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->noContent();
    }

    private function calculateTotals(Invoice $invoice)
{
    $baseAmount = 0;

    // Suma de ítems reutilizables
    foreach ($invoice->items as $item) {
        $subtotal = $item->pivot->quantity * $item->pivot->price;
        $baseAmount += $subtotal;
    }

    // Suma de custom items
    if (!empty($invoice->custom_items)) {
        foreach ($invoice->custom_items as $customItem) {
            $subtotal = $customItem['quantity'] * $customItem['unit_price'];
            $baseAmount += $subtotal;
        }
    }

    // Suma de porcentajes de impuestos
    $porcentajeTotalImpuestos = $invoice->taxes->sum('percentage');

    // Calcula base imponible y total impuestos igual que en el frontend
    if ($porcentajeTotalImpuestos > 0) {
        $base = $baseAmount / (1 + $porcentajeTotalImpuestos / 100);
    } else {
        $base = $baseAmount;
    }
    $taxAmount = $baseAmount - $base;
    $total = $baseAmount;

    $invoice->base_amount = $base;
    $invoice->tax_amount = $taxAmount;
    $invoice->total = $total;

    $invoice->save();
}
}