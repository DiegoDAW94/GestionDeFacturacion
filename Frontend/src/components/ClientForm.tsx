import React, { useState } from 'react';
import { createClient } from '../services/apiservices';

const ClientForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    nif: '',
    fiscal_address: '',
    city: '',
    postal_code: '',
    province: '',
    email: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');
  const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || '{}');

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
      const clientData = {
        ...formData,
        company_id: selectedCompany.id,
      };

      await createClient(clientData, token);
      setSuccess('Cliente añadido exitosamente.');
      setFormData({
        name: '',
        nif: '',
        fiscal_address: '',
        city: '',
        postal_code: '',
        province: '',
        email: '',
      });
    } catch (err) {
      console.error('Error al añadir el cliente:', err);
      setError('Hubo un error al añadir el cliente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Añadir Cliente</h1>

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
          placeholder="Nombre del cliente"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">NIF</label>
        <input
          type="text"
          name="nif"
          value={formData.nif}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="NIF"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Dirección fiscal</label>
        <input
          type="text"
          name="fiscal_address"
          value={formData.fiscal_address}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Dirección fiscal"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Ciudad</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Ciudad"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Código postal</label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Código postal"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Provincia</label>
        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Provincia"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Email"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Añadir Cliente
      </button>
    </form>
  );
};

export default ClientForm;