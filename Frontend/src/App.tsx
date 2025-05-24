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
import CompanyDetail from './components/CompanyDetail';
import UserDetail from './components/UserDetail';
import ClientDetail from './components/ClientDetail';
import InvoiceDetail from './components/InvoiceDetail';
import ItemDetail from './components/ItemDetail';

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
         <Route
          path="/companies/:id"
          element={
            <MainLayout>
              <CompanyDetail />
            </MainLayout>
          }
        />
        <Route
          path="/settings/:id"
          element={
            <MainLayout>
              <UserDetail />
            </MainLayout>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <MainLayout>
              <ClientDetail />
            </MainLayout>
          }
        />
        <Route
          path="/invoices/:id"
          element={
            <MainLayout>
              <InvoiceDetail />
            </MainLayout>
          }
        />
        <Route
          path="/items/:id"
          element={
            <MainLayout>
              <ItemDetail />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;