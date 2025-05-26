import React, { useState, useEffect } from "react";
import ItemForm from "../components/ItemForm";
import Modal from "../components/Modal";
import DataTable from "../components/DataTable";
import { getAllItems, deleteItem } from "../services/apiservices";
import { Link } from "react-router-dom";

const AdminItems: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const token = localStorage.getItem("authToken");
  const [editItem, setEditItem] = useState<any | null>(null);
  const [filter, setFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (token) {
      getAllItems(token).then(setItems).catch(console.error);
    }
  }, [token]);

  const filteredItems = items.filter((row) => {
    const matchesText = Object.values(row).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(filter.toLowerCase())
    );

    let matchesPrice = true;
    if (minPrice) matchesPrice = Number(row.price) >= Number(minPrice);
    if (maxPrice)
      matchesPrice = matchesPrice && Number(row.price) <= Number(maxPrice);

    return matchesText && matchesPrice;
  });

  const columns = [
    {
      key: "name",
      label: "Nombre",
      render: (row: any) => (
        <Link
          to={`/items/${row.id}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {row.name}
        </Link>
      ),
    },
    { key: "description", label: "Descripción" },
    { key: "price", label: "Precio" },
    { key: "company_id", label: "ID Compañía" },
  ];

  const handleEdit = (item: any) => {
    setEditItem(item);
    setModalOpen(true);
  };

 const handleDelete = async (id: number) => {
  if (!token) {
    alert(
      "No hay token de autenticación. Por favor, inicia sesión de nuevo."
    );
    return;
  }
  const item = items.find((i) => i.id === id);
  if (!item) return;
  if (!window.confirm(`¿Seguro que quieres borrar el ítem "${item.name}"?`))
    return;
  try {
    await deleteItem(id, token!);
    const updatedItems = await getAllItems(token!);
    setItems(updatedItems);
  } catch (error) {
    alert("Error al borrar el ítem");
  }
};

const handleSaved = async () => {
  if (!token) {
    alert(
      "No hay token de autenticación. Por favor, inicia sesión de nuevo."
    );
    return;
  }
  setModalOpen(false);
  setEditItem(null);
  const updatedItems = await getAllItems(token!);
  setItems(updatedItems);
};

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Ítems (Admin)</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setModalOpen(true);
          setEditItem(null);
        }}
      >
        Crear
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        title={editItem ? "Editar Ítem" : "Crear Ítem"}
      >
        <ItemForm item={editItem} onSaved={handleSaved} />
      </Modal>
      <div className="flex gap-4 items-center mb-4">
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-2 py-1 border rounded w-24"
          min="0"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-2 py-1 border rounded w-24"
          min="0"
        />
        <input
          type="text"
          placeholder="Buscar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-2 py-1 border rounded w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
        />
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          onClick={() => {
            setFilter("");
            setMinPrice("");
            setMaxPrice("");
          }}
          type="button"
        >
          Reset Filter
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminItems;
