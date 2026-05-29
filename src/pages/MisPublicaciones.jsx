import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const initialEditData = {
  title: '',
  price: '',
  descripcion: '',
  categoria: 'General',
  whatsapp: '',
  imagenesExistentes: [],
  location: null
};

const MisPublicaciones = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [editProducto, setEditProducto] = useState(null);
  const [editData, setEditData] = useState(initialEditData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('marketpinUsuario');
    const currentUser = saved ? JSON.parse(saved) : null;
    setUsuario(currentUser);
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userId = currentUser._id || currentUser.id || '';
    const query = currentUser.email ? `?email=${encodeURIComponent(currentUser.email)}` : `?vendedorId=${encodeURIComponent(userId)}`;

    fetch(`http://localhost:5001/api/productos/mis${query}`)
      .then((res) => res.json())
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Error cargando publicaciones propias:', err);
        setProductos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const openEditModal = (producto) => {
    setEditProducto(producto);
    setEditData({
      title: producto.title || '',
      price: producto.price?.toString() || '',
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || 'General',
      whatsapp: producto.whatsapp || '',
      imagenesExistentes: producto.imgs || [],
      location: producto.location || null
    });
    setError('');
    setMessage('');
  };

  const closeEditModal = () => {
    setEditProducto(null);
    setEditData(initialEditData);
    setSaving(false);
    setError('');
    setMessage('');
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarEdicion = async (event) => {
    event.preventDefault();
    if (!editData.title || !editData.price) {
      setError('Completa el título y el precio antes de guardar.');
      return;
    }

    setSaving(true);
    setError('');
    const token = localStorage.getItem('marketpinUserToken');

    try {
      const formData = new FormData();
      formData.append('title', editData.title);
      formData.append('price', editData.price);
      formData.append('descripcion', editData.descripcion);
      formData.append('categoria', editData.categoria);
      formData.append('whatsapp', editData.whatsapp);
      formData.append('imagenesExistentes', JSON.stringify(editData.imagenesExistentes || []));
      if (editData.location) {
        formData.append('location', JSON.stringify(editData.location));
      }

      const response = await fetch(`http://localhost:5001/api/productos/${editProducto._id}`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.mensaje || 'No se pudo actualizar la publicación.');
        return;
      }

      setProductos((prev) => prev.map((item) => (item._id === data.producto._id ? data.producto : item)));
      setMessage('La publicación se actualizó y se envió a revisión.');
      closeEditModal();
    } catch (err) {
      console.error('Error guardando la publicación:', err);
      setError('Error guardando la publicación. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (!usuario) {
    return (
      <div className="app-container" style={{ padding: '40px' }}>
        <h2>No estás logueado</h2>
        <p>Inicia sesión para ver tus publicaciones.</p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ padding: '40px' }}>
      <div className="section-header">
        <div>
          <h2>Mis publicaciones</h2>
          <p>Revisa y actualiza tus productos. Las ediciones pasan a revisión automática.</p>
        </div>
        <Link to="/" className="btn-registro">Volver al mapa</Link>
      </div>

      {loading ? (
        <p>Cargando tus publicaciones...</p>
      ) : productos.length === 0 ? (
        <div className="empty-state">No encontré publicaciones asociadas a tu cuenta.</div>
      ) : (
        <div className="users-grid">
          {productos.map((producto) => (
            <div key={producto._id || producto.id} className="user-card">
              <div className="user-card-header">
                <div>
                  <h3>{producto.title}</h3>
                  <span className="user-email">{producto.categoria || 'Sin categoría'}</span>
                </div>
                <span className={`user-status ${producto.aprobado ? 'active' : 'inactive'}`}>
                  {producto.aprobado ? 'Aprobado' : 'En revisión'}
                </span>
              </div>
              <div className="user-card-body">
                <p><strong>Precio:</strong> ${producto.price?.toLocaleString() || '0'}</p>
                <p><strong>Ubicación:</strong> {producto.location?.lat?.toFixed(4) || 'N/D'}, {producto.location?.lng?.toFixed(4) || 'N/D'}</p>
                <p>{producto.descripcion || 'Sin descripción'}</p>
                <p><strong>WhatsApp:</strong> {producto.whatsapp || 'No disponible'}</p>
              </div>
              <div className="user-card-actions">
                <button className="btn-primary" onClick={() => openEditModal(producto)}>
                  Editar publicación
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editProducto && (
        <div className="product-detail-overlay" onClick={closeEditModal}>
          <div className="product-detail-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', gridTemplateColumns: '1fr' }}>
            <div className="product-detail-gallery" style={{ padding: '24px' }}>
              <h3>Editar publicación</h3>
              <p style={{ marginBottom: '18px', color: '#555' }}>
                Esta edición volverá a revisión del administrador antes de mostrarse públicamente.
              </p>
              <form className="edit-product-form" onSubmit={handleGuardarEdicion}>
                <label>
                  Título
                  <input
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="form-input"
                    required
                  />
                </label>
                <label>
                  Precio ($)
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </label>
                <label>
                  Categoría
                  <input
                    name="categoria"
                    value={editData.categoria}
                    onChange={handleEditChange}
                    className="form-input"
                  />
                </label>
                <label>
                  WhatsApp
                  <input
                    name="whatsapp"
                    value={editData.whatsapp}
                    onChange={handleEditChange}
                    className="form-input"
                  />
                </label>
                <label>
                  Descripción
                  <textarea
                    name="descripcion"
                    value={editData.descripcion}
                    onChange={handleEditChange}
                    className="form-input"
                    rows="4"
                  />
                </label>
                <div style={{ marginBottom: '16px', color: '#444' }}>
                  <strong>Imágenes actuales:</strong>
                  <div className="pending-images" style={{ marginTop: '10px' }}>
                    {editData.imagenesExistentes.length > 0 ? (
                      editData.imagenesExistentes.map((img, idx) => (
                        <img key={idx} src={img} alt={`Imagen ${idx + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', marginRight: '10px' }} />
                      ))
                    ) : (
                      <span>No hay imágenes guardadas.</span>
                    )}
                  </div>
                </div>

                {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
                {message && <p style={{ color: 'green', marginBottom: '12px' }}>{message}</p>}

                <div className="modal-actions" style={{ marginTop: '18px', display: 'flex', gap: '12px' }}>
                  <button type="button" className="btn-light" onClick={closeEditModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-orange" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPublicaciones;
