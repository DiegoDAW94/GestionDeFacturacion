import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireCompany: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const selectedCompany = localStorage.getItem('selectedCompany');
  if (!selectedCompany) {
    return <Navigate to="/create-company" replace />;
  }
  return <>{children}</>;
};

export default RequireCompany;