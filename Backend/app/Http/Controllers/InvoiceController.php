<?php


namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Item;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
{
    return Invoice::with(['invoiceItems', 'taxes', 'client'])->get();
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

    // Obtener la empresa y su prefijo
    $company = \App\Models\Company::findOrFail($validated['company_id']);
    $prefix = $company->invoice_prefix ?: 'F';

    // Si no se pasa número, generarlo correlativo por empresa
    if (empty($validated['number'])) {
        // Busca la última factura de la empresa ordenada por id descendente
        $lastInvoice = \App\Models\Invoice::where('company_id', $company->id)
            ->orderByDesc('id')
            ->first();

        // Extrae el número correlativo (asume formato PREFIX-XXX)
        if ($lastInvoice && preg_match('/^' . preg_quote($prefix, '/') . '-(\d+)$/', $lastInvoice->number, $matches)) {
            $nextNumber = intval($matches[1]) + 1;
        } else {
            $nextNumber = 1;
        }

        $validated['number'] = $prefix . '-' . $nextNumber;
    }

    $validated['base_amount'] = 0;
    $validated['tax_amount'] = 0;
    $validated['total'] = 0;

    $invoice = Invoice::create($validated);

    // Guardar los datos históricos de los ítems
    if ($request->has('items')) {
        foreach ($request->input('items') as $itemData) {
            $item = \App\Models\Item::findOrFail($itemData['id']);
            $invoice->invoiceItems()->create([
                'item_id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'price' => $item->price,
                'quantity' => $itemData['quantity'],
            ]);
        }
    }

    // Relacionar impuestos
    if ($request->has('taxes')) {
        $invoice->taxes()->sync($request->input('taxes'));
    }

    // Cargar relaciones antes de calcular totales
    $invoice->load(['invoiceItems', 'taxes']);
    $this->calculateTotals($invoice);

    return $invoice->load(['invoiceItems', 'taxes']);
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

        // Actualizar ítems históricos
        if ($request->has('items')) {
            // Borra los invoice_items actuales y vuelve a crearlos
            $invoice->invoiceItems()->delete();
            foreach ($request->input('items') as $itemData) {
                $item = Item::findOrFail($itemData['id']);
                $invoice->invoiceItems()->create([
                    'item_id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => $item->price,
                    'quantity' => $itemData['quantity'],
                ]);
            }
        }

        // Actualizar impuestos
        if ($request->has('taxes')) {
            $invoice->taxes()->sync($request->input('taxes'));
        }

        // Recalcular los totales
        $this->calculateTotals($invoice);

        return $invoice->load(['invoiceItems', 'taxes']);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->noContent();
    }

    private function calculateTotals(Invoice $invoice)
    {
        $baseAmount = 0;

        // Suma de ítems históricos
        foreach ($invoice->invoiceItems as $invoiceItem) {
            $subtotal = $invoiceItem->quantity * $invoiceItem->price;
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
    public function invoicesByCompany($companyId)
{
    return Invoice::with(['invoiceItems', 'taxes', 'client'])
        ->where('company_id', $companyId)
        ->get();
}


public function show($id)
{
    $invoice = Invoice::with(['invoiceItems', 'taxes', 'client'])->find($id);

    if (!$invoice) {
        return response()->json(['error' => 'Factura no encontrada'], 404);
    }

    return $invoice;
}
public function allInvoices(Request $request)
{
    $isAdmin = $request->user()->roles()->where('roles.id', 1)->exists();
    if (!$isAdmin) {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    return Invoice::with(['invoiceItems', 'taxes', 'client'])->get();
}
}