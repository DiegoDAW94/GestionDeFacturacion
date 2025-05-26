import React, { useState } from 'react';
import { registerWorker } from '../services/apiservices';

interface RegisterWorkerFormProps {
  companies: any[];
  onSuccess: () => void;
}

const RegisterWorkerForm: React.FC<RegisterWorkerFormProps> = ({ companies, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', company_id: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('authToken');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Enviando formulario', form); // <-- Añade esto
  setLoading(true);
  setError(null);
  try {
    await registerWorker(form, token!);
    onSuccess();
  } catch (err) {
    setError('Error al registrar trabajador');
  }
  setLoading(false);
};

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mt-6">
      <h3 className="font-bold mb-2">Registrar nuevo trabajador</h3>
      <input name="name" placeholder="Nombre" className="mb-2 block w-full" onChange={handleChange} required />
      <input name="email" placeholder="Email" className="mb-2 block w-full" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" className="mb-2 block w-full" onChange={handleChange} required />
      <select name="company_id" className="mb-2 block w-full" onChange={handleChange} required>
        <option value="">Selecciona compañía</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
};

export default RegisterWorkerForm;