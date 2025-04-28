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
            'number' => 'required|string|max:20',
            'date' => 'required|date',
            'operation_date' => 'nullable|date',
            'custom_items' => 'nullable|array',
        ]);

        // Crear la factura
        $invoice = Invoice::create($validated);

        // Relacionar ítems reutilizables
        if ($request->has('items')) {
            $invoice->items()->sync($request->input('items'));
        }

        // Relacionar impuestos
        if ($request->has('taxes')) {
            $invoice->taxes()->sync($request->input('taxes'));
        }

        // Calcular los totales
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

        // Calcular base_amount a partir de los ítems reutilizables
        foreach ($invoice->items as $item) {
            $subtotal = $item->pivot->quantity * $item->pivot->price;
            $baseAmount += $subtotal;
        }

        // Calcular base_amount a partir de los custom_items
        if (!empty($invoice->custom_items)) {
            foreach ($invoice->custom_items as $customItem) {
                $subtotal = $customItem['quantity'] * $customItem['unit_price'];
                $baseAmount += $subtotal;
            }
        }

        $invoice->base_amount = $baseAmount;

        // Calcular tax_amount a partir de los impuestos relacionados
        $taxAmount = $invoice->taxes->sum(function ($tax) use ($baseAmount) {
            return $baseAmount * ($tax->percentage / 100);
        });

        $invoice->tax_amount = $taxAmount;

        // Calcular el total
        $invoice->total = $baseAmount + $taxAmount;

        // Guardar los cambios en la factura
        $invoice->save();
    }
}