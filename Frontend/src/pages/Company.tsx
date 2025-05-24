import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import CompanyForm from '../components/CompanyForm';
import { getCompanies, deleteCompany } from '../services/apiservices';
import { Link } from 'react-router-dom';

const Company: React.FC<{ setUser?: any, setSelectedCompany?: any, selectedCompany?: any }> = ({
  setUser,
  setSelectedCompany,
  selectedCompany,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [editCompany, setEditCompany] = useState<any | null>(null);
  const token = localStorage.getItem('authToken');
  

  useEffect(() => {
    if (token) {
      getCompanies(token)
        .then((res) => setCompanies(res.companies || res))
        .catch(console.error);
    }
  }, [token]);

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row: any) => (
        <Link
          to={`/companies/${row.id}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {row.name}
        </Link>
      ),
    },
    { key: 'cif', label: 'NIF' },
    { key: 'fiscal_address', label: 'Dirección fiscal' },
    { key: 'email', label: 'Email' },
  ];

  const handleEdit = (company: any) => {
    setEditCompany(company);
    setModalOpen(true);
  };

  const handleDelete = async (company: any) => {
    if (!window.confirm(`¿Seguro que quieres borrar la compañía "${company.name}"?`)) return;
    try {
      await deleteCompany(company.id, token);
      const updatedCompanies = await getCompanies(token);
      setCompanies(updatedCompanies.companies || updatedCompanies);

      // Si la compañía borrada era la seleccionada, selecciona otra
      if (selectedCompany && selectedCompany.id === company.id) {
        const allCompanies = updatedCompanies.companies || updatedCompanies;
        const newSelected = allCompanies.length > 0 ? allCompanies[0] : null;
        if (setSelectedCompany) setSelectedCompany(newSelected);
        if (newSelected) {
          localStorage.setItem('selectedCompany', JSON.stringify(newSelected));
        } else {
          localStorage.removeItem('selectedCompany');
        }
      }
      if (setUser) setUser((prev: any) => ({ ...prev, companies: updatedCompanies.companies || updatedCompanies }));
    } catch (error) {
      alert('Error al borrar la compañía');
    }
  };

  const handleSaved = async (newCompany: any) => {
    setModalOpen(false);
    setEditCompany(null);
    const updatedCompanies = await getCompanies(token);
    setCompanies(updatedCompanies.companies || updatedCompanies);

    // Busca la nueva compañía en la lista actualizada
    const allCompanies = updatedCompanies.companies || updatedCompanies;
    const created = allCompanies.find(
      (c: any) => c.id === newCompany.id || (c.name === newCompany.name && c.cif === newCompany.cif)
    );
    if (created) {
      localStorage.setItem('selectedCompany', JSON.stringify(created));
      if (setSelectedCompany) setSelectedCompany(created);
      if (setUser) setUser((prev: any) => ({ ...prev, companies: allCompanies }));
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Compañías</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setModalOpen(true);
          setEditCompany(null);
        }}
      >
        Crear Compañía
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditCompany(null);
        }}
        title={editCompany ? 'Editar Compañía' : 'Crear Compañía'}
      >
        <CompanyForm company={editCompany} onSaved={handleSaved} />
      </Modal>
      <DataTable
        columns={columns}
        data={companies.companies || companies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Company;