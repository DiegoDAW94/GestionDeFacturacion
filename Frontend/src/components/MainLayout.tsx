import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import DropdownSelector from './DropdownSelector';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const navigate = useNavigate();

  // Cargar usuario y compañía seleccionada al montar
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      const storedCompany = localStorage.getItem('selectedCompany');
      if (storedCompany) {
        setSelectedCompany(JSON.parse(storedCompany));
      } else if (parsedUser.companies && parsedUser.companies.length > 0) {
        setSelectedCompany(parsedUser.companies[0]);
        localStorage.setItem('selectedCompany', JSON.stringify(parsedUser.companies[0]));
      }
    }
  }, []);

  // Actualizar compañías y compañía seleccionada cuando cambian en el backend
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('http://127.0.0.1:8000/api/my-companies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.companies) {
            setUser((prev: any) => ({ ...prev, companies: data.companies }));

            // Sincronizar selectedCompany con la nueva lista
            const storedCompany = localStorage.getItem('selectedCompany');
            let companyToSelect = null;
            if (storedCompany) {
              const storedCompanyObj = JSON.parse(storedCompany);
              companyToSelect = data.companies.find((c: any) => c.id === storedCompanyObj.id);
            }
            if (!companyToSelect && data.companies.length > 0) {
              companyToSelect = data.companies[0];
            }
            setSelectedCompany(companyToSelect);
            if (companyToSelect) {
              localStorage.setItem('selectedCompany', JSON.stringify(companyToSelect));
            }
          }
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedCompany');
    setUser(null);
    setSelectedCompany(null);
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Barra superior */}
      <div className="bg-gray-800 text-white fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 z-10">
        <Link to="/" className="text-blue-400 text-xl font-bold hover:underline">
          Invoquio
        </Link>
        <div className="flex items-center text-white space-x-4">
          {user ? (
            <>
              <span>Bienvenido, {user.name}</span>
              {user.companies && user.companies.length > 0 && (
                <DropdownSelector
                  options={user.companies}
                  value={user.companies.find((c: any) => c.id === selectedCompany?.id) || null}
                  onChange={(company) => {
                    setSelectedCompany(company);
                    localStorage.setItem('selectedCompany', JSON.stringify(company));
                  }}
                />
              )}
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
        <main className="flex-1 p-4 bg-gray-100">
          {React.isValidElement(children)
            ? React.cloneElement(children, {
                selectedCompany,
                setSelectedCompany,
                setUser,
                key: selectedCompany?.id,
              })
            : children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;