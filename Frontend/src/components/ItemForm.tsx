import React, { useState } from 'react';
import { createItem } from '../services/apiservices';

const ItemForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('authToken'); // Obtener el token del usuario logueado

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

    try {
      // Convertir el precio a número antes de enviarlo
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
      };

      await createItem(itemData, token);
      setSuccess('Ítem añadido exitosamente.');
      setFormData({
        name: '',
        description: '',
        price: '',
      });
    } catch (err) {
      console.error('Error al añadir el ítem:', err);
      setError('Hubo un error al añadir el ítem.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Añadir Ítem</h1>

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
        Añadir Ítem
      </button>
    </form>
  );
};

export default ItemForm;