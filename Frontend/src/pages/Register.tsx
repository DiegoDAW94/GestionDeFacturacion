import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link para la navegación
import RegisterForm from '../components/RegisterForm'; // Importar el componente RegisterForm

const Register: React.FC = () => {
  return (
   <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
         {/* Barra superior */}
         <div className="bg-gray-800 text-white fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 z-10">
           <Link to="/" className="text-blue-400 text-xl font-bold hover:underline">
             Invoquio
           </Link>
           <div className="flex items-center text-white space-x-4">
             {location.pathname !== '/login' && (
               <Link
                 to="/login"
                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
               >
                 Login
               </Link>
             )}
             {location.pathname !== '/register' && (
               <Link
                 to="/register"
                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
               >
                 Register
               </Link>
             )}
           </div>
         </div>
      {/* Contenedor del formulario */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrarse</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;