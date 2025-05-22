import React from 'react';

const DashBoard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Bienvenido a Invoquio</h1>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">El primer paso es crear tu empresa</h1>
      <p className="text-lg text-gray-600 mb-8">
        Selecciona una opción en el menú lateral para comenzar a gestionar tu empresa.
      </p>
      <p className="text-lg text-gray-600 mb-8">
        Una vez creada, seleccionala en la barra superior derecha para podder utilizar todas las funciones
      </p>
      <div className="flex space-x-4">
        <div className="bg-white rounded shadow p-6 text-center">
          <span className="block text-2xl font-bold text-blue-600 mb-2">Facturas</span>
          <span className="text-gray-500">Gestiona tus facturas fácilmente</span>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <span className="block text-2xl font-bold text-green-600 mb-2">Clientes</span>
          <span className="text-gray-500">Administra tus clientes</span>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <span className="block text-2xl font-bold text-purple-600 mb-2">Compañías</span>
          <span className="text-gray-500">Configura tus compañías</span>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;