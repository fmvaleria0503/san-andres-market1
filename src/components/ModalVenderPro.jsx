// src/components/ModalVenderPro.jsx
import React, { useState } from 'react';
import { FiUpload, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import './ModalVenderPro.css';

const ModalVenderPro = ({ coordenadas, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handlePublicar = async (e) => {
    e.preventDefault();
    setLoading(true);
    // ... lógica de fetch a tu backend ...
    setTimeout(() => { alert("¡Producto posteado!"); onClose(); window.location.reload(); }, 2000);
  };

  return (
    <div className="modal-mp-overlay">
      <div className="modal-mp-pro">
        <h2>Vender Producto Pro</h2>
        <p className="subtitle">Sigue estos pasos para clavar tu pin en San Martín</p>
        
        <div className="status-badge-wrapper">
          <FiCheckCircle /> UBICACIÓN SELECCIONADA
          <div className="coords">📍 ({coordenadas?.lat.toFixed(4)}, {coordenadas?.lng.toFixed(4)})</div>
        </div>

        <form onSubmit={handlePublicar} className="pro-upload-form">
          <input type="text" placeholder="¿Qué vendés? (ej: Lavarropas)" className="form-input" />
          <input type="number" placeholder="Precio ($)" className="form-input" />
          <select className="form-input">
            <option>Hogar</option><option>Hogar</option>
          </select>
          
          <div className="file-box">
             Elegir archivo <span>logo.png</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-light" onClick={onClose}>CANCELAR</button>
            <button type="submit" className="btn-orange" disabled={loading}>
              {loading ? "PUBLICANDO..." : "PUBLICAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalVenderPro;