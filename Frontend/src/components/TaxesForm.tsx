import React, { useState, useEffect } from 'react';
import { createTax, updateTax } from '../services/apiservices';

interface TaxesFormProps {
  tax?: any; // El impuesto a editar, o undefined/null para crear
  onSaved?: () => void; // Callback tras guardar
}

const TaxesForm: React.FC<TaxesFormProps> = ({ tax, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    percentage: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');

  // Si hay tax, inicializa el formulario con sus datos
  useEffect(() => {
    if (tax) {
      setFormData({
        name: tax.name || '',
        percentage: tax.percentage !== undefined ? String(tax.percentage) : '',
      });
    } else {
      setFormData({
        name: '',
        percentage: '',
      });
    }
    setError(null);
    setSuccess(null);
  }, [tax]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const taxData = {
        name: formData.name,
        percentage: parseFloat(formData.percentage),
      };

      if (tax && tax.id) {
        await updateTax(tax.id, taxData, token);
        setSuccess('Impuesto actualizado correctamente.');
      } else {
        await createTax(taxData, token);
        setSuccess('Impuesto creado correctamente.');
        setFormData({ name: '', percentage: '' });
      }
      if (onSaved) onSaved();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el impuesto.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">{tax ? 'Editar Impuesto' : 'Añadir Impuesto'}</h1>
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
          placeholder="Nombre del impuesto"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Porcentaje (%)</label>
        <input
          type="number"
          name="percentage"
          value={formData.percentage}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Porcentaje"
          required
          min="0"
          max="100"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {tax ? 'Actualizar Impuesto' : 'Añadir Impuesto'}
      </button>
    </form>
  );
};

export default TaxesForm;