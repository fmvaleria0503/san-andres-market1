import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiTrendingUp } from 'react-icons/fi';
import './GestionPublicidades.css';

const GestionPublicidades = () => {
  const [publicidades, setPublicidades] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    texto: '',
    prioridad: 1,
    activa: true,
    tipo: 'normal',
    fechaExpiracion: '',
    partido: 'Norte',
    costoPorClick: 0,
    costoTotal: 0,
    zona: 'Norte',
    imagenLocal: '',
    imagenes: [],
    nuevosArchivos: [],
    anunciante: {
      nombre: '',
      email: '',
      telefono: '',
      whatsapp: ''
    }
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      Authorization: `Bearer ${token}`
    };
  };

  useEffect(() => {
    cargarPublicidades();
  }, []);

  const cargarPublicidades = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/publicidades/admin', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setPublicidades(data);
    } catch (error) {
      console.error('Error cargando publicidades:', error);
    }
  };

  const buildFormData = () => {
    const body = new FormData();
    body.append('texto', formData.texto);
    body.append('prioridad', formData.prioridad);
    body.append('activa', formData.activa);
    body.append('tipo', formData.tipo);
    body.append('fechaExpiracion', formData.fechaExpiracion);
    body.append('zona', formData.zona);
    body.append('partido', formData.partido);
    body.append('imagenLocal', formData.imagenLocal);
    body.append('costoPorClick', formData.costoPorClick);
    body.append('costoTotal', formData.costoTotal);
    body.append('anunciante', JSON.stringify(formData.anunciante));
    body.append('imagenesJson', JSON.stringify(formData.imagenes || []));

    formData.nuevosArchivos.forEach(file => {
      body.append('files', file);
    });

    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editando ? `http://localhost:5000/api/publicidades/${editando._1d}` : 'http://localhost:5000/api/publicidades';
      const method = editando ? 'PUT' : 'POST';
      const body = buildFormData();

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body
      });

      if (res.ok) {
        cargarPublicidades();
        setMostrarModal(false);
        setEditando(null);
        resetForm();
      } else {
        const errorData = await res.json();
        console.error('Error guardando publicidad:', errorData);
      }
    } catch (error) {
      console.error('Error guardando publicidad:', error);
    }
  };

  const handleEdit = (publicidad) => {
    setEditando(publicidad);
    setFormData({
      texto: publicidad.texto || '',
      prioridad: publicidad.prioridad || 1,
      activa: publicidad.activa ?? true,
      tipo: publicidad.tipo || 'normal',
      fechaExpiracion: publicidad.fechaExpiracion ? new Date(publicidad.fechaExpiracion).toISOString().slice(0, 10) : '',
      partido: publicidad.partido || 'Norte',
      costoPorClick: publicidad.costoPorClick || 0,
      costoTotal: publicidad.costoTotal || 0,
      zona: publicidad.zona || 'Norte',
      imagenLocal: publicidad.imagenLocal || '',
      imagenes: publicidad.imagenes || [],
      nuevosArchivos: [],
      anunciante: publicidad.anunciante || { nombre: '', email: '', telefono: '', whatsapp: '' }
    });
    setMostrarModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicidad?')) {
      try {
        const res = await fetch(`http://localhost:5001/api/publicidades/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (res.ok) cargarPublicidades();
      } catch (error) {
        console.error('Error eliminando publicidad:', error);
      }
    }
  };

  const toggleActiva = async (id, activa) => {
    try {
      const form = new FormData();
      form.append('activa', !activa);
      const res = await fetch(`http://localhost:5001/api/publicidades/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: form
      });
      if (res.ok) cargarPublicidades();
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      texto: '',
      prioridad: 1,
      activa: true,
      tipo: 'normal',
      fechaExpiracion: '',
      partido: 'Norte',
      costoPorClick: 0,
      costoTotal: 0,
      zona: 'Norte',
      imagenLocal: '',
      imagenes: [],
      nuevosArchivos: [],
      anunciante: {
        nombre: '',
        email: '',
        telefono: '',
        whatsapp: ''
      }
    });
  };

  const calcularIngresos = (publicidad) => (publicidad.clicks || 0) * (publicidad.costoPorClick || 0);
  const totalIngresos = publicidades.reduce((total, pub) => total + calcularIngresos(pub), 0);

  return (
    <div className="gestion-publicidades">
      <div className="header-section">
        <div className="header-info">
          <h2><FiTrendingUp /> Gestión de Publicidades</h2>
          <div className="stats">
            <div className="stat-card">
              <span className="stat-number">{publicidades.length}</span>
              <span className="stat-label">Total Publicidades</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">${totalIngresos.toLocaleString()}</span>
              <span className="stat-label">Ingresos Totales</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{publicidades.reduce((total, pub) => total + (pub.impresiones || 0), 0)}</span>
              <span className="stat-label">Impresiones</span>
            </div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => { setEditando(null); resetForm(); setMostrarModal(true); }}>
          <FiPlus /> Nueva Publicidad
        </button>
      </div>

      <div className="publicidades-grid">
        {publicidades.map(pub => (
          <div key={pub._id} className={`publicidad-card ${!pub.activa ? 'inactiva' : ''}`}>
            {pub.imagenes?.[0] && (
              <div className="publicidad-image">
                <img src={pub.imagenes[0]} alt={pub.texto || 'Publicidad'} />
              </div>
            )}
            <div className="card-header">
              <div className="prioridad-badge">P{pub.prioridad}</div>
              <div className="card-actions">
                <button className="btn-icon" onClick={() => toggleActiva(pub._id, pub.activa)} title={pub.activa ? 'Desactivar' : 'Activar'}>
                  {pub.activa ? <FiEye /> : <FiEyeOff />}
                </button>
                <button className="btn-icon" onClick={() => handleEdit(pub)} title="Editar">
                  <FiEdit />
                </button>
                <button className="btn-icon delete" onClick={() => handleDelete(pub._id)} title="Eliminar">
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="card-content">
              <p className="texto-publicidad">{pub.texto}</p>
              <div className="anunciante-info">
                <strong>{pub.anunciante?.nombre || 'Sin nombre'}</strong>
                {pub.anunciante?.email && <span>{pub.anunciante.email}</span>}
                {pub.partido && <span>Partido: {pub.partido}</span>}
                {pub.zona && <span>Zona: {pub.zona}</span>}
              </div>
              <div className="publicidad-meta">
                <span className={`tipo-badge ${pub.tipo === 'premium' ? 'premium' : 'normal'}`}>
                  {pub.tipo === 'premium' ? 'Pago / Destacado' : 'Normal'}
                </span>
                {pub.fechaExpiracion && (
                  <span className="expiration-text">Vence: {new Date(pub.fechaExpiracion).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <div className="card-stats">
              <div className="stat">
                <span className="stat-value">{pub.impresiones || 0}</span>
                <span className="stat-label">Vistas</span>
              </div>
              <div className="stat">
                <span className="stat-value">{pub.clicks || 0}</span>
                <span className="stat-label">Clicks</span>
              </div>
              <div className="stat">
                <span className="stat-value">${calcularIngresos(pub)}</span>
                <span className="stat-label">Ingresos</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editando ? 'Editar Publicidad' : 'Nueva Publicidad'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Texto de la publicidad *</label>
                <textarea
                  value={formData.texto}
                  onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                  placeholder="Ej: 🔥 OFERTA ESPECIAL: 50% OFF en productos electrónicos"
                  maxLength="200"
                  required
                />
                <small>{formData.texto.length}/200 caracteres</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prioridad (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.prioridad}
                    onChange={(e) => setFormData({ ...formData, prioridad: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>Activa</label>
                  <input
                    type="checkbox"
                    checked={formData.activa}
                    onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de publicidad</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vence el</label>
                  <input
                    type="date"
                    value={formData.fechaExpiracion}
                    onChange={(e) => setFormData({ ...formData, fechaExpiracion: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zona</label>
                  <input
                    type="text"
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Partido</label>
                  <select
                    value={formData.partido}
                    onChange={(e) => setFormData({ ...formData, partido: e.target.value })}
                  >
                    <option value="Norte">Norte</option>
                    <option value="Sur">Sur</option>
                    <option value="Oeste">Oeste</option>
                    <option value="CABA">CABA</option>
                    <option value="Todas">Todas</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Imágenes desde galería</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData(prev => ({ ...prev, nuevosArchivos: files }));
                    }}
                  />
                  <small>Selecciona varias imágenes para que aparezcan en la publicidad.</small>
                </div>
                <div className="form-group">
                  <label>URL de imagen adicional</label>
                  <input
                    type="text"
                    value={formData.imagenLocal}
                    onChange={(e) => setFormData({ ...formData, imagenLocal: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {formData.imagenes?.length > 0 && (
                <div className="image-preview-grid">
                  {formData.imagenes.map((img, index) => (
                    <img key={index} src={img} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Costo por click ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costoPorClick}
                    onChange={(e) => setFormData({ ...formData, costoPorClick: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Costo total ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costoTotal}
                    onChange={(e) => setFormData({ ...formData, costoTotal: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Datos del Anunciante</h4>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.anunciante.nombre}
                    onChange={(e) => setFormData({
                      ...formData,
                      anunciante: { ...formData.anunciante, nombre: e.target.value }
                    })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.anunciante.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        anunciante: { ...formData.anunciante, email: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={formData.anunciante.telefono}
                      onChange={(e) => setFormData({
                        ...formData,
                        anunciante: { ...formData.anunciante, telefono: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.anunciante.whatsapp}
                      onChange={(e) => setFormData({
                        ...formData,
                        anunciante: { ...formData.anunciante, whatsapp: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editando ? 'Actualizar' : 'Crear'} Publicidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPublicidades;