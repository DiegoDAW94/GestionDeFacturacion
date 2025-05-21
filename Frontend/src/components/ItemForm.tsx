import React, { useState, useEffect } from 'react';
import { createItem, updateItem } from '../services/apiservices';

interface ItemFormProps {
  item?: any; // El ítem a editar, o undefined/null para crear
  onSaved?: () => void; // Callback tras guardar
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');
  const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || '{}');

  // Si hay item, inicializa el formulario con sus datos
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price !== undefined ? String(item.price) : '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
      });
    }
    setError(null);
    setSuccess(null);
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('No se encontró el token de autenticación.');
      return;
    }
    if (!selectedCompany.id) {
      setError('No hay empresa seleccionada.');
      return;
    }

    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        company_id: selectedCompany.id,
      };

      if (item && item.id) {
        await updateItem(item.id, itemData, token);
        setSuccess('Ítem actualizado exitosamente.');
      } else {
        await createItem(itemData, token);
        setSuccess('Ítem añadido exitosamente.');
        setFormData({ name: '', description: '', price: '' });
      }

      if (onSaved) onSaved();
    } catch (err) {
      setError('Hubo un error al guardar el ítem.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">{item ? 'Editar Ítem' : 'Añadir Ítem'}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Nombre del ítem"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Descripción del ítem"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Precio</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Precio del ítem"
          required
          min="0"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {item ? 'Actualizar Ítem' : 'Añadir Ítem'}
      </button>
    </form>
  );
};

export default ItemForm;