import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ClientForm from '../components/ClientForm';
import { getClients, deleteClient, getClientsByCompany } from '../services/apiservices';

const Clients: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [editClient, setEditClient] = useState<any | null>(null);
  const token = localStorage.getItem('authToken');
 const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || '{}');

  useEffect(() => {
    if (selectedCompany?.id && token) {
      getClientsByCompany(selectedCompany.id, token)
        .then(setClients)
        .catch(console.error);
    }
  }, [selectedCompany?.id, token]);

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'nif', label: 'NIF' },
    { key: 'fiscal_address', label: 'Dirección fiscal' },
    { key: 'email', label: 'Email' },
  ];

  const handleEdit = (client: any) => {
    setEditClient(client);
    setModalOpen(true);
  };

  const handleDelete = async (client: any) => {
    if (!window.confirm(`¿Seguro que quieres borrar el cliente "${client.name}"?`)) return;
    try {
      await deleteClient(client.id, token);
      const updatedClients = await getClients(token);
      setClients(updatedClients);
    } catch (error) {
      alert('Error al borrar el cliente');
    }
  };

  const handleSaved = async () => {
    setModalOpen(false);
    setEditClient(null);
    const updatedClients = await getClients(token);
    setClients(updatedClients);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => { setModalOpen(true); setEditClient(null); }}
      >
        Crear Cliente
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditClient(null); }}
        title={editClient ? "Editar Cliente" : "Crear Cliente"}
      >
        <ClientForm client={editClient} onSaved={handleSaved} />
      </Modal>
      <DataTable
        columns={columns}
        data={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Clients;