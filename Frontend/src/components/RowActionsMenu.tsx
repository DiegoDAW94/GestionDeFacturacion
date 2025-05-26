import React, { useState, useRef, useEffect } from 'react';

interface RowActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const RowActionsMenu: React.FC<RowActionsMenuProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si haces click fuera del botón Y del menú
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        open &&
        !buttonRef.current?.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="text-gray-500 hover:text-gray-700 px-2"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        ⋮
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-1/2 top-8 -translate-x-1/2 z-50 bg-white border rounded shadow-md w-28"
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          >
            Editar
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            Borrar
          </button>
        </div>
      )}
    </div>
  );
};

export default RowActionsMenu;