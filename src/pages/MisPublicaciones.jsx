import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MisPublicaciones = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('marketpinUsuario');
    const currentUser = saved ? JSON.parse(saved) : null;
    setUsuario(currentUser);
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const query = currentUser.email ? `?email=${encodeURIComponent(currentUser.email)}` : `?vendedorId=${encodeURIComponent(currentUser.id)}`;
    fetch(`http://localhost:5001/api/productos/mis${query}`)
      .then((res) => res.json())
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Error cargando publicaciones propias:', err);
        setProductos([]);
      })
      .finally(() => setLoading(false));
  }, []);

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
          <p>Revisa tus productos publicados y su estado de aprobación.</p>
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
                <p><strong>Ubicación:</strong> {producto.location?.lat?.toFixed(4)}, {producto.location?.lng?.toFixed(4)}</p>
                <p>{producto.descripcion || 'Sin descripción'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPublicaciones;
