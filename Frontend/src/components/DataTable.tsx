import React, { useState } from "react";
import RowActionsMenu from "./RowActionsMenu";

export interface DataTableProps<T> {
  columns: {
    key: keyof T;
    label: React.ReactNode;
    render?: (row: T) => React.ReactNode;
  }[]; // Cambiado a React.ReactNode
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (id: number) => void;
}

function DataTable<T extends { [key: string]: unknown }>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortKey, sortOrder]);

  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="bg-white rounded shadow-md border border-gray-200 p-4 max-h-96 max-w-full overflow-visible">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 border-b bg-gray-100 text-left font-semibold cursor-pointer select-none"
                onClick={() => {
                  if (sortKey === col.key) {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortKey(col.key);
                    setSortOrder("asc");
                  }
                }}
              >
                {col.label}
                {sortKey === col.key && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
            <th className="w-10 border-b bg-gray-100 text-left font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-4 text-gray-500"
              >
                No hay datos
              </td>
            </tr>
          ) : (
            paginatedData.map((row, idx) => {
              const handleEditRow = () => {
                if (onEdit) onEdit(row);
              };
              const handleDeleteRow = () => {
                if (onDelete) onDelete(row.id as number);
              };
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-2 border-b">
                      {col.render
                        ? col.render(row)
                        : typeof row[col.key] === "object" &&
                          row[col.key] !== null
                        ? (row[col.key] as any).name
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                  <td className="border-b w-10 text-center p-0 relative">
                    <RowActionsMenu
                      onEdit={handleEditRow}
                      onDelete={handleDeleteRow}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
