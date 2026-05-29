import React, { useState, useEffect } from 'react';
import MapaBarrio from './components/MapaBarrio';
import ModalVenderPro from './components/ModalVenderPro';
import Registro from './components/Registro';
import GestionPublicidades from './components/GestionPublicidades';
import AdminLogin from './components/AdminLogin';
import { FiSearch, FiZap, FiUser, FiSettings, FiTrendingUp, FiPackage, FiLogOut } from 'react-icons/fi';
import logo from './assets/logo.png';
import './App.css';

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const [productosPendientes, setProductosPendientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [coordsClic, setCoordsClic] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState('dashboard');
  const [adminAutenticado, setAdminAutenticado] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [filtroUsuarios, setFiltroUsuarios] = useState('');
  const [config, setConfig] = useState({
    permitirRegistro: true,
    mostrarDestacados: true,
    zonaPredeterminada: 'Norte',
    maxPublicidades: 6
  });

  useEffect(() => {
    verificarAutenticacion();
  }, []);

  useEffect(() => {
    if (adminAutenticado) {
      // Cargar productos aprobados desde el backend
      fetch("http://localhost:5000/api/productos?aprobado=true")
        .then(res => res.json())
        .then(data => setProductos(data))
        .catch(err => console.error("Error backend:", err));

      const token = localStorage.getItem('adminToken');

      fetch("http://localhost:5000/api/productos/pendientes", {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setProductosPendientes(data))
        .catch(err => console.error("Error cargando productos pendientes:", err));

      fetch('http://localhost:5000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUsuarios(data))
        .catch(err => console.error('Error cargando usuarios:', err))
        .finally(() => setCargandoUsuarios(false));

      const savedConfig = localStorage.getItem('marketpinConfig');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }

      fetch('http://localhost:5000/api/admin/eventos', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setEventos(Array.isArray(data) ? data : []))
        .catch(err => console.error('Error cargando eventos de admin:', err));
    }
  }, [adminAutenticado]);

  const verificarAutenticacion = async () => {
    const token = localStorage.getItem('adminToken');
    const usuario = localStorage.getItem('adminUser');

    if (token && usuario) {
      try {
        // Verificar token con el backend
                const res = await fetch('http://localhost:5000/api/auth/verificar', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setAdminAutenticado(data.usuario);
        } else {
          // Token inválido, limpiar
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setCargandoAuth(false);
  };

  const handleLoginSuccess = (usuario) => {
    setAdminAutenticado(usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminAutenticado(null);
    setPestanaActiva('dashboard');
  };

  const handleGuardarConfiguracion = () => {
    localStorage.setItem('marketpinConfig', JSON.stringify(config));
    alert('Configuración guardada correctamente');
  };

  const handleToggleUsuario = async (usuarioId, activo) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/usuarios/${usuarioId}/activo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ activo: !activo })
      });
      if (res.ok) {
        setUsuarios(prev => prev.map(u => u._id === usuarioId ? { ...u, activo: !activo } : u));
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  const handleSetUsuarioPremium = async (usuarioId) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/usuarios/${usuarioId}/premium`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ premium: true })
      });
      if (res.ok) {
        setUsuarios(prev => prev.map(u => u._id === usuarioId ? { ...u, esPremium: true, fechaPremium: new Date().toISOString() } : u));
      }
    } catch (error) {
      console.error('Error actualizando premium:', error);
    }
  };

  const handleEliminarProducto = async (productoId) => {
    if (!window.confirm('Eliminar este pin eliminará la publicación permanentemente.')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/productos/${productoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProductosPendientes(prev => prev.filter(p => p._id !== productoId));
        setProductos(prev => prev.filter(p => p._id !== productoId));
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  const abrirModalConClic = (coordenadas) => {
    setCoordsClic(coordenadas);
    setMostrarModal(true);
  };

  // Si está cargando la autenticación, mostrar loading
  if (cargandoAuth) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando acceso...</p>
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!adminAutenticado) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* HEADER SUPERIOR */}
      <header className="nav-header">
        <img src={logo} alt="MarketPin" className="brand-logo" />
        <div className="search-pill">
          <FiSearch />
          <input type="text" placeholder="¿Qué buscás en San Martín? (ej: mesa, lavarropas...)" />
        </div>
        <div className="user-access">
          <span className="admin-info">
            <FiUser /> {adminAutenticado.nombre} (Admin)
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut /> Salir
          </button>
        </div>
      </header>

      {/* NAVEGACIÓN DE ADMIN */}
      <nav className="admin-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${pestanaActiva === 'dashboard' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('dashboard')}
          >
            <FiZap /> Dashboard
          </button>
          <button
            className={`nav-tab ${pestanaActiva === 'productos' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('productos')}
          >
            <FiPackage /> Productos
          </button>
          <button
            className={`nav-tab ${pestanaActiva === 'publicidades' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('publicidades')}
          >
            <FiTrendingUp /> Publicidades
          </button>
          <button
            className={`nav-tab ${pestanaActiva === 'usuarios' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('usuarios')}
          >
            <FiUser /> Usuarios
          </button>
          <button
            className={`nav-tab ${pestanaActiva === 'configuracion' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('configuracion')}
          >
            <FiSettings /> Configuración
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      {pestanaActiva === 'dashboard' ? (
        <>
          {/* CUERPO PRINCIPAL (DASHBOARD GRID) */}
      <main className="main-content-grid">
        
        {/* COLUMNA IZQUIERDA: VENDEDORES */}
        <aside className="side-panel left-side">
          <h3>Vendedores Top ⭐</h3>
          <div className="sellers-list">
            {[
              { nom: "Ferretería Central", est: "⭐⭐⭐⭐⭐" },
              { nom: "Almacén de Juan", est: "⭐⭐⭐⭐" }
            ].map(v => (
              <div key={v.nom} className="seller-card">
                <span className="seller-name">{v.nom}</span>
                <span className="seller-stars">{v.est}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTRO: MAPA PROFESIONAL CON RE_CALCULO */}
        <section className="map-zone-wrapper">
          <MapaBarrio productos={productos} onMapClick={abrirModalConClic} />
        </section>

        {/* COLUMNA DERECHA: DESTACADOS */}
        <aside className="side-panel right-side">
          <h3>Destacados Premium</h3>
          <div className="premium-grid">
            {productos.slice(0, 3).map(p => (
              <div key={p._id} className="premium-card">
                <img src={p.imgs[0]} alt={p.title} />
                <div className="card-info">
                  <h4>{p.title}</h4>
                  <p>${p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>

      {/* FOOTER MARQUEE */}
      <footer className="footer-marquee">
        <div className="marquee-content">
           🔥 HELADERIA BALLESTER: 2x1 en 1/4kg todos los jueves 🍦 • 🛠️ FERRETERIA MALAIPU: 15% OFF • 📦
        </div>
      </footer>
        </>
      ) : pestanaActiva === 'productos' ? (
        <div className="admin-section">
          <h2>Gestión de Productos</h2>
          <p>Aquí podrás aprobar/rechazar productos de vendedores y revisar sus imágenes.</p>
          <div className="products-pending-grid">
            {productosPendientes.length > 0 ? productosPendientes.map(producto => (
              <div key={producto._id} className="pending-product-card">
                <div className="pending-card-header">
                  <h3>{producto.title}</h3>
                  <span className="pending-price">${producto.price}</span>
                </div>
                <p className="pending-desc">{producto.descripcion || 'Sin descripción'}</p>
                <div className="pending-meta">
                  <span>Vendedor: {producto.vendedor?.nombre || 'Desconocido'}</span>
                  <span>Categoria: {producto.categoria || 'General'}</span>
                </div>
                {producto.imgs && producto.imgs.length > 0 && (
                  <div className="pending-images">
                    {producto.imgs.slice(0, 3).map((img, idx) => (
                      <img key={idx} src={img} alt={`Producto ${idx + 1}`} />
                    ))}
                  </div>
                )}
                <div className="pending-actions">
                  <button className="btn-approve" onClick={() => {
                    const token = localStorage.getItem('adminToken');
                    fetch(`http://localhost:5001/api/admin/productos/${producto._id}/aprobar`, {
                      method: 'PUT',
                      headers: { 'Authorization': `Bearer ${token}` }
                    })
                      .then(res => res.json())
                      .then(data => {
                        if (data.producto) {
                          setProductosPendientes(prev => prev.filter(p => p._id !== producto._id));
                          setProductos(prev => [data.producto, ...prev]);
                        } else {
                          alert('Error: ' + (data.mensaje || 'Error desconocido'));
                        }
                      })
                      .catch(err => {
                        console.error('Error aprobando producto:', err);
                        alert('Error de conexión al aprobar producto');
                      });
                  }}>
                    Aprobar
                  </button>
                  <button className="btn-reject" onClick={() => {
                    const token = localStorage.getItem('adminToken');
                    fetch(`http://localhost:5001/api/admin/productos/${producto._id}/rechazar`, {
                      method: 'PUT',
                      headers: { 'Authorization': `Bearer ${token}` }
                    })
                      .then(() => setProductosPendientes(prev => prev.filter(p => p._id !== producto._id)))
                      .catch(err => console.error('Error rechazando producto:', err));
                  }}>
                    Rechazar
                  </button>
                  <button className="btn-delete" onClick={() => handleEliminarProducto(producto._id)}>
                    Eliminar pin
                  </button>
                </div>
              </div>
            )) : (
              <p>No hay productos pendientes por revisar.</p>
            )}
          </div>

          <div className="admin-section admin-notifications">
            <h3>Notificaciones recientes</h3>
            {eventos.length > 0 ? (
              <ul className="event-list">
                {eventos.slice(0, 6).map(evento => (
                  <li key={evento._id} className="event-item">
                    <span className="event-time">{new Date(evento.fecha).toLocaleString()}</span>
                    <p>{evento.mensaje}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay notificaciones recientes.</p>
            )}
          </div>
        </div>
      ) : pestanaActiva === 'publicidades' ? (
        <GestionPublicidades />
      ) : pestanaActiva === 'usuarios' ? (
        <div className="admin-section">
          <div className="section-header">
            <div>
              <h2>Gestión de Usuarios</h2>
              <p>Administra y organiza los usuarios registrados.</p>
            </div>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Buscar por nombre o email"
                value={filtroUsuarios}
                onChange={(e) => setFiltroUsuarios(e.target.value)}
              />
            </div>
          </div>

          {cargandoUsuarios ? (
            <p>Cargando usuarios...</p>
          ) : (
            <div className="users-grid">
              {usuarios.filter(usuario => {
                const term = filtroUsuarios.toLowerCase();
                return (
                  usuario.nombre?.toLowerCase().includes(term) ||
                  usuario.email?.toLowerCase().includes(term)
                );
              }).map(usuario => (
                <div key={usuario._id} className="user-card">
                  <div className="user-card-header">
                    <div>
                      <h3>{usuario.nombre}</h3>
                      <span className="user-email">{usuario.email}</span>
                    </div>
                    <span className={`user-status ${usuario.activo ? 'active' : 'inactive'}`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="user-card-body">
                    <p><strong>Premium:</strong> {usuario.esPremium ? 'Sí' : 'No'}</p>
                    <p><strong>Teléfono:</strong> {usuario.telefono || 'No disponible'}</p>
                    <p><strong>Región:</strong> {usuario.zona || 'N/D'}</p>
                  </div>
                  <div className="user-card-actions">
                    <button className="btn-small" onClick={() => handleToggleUsuario(usuario._id, usuario.activo)}>
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    {!usuario.esPremium && (
                      <button className="btn-small btn-yellow" onClick={() => handleSetUsuarioPremium(usuario._id)}>
                        Marcar Premium
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {usuarios.filter(usuario => {
                const term = filtroUsuarios.toLowerCase();
                return (
                  usuario.nombre?.toLowerCase().includes(term) ||
                  usuario.email?.toLowerCase().includes(term)
                );
              }).length === 0 && (
                <p className="empty-state">No se encontraron usuarios con ese filtro.</p>
              )}
            </div>
          )}
        </div>
      ) : pestanaActiva === 'configuracion' ? (
        <div className="admin-section">
          <div className="section-header">
            <div>
              <h2>Configuración del Sistema</h2>
              <p>Define el comportamiento y la experiencia de MarketPin.</p>
            </div>
          </div>

          <div className="config-grid">
            <div className="config-card">
              <h4>Registro de usuarios</h4>
              <p>Permitir que nuevos usuarios se registren en la plataforma.</p>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={config.permitirRegistro}
                  onChange={(e) => setConfig(prev => ({ ...prev, permitirRegistro: e.target.checked }))}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="config-card">
              <h4>Mostrar destacados</h4>
              <p>Activar la sección de productos destacados en el dashboard.</p>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={config.mostrarDestacados}
                  onChange={(e) => setConfig(prev => ({ ...prev, mostrarDestacados: e.target.checked }))}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="config-card">
              <h4>Zona predeterminada</h4>
              <p>Selecciona la zona por defecto para nuevas búsquedas y anuncios.</p>
              <select
                value={config.zonaPredeterminada}
                onChange={(e) => setConfig(prev => ({ ...prev, zonaPredeterminada: e.target.value }))}
              >
                <option value="Norte">Norte</option>
                <option value="Sur">Sur</option>
                <option value="Oeste">Oeste</option>
                <option value="CABA">CABA</option>
              </select>
            </div>

            <div className="config-card">
              <h4>Límite de publicidades</h4>
              <p>Cuántas publicidades se muestran en la vista principal.</p>
              <input
                type="number"
                min="1"
                max="20"
                value={config.maxPublicidades}
                onChange={(e) => setConfig(prev => ({ ...prev, maxPublicidades: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="config-actions">
            <button className="btn-primary" onClick={handleGuardarConfiguracion}>
              Guardar configuración
            </button>
          </div>
        </div>
      ) : null}

      {/* MODALES CENTRALES */}
      {mostrarModal && (
        <ModalVenderPro 
          coordenadas={coordsClic} 
          onClose={() => setMostrarModal(false)} 
        />
      )}
      {mostrarRegistro && <Registro onClose={() => setMostrarRegistro(false)} />}
    </div>
  );
};

export default Admin;