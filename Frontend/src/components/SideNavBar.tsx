import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Ícono para el estado expandido
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // Ícono para el estado colapsado

const SideNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-gray-800 h-screen text-white transition-all duration-300 fixed top-16`}
    >
        {/* Botón para alternar la barra lateral */}
        <div className="flex justify-between items-center p-4">
        {!isOpen ? (
          <button
            className="focus:outline-none"
            onClick={toggleSidebar}
          >
            <ChevronRightIcon />
          </button>
        ) : (
          <button
            className="focus:outline-none ml-auto"
            onClick={toggleSidebar}
          >
            <ChevronLeftIcon />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className="mt-4">
        <ul>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/dashboard" className="flex items-center w-full">
              <DashboardIcon />
              {isOpen && <span className="ml-2">Dashboard</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/clients" className="flex items-center w-full">
              <PeopleIcon />
              {isOpen && <span className="ml-2">Clientes</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/create-invoice" className="flex items-center w-full">
              <ReceiptIcon />
              {isOpen && <span className="ml-2">Facturas</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/items" className="flex items-center w-full">
              <InventoryIcon />
              {isOpen && <span className="ml-2">Artículos</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/create-company" className="flex items-center w-full">
              <BusinessIcon />
              {isOpen && <span className="ml-2">Compañías</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to={`/settings/${userId}`} className="flex items-center w-full">
              <SettingsIcon />
              {isOpen && <span className="ml-2">Configuración</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Botón para cerrar la barra lateral */}
      {isOpen && (
        <button
          className="p-4 focus:outline-none absolute bottom-4 right-4"
          onClick={toggleSidebar}
        >
          <ChevronLeftIcon />
        </button>
      )}
    </div>
  );
};

export default SideNavBar;