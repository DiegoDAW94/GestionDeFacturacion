import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyById, getUserById } from '../services/apiservices';

const CompanyDetail: React.FC = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [ownerName, setOwnerName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (id && token) {
      getCompanyById(Number(id), token)
        .then((data) => {
          setCompany(data.company);
          setLoading(false);
          // Obtener el nombre del propietario
          if (data.company?.owner_id) {
            getUserById(data.company.owner_id, token)
              .then((user) => setOwnerName(user.name))
              .catch(() => setOwnerName('Desconocido'));
          }
        })
        .catch(() => setLoading(false));
    }
  }, [id, token]);

  if (loading) return <div>Cargando compañía...</div>;
  if (!company) return <div>No se encontró la compañía.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Información de la Compañía</h2>
      <div className="mb-2"><span className="font-semibold">Nombre:</span> {company.name}</div>
      <div className="mb-2"><span className="font-semibold">Razón social:</span> {company.legal_name}</div>
      <div className="mb-2"><span className="font-semibold">CIF:</span> {company.cif}</div>
      <div className="mb-2"><span className="font-semibold">Dirección fiscal:</span> {company.fiscal_address}</div>
      <div className="mb-2"><span className="font-semibold">Dirección social:</span> {company.social_address}</div>
      <div className="mb-2"><span className="font-semibold">Ciudad:</span> {company.city}</div>
      <div className="mb-2"><span className="font-semibold">Código postal:</span> {company.postal_code}</div>
      <div className="mb-2"><span className="font-semibold">Provincia:</span> {company.province}</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {company.email}</div>
      <div className="mb-2"><span className="font-semibold">Teléfono:</span> {company.telefono}</div>
      <div className="mb-2"><span className="font-semibold">Prefijo factura:</span> {company.invoice_prefix}</div>
      <div className="mb-2"><span className="font-semibold">Propietario:</span> {ownerName || company.owner_id}</div>
    </div>
  );
};

export default CompanyDetail;