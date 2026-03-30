// src/components/ModalVenderPro.jsx
import React, { useState } from 'react';
import { FiUpload, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import './ModalVenderPro.css';

const ModalVenderPro = ({ coordenadas, onClose, onAddProduct, usuario }) => {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Hogar');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');

  const handlePublicar = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !coordenadas) {
      alert('Completa todos los campos y selecciona la ubicación en el mapa.');
      return;
    }

    setLoading(true);
    const nuevoProducto = {
      title: nombre,
      price: Number(precio),
      imgs: [imagen || 'https://i.ibb.co/JpXgm06/default-product.jpg'],
      location: { lat: coordenadas.lat, lng: coordenadas.lng },
      aprobado: false,
      vendedor: { nombre: usuario?.nombre || 'Invitado', estrellas: 0 }
    };

    try {
      const response = await fetch('http://localhost:5000/api/productos/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });
      if (!response.ok) {
        throw new Error('Error en servidor');
      }
      const productoGuardado = await response.json();
      onAddProduct(productoGuardado);
      alert('¡Producto publicado!');
      onClose();
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Error al publicar el producto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
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
          <input value={nombre} onChange={e => setNombre(e.target.value)} type="text" placeholder="¿Qué vendés? (ej: Lavarropas)" className="form-input" />
          <input value={precio} onChange={e => setPrecio(e.target.value)} type="number" placeholder="Precio ($)" className="form-input" />
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} type="text" placeholder="Descripción" className="form-input" />
          <input value={imagen} onChange={e => setImagen(e.target.value)} type="text" placeholder="URL imagen (opcional)" className="form-input" />
          <select value={categoria} onChange={e => setCategoria(e.target.value)} className="form-input">
            <option value="Hogar">Hogar</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Moda">Moda</option>
            <option value="Alimentos">Alimentos</option>
          </select>

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