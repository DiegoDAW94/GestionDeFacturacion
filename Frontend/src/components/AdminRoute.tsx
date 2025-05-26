import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = Array.isArray(user.roles) && user.roles.some(
    (role: any) => role.pivot?.role_id === 1
  );
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default AdminRoute;