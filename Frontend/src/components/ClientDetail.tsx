import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClientById } from '../services/apiservices' // Asegúrate de que esta ruta sea correcta

const ClientDetail: React.FC = () => {  
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (id && token) {
      getClientById(Number(id), token)
        .then((data) => {
          setClient(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, token]);

  if (loading) return <div>Cargando cliente...</div>;
  if (!client) return <div>No se encontró el cliente.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
      <div className="mb-2"><span className="font-semibold">Nombre:</span> {client.name}</div>
      <div className="mb-2"><span className="font-semibold">NIF:</span> {client.nif}</div>
      <div className="mb-2"><span className="font-semibold">Dirección fiscal:</span> {client.fiscal_address}</div>
      <div className="mb-2"><span className="font-semibold">Ciudad:</span> {client.city}</div>
      <div className="mb-2"><span className="font-semibold">Código postal:</span> {client.postal_code}</div>
      <div className="mb-2"><span className="font-semibold">Provincia:</span> {client.province}</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {client.email}</div>
    </div>
  );
};

export default ClientDetail;