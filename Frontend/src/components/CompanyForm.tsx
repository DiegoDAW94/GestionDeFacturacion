import React, { useState, useEffect } from 'react';
import { createCompany, updateCompany } from '../services/apiservices'; // <-- Importa updateCompany

interface CompanyFormProps {
  company?: any;
  onSaved?: (newCompany: any) => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    legal_name: '',
    cif: '',
    fiscal_address: '',
    social_address: '',
    city: '',
    postal_code: '',
    province: '',
    email: '',
    telefono: '',
    invoice_prefix: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('authToken'); // Obtener el token del usuario logueado

  // Actualiza los campos del formulario cuando cambia la compañía a editar
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        legal_name: company.legal_name || '',
        cif: company.cif || '',
        fiscal_address: company.fiscal_address || '',
        social_address: company.social_address || '',
        city: company.city || '',
        postal_code: company.postal_code || '',
        province: company.province || '',
        email: company.email || '',
        telefono: company.telefono || '',
        invoice_prefix: company.invoice_prefix || '',
      });
    } else {
      setFormData({
        name: '',
        legal_name: '',
        cif: '',
        fiscal_address: '',
        social_address: '',
        city: '',
        postal_code: '',
        province: '',
        email: '',
        telefono: '',
        invoice_prefix: '',
      });
    }
  }, [company]);

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
    let result;
    if (company) {
      // Editar compañía existente
      result = await updateCompany(company.id, formData, token);
      setSuccess('Compañía actualizada exitosamente.');
    } else {
      // Crear nueva compañía
      result = await createCompany(formData, token);
      setSuccess('Compañía creada exitosamente.');
      setFormData({
        name: '',
        legal_name: '',
        cif: '',
        fiscal_address: '',
        social_address: '',
        city: '',
        postal_code: '',
        province: '',
        email: '',
        telefono: '',
        invoice_prefix: '',
      });
    }
    // Llama a onSaved pasando la compañía creada/actualizada
    if (typeof onSaved === 'function') {
      onSaved(result.company || result);
    }
  } catch (err) {
    console.error('Error al guardar la compañía:', err);
    setError('Hubo un error al guardar la compañía.');
  }
};

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {company ? 'Editar Compañía' : 'Crear Compañía'}
      </h1>

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
          placeholder="Nombre de la compañía"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Nombre Legal</label>
        <input
          type="text"
          name="legal_name"
          value={formData.legal_name}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Nombre legal de la compañía"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">CIF</label>
        <input
          type="text"
          name="cif"
          value={formData.cif}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="CIF de la compañía"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Dirección Fiscal</label>
        <input
          type="text"
          name="fiscal_address"
          value={formData.fiscal_address}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Dirección fiscal"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Dirección Social</label>
        <input
          type="text"
          name="social_address"
          value={formData.social_address}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Dirección social"
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
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Código Postal</label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Código postal"
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
          placeholder="Email de la compañía"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Teléfono de la compañía"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Prefijo de Factura</label>
        <input
          type="text"
          name="invoice_prefix"
          value={formData.invoice_prefix}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Prefijo para las facturas"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {company ? 'Guardar Cambios' : 'Crear Compañía'}
      </button>
    </form>
  );
};

export default CompanyForm;