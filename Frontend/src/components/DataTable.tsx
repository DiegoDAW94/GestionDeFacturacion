import React, { useState } from 'react';
import RowActionsMenu from './RowActionsMenu';

export interface DataTableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

function DataTable<T extends { [key: string]: unknown }>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="bg-white rounded shadow-md border border-gray-200 p-4 max-h-96 max-w-full overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-2 border-b bg-gray-100 text-left font-semibold">
                {col.label}
              </th>
            ))}
            <th className="w-10 border-b bg-gray-100 text-left font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                No hay datos
              </td>
            </tr>
          ) : (
            paginatedData.map((row, idx) => {
              // Definir los handlers aquí para que el closure de row sea correcto
              const handleEditRow = () => {
                console.log('onEdit en DataTable', row);
                onEdit && onEdit(row);
              };
              const handleDeleteRow = () => {
                console.log('onDelete en DataTable', row);
                onDelete && onDelete(row);
              };
              return (
                <tr key={idx} className="hover:bg-gray-50">
                 {columns.map((col) => (
  <td key={String(col.key)} className="px-4 py-2 border-b">
    {typeof row[col.key] === 'object' && row[col.key] !== null
      ? row[col.key].name
      : String(row[col.key] ?? '')}
  </td>
))}
                  <td className="border-b w-10 text-center p-0">
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