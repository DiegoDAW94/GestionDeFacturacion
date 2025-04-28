import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link para la navegación
import RegisterForm from '../components/RegisterForm'; // Importar el componente RegisterForm

const Register: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Enlace a la página de inicio */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="text-blue-500 text-xl font-bold hover:underline">
          Invoquio
        </Link>
      </div>

      {/* Contenedor del formulario */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrarse</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;