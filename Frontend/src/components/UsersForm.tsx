import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from '../services/apiservices';

interface UsersFormProps {
  user?: any; // El usuario a editar, o undefined/null para crear
  onSaved?: () => void; // Callback tras guardar
}

const UsersForm: React.FC<UsersFormProps> = ({ user, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');

  // Si hay user, inicializa el formulario con sus datos
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
      });
    }
    setError(null);
    setSuccess(null);
  }, [user]);

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
      if (user && user.id) {
        // Solo envía password si se ha escrito
        const updateData: any = {
          name: formData.name,
          email: formData.email,
        };
        if (formData.password) updateData.password = formData.password;

        await updateUser(user.id, updateData, token);
        setSuccess('Usuario actualizado exitosamente.');
        if (onSaved) onSaved();
      } else {
        await createUser(formData, token);
        setSuccess('Usuario añadido exitosamente.');
        setFormData({ name: '', email: '', password: '' });
        if (onSaved) onSaved();
      }
    } catch (err: any) {
      // Mostrar mensaje de error del backend si existe
      if (err && err.message) {
        setError(err.message);
      } else {
        setError('Hubo un error al guardar el usuario.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">{user ? 'Editar Usuario' : 'Añadir Usuario'}</h1>
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
          placeholder="Nombre del usuario"
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
          placeholder="Email del usuario"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Contraseña {user ? '(dejar en blanco para no cambiar)' : ''}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Contraseña"
          minLength={user ? 0 : 8}
          required={!user}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {user ? 'Actualizar Usuario' : 'Añadir Usuario'}
      </button>
    </form>
  );
};

export default UsersForm;