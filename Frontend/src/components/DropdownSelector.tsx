import React, { useState, useRef, useEffect } from 'react';

interface DropdownSelectorProps {
  options: any[];
  value: any;
  onChange: (option: any) => void;
  labelKey?: string;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  options,
  value,
  onChange,
  labelKey = 'name',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="px-2 py-1 rounded text-white min-w-[120px] text-left"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {value ? value[labelKey] : 'Selecciona una empresa'}
        <span className="ml-2">&#9662;</span>
      </button>
      {open && (
        <ul className="absolute left-0 mt-1 w-full bg-white border rounded shadow z-50">
          {options.map((option) => (
            <li
              key={option.id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-200 text-black `}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option[labelKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelector;