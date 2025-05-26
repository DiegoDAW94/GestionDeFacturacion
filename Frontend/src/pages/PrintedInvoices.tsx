import React, { useEffect, useState } from "react";
import {
  getPrintedInvoices,
  getInvoiceById,
  getCompanyById,
} from "../services/apiservices";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { deletePrintedInvoice } from "../services/apiservices"; // Asegúrate de importar la función

const baseTextStyle = {
  fontSize: 14,
  margin: 0,
  padding: 0,
  fontFamily: "Arial, sans-serif",
};
const labelStyle = { ...baseTextStyle, fontWeight: "bold" };
const valueStyle = { ...baseTextStyle, fontWeight: "normal" };

const PrintedInvoices: React.FC = () => {
  const [printed, setPrinted] = useState<any[]>([]);
  const [printInvoices, setPrintInvoices] = useState<any[]>([]);
  const [printCompanies, setPrintCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPrintedInvoices(token!);
        setPrinted(data.printed || data);

        // Cargar facturas y empresas asociadas para el contenedor oculto
        const invoices = await Promise.all(
          (data.printed || data).map((p: any) =>
            getInvoiceById(p.invoice_id, token!)
          )
        );
        setPrintInvoices(invoices);

        const companies = await Promise.all(
          invoices.map((inv: any) =>
            inv?.company_id
              ? getCompanyById(inv.company_id, token!).then(
                  (res) => res.company
                )
              : null
          )
        );
        setPrintCompanies(companies);
      } catch {
        setPrinted([]);
        setPrintInvoices([]);
        setPrintCompanies([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  // Filtros y selección
  const filteredPrinted = printed.filter((row) => {
    const invoice =
      printInvoices.find((inv: any) => inv && inv.id === row.invoice_id) || {};
    const matchesText = Object.values(invoice).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(filter.toLowerCase())
    );
    const matchesClient =
      invoice.client &&
      invoice.client.name &&
      invoice.client.name.toLowerCase().includes(filter.toLowerCase());

    let matchesDate = true;
    if (startDate) matchesDate = invoice.date >= startDate;
    if (endDate) matchesDate = matchesDate && invoice.date <= endDate;

    let matchesPrice = true;
    if (minPrice) matchesPrice = Number(invoice.total) >= Number(minPrice);
    if (maxPrice)
      matchesPrice = matchesPrice && Number(invoice.total) <= Number(maxPrice);

    return (matchesText || matchesClient) && matchesDate && matchesPrice;
  });

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPrinted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPrinted.map((p: any) => p.id));
    }
  };

  // Imprimir lote en un solo PDF
  const handlePrintBatch = async () => {
    const selectedPrintIds = selectedIds
      .map((id) => {
        const printedInvoice = printed.find((p) => p.id === id);
        const invoice = printInvoices.find(
          (inv) => inv && inv.id === printedInvoice?.invoice_id
        );
        return invoice ? `invoice-print-${invoice.id}` : null;
      })
      .filter(Boolean);

    if (selectedPrintIds.length === 0) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    for (let i = 0; i < selectedPrintIds.length; i++) {
      const element = document.getElementById(selectedPrintIds[i] as string);
      if (!element) continue;
      // eslint-disable-next-line no-await-in-loop
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    // En vez de save, abre el diálogo de impresión
    pdf.autoPrint();
    window.open(pdf.output("bloburl"), "_blank");
  };
  const handleDeletePrintedInvoice = async (id: number) => {
    if (!token) {
      alert(
        "No hay token de autenticación. Por favor, inicia sesión de nuevo."
      );
      return;
    }
    if (!window.confirm("¿Seguro que quieres eliminar esta factura impresa?"))
      return;
    try {
      await deletePrintedInvoice(id, token!);
      setPrinted((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert("Error al eliminar la factura impresa: " + (e.message || e));
    }
  };
  // Columnas para DataTable
  const columns = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={
            selectedIds.length === filteredPrinted.length &&
            filteredPrinted.length > 0
          }
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
      key: "number",
      label: "Número Factura",
      render: (row: any) => (
        <Link
          to={`/invoices/printed/${row.id}`}
          className="text-blue-600 underline hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.number}
        </Link>
      ),
    },
    {
      key: "date",
      label: "Fecha",
      render: (row: any) => {
        const invoice = printInvoices.find(
          (inv: any) => inv && inv.id === row.invoice_id
        );
        return invoice?.date;
      },
    },
    {
      key: "client",
      label: "Cliente",
      render: (row: any) => {
        const invoice = printInvoices.find(
          (inv: any) => inv && inv.id === row.invoice_id
        );
        return invoice?.client?.name;
      },
    },
    {
      key: "total",
      label: "Total",
      render: (row: any) => {
        const invoice = printInvoices.find(
          (inv: any) => inv && inv.id === row.invoice_id
        );
        return invoice?.total ? invoice.total + " €" : "";
      },
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Contenedor oculto para impresión en lote */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {printed.map((printedItem) => {
          const invoice = printInvoices.find(
            (inv) => inv && inv.id === printedItem.invoice_id
          );
          const company =
            printCompanies[
              printInvoices.findIndex(
                (inv) => inv && inv.id === printedItem.invoice_id
              )
            ];
          if (!invoice) return null; // <-- Añade esta línea
          const allItems = [
            ...(invoice.invoice_items || []),
            ...(invoice.custom_items
              ? invoice.custom_items.map((item: any, i: number) => ({
                  id: `custom-${i}`,
                  name: item.name || "Personalizado",
                  description: item.description,
                  price: item.unit_price,
                  quantity: item.quantity,
                }))
              : []),
          ];
          return (
            <div
              key={printedItem.id}
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
                marginBottom: 24,
              }}
            >
              {/* Cabecera */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1 style={{ fontSize: 28, margin: 0 }}>Factura</h1>
                  <div style={{ ...baseTextStyle, margin: "2px 0" }}>
                    Nº {printedItem.number}
                  </div>
                  <div style={{ ...baseTextStyle, margin: "2px 0" }}>
                    Fecha: {invoice.date}
                  </div>
                  <div style={{ ...baseTextStyle, margin: "2px 0" }}>
                    Fecha operación: {invoice.operation_date}
                  </div>
                </div>
              </div>
              {/* Empresa emisora */}
              {company && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 28, margin: 4 }}>Empresa</h2>
                  <div>
                    <span style={labelStyle}>Nombre:</span>{" "}
                    <span style={valueStyle}>{company.name}</span>
                  </div>
                  <div>
                    <span style={labelStyle}>CIF/NIF:</span>{" "}
                    <span style={valueStyle}>{company.cif}</span>
                  </div>
                  <div>
                    <span style={labelStyle}>Dirección:</span>{" "}
                    <span style={valueStyle}>{company.fiscal_address}</span>
                  </div>
                  <div>
                    <span style={labelStyle}>Ciudad:</span>{" "}
                    <span style={valueStyle}>{company.city}</span>
                  </div>
                  <div>
                    <span style={labelStyle}>Provincia:</span>{" "}
                    <span style={valueStyle}>{company.province}</span>
                  </div>
                  <div>
                    <span style={labelStyle}>Código postal:</span>{" "}
                    <span style={valueStyle}>{company.postal_code}</span>
                  </div>
                  <div>
                    <span style={labelStyle}>Email:</span>{" "}
                    <span style={valueStyle}>{company.email}</span>
                  </div>
                  <div>
                    <span style={labelStyle}>Teléfono:</span>{" "}
                    <span style={valueStyle}>{company.telefono}</span>
                  </div>
                </div>
              )}
              {/* Datos del cliente */}
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 28, margin: 4 }}>Cliente</h2>
                <div>
                  <span style={labelStyle}>Nombre:</span>{" "}
                  <span style={valueStyle}>{invoice.client?.name}</span>
                </div>
                <div>
                  <span style={labelStyle}>NIF:</span>{" "}
                  <span style={valueStyle}>{invoice.client?.nif}</span>
                </div>
                <div>
                  <span style={labelStyle}>Dirección:</span>{" "}
                  <span style={valueStyle}>
                    {invoice.client?.fiscal_address}
                  </span>
                </div>
                <div>
                  <span style={labelStyle}>Ciudad:</span>{" "}
                  <span style={valueStyle}>{invoice.client?.city}</span>
                </div>
                <div>
                  <span style={labelStyle}>Provincia:</span>{" "}
                  <span style={valueStyle}>{invoice.client?.province}</span>
                </div>
                <div>
                  <span style={labelStyle}>Código postal:</span>{" "}
                  <span style={valueStyle}>{invoice.client?.postal_code}</span>
                </div>
                <div>
                  <span style={labelStyle}>Email:</span>{" "}
                  <span style={valueStyle}>{invoice.client?.email}</span>
                </div>
              </div>
              {/* Tabla de ítems */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: 24,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #222",
                        padding: 8,
                        background: "#f5f5f5",
                      }}
                    >
                      Nombre
                    </th>
                    <th
                      style={{
                        border: "1px solid #222",
                        padding: 8,
                        background: "#f5f5f5",
                      }}
                    >
                      Descripción
                    </th>
                    <th
                      style={{
                        border: "1px solid #222",
                        padding: 8,
                        background: "#f5f5f5",
                      }}
                    >
                      Precio
                    </th>
                    <th
                      style={{
                        border: "1px solid #222",
                        padding: 8,
                        background: "#f5f5f5",
                      }}
                    >
                      Cantidad
                    </th>
                    <th
                      style={{
                        border: "1px solid #222",
                        padding: 8,
                        background: "#f5f5f5",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item: any) => (
                    <tr key={item.id}>
                      <td
                        style={{
                          fontSize: 14,
                          border: "1px solid #222",
                          padding: 8,
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          fontSize: 14,
                          border: "1px solid #222",
                          padding: 8,
                        }}
                      >
                        {item.description}
                      </td>
                      <td
                        style={{
                          fontSize: 14,
                          border: "1px solid #222",
                          padding: 8,
                        }}
                      >
                        {item.price} €
                      </td>
                      <td
                        style={{
                          fontSize: 14,
                          border: "1px solid #222",
                          padding: 8,
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          fontSize: 14,
                          border: "1px solid #222",
                          padding: 8,
                        }}
                      >
                        {(
                          parseFloat(item.price) * parseFloat(item.quantity)
                        ).toFixed(2)}{" "}
                        €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Totales */}
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <div>
                  <span style={labelStyle}>Base imponible:</span>{" "}
                  <span style={valueStyle}>{invoice.base_amount} €</span>
                </div>
                {invoice.taxes?.map((tax: any) => (
                  <div key={tax.id}>
                    <span style={labelStyle}>Impuesto {tax.name}:</span>{" "}
                    <span style={valueStyle}>
                      {tax.percentage}% {invoice.tax_amount} €
                    </span>
                  </div>
                ))}
                <div style={{ fontSize: 18, marginTop: 8, fontWeight: "bold" }}>
                  <span>Total:</span>{" "}
                  <span style={valueStyle}>{invoice.total} €</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Fin contenedor oculto */}

      <h1 className="text-3xl font-bold mb-6">Facturas listas para imprimir</h1>
      <div className="flex gap-4 items-center mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <span>a</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-2 py-1 border rounded w-24"
          min="0"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-2 py-1 border rounded w-24"
          min="0"
        />
        <input
          type="text"
          placeholder="Buscar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-2 py-1 border rounded w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
        />
        <button
          className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded"
          onClick={() => {
            setFilter("");
            setEndDate("");
            setStartDate("");
            setMinPrice("");
            setMaxPrice("");
          }}
          type="button"
        >
          Reset Filter
        </button>
      </div>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        disabled={selectedIds.length === 0}
        onClick={handlePrintBatch}
      >
        Imprimir seleccionadas
      </button>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredPrinted}
          onDelete={handleDeletePrintedInvoice}
        />
      )}
    </div>
  );
};

export default PrintedInvoices;
