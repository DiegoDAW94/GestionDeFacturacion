import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SideNavBar from './SideNavBar';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string } | null>(null); // Estado del usuario logueado
  const navigate = useNavigate();

  // Función para cargar los datos del usuario desde localStorage
  const loadUserFromLocalStorage = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData)); // Establecer los datos del usuario
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Eliminar el token del almacenamiento local
    localStorage.removeItem('user'); // Eliminar los datos del usuario del almacenamiento local
    setUser(null); // Limpiar el estado del usuario
    navigate('/login'); // Redirigir al login
  };

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    loadUserFromLocalStorage();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Barra superior */}
      <div className="bg-gray-800 text-white fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 z-10">
        {/* Enlace a la página de inicio */}
        <Link to="/" className="text-blue-400 text-xl font-bold hover:underline">
          Invoquio
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Bienvenido, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Barra lateral */}
      <SideNavBar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col ml-16 mt-16">
        <main className="flex-1 p-4 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;