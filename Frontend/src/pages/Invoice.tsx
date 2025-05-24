import React, { useState, useEffect } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import { getInvoices, deleteInvoice, getClients, getInvoicesByCompany } from '../services/apiservices';
import { Link } from 'react-router-dom';

const Invoice: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [editInvoice, setEditInvoice] = useState<any | null>(null);
  const token = localStorage.getItem('authToken');
  const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || '{}');
  const [filter, setFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const filteredInvoices = invoices.filter(row => {
  // Filtrado por texto en campos directos
  const matchesText = Object.values(row).some(
    value =>
      value &&
      typeof value === 'string' &&
      value.toLowerCase().includes(filter.toLowerCase())
  );

  // Filtrado por nombre de cliente
  const matchesClient =
    row.client &&
    row.client.name &&
    row.client.name.toLowerCase().includes(filter.toLowerCase());

  // ... (aquí tu filtrado por fecha y precio)
  let matchesDate = true;
  if (startDate) matchesDate = row.date >= startDate;
  if (endDate) matchesDate = matchesDate && row.date <= endDate;

  let matchesPrice = true;
  if (minPrice) matchesPrice = Number(row.total) >= Number(minPrice);
  if (maxPrice) matchesPrice = matchesPrice && Number(row.total) <= Number(maxPrice);

  return (matchesText || matchesClient) && matchesDate && matchesPrice;
});

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
  {
    key: 'number',
    label: 'Número',
    render: (row: any) => (
      <Link
        to={`/invoices/${row.id}`}
        className="text-blue-600 underline hover:text-blue-800"
      >
        {row.number}
      </Link>
    ),
  },
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
      <div className="flex gap-4 items-center mb-4">
  <input
    type="date"
    value={startDate}
    onChange={e => setStartDate(e.target.value)}
    className="px-2 py-1 border rounded"
  />
  <span>a</span>
  <input
    type="date"
    value={endDate}
    onChange={e => setEndDate(e.target.value)}
    className="px-2 py-1 border rounded"
  />
  <input
    type="number"
    placeholder="Precio mínimo"
    value={minPrice}
    onChange={e => setMinPrice(e.target.value)}
    className="px-2 py-1 border rounded w-24"
    min="0"
  />
  <input
    type="number"
    placeholder="Precio máximo"
    value={maxPrice}
    onChange={e => setMaxPrice(e.target.value)}
    className="px-2 py-1 border rounded w-24"
    min="0"
  />
  <input
    type="text"
    placeholder="Buscar..."
    value={filter}
    onChange={e => setFilter(e.target.value)}
    className="px-2 py-1 border rounded w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
  /><button className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded" 
        onClick={() => setFilter('')}
        type="button">
          Reset Filter
      </button>
</div>
      
      <DataTable 
      columns={columns} 
      data={filteredInvoices} 
      onEdit={handleEdit} 
      onDelete={handleDelete} />
    </div>
  );
};

export default Invoice;