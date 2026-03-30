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
    costoPorClick: 0,
    costoTotal: 0,
    anunciante: {
      nombre: '',
      email: '',
      telefono: ''
    }
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editando
        ? `http://localhost:5000/api/publicidades/${editando._id}`
        : 'http://localhost:5000/api/publicidades';

      const method = editando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        cargarPublicidades();
        setMostrarModal(false);
        setEditando(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error guardando publicidad:', error);
    }
  };

  const handleEdit = (publicidad) => {
    setEditando(publicidad);
    setFormData({
      texto: publicidad.texto,
      prioridad: publicidad.prioridad,
      activa: publicidad.activa,
      costoPorClick: publicidad.costoPorClick,
      costoTotal: publicidad.costoTotal,
      anunciante: publicidad.anunciante || { nombre: '', email: '', telefono: '' }
    });
    setMostrarModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicidad?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/publicidades/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (res.ok) {
          cargarPublicidades();
        }
      } catch (error) {
        console.error('Error eliminando publicidad:', error);
      }
    }
  };

  const toggleActiva = async (id, activa) => {
    try {
      const res = await fetch(`http://localhost:5000/api/publicidades/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ activa: !activa })
      });
      if (res.ok) {
        cargarPublicidades();
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      texto: '',
      prioridad: 1,
      activa: true,
      costoPorClick: 0,
      costoTotal: 0,
      anunciante: {
        nombre: '',
        email: '',
        telefono: ''
      }
    });
  };

  const calcularIngresos = (publicidad) => {
    return publicidad.clicks * publicidad.costoPorClick;
  };

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
              <span className="stat-number">
                {publicidades.reduce((total, pub) => total + pub.impresiones, 0)}
              </span>
              <span className="stat-label">Impresiones</span>
            </div>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditando(null);
            resetForm();
            setMostrarModal(true);
          }}
        >
          <FiPlus /> Nueva Publicidad
        </button>
      </div>

      <div className="publicidades-grid">
        {publicidades.map(pub => (
          <div key={pub._id} className={`publicidad-card ${!pub.activa ? 'inactiva' : ''}`}>
            <div className="card-header">
              <div className="prioridad-badge">P{pub.prioridad}</div>
              <div className="card-actions">
                <button
                  className="btn-icon"
                  onClick={() => toggleActiva(pub._id, pub.activa)}
                  title={pub.activa ? 'Desactivar' : 'Activar'}
                >
                  {pub.activa ? <FiEye /> : <FiEyeOff />}
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(pub)}
                  title="Editar"
                >
                  <FiEdit />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(pub._id)}
                  title="Eliminar"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="card-content">
              <p className="texto-publicidad">{pub.texto}</p>
              <div className="anunciante-info">
                <strong>{pub.anunciante?.nombre || 'Sin nombre'}</strong>
                {pub.anunciante?.email && <span>{pub.anunciante.email}</span>}
              </div>
            </div>

            <div className="card-stats">
              <div className="stat">
                <span className="stat-value">{pub.impresiones}</span>
                <span className="stat-label">Vistas</span>
              </div>
              <div className="stat">
                <span className="stat-value">{pub.clicks}</span>
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
                  onChange={(e) => setFormData({...formData, texto: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, prioridad: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Activa</label>
                  <input
                    type="checkbox"
                    checked={formData.activa}
                    onChange={(e) => setFormData({...formData, activa: e.target.checked})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Costo por click ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costoPorClick}
                    onChange={(e) => setFormData({...formData, costoPorClick: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Costo total ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costoTotal}
                    onChange={(e) => setFormData({...formData, costoTotal: parseFloat(e.target.value)})}
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
                      anunciante: {...formData.anunciante, nombre: e.target.value}
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
                        anunciante: {...formData.anunciante, email: e.target.value}
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
                        anunciante: {...formData.anunciante, telefono: e.target.value}
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