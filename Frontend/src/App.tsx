import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import PrintedInvoices from './pages/PrintedInvoices';
import PrintedInvoiceDetails from './components/PrintedInvoiceDetail';
import ProtectedRoute from './components/ProtectedRoute';
import RequireCompany from './components/RequireCompany';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminPanel from './pages/AdminPanel';
import AdminUsers from './pages/AdminUsers';
import AdminClientes from './pages/AdminClientes';
import AdminCompanies from './pages/AdminCompanies';
import AdminInvoices from './pages/AdminInvoices';
import AdminTaxes from './pages/AdminTaxes';
import AdminRoles from './pages/AdminRoles';
import AdminItems from './pages/AdminItems';



const AppRouter: React.FC = () => {
  return (
    <Router basename="/app">
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout>
                  <AdminPanel />
                </AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout>
                  <AdminClientes />
                </AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout>
                  <AdminCompanies />
                </AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/items"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout>
                  <AdminItems />
                </AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/invoices"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout>
                  <AdminInvoices />
                </AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/taxes"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout>
                  <AdminTaxes />
                </AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout>
                  <AdminRoles />
                </AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <MainLayout>
               <DashBoard />
            </MainLayout>
          }
        />
        <Route
          path="/home"
          element={
            <MainLayout>
              <DashBoard />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/create-invoice"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <Invoice />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <Items />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-company"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Company />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <Clients />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies/:id"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <CompanyDetail />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/:id"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <UserDetail />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <ClientDetail />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices/:id"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <InvoiceDetail />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices/printed"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <PrintedInvoices />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices/printed/:id"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <PrintedInvoiceDetails />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:id"
          element={
            <ProtectedRoute>
              <RequireCompany>
              <MainLayout>
                <ItemDetail />
              </MainLayout>
              </RequireCompany>
            </ProtectedRoute>
          }
        />

        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
