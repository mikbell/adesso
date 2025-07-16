import React from 'react';
import CustomButton from '../../components/shared/CustomButton';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-6xl font-extrabold text-red-600">403</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-800">Accesso Negato</h2>
      <p className="mt-2 text-lg text-gray-600">
        Non disponi delle autorizzazioni necessarie per visualizzare questa pagina.
      </p>
      <CustomButton
        onClick={handleClick}
      >
        Torna Indietro
      </CustomButton>
    </div>
  );
};

export default Unauthorized;
