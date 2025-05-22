import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Clients from './pages/Clients';
import NotFound from './pages/NotFound';
import MainLayout from './components/MainLayout';
import Invoice from './pages/Invoice';
import Items from './pages/Items';
import Company from './pages/Company';
import DashBoard from './pages/DashBoard';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas con MainLayout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/home"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
         <Route
          path="/create-invoice"
          element={
            <MainLayout>
              <Invoice />
            </MainLayout>
          }
        />
           <Route
          path="/items"
          element={
            <MainLayout>
              <Items />
            </MainLayout>
          }
        />
        <Route
          path="/create-company"
          element={
            <MainLayout>
              <Company />
            </MainLayout>
          }
        />
        <Route
          path="/clients"
          element={
            <MainLayout>
              <Clients />
            </MainLayout>
          }
        />
         <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashBoard />
            </MainLayout>
          }
        />
        
       
     
        {/* <Route
          path="/taxes"
          element={
            <MainLayout>
              <Taxes />
            </MainLayout>
          }
        /> */}

        {/* Rutas sin MainLayout */}
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Ruta para páginas no encontradas */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;