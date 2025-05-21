import React from 'react';
import ClientForm from '../components/ClientForm';

const Items: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <ClientForm />
    </div>
  );
};

export default Items;