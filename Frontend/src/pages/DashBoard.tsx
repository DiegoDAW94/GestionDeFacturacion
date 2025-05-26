import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';

const DashBoard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Bienvenido a Invoquio</h1>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Gestiona tu Facturación de manera rapida y sencilla</h1>
      <p className="text-lg text-gray-600 mb-8">
  Invoquio es la solución integral para gestionar la facturación de tu empresa de forma sencilla, rápida y segura. 
  Centraliza clientes, facturas, artículos y compañías en un solo lugar.
</p>
<p className="text-lg text-gray-600 mb-8">
  Ahorra tiempo y mantén tus datos siempre organizados y accesibles desde cualquier dispositivo. 
  ¡Empieza a optimizar tu gestión hoy mismo!
</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-6 text-center flex flex-col items-center">
          <DashboardIcon className="text-blue-500 mb-2" fontSize="large" />
          <span className="block text-2xl font-bold text-blue-600 mb-2">Dashboard</span>
          <span className="text-gray-500">Visión general de tu actividad</span>
        </div>
        <div className="bg-white rounded shadow p-6 text-center flex flex-col items-center">
          <PeopleIcon className="text-green-500 mb-2" fontSize="large" />
          <span className="block text-2xl font-bold text-green-600 mb-2">Clientes</span>
          <span className="text-gray-500">Administra tus clientes</span>
        </div>
        <div className="bg-white rounded shadow p-6 text-center flex flex-col items-center">
          <ReceiptIcon className="text-yellow-500 mb-2" fontSize="large" />
          <span className="block text-2xl font-bold text-yellow-600 mb-2">Facturas</span>
          <span className="text-gray-500">Gestiona tus facturas fácilmente</span>
        </div>
        <div className="bg-white rounded shadow p-6 text-center flex flex-col items-center">
          <InventoryIcon className="text-purple-500 mb-2" fontSize="large" />
          <span className="block text-2xl font-bold text-purple-600 mb-2">Artículos</span>
          <span className="text-gray-500">Gestiona tus productos o servicios</span>
        </div>
        <div className="bg-white rounded shadow p-6 text-center flex flex-col items-center">
          <BusinessIcon className="text-pink-500 mb-2" fontSize="large" />
          <span className="block text-2xl font-bold text-pink-600 mb-2">Compañías</span>
          <span className="text-gray-500">Configura tus compañías</span>
        </div>
        <div className="bg-white rounded shadow p-6 text-center flex flex-col items-center">
          <SettingsIcon className="text-gray-500 mb-2" fontSize="large" />
          <span className="block text-2xl font-bold text-gray-700 mb-2">Configuración</span>
          <span className="text-gray-500">Ajusta tus preferencias y datos</span>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;