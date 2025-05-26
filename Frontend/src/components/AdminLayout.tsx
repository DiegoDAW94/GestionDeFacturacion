import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import { AttachMoney, Portrait } from '@mui/icons-material';

// Barra lateral específica para admin
const AdminSideNavBar: React.FC<{ expanded: boolean; onToggle: (expanded: boolean) => void }> = ({
  expanded,
  onToggle,
}) => {
  return (
    <div
      className={`${
        expanded ? 'w-64' : 'w-16'
      } bg-gray-900 h-screen text-white transition-all duration-300 fixed top-16`}
    >
      {/* Botón para alternar la barra lateral */}
      <div className="flex justify-between items-center p-4">
        {!expanded ? (
          <button className="focus:outline-none" onClick={() => onToggle(true)}>
            <span>&#9776;</span>
          </button>
        ) : (
          <button className="focus:outline-none ml-auto" onClick={() => onToggle(false)}>
            <span>&#10005;</span>
          </button>
        )}
      </div>
      {/* Navegación admin */}
      <nav className="mt-4">
        <ul>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/admin" className="flex items-center w-full">
              <DashboardIcon />
              {expanded && <span className="ml-2">Dashboard Admin</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/admin/users" className="flex items-center w-full">
              <PeopleIcon />
              {expanded && <span className="ml-2">Usuarios</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/admin/clientes" className="flex items-center w-full">
              <Portrait/>
              {expanded && <span className="ml-2">Clientes</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/admin/companies" className="flex items-center w-full">
              <BusinessIcon />
              {expanded && <span className="ml-2">Compañías</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/admin/invoices" className="flex items-center w-full">
              <ReceiptIcon />
              {expanded && <span className="ml-2">Facturas</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/admin/items" className="flex items-center w-full">
              <InventoryIcon />
              {expanded && <span className="ml-2">Items</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/admin/taxes" className="flex items-center w-full">
              <AttachMoney />
              {expanded && <span className="ml-2">Taxes</span>}
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <Link to="/admin/roles" className="flex items-center w-full">
              <SecurityIcon />
              {expanded && <span className="ml-2">Roles</span>}
            </Link>
          </li>
          {/* Añade más enlaces de administración aquí */}
        </ul>
      </nav>
    </div>
  );
};

const SIDENAV_WIDTH = 64;
const SIDENAV_WIDTH_EXPANDED = 240;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sideNavExpanded, setSideNavExpanded] = useState(() => {
    const stored = localStorage.getItem('adminSideNavExpanded');
    return stored ? JSON.parse(stored) : false;
  });
  const navigate = useNavigate();

  const handleSideNavToggle = (expanded: boolean) => {
    setSideNavExpanded(expanded);
    localStorage.setItem('adminSideNavExpanded', JSON.stringify(expanded));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedCompany');
    navigate('/login');
  };

  const mainMarginLeft = sideNavExpanded ? SIDENAV_WIDTH_EXPANDED : SIDENAV_WIDTH;

  return (
    <div className="flex h-screen">
      {/* Barra superior */}
      <div className="bg-gray-900 text-white fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 z-10">
        <Link to="/admin" className="text-blue-400 text-xl font-bold hover:underline">
          AdminPanel
        </Link>
        <div className="flex items-center text-white space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Barra lateral admin */}
      <AdminSideNavBar expanded={sideNavExpanded} onToggle={handleSideNavToggle} />

      {/* Contenido principal */}
      <div
        className="flex-1 flex flex-col mt-16 transition-all duration-300"
        style={{ marginLeft: mainMarginLeft }}
      >
        <main className="flex-1 p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;