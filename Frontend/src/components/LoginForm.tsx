import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField'; // Importar el componente InputField

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error al iniciar sesión');
        return;
      }

      const data = await response.json();
      console.log('Inicio de sesión exitoso:', data);

      // Guardar el token en localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirigir al usuario al dashboard o página principal
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <InputField
        label="Correo electrónico"
        type="email"
        name="email"
        value={formData.email}
        placeholder="Ingresa tu correo electrónico"
        onChange={handleChange}
      />
      <InputField
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        placeholder="Ingresa tu contraseña"
        onChange={handleChange}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Iniciar Sesión
      </button>
    </form>
  );
};

export default LoginForm;