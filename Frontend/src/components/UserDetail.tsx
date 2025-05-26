
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../services/apiservices';
import RegisterWorkerForm from '../components/RegisterWorkerForm';
import Modal from './Modal';

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    if (id && token) {
      getUserById(Number(id), token)
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, token]);

  if (loading) return <div>Cargando usuario...</div>;
  if (!user) return <div>No se encontró el usuario.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded shadow p-6">
        <button
      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      onClick={() => setModalOpen(true)}
    >
      Registrar trabajador
    </button>
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Registrar nuevo trabajador"
    >
      <RegisterWorkerForm
        companies={user.companies || []}
        onSuccess={() => {
          setModalOpen(false);
        }}
      />
    </Modal>
       <div className="max-w-xl mx-auto mt-10 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Información del Usuario</h2>
      <div className="mb-2"><span className="font-semibold">Nombre:</span> {user.name}</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
      
      

      <h3 className="text-xl font-bold mt-6 mb-2">Compañías</h3>
      <ul>
        {user.companies?.map((company: any) => (
          <li key={company.id} className="mb-2 border-b pb-2">
            <div><span className="font-semibold">Nombre:</span> {company.name}</div>
            <div><span className="font-semibold">CIF:</span> {company.cif}</div>
            <div><span className="font-semibold">Email:</span> {company.email}</div>
            <div>
  <span className="font-semibold">
    {user.roles
      ?.filter((role: any) => role.pivot?.company_id === company.id)
      .map((role: any) => (
        <div key={role.id}>
          <span className="font-semibold">Rol:</span>{" "}
          <span className="font-normal">{role.name}</span>
        </div>
      ))}
  </span>
</div>
          </li>
        ))}
      </ul>
    </div>
      
    </div>
  );
};

export default UserDetail;