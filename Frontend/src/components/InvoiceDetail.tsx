import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvoiceById } from '../services/apiservices';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (id && token) {
      getInvoiceById(Number(id), token)
        .then((data) => {
          setInvoice(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, token]);

  if (loading) return <div>Cargando factura...</div>;
  if (!invoice) return <div>No se encontró la factura.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Factura {invoice.number}</h2>
         <div className="mb-2"><span className="font-semibold">Fecha:</span> {invoice.date}</div>
      <div className="mb-2"><span className="font-semibold">Fecha operación:</span> {invoice.operation_date}</div>
        <h3 className="text-xl font-bold mt-6 mb-2">Cliente</h3>
      <div className="mb-2"><span className="font-semibold">Nombre:</span> {invoice.client?.name}</div>
      <div className="mb-2"><span className="font-semibold">NIF:</span> {invoice.client?.nif}</div>
      <div className="mb-2"><span className="font-semibold">Dirección:</span> {invoice.client?.fiscal_address}</div>
      <div className="mb-2"><span className="font-semibold">Ciudad:</span> {invoice.client?.city}</div>
      <div className="mb-2"><span className="font-semibold">Provincia:</span> {invoice.client?.province}</div>
      <div className="mb-2"><span className="font-semibold">Código postal:</span> {invoice.client?.postal_code}</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {invoice.client?.email}</div>
 <h3 className="text-xl font-bold mt-6 mb-2">Ítems</h3>
      <ul className="mb-4">
        {invoice.invoice_items?.map((item: any) => (
          <li key={item.id} className="mb-2 border-b pb-2">
            <div><span className="font-semibold">Nombre:</span> {item.name}</div>
            <div><span className="font-semibold">Descripción:</span> {item.description}</div>
            <div><span className="font-semibold">Precio:</span> {item.price} €</div>
            <div><span className="font-semibold">Cantidad:</span> {item.quantity}</div>
          </li>
        ))}
      </ul>
      
     
      <div className="mb-2"><span className="font-semibold">Base imponible:</span> {invoice.base_amount} €</div>
        <div className="mb-2">
       <ul>
        {invoice.taxes?.map((tax: any) => (
          <li key={tax.id}>
            <span className="font-semibold">Impuestos: {tax.name}:</span> {tax.percentage}% {invoice.tax_amount} €
          </li>
        ))}
      </ul>
      </div>
       <div className="mb-2"><span className="font-semibold">Total:</span> {invoice.total} €</div>
     
      
     
     
    </div>
  );
};

export default InvoiceDetail;