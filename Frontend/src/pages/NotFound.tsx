import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* Enlace a la página de inicio */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="text-blue-500 text-xl font-bold hover:underline">
          Invoquio
        </Link>
      </div>

      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;