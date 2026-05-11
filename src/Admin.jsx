import React, { useState, useEffect } from 'react';
import MapaBarrio from './components/MapaBarrio';
import ModalVenderPro from './components/ModalVenderPro';
import Registro from './components/Registro';
import GestionPublicidades from './components/GestionPublicidades';
import AdminLogin from './components/AdminLogin';
import { FiSearch, FiZap, FiUser, FiSettings, FiTrendingUp, FiPackage, FiLogOut } from 'react-icons/fi';
import logo from './assets/logo.png';
import './App.css';

const App = () => {
  const [productos, setProductos] = useState([]);
  const [productosPendientes, setProductosPendientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [coordsClic, setCoordsClic] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState('dashboard');
  const [adminAutenticado, setAdminAutenticado] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);

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

      fetch("http://localhost:5000/api/productos/pendientes")
        .then(res => res.json())
        .then(data => setProductosPendientes(data))
        .catch(err => console.error("Error cargando productos pendientes:", err));

      const token = localStorage.getItem('adminToken');
      fetch('http://localhost:5000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUsuarios(data))
        .catch(err => console.error('Error cargando usuarios:', err))
        .finally(() => setCargandoUsuarios(false));
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
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setUsuarios(prev => prev.map(u => u._id === usuarioId ? { ...u, esPremium: true, fechaPremium: new Date().toISOString() } : u));
      }
    } catch (error) {
      console.error('Error actualizando premium:', error);
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
                    fetch(`http://localhost:5000/api/admin/productos/${producto._id}/aprobar`, {
                      method: 'PUT',
                      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                    }).then(() => setProductosPendientes(prev => prev.filter(p => p._id !== producto._id)));
                  }}>
                    Aprobar
                  </button>
                  <button className="btn-reject" onClick={() => {
                    fetch(`http://localhost:5000/api/admin/productos/${producto._id}/rechazar`, {
                      method: 'PUT',
                      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                    }).then(() => setProductosPendientes(prev => prev.filter(p => p._id !== producto._id)));
                  }}>
                    Rechazar
                  </button>
                </div>
              </div>
            )) : (
              <p>No hay productos pendientes por revisar.</p>
            )}
          </div>
        </div>
      ) : pestanaActiva === 'publicidades' ? (
        <GestionPublicidades />
      ) : pestanaActiva === 'usuarios' ? (
        <div className="admin-section">
          <h2>Gestión de Usuarios</h2>
          <p>Administra los usuarios registrados, activa/desactiva cuentas y marca premium.</p>
          {cargandoUsuarios ? (
            <p>Cargando usuarios...</p>
          ) : (
            <div className="users-table">
              <div className="users-table-header">
                <span>Nombre</span>
                <span>Email</span>
                <span>Estado</span>
                <span>Premium</span>
                <span>Acciones</span>
              </div>
              {usuarios.map(usuario => (
                <div key={usuario._id} className="users-table-row">
                  <span>{usuario.nombre}</span>
                  <span>{usuario.email}</span>
                  <span>{usuario.activo ? 'Activo' : 'Inactivo'}</span>
                  <span>{usuario.esPremium ? 'Sí' : 'No'}</span>
                  <span className="users-actions">
                    <button
                      className="btn-small"
                      onClick={() => handleToggleUsuario(usuario._id, usuario.activo)}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    {!usuario.esPremium && (
                      <button
                        className="btn-small btn-yellow"
                        onClick={() => handleSetUsuarioPremium(usuario._id)}
                      >
                        Premium
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : pestanaActiva === 'configuracion' ? (
        <div className="admin-section">
          <h2>Configuración del Sistema</h2>
          <p>Configuraciones generales de MarketPin.</p>
          {/* TODO: Implementar configuración */}
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

export default App;