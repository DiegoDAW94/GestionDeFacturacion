import React, { useState } from 'react';
import { register } from '../services/apiservices'; // Importar la función de registro del apiservice
import InputField from './InputField'; // Importar el componente InputField
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
    const navigate = useNavigate();


  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await register(formData);
      console.log('Registro exitoso:', data);

      // Redirigir usando React Router
      navigate('app/login');
    } catch (error: any) {
      console.error('Error al registrarse:', error);
      setError(error.message || 'Error al registrarse');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <InputField
        label="Nombre"
        type="text"
        name="name"
        value={formData.name}
        placeholder="Ingresa tu nombre"
        onChange={handleChange}
      />
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
      <InputField
        label="Confirmar contraseña"
        type="password"
        name="password_confirmation"
        value={formData.password_confirmation}
        placeholder="Confirma tu contraseña"
        onChange={handleChange}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Registrarse
      </button>
    </form>
  );
};

export default RegisterForm;