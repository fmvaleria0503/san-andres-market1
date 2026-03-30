import React from 'react';
import './Registro.css';

const Registro = () => {
  return (
    <div className="zara-container">
      <h2 style={{color: 'white', fontWeight: '300'}}>DATOS PERSONALES</h2>
      {/* ... resto del form ... */}
      <button className="zara-btn">CREAR CUENTA</button>
    </div>
  );
};

export default Registro; // ESTA LÍNEA ES CLAVE