import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import DataTable from "../components/DataTable";
import UsersForm from "../components/UsersForm"; // <-- Importa tu formulario
import { getUsers, deleteUser } from "../services/apiservices";

const AdminUsers: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const token = localStorage.getItem("authToken");
  const [editUser, setEditUser] = useState<any | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (token) {
      getUsers(token).then(setUsers).catch(console.error);
    }
  }, [token]);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "created_at", label: "Creado" },
  ];

  const handleEdit = (user: any) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      alert(
        "No hay token de autenticación. Por favor, inicia sesión de nuevo."
      );
      return;
    }
    const user = users.find((u) => u.id === id);
    if (!user) return;
    if (
      !window.confirm(`¿Seguro que quieres borrar el usuario "${user.name}"?`)
    )
      return;
    try {
      await deleteUser(id, token!);
      const updatedUsers = await getUsers(token!);
      setUsers(updatedUsers);
    } catch (error) {
      alert("Error al borrar el usuario");
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
    setEditUser(null);
    const updatedUsers = await getUsers(token!);
    setUsers(updatedUsers);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios (Admin)</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setModalOpen(true);
          setEditUser(null);
        }}
      >
        Crear
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditUser(null);
        }}
        title={editUser ? "Editar Usuario" : "Crear Usuario"}
      >
        <UsersForm user={editUser} onSaved={handleSaved} />
      </Modal>
      <div className="flex gap-4 items-center mb-4">
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
          }}
          type="button"
        >
          Reset Filter
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminUsers;
