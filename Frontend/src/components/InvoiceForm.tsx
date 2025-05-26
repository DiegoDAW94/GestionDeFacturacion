import React, { useState, useEffect } from 'react';
import { getClientsByCompany, getTaxes, createInvoice, updateInvoice, getItemsByCompany } from '../services/apiservices';

interface InvoiceFormProps {
  invoice?: any;
  onSaved?: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSaved }) => {
  const [clients, setClients] = useState<{ id: number; name: string }[]>([]);
  const [clientQuery, setClientQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<{ id: number; name: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);

  const [items, setItems] = useState<{ id: string; name: string; price: number; company_id: number }[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<{ id: string; quantity: number }[]>([]);
  const [customItems, setCustomItems] = useState<{ description: string; quantity: number; unit_price: number }[]>([]);
  const [taxes, setTaxes] = useState<{ id: number; name: string; percentage: number }[]>([]);
  const [selectedTaxes, setSelectedTaxes] = useState<{ id: number; name: string; percentage: number }[]>([]);
  const [baseImponible, setBaseImponible] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState('');
  const [operationDate, setOperationDate] = useState('');
  const token = localStorage.getItem('authToken');
  const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || '{}');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la factura al editar
  useEffect(() => {
    if (invoice) {
      // Cliente
      if (invoice.client) {
        setSelectedClient({ id: invoice.client.id, name: invoice.client.name });
        setClientQuery(invoice.client.name);
      } else {
        setSelectedClient(null);
        setClientQuery('');
      }
      // Ítems reutilizables
      setInvoiceItems(
        invoice.invoice_items
          ? invoice.invoice_items.map((ii: any) => ({
              id: String(ii.item_id),
              quantity: ii.quantity,
            }))
          : []
      );
      // Ítems personalizados
      setCustomItems(invoice.custom_items || []);
      // Impuestos
      setSelectedTaxes(
        invoice.taxes
          ? invoice.taxes.map((tax: any) => ({
              id: tax.id,
              name: tax.name,
              percentage: Number(tax.percentage),
            }))
          : []
      );
      // Fechas
      setDate(invoice.date || '');
      setOperationDate(invoice.operation_date || '');
    } else {
      setSelectedClient(null);
      setClientQuery('');
      setInvoiceItems([]);
      setCustomItems([]);
      setSelectedTaxes([]);
      setDate('');
      setOperationDate('');
    }
  }, [invoice]);

  // Cargar ítems y clientes según la empresa de la factura (o la seleccionada)
  useEffect(() => {
    const companyIdToUse = invoice?.company_id || selectedCompany?.id;
    if (!companyIdToUse) {
      setError('No se ha encontrado la empresa para esta factura.');
      setItems([]);
      setClients([]);
      return;
    }
    if (token) {
      getItemsByCompany(companyIdToUse, token)
        .then(data => {
          setItems(
            data.map((item: any) => ({
              ...item,
              id: String(item.id),
              price: Number(item.price),
            }))
          );
        })
        .catch(console.error);

      getClientsByCompany(companyIdToUse, token)
        .then(setClients)
        .catch(console.error);
    }
  }, [invoice, selectedCompany?.id, token]);

  // Cargar impuestos solo una vez
  useEffect(() => {
    if (token) {
      getTaxes(token).then(setTaxes).catch(console.error);
    }
  }, [token]);

  // Filtrar clientes según lo que escribe el usuario
  useEffect(() => {
    setFilteredClients(
      clients.filter((c) => c.name.toLowerCase().includes(clientQuery.toLowerCase()))
    );
  }, [clientQuery, clients]);

  // Calcular base imponible, impuestos y total
  useEffect(() => {
    const itemsTotal = invoiceItems.reduce((sum, invItem) => {
      if (!invItem.id) return sum;
      const item = items.find((i) => i.id === invItem.id);
      return sum + (item ? item.price * invItem.quantity : 0);
    }, 0);

    const customTotal = customItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    const totalFactura = itemsTotal + customTotal;

    const porcentajeTotalImpuestos = selectedTaxes.reduce(
      (sum, tax) => sum + tax.percentage,
      0
    );

    const base =
      porcentajeTotalImpuestos > 0
        ? totalFactura / (1 + porcentajeTotalImpuestos / 100)
        : totalFactura;
    const impuestos = totalFactura - base;

    setBaseImponible(base);
    setTaxAmount(impuestos);
    setTotal(totalFactura);
  }, [invoiceItems, customItems, selectedTaxes, items]);

  // Handlers
  const handleClientInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientQuery(e.target.value);
    setSelectedClient(null);
  };

  const handleSelectClient = (client: { id: number; name: string }) => {
    setSelectedClient(client);
    setClientQuery(client.name);
    setFilteredClients([]);
  };

  const handleAddInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { id: '', quantity: 1 }]);
  };

  const handleInvoiceItemChange = (index: number, field: string, value: unknown) => {
    const updated = [...invoiceItems];
    if (field === 'id') {
      updated[index] = { ...updated[index], id: value ? String(value) : '' };
    } else if (field === 'quantity') {
      updated[index] = { ...updated[index], quantity: Number(value) || 1 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setInvoiceItems(updated);
  };

  const handleRemoveInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleAddCustomItem = () => {
    setCustomItems([...customItems, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const handleCustomItemChange = (index: number, field: string, value: unknown) => {
    const updated = [...customItems];
    updated[index] = { ...updated[index], [field]: value };
    setCustomItems(updated);
  };

  const handleRemoveCustomItem = (index: number) => {
    setCustomItems(customItems.filter((_, i) => i !== index));
  };

  const handleAddTax = (taxId: number) => {
    const tax = taxes.find((t) => t.id === taxId);
    if (tax && !selectedTaxes.some((t) => t.id === taxId)) {
      setSelectedTaxes([...selectedTaxes, tax]);
    }
  };

  const handleRemoveTax = (index: number) => {
    setSelectedTaxes(selectedTaxes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  if (!token) {
    setError('No se encontró el token de autenticación.');
    return;
  }
  // Usar el company_id de la factura si existe, si no el seleccionado
  const companyIdToUse = invoice?.company_id || selectedCompany.id;
  if (!companyIdToUse) {
    setError('No hay empresa seleccionada.');
    return;
  }
  if (!user.id) {
    setError('No hay usuario autenticado.');
    return;
  }
  if (!selectedClient) {
    setError('Selecciona un cliente.');
    return;
  }

  try {
    const payload = {
      company_id: companyIdToUse,
      user_id: user.id,
      client_id: selectedClient.id,
      number: invoice ? invoice.number : undefined, // <-- Añade este campo SOLO en edición
      items: invoiceItems.map((item) => ({
        id: Number(item.id),
        quantity: item.quantity,
        price: items.find((i) => i.id === item.id)?.price || 0,
      })),
      custom_items: customItems,
      taxes: selectedTaxes.map((tax) => tax.id),
      date,
      operation_date: operationDate,
      total,
    };
    if (invoice) {
      await updateInvoice(invoice.id, payload, token);
      setSuccess('¡Factura actualizada correctamente!');
    } else {
      await createInvoice(payload, token);
      setSuccess('¡Factura creada correctamente!');
    }
    if (onSaved) onSaved();
    // Limpiar campos solo si es creación
    if (!invoice) {
      setSelectedClient(null);
      setClientQuery('');
      setInvoiceItems([]);
      setCustomItems([]);
      setSelectedTaxes([]);
      setDate('');
      setOperationDate('');
      setBaseImponible(0);
      setTaxAmount(0);
      setTotal(0);
    }
  } catch (err) {
    setError('Hubo un error al guardar la factura.');
  }
};

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">{invoice ? 'Editar Factura' : 'Crear Factura'}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {/* Cliente con autocompletado */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Cliente</label>
        <input
          type="text"
          value={clientQuery}
          onChange={handleClientInput}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Buscar cliente..."
        />
        {clientQuery.length > 0 && filteredClients.length > 0 && (
          <ul className="border border-gray-300 bg-white absolute z-10 w-full">
            {filteredClients.map((client) => (
              <li
                key={client.id}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelectClient(client)}
              >
                {client.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ítems reutilizables */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Ítems</label>
        {invoiceItems.map((invItem, index) => {
          const itemObj = items.find((i) => i.id === invItem.id);
          return (
            <div key={index} className="flex items-center space-x-4 mb-2">
              <select
                value={invItem.id === undefined ? "" : String(invItem.id)}
                onChange={(e) => handleInvoiceItemChange(index, 'id', e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Seleccionar ítem</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={invItem.quantity}
                onChange={(e) => handleInvoiceItemChange(index, 'quantity', Number(e.target.value))}
                className="w-24 p-2 border border-gray-300 rounded"
                placeholder="Cantidad"
              />
              <span>
                Precio: {itemObj && typeof itemObj.price === 'number'
                  ? (itemObj.price * invItem.quantity).toFixed(2)
                  : '0.00'} €
              </span>
              <button
                type="button"
                onClick={() => handleRemoveInvoiceItem(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={handleAddInvoiceItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Añadir Ítem
        </button>
      </div>

      {/* Ítems personalizados */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Ítems Personalizados</label>
        {customItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 mb-2">
            <input
              type="text"
              placeholder="Descripción"
              value={item.description}
              onChange={(e) => handleCustomItemChange(index, 'description', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              min={1}
              placeholder="Cantidad"
              value={item.quantity}
              onChange={(e) => handleCustomItemChange(index, 'quantity', Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="Precio Unitario"
              value={item.unit_price}
              onChange={(e) => handleCustomItemChange(index, 'unit_price', Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveCustomItem(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCustomItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Añadir Ítem Personalizado
        </button>
      </div>

      {/* Impuestos */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Impuestos</label>
        <select
          onChange={(e) => {
            const taxId = Number(e.target.value);
            if (taxId) handleAddTax(taxId);
          }}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccionar impuesto</option>
          {taxes.map((tax) => (
            <option key={tax.id} value={tax.id}>
              {tax.name} ({tax.percentage}%)
            </option>
          ))}
        </select>
        <div className="mt-2">
          {selectedTaxes.map((tax, index) => (
            <div key={tax.id} className="flex items-center space-x-2">
              <span>
                {tax.name} ({tax.percentage}%)
              </span>
              <button
                type="button"
                onClick={() => handleRemoveTax(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Desglose de totales */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Desglose</label>
        <div>
          Base imponible: {baseImponible.toFixed(2)} €
        </div>
        <div>
          Impuestos: {taxAmount.toFixed(2)} €
        </div>
        <div className="font-bold">
          Total factura: {total.toFixed(2)} €
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Fecha operación</label>
        <input
          type="date"
          value={operationDate}
          onChange={(e) => setOperationDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {invoice ? 'Guardar Cambios' : 'Crear Factura'}
      </button>
    </form>
  );
};

export default InvoiceForm;