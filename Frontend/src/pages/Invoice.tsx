import React, { useState, useEffect } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import { getInvoices, deleteInvoice, getClients, getInvoicesByCompany, getInvoiceById, getCompanyById } from '../services/apiservices';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const baseTextStyle = { fontSize: 14, margin: 0, padding: 0, fontFamily: "Arial, sans-serif" };
const labelStyle = { ...baseTextStyle, fontWeight: "bold" };
const valueStyle = { ...baseTextStyle, fontWeight: "normal" };

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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [printInvoices, setPrintInvoices] = useState<any[]>([]);
  const [printCompanies, setPrintCompanies] = useState<any[]>([]);

  const filteredInvoices = invoices.filter(row => {
    const matchesText = Object.values(row).some(
      value =>
        value &&
        typeof value === 'string' &&
        value.toLowerCase().includes(filter.toLowerCase())
    );
    const matchesClient =
      row.client &&
      row.client.name &&
      row.client.name.toLowerCase().includes(filter.toLowerCase());

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

  const handleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInvoices.map(inv => inv.id));
    }
  };

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedIds.length === filteredInvoices.length && filteredInvoices.length > 0}
          onChange={handleSelectAll}
        />
      ),
      render: (row: any) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelect(row.id)}
        />
      ),
    },
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

  // NUEVO: Imprimir en lote respetando el estilo de InvoiceDetail
  const handlePrintSelected = async () => {
    if (!selectedIds.length) return;
    const token = localStorage.getItem('authToken');
    // 1. Obtén los datos de las facturas y sus empresas
    const invoicesData = await Promise.all(selectedIds.map(id => getInvoiceById(id, token)));
    const companiesData = await Promise.all(
      invoicesData.map(inv => getCompanyById(inv.company_id, token).then(res => res.company))
    );
    setPrintInvoices(invoicesData);
    setPrintCompanies(companiesData);

    setTimeout(async () => {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      for (let idx = 0; idx < invoicesData.length; idx++) {
        const input = document.getElementById(`invoice-print-${invoicesData[idx].id}`);
        if (input) {
          const canvas = await html2canvas(input);
          const imgData = canvas.toDataURL('image/png');
          if (idx > 0) pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        }
      }
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
      setPrintInvoices([]);
      setPrintCompanies([]);
    }, 500);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Contenedor oculto para impresión en lote */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {printInvoices.map((invoice, idx) => {
          const company = printCompanies[idx];
          const allItems = [
            ...(invoice.invoice_items || []),
            ...(invoice.custom_items
              ? invoice.custom_items.map((item: any, i: number) => ({
                  id: `custom-${i}`,
                  name: item.name || 'Personalizado',
                  description: item.description,
                  price: item.unit_price,
                  quantity: item.quantity,
                }))
              : [])
          ];
          return (
            <div
              key={invoice.id}
              id={`invoice-print-${invoice.id}`}
              style={{
                fontFamily: "Arial, sans-serif",
                color: "#222",
                background: "#fff",
                padding: 40,
                width: 595,
                minHeight: 842,
                border: "1px solid #222",
                boxSizing: "border-box",
                marginBottom: 24
              }}
            >
              {/* Cabecera */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize:28, margin:0}}>Factura</h1>
                  <div style={{ ...baseTextStyle, margin: "2px 0" }}>Nº {invoice.number}</div>
                  <div style={{ ...baseTextStyle, margin: "2px 0" }}>Fecha: {invoice.date}</div>
                  <div style={{ ...baseTextStyle, margin: "2px 0" }}>Fecha operación: {invoice.operation_date}</div>
                </div>
              </div>
              {/* Empresa emisora */}
              {company && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 28, margin: 4 }}>Empresa</h2>
                  <div><span style={labelStyle}>Nombre:</span> <span style={valueStyle}>{company.name}</span></div>
                  <div><span style={labelStyle}>CIF/NIF:</span> <span style={valueStyle}>{company.cif}</span></div>
                  <div><span style={labelStyle}>Dirección:</span> <span style={valueStyle}>{company.fiscal_address}</span></div>
                  <div><span style={labelStyle}>Ciudad:</span> <span style={valueStyle}>{company.city}</span></div>
                  <div><span style={labelStyle}>Provincia:</span> <span style={valueStyle}>{company.province}</span></div>
                  <div><span style={labelStyle}>Código postal:</span> <span style={valueStyle}>{company.postal_code}</span></div>
                  <div><span style={labelStyle}>Email:</span> <span style={valueStyle}>{company.email}</span></div>
                  <div><span style={labelStyle}>Teléfono:</span> <span style={valueStyle}>{company.telefono}</span></div>
                </div>
              )}
              {/* Datos del cliente */}
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize:28, margin:4}}>Cliente</h2>
                <div><span style={labelStyle}>Nombre:</span> <span style={valueStyle}>{invoice.client?.name}</span></div>
                <div><span style={labelStyle}>NIF:</span> <span style={valueStyle}>{invoice.client?.nif}</span></div>
                <div><span style={labelStyle}>Dirección:</span> <span style={valueStyle}>{invoice.client?.fiscal_address}</span></div>
                <div><span style={labelStyle}>Ciudad:</span> <span style={valueStyle}>{invoice.client?.city}</span></div>
                <div><span style={labelStyle}>Provincia:</span> <span style={valueStyle}>{invoice.client?.province}</span></div>
                <div><span style={labelStyle}>Código postal:</span> <span style={valueStyle}>{invoice.client?.postal_code}</span></div>
                <div><span style={labelStyle}>Email:</span> <span style={valueStyle}>{invoice.client?.email}</span></div>
              </div>
              {/* Tabla de ítems */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #222", padding: 8, background: "#f5f5f5" }}>Nombre</th>
                    <th style={{ border: "1px solid #222", padding: 8, background: "#f5f5f5" }}>Descripción</th>
                    <th style={{ border: "1px solid #222", padding: 8, background: "#f5f5f5" }}>Precio</th>
                    <th style={{ border: "1px solid #222", padding: 8, background: "#f5f5f5" }}>Cantidad</th>
                    <th style={{ border: "1px solid #222", padding: 8, background: "#f5f5f5" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item: any) => (
                    <tr key={item.id}>
                      <td style={{ fontSize:14,border: "1px solid #222", padding: 8 }}>{item.name}</td>
                      <td style={{ fontSize:14,border: "1px solid #222", padding: 8 }}>{item.description}</td>
                      <td style={{ fontSize:14,border: "1px solid #222", padding: 8 }}>{item.price} €</td>
                      <td style={{ fontSize:14,border: "1px solid #222", padding: 8 }}>{item.quantity}</td>
                      <td style={{ fontSize:14,border: "1px solid #222", padding: 8 }}>
                        {(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Totales */}
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <div><span style={labelStyle}>Base imponible:</span> <span style={valueStyle}>{invoice.base_amount} €</span></div>
                {invoice.taxes?.map((tax: any) => (
                  <div key={tax.id}>
                    <span style={labelStyle}>Impuesto {tax.name}:</span> <span style={valueStyle}>{tax.percentage}% {invoice.tax_amount} €</span>
                  </div>
                ))}
                <div style={{ fontSize: 18, marginTop: 8, fontWeight: "bold" }}><span>Total:</span> <span style={valueStyle}>{invoice.total} €</span></div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Fin contenedor oculto */}

      <h1 className="text-3xl font-bold mb-6">Gestión de Facturas</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => { setModalOpen(true); setEditInvoice(null); }}
      >
        Crear Factura
      </button>
      <button
        className="mb-4 ml-2 px-4 py-2 bg-green-600 text-white rounded"
        disabled={selectedIds.length === 0}
        onClick={handlePrintSelected}
      >
        Imprimir seleccionadas
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
        />
        <button className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded"
          onClick={() => setFilter('')}
          type="button">
          Reset Filter
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filteredInvoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Invoice;