import React, { useState, useEffect } from 'react';
import ItemForm from '../components/ItemForm';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import { getItemsByCompany, deleteItem } from '../services/apiservices';

const Items: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const token = localStorage.getItem('authToken');
  const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || '{}');
  const [editItem, setEditItem] = useState<any | null>(null);

  useEffect(() => {
    if (selectedCompany?.id && token) {
      getItemsByCompany(selectedCompany.id, token)
        .then(setItems)
        .catch(console.error);
    }
  }, [selectedCompany?.id, token]);

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'price', label: 'Precio' },
  ];

 const handleEdit = (item: any) => {
  console.log('Edit item:', item);
  setEditItem(item);
  setModalOpen(true);
};

  const handleDelete = async (item: any) => {
  console.log('Intentando borrar:', item);
  if (!window.confirm(`¿Seguro que quieres borrar el ítem "${item.name}"?`)) return;
  try {
    await deleteItem(item.id, token);
    const updatedItems = await getItemsByCompany(selectedCompany.id, token);
    setItems(updatedItems);
  } catch (error) {
    alert('Error al borrar el ítem');
  }
};

  // Cuando se guarda (crea o edita), refresca y cierra modal
  const handleSaved = async () => {
    setModalOpen(false);
    setEditItem(null);
    const updatedItems = await getItemsByCompany(selectedCompany.id, token);
    setItems(updatedItems);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Ítems</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => { setModalOpen(true); setEditItem(null); }}
      >
        Crear
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        title={editItem ? "Editar Ítem" : "Crear Ítem"}
      >
        <ItemForm item={editItem} onSaved={handleSaved} />
      </Modal>
      <DataTable
        columns={columns}
        data={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Items;