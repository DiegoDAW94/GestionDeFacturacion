import React from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SideNavBarProps {
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
}

const SideNavBar: React.FC<SideNavBarProps> = ({ expanded, onToggle }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  return (
    <div
      className={`${
        expanded ? 'w-64' : 'w-16'
      } bg-gray-800 h-screen text-white transition-all duration-300 fixed top-16`}
    >
      {/* Botón para alternar la barra lateral */}
      <div className="flex justify-between items-center p-4">
        {!expanded ? (
          <button
            className="focus:outline-none"
            onClick={() => onToggle(true)}
          >
            <ChevronRightIcon />
          </button>
        ) : (
          <button
            className="focus:outline-none ml-auto"
            onClick={() => onToggle(false)}
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
              {expanded && <span className="ml-2">Dashboard</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/clients" className="flex items-center w-full">
              <PeopleIcon />
              {expanded && <span className="ml-2">Clientes</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/create-invoice" className="flex items-center w-full">
              <ReceiptIcon />
              {expanded && <span className="ml-2">Facturas</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/items" className="flex items-center w-full">
              <InventoryIcon />
              {expanded && <span className="ml-2">Artículos</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/create-company" className="flex items-center w-full">
              <BusinessIcon />
              {expanded && <span className="ml-2">Compañías</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to={`/settings/${userId}`} className="flex items-center w-full">
              <SettingsIcon />
              {expanded && <span className="ml-2">Configuración</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNavBar;