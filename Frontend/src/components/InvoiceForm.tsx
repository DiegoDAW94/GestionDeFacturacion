import React, { useState, useEffect } from 'react';
import { getClients, getItems, getTaxes, createInvoice } from '../services/apiservices';

const InvoiceForm: React.FC = () => {
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const [taxes, setTaxes] = useState<{ id: number; name: string; percentage: number }[]>([]);
  const [formData, setFormData] = useState({
    client_id: '',
    items: [{ id: '', quantity: 1, price: 0 }],
    taxes: [] as { id: number; name: string; percentage: number }[], // Array de objetos con { id, name, percentage }
    custom_items: [{ description: '', quantity: 1, unit_price: 0 }],
    date: '',
    operation_date: '',
    total: 0,
  });

  const token = localStorage.getItem('authToken'); // Obtener el token del usuario logueado

  // Cargar clientes, ítems e impuestos desde el backend
  useEffect(() => {
    if (token) {
      getClients(token).then(setClients).catch(console.error);
      getItems(token).then(setItems).catch(console.error);
      getTaxes(token).then(setTaxes).catch(console.error);
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleCustomItemChange = (index: number, field: string, value: string | number) => {
    const updatedCustomItems = [...formData.custom_items];
    updatedCustomItems[index] = { ...updatedCustomItems[index], [field]: value };
    setFormData({ ...formData, custom_items: updatedCustomItems });
  };

  const addCustomItem = () => {
    setFormData({
      ...formData,
      custom_items: [...formData.custom_items, { description: '', quantity: 1, unit_price: 0 }],
    });
  };

  const removeCustomItem = (index: number) => {
    const updatedCustomItems = formData.custom_items.filter((_, i) => i !== index);
    setFormData({ ...formData, custom_items: updatedCustomItems });
  };

  const calculateTotal = () => {
    const itemTotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const customItemTotal = formData.custom_items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const taxTotal = formData.taxes.reduce(
      (sum, tax: { id: number; name: string; percentage: number }) => sum + (itemTotal + customItemTotal) * (tax.percentage / 100),
      0
    );

    setFormData({ ...formData, total: itemTotal + customItemTotal + taxTotal });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      console.error('No se encontró el token de autenticación.');
      return;
    }

    try {
      await createInvoice(
        {
          client_id: Number(formData.client_id),
          items: formData.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          custom_items: formData.custom_items,
          taxes: formData.taxes.map((tax) => tax.id),
          date: formData.date,
          operation_date: formData.operation_date,
          total: formData.total,
        },
        token
      );
      alert('Factura creada exitosamente');
      setFormData({
        client_id: '',
        items: [{ id: '', quantity: 1, price: 0 }],
        taxes: [],
        custom_items: [{ description: '', quantity: 1, unit_price: 0 }],
        date: '',
        operation_date: '',
        total: 0,
      });
    } catch (error) {
      console.error('Error al crear la factura:', error);
      alert('Hubo un error al crear la factura.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Crear Factura</h1>

      {/* Seleccionar cliente */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Cliente</label>
        <select
          name="client_id"
          value={formData.client_id}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccionar cliente</option>
          {clients.map((client: { id: number; name: string }) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ítems reutilizables */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Ítems</label>
        {formData.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 mb-2">
            <div>
            <p>Descripción</p>
            <select
              value={item.id}
              onChange={(e) => handleItemChange(index, 'id', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccionar ítem</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            </div>
            <div>
               <p>Cantidad</p>
            <input
              type="number"
              placeholder="Cantidad"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded"
            /></div>
            <div>
            <p>Precio Unitario</p>
            <input
              type="number"
              placeholder="Precio"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded"
            /></div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Añadir Ítem
        </button>
      </div>

      {/* Ítems personalizados */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Ítems Personalizados</label>
        {formData.custom_items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 mb-2">
            <div>
            <p>Descripción</p>
            <input
              type="text"
              placeholder=""
              value={item.description}
              onChange={(e) => handleCustomItemChange(index, 'description', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            /></div>
            <div>
               <p>Cantidad</p>
            <input
              type="text"
              placeholder="Cantidad"
              value={item.quantity}
              onChange={(e) => handleCustomItemChange(index, 'quantity', Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded"
            /></div>
            <div>
            <p>Precio Unitario</p>
            <input
              type="text"
              placeholder="Precio Unitario"
              value={item.unit_price}
              onChange={(e) => handleCustomItemChange(index, 'unit_price', Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded"
            /></div>
            <button
              type="button"
              onClick={() => removeCustomItem(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCustomItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Añadir Ítem Personalizado
        </button>
      </div>

      {/* Seleccionar impuestos */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Impuestos</label>
        <div className="flex items-center space-x-4">
          <select
            name="tax"
            onChange={(e) => {
              const selectedTax = taxes.find((tax: { id: number; name: string; percentage: number }) => tax.id === Number(e.target.value));
              if (selectedTax) {
                setFormData({
                  ...formData,
                  taxes: [...formData.taxes, { id: selectedTax.id, name: selectedTax.name, percentage: selectedTax.percentage }],
                });
              }
            }}
            className="flex-1 p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccionar impuesto</option>
            {taxes.map((tax: { id: number; name: string; percentage: number }) => (
              <option key={tax.id} value={tax.id}>
                {tax.name} ({tax.percentage}%)
              </option>
            ))}
          </select>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              const dropdown = document.querySelector('select[name="tax"]') as HTMLSelectElement;
              if (dropdown) dropdown.value = '';
            }}
          >
            Añadir Impuesto
          </button>
        </div>

        {/* Lista de impuestos añadidos */}
        <div className="mt-4">
          {formData.taxes.map((tax, index) => (
            <div key={index} className="flex items-center space-x-4 mb-2">
              <span className="flex-1">{tax.name} ({tax.percentage}%)</span>
              <button
                type="button"
                onClick={() => {
                  const updatedTaxes = formData.taxes.filter((_, i) => i !== index);
                  setFormData({ ...formData, taxes: updatedTaxes });
                }}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Total</label>
        <input
          type="number"
          value={formData.total}
          readOnly
          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
        />
      </div>

      <button
        type="button"
        onClick={calculateTotal}
        className="bg-green-500 text-white px-4 py-2 rounded mr-4"
      >
        Calcular Total
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Crear Factura
      </button>
    </form>
  );
};

export default InvoiceForm;