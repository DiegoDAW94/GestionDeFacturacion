import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPrintedInvoiceById, getInvoiceById, getCompanyById } from '../services/apiservices';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const baseTextStyle = { fontSize: 14, margin: 0, padding: 0, fontFamily: "Arial, sans-serif" };
const labelStyle = { ...baseTextStyle, fontWeight: "bold" };
const valueStyle = { ...baseTextStyle, fontWeight: "normal" };

const PrintedInvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const [printedInvoice, setPrintedInvoice] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (id && token) {
      getPrintedInvoiceById(Number(id), token)
        .then((data) => {
          setPrintedInvoice(data);
          return getInvoiceById(data.invoice_id, token);
        })
        .then((inv) => {
          setInvoice(inv);
          if (inv?.company_id) {
            return getCompanyById(inv.company_id, token).then(data => setCompany(data.company));
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, token]);

  if (loading) return <div>Cargando factura impresa...</div>;
  if (!printedInvoice || !invoice) return <div>No se encontró la factura impresa.</div>;

  const handlePrintPDF = async () => {
    const input = document.getElementById('invoice-pdf');
    if (!input) {
      console.error('No se encontró el elemento invoice-pdf');
      return;
    }
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.autoPrint();
    window.open(pdf.output('bloburl'), '_blank');
  };

  const allItems = [
    ...(invoice.invoice_items || []),
    ...(invoice.custom_items
      ? invoice.custom_items.map((item: any, idx: number) => ({
          id: `custom-${idx}`,
          name: item.name || 'Personalizado',
          description: item.description,
          price: item.unit_price,
          quantity: item.quantity,
        }))
      : [])
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded shadow p-6">
      <style>
        {`
          #invoice-pdf, #invoice-pdf * {
            color: #222 !important;
            background: #fff !important;
            border-color: #222 !important;
            font-family: Arial, sans-serif !important;
          }
        `}
      </style>
      <div
        id="invoice-pdf"
        style={{
          fontFamily: "Arial, sans-serif",
          color: "#222",
          background: "#fff",
          padding: 40,
          width: 595,
          minHeight: 842,
          border: "1px solid #222",
          boxSizing: "border-box"
        }}
      >
        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize:28, margin:0}}>Factura Impresa</h1>
            <div style={{ ...baseTextStyle, margin: "2px 0" }}>Nº Factura: {printedInvoice.number}</div>
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
      <button onClick={handlePrintPDF} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
        Imprimir
      </button>
    </div>
  );
};

export default PrintedInvoiceDetail;