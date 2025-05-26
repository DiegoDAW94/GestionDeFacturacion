import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import RolesForm from '../components/RolesForm';
import { getRoles, deleteRole } from '../services/apiservices';

const AdminRoles: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [editRole, setEditRole] = useState<any | null>(null);
  const [filter, setFilter] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      getRoles(token)
        .then(setRoles)
        .catch(console.error);
    }
  }, [token]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
  ];

  const handleEdit = (role: any) => {
    setEditRole(role);
    setModalOpen(true);
  };

 const handleDelete = async (id: number) => {
  const role = roles.find((r) => r.id === id);
  if (!role) return;
  if (!window.confirm(`¿Seguro que quieres borrar el rol "${role.name}"?`)) return;
  try {
    await deleteRole(id, token);
    const updatedRoles = await getRoles(token);
    setRoles(updatedRoles);
  } catch (error) {
    alert('Error al borrar el rol');
  }
};

  const handleSaved = async () => {
    setModalOpen(false);
    setEditRole(null);
    const updatedRoles = await getRoles(token);
    setRoles(updatedRoles);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Roles</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => { setModalOpen(true); setEditRole(null); }}
      >
        Crear Rol
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditRole(null); }}
        title={editRole ? "Editar Rol" : "Crear Rol"}
      >
        <RolesForm role={editRole} onSaved={handleSaved} />
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
        data={filteredRoles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminRoles;