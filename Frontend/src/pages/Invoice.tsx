import React, { useState, useEffect } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import { getInvoices, deleteInvoice, getClients, getInvoicesByCompany } from '../services/apiservices';

const Invoice: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [editInvoice, setEditInvoice] = useState<any | null>(null);
  const token = localStorage.getItem('authToken');
const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || '{}');

  useEffect(() => {
  if (selectedCompany?.id && token) {
    Promise.all([
      getInvoicesByCompany(selectedCompany.id, token),
      getClients(token)
    ]).then(([invoices, clients]) => {
      const clientsMap = Object.fromEntries(clients.map((c: any) => [c.id, c.name]));
      const invoicesWithClientName = invoices.map((inv: any) => ({
        ...inv,
        client: { name: clientsMap[inv.client_id] || 'Desconocido' }
      }));
      setInvoices(invoicesWithClientName);
    });
  }
}, [selectedCompany?.id, token]);

  const columns = [
    { key: 'number', label: 'Número' },
    { key: 'date', label: 'Fecha' },
    { key: 'client', label: 'Cliente' },
    { key: 'total', label: 'Total' },
  ];

  const handleEdit = (invoice: any) => {
    setEditInvoice(invoice);
    setModalOpen(true);
  };

  const handleDelete = async (invoice: any) => {
    if (!window.confirm(`¿Seguro que quieres borrar la factura "${invoice.number}"?`)) return;
    try {
      await deleteInvoice(invoice.id, token);
      const updatedInvoices = await getInvoices(token);
      setInvoices(updatedInvoices);
    } catch (error) {
      alert('Error al borrar la factura');
    }
  };

  const handleSaved = async () => {
    setModalOpen(false);
    setEditInvoice(null);
    const updatedInvoices = await getInvoices(token);
    setInvoices(updatedInvoices);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Facturas</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => { setModalOpen(true); setEditInvoice(null); }}
      >
        Crear Factura
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditInvoice(null); }}
        title={editInvoice ? "Editar Factura" : "Crear Factura"}
      >
        <InvoiceForm invoice={editInvoice} onSaved={handleSaved} />
      </Modal>
      <DataTable
        columns={columns}
        data={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Invoice;