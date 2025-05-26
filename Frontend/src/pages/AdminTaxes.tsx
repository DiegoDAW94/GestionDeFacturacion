import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import TaxesForm from '../components/TaxesForm';
import { getTaxes, deleteTax } from '../services/apiservices';

const AdminTaxes: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [taxes, setTaxes] = useState<any[]>([]);
  const token = localStorage.getItem('authToken');
  const [editTax, setEditTax] = useState<any | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (token) {
      getTaxes(token)
        .then(setTaxes)
        .catch(console.error);
    }
  }, [token]);

  const filteredTaxes = taxes.filter(tax =>
    Object.values(tax).some(
      value =>
        value &&
        typeof value === 'string' &&
        value.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'percentage', label: 'Porcentaje' },
  ];

  const handleEdit = (tax: any) => {
    setEditTax(tax);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
  const tax = taxes.find((t) => t.id === id);
  if (!tax) return;
  if (!window.confirm(`¿Seguro que quieres borrar el impuesto "${tax.name}"?`)) return;
  try {
    await deleteTax(id, token);
    const updatedTaxes = await getTaxes(token);
    setTaxes(updatedTaxes);
  } catch (error) {
    alert('Error al borrar el impuesto');
  }
};

  const handleSaved = async () => {
    setModalOpen(false);
    setEditTax(null);
    const updatedTaxes = await getTaxes(token);
    setTaxes(updatedTaxes);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Impuestos</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => { setModalOpen(true); setEditTax(null); }}
      >
        Crear Impuesto
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTax(null); }}
        title={editTax ? "Editar Impuesto" : "Crear Impuesto"}
      >
        <TaxesForm tax={editTax} onSaved={handleSaved} />
      </Modal>
      <div className="flex gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-2 py-1 border rounded w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
        />
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          onClick={() => setFilter('')}
          type="button"
        >
          Reset Filter
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filteredTaxes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminTaxes;