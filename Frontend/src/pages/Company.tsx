import React from 'react';
import CompanyForm from '../components/CompanyForm';

const Company: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Compañías</h1>
      <CompanyForm />
    </div>
  );
};

export default Company;