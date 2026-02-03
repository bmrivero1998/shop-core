import React from 'react';
import { useNavigate } from 'react-router-dom';

export const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <button 
          onClick={() => navigate('/store')}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
};