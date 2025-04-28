import React from 'react';
import InvoiceForm from '../components/InvoiceForm';

const Invoice: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <InvoiceForm />
    </div>
  );
};

export default Invoice;