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
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [coordsClic, setCoordsClic] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState('dashboard');
  const [adminAutenticado, setAdminAutenticado] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

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
          <p>Aquí podrás aprobar/rechazar productos de vendedores.</p>
          {/* TODO: Implementar gestión de productos */}
        </div>
      ) : pestanaActiva === 'publicidades' ? (
        <GestionPublicidades />
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