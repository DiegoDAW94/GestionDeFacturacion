import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { Portrait } from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import { AttachMoney } from '@mui/icons-material';
import SecurityIcon from '@mui/icons-material/Security';

const adminSections = [
  {
    title: 'Dashboard Admin',
    description: 'Visión general y acceso rápido a la administración.',
    icon: <DashboardIcon className="text-blue-500" fontSize="large" />,
  },
  {
    title: 'Gestión de usuarios',
    description: 'Administra y controla los usuarios de la aplicación.',
    icon: <PeopleIcon className="text-blue-500" fontSize="large" />,
  },
  {
    title: 'Gestión de clientes',
    description: 'Gestiona los clientes registrados en el sistema.',
    icon: <Portrait className="text-blue-500" fontSize="large" />,
  },
  {
    title: 'Gestión de compañías',
    description: 'Administra las compañías y sus datos asociados.',
    icon: <BusinessIcon className="text-blue-500" fontSize="large" />,
  },
  {
    title: 'Gestión de facturas',
    description: 'Consulta, crea y edita las facturas de la aplicación.',
    icon: <ReceiptIcon className="text-blue-500" fontSize="large" />,
  },
  {
    title: 'Gestión de ítems',
    description: 'Administra los productos o servicios (ítems) disponibles.',
    icon: <InventoryIcon className="text-blue-500" fontSize="large" />,
  },
  {
    title: 'Gestión de impuestos',
    description: 'Administra los impuestos aplicables a las facturas.',
    icon: <AttachMoney className="text-blue-500" fontSize="large" />,
  },
  {
    title: 'Gestión de roles',
    description: 'Gestiona los roles y permisos de los usuarios.',
    icon: <SecurityIcon className="text-blue-500" fontSize="large" />,
  },
];

const AdminPanel: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start hover:shadow-xl transition-shadow border border-gray-200"
          >
            <div className="mb-4">{section.icon}</div>
            <h2 className="text-xl font-semibold mb-2 text-blue-700">{section.title}</h2>
            <p className="text-gray-700">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;