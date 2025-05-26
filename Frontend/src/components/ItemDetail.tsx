import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getItemById } from '../services/apiservices';

const ItemDetail: React.FC = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (id && token) {
      getItemById(Number(id), token)
        .then((data) => {
          setItem(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, token]);

  if (loading) return <div>Cargando ítem...</div>;
  if (!item) return <div>No se encontró el ítem.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Información del Ítem</h2>
      <div className="mb-2"><span className="font-semibold">Nombre:</span> {item.name}</div>
      <div className="mb-2"><span className="font-semibold">Descripción:</span> {item.description}</div>
      <div className="mb-2"><span className="font-semibold">Precio:</span> {item.price} €</div>
      </div>
  );
};

export default ItemDetail;