import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ClientForm from "../components/ClientForm";
import {
  getClients,
  deleteClient,
  getClientsByCompany,
} from "../services/apiservices";
import { Link } from "react-router-dom";

const Clients: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [editClient, setEditClient] = useState<any | null>(null);
  const token = localStorage.getItem("authToken");
  const selectedCompany = JSON.parse(
    localStorage.getItem("selectedCompany") || "{}"
  );
  const [filter, setFilter] = useState("");
  const filteredClients = clients.filter((row) =>
    Object.values(row).some(
      (value) =>
        value && value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  useEffect(() => {
    if (selectedCompany?.id && token) {
      getClientsByCompany(selectedCompany.id, token)
        .then(setClients)
        .catch(console.error);
    }
  }, [selectedCompany?.id, token]);

  const columns = [
    {
      key: "name",
      label: "Nombre",
      render: (row: any) => (
        <Link
          to={`/clients/${row.id}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {row.name}
        </Link>
      ),
    },
    { key: "nif", label: "NIF" },
    { key: "fiscal_address", label: "Dirección fiscal" },
    { key: "email", label: "Email" },
  ];

  const handleEdit = (client: any) => {
    setEditClient(client);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      alert(
        "No hay token de autenticación. Por favor, inicia sesión de nuevo."
      );
      return;
    }
    const client = clients.find((c) => c.id === id);
    if (!client) return;
    if (
      !window.confirm(`¿Seguro que quieres borrar el cliente "${client.name}"?`)
    )
      return;
    try {
      await deleteClient(id, token!);
      const updatedClients = await getClients(token!);
      setClients(updatedClients);
    } catch (error) {
      alert("Error al borrar el cliente");
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
    setEditClient(null);
    const updatedClients = await getClients(token!);
    setClients(updatedClients);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setModalOpen(true);
          setEditClient(null);
        }}
      >
        Crear Cliente
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditClient(null);
        }}
        title={editClient ? "Editar Cliente" : "Crear Cliente"}
      >
        <ClientForm client={editClient} onSaved={handleSaved} />
      </Modal>
      <input
        type="text"
        placeholder="Buscar..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="m-4 mb-4 px-2 py-1 border rounded w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
      />
      <button
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded"
        onClick={() => setFilter("")}
        type="button"
      >
        Reset Filter
      </button>
      <DataTable
        columns={columns}
        data={filteredClients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Clients;
