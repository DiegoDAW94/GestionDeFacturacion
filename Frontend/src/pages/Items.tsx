import React from 'react';
import ItemForm from '../components/ItemForm';

const Items: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Ítems</h1>
      <ItemForm />
    </div>
  );
};

export default Items;