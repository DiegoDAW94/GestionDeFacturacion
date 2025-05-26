import React, { useState, useEffect } from 'react';
import { createRole, updateRole } from '../services/apiservices';

interface RolesFormProps {
  role?: any;
  onSaved?: () => void;
}

const RolesForm: React.FC<RolesFormProps> = ({ role, onSaved }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setName(role ? role.name : '');
    setError(null);
    setSuccess(null);
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!token) {
      setError('No se encontró el token de autenticación.');
      return;
    }
    try {
      if (role && role.id) {
        await updateRole(role.id, { name }, token);
        setSuccess('Rol actualizado correctamente.');
      } else {
        await createRole({ name }, token);
        setSuccess('Rol creado correctamente.');
        setName('');
      }
      if (onSaved) onSaved();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el rol.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">{role ? 'Editar Rol' : 'Crear Rol'}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Nombre del rol</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {role ? 'Actualizar Rol' : 'Crear Rol'}
      </button>
    </form>
  );
};

export default RolesForm;