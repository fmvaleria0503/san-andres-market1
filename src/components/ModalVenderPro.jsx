// src/components/ModalVenderPro.jsx
import React, { useState } from 'react';
import { FiUpload, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import ImageUploader from './ImageUploader';
import './ModalVenderPro.css';

const ModalVenderPro = ({ coordenadas, onClose, onAddProduct, usuario }) => {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Hogar');
  const [descripcion, setDescripcion] = useState('');
  const [whatsapp, setWhatsapp] = useState(usuario?.whatsapp || '');
  const [selectedImages, setSelectedImages] = useState([]);

  const handlePublicar = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !coordenadas) {
      alert('Completa todos los campos obligatorios y selecciona la ubicación en el mapa.');
      return;
    }

    if (selectedImages.length === 0) {
      alert('Debes subir al menos una imagen del producto.');
      return;
    }

    setLoading(true);

    // Crear FormData para enviar archivos
    const formData = new FormData();
    formData.append('title', nombre);
    formData.append('price', precio);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('vendedorId', usuario?._id || '');
    formData.append('whatsapp', whatsapp);
    formData.append('location', JSON.stringify({ lat: coordenadas.lat, lng: coordenadas.lng }));

    // Agregar imágenes
    selectedImages.forEach((file, index) => {
      formData.append('imagenes', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/productos/vender', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error en servidor');
      }

      const productoGuardado = await response.json();
      onAddProduct(productoGuardado);
      alert('¡Producto publicado exitosamente! Espera la aprobación del administrador.');
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
          <div className="form-row">
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              type="text"
              placeholder="¿Qué vendés? (ej: Lavarropas Samsung)"
              className="form-input"
              required
            />
            <input
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              type="number"
              placeholder="Precio ($)"
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Descripción detallada del producto..."
            className="form-input"
            rows="3"
          />

          <div className="form-row">
            <select
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className="form-input"
            >
              <option value="Hogar">🏠 Hogar</option>
              <option value="Electrónica">📱 Electrónica</option>
              <option value="Moda">👕 Moda</option>
              <option value="Alimentos">🍎 Alimentos</option>
              <option value="Deportes">⚽ Deportes</option>
              <option value="Vehículos">🚗 Vehículos</option>
              <option value="Servicios">🔧 Servicios</option>
              <option value="Otros">📦 Otros</option>
            </select>

            <input
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              type="tel"
              placeholder="WhatsApp (ej: +54911234567)"
              className="form-input"
            />
          </div>

          {/* Componente de subida de imágenes */}
          <div className="image-uploader-section">
            <label className="form-label">Imágenes del producto *</label>
            <ImageUploader
              onImagesSelected={setSelectedImages}
              maxImages={5}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-light" onClick={onClose}>CANCELAR</button>
            <button type="submit" className="btn-orange" disabled={loading}>
              {loading ? "PUBLICANDO..." : "PUBLICAR PRODUCTO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalVenderPro;