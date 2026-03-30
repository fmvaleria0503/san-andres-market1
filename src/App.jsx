import React, { useState, useEffect, useRef } from 'react';
import MapaBarrio from './components/MapaBarrio';
import ModalVenderPro from './components/ModalVenderPro';
import Registro from './components/Registro';
import { FiSearch, FiZap, FiUser } from 'react-icons/fi';
import logo from './assets/logo.png'; 
import './App.css';

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [coordsClic, setCoordsClic] = useState(null);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [mostrarModalVendedor, setMostrarModalVendedor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [condicionSeleccionada, setCondicionSeleccionada] = useState('Todas');
  const mapCenterRef = useRef();

  // Locales publicitarios
  const localesPublicitarios = [
    { id: 1, nombre: 'Heladería Ballester', lat: -34.57, lng: -58.53, imagen: 'https://i.ibb.co/JpXgm06/default-product.jpg' },
    { id: 2, nombre: 'Ferretería Malaipu', lat: -34.572, lng: -58.535, imagen: 'https://i.ibb.co/JpXgm06/default-product.jpg' },
    { id: 3, nombre: 'Almacén Central', lat: -34.575, lng: -58.54, imagen: 'https://i.ibb.co/JpXgm06/default-product.jpg' }
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/productos?aprobado=true')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error backend:', err));
  }, []);

  const handleRegistro = ({ nombre, email, password, role }) => {
    if (usuarios.some(u => u.email === email)) {
      alert('El email ya está registrado.');
      return;
    }
    const nuevoUsuario = { id: Date.now(), nombre, email, password, role };
    setUsuarios(prev => [...prev, nuevoUsuario]);
    setUsuario(nuevoUsuario);
    setMostrarRegistro(false);
    alert('Usuario creado con éxito.');
  };

  const handleLogin = ({ email, password }) => {
    const usuarioExistente = usuarios.find(u => u.email === email && u.password === password);
    if (!usuarioExistente) {
      alert('Credenciales incorrectas');
      return;
    }
    setUsuario(usuarioExistente);
    setMostrarRegistro(false);
  };

  const handleNewProduct = (nuevoProducto) => {
    setProductos(prev => [nuevoProducto, ...prev]);
    setMostrarModal(false);
  };

  const abrirModalVendedor = (vendedor) => {
    setVendedorSeleccionado(vendedor);
    setMostrarModalVendedor(true);
  };

  const centrarMapaEnProducto = (producto) => {
    if (mapCenterRef.current) {
      mapCenterRef.current(producto);
    }
  };

  const centrarMapaEnLocal = (local) => {
    if (mapCenterRef.current) {
      mapCenterRef.current({ lat: local.lat, lng: local.lng });
    }
  };

  const abrirModalConClic = (coordenadas) => {
    if (!usuario) {
      alert('Debés ingresar o registrarte para ofertar productos.');
      return;
    }
    setCoordsClic(coordenadas);
    setMostrarModal(true);
  };

  const productosFiltrados = productos.filter(p => {
    const titulo = (p.title || p.titulo || '').toLowerCase();
    const matchesSearch = titulo.includes(searchTerm.toLowerCase());
    const matchesCategoria = categoriaSeleccionada === 'Todas' || (p.categoria || p.category) === categoriaSeleccionada;
    const matchesCondicion = condicionSeleccionada === 'Todas' || (p.condicion || p.condition) === condicionSeleccionada;
    return matchesSearch && matchesCategoria && matchesCondicion;
  });

  const topSellers = Array.from(
    new Map(
      productosFiltrados
        .map(p => ({
          nombre: p.vendedor?.nombre || 'Vendedor Anónimo',
          estrellas: p.vendedor?.estrellas || 0,
          productos: 1
        }))
        .sort((a, b) => b.estrellas - a.estrellas)
        .map(item => [item.nombre, item])
    ).values()
  );

  const sellersConComentario = topSellers.slice(0, 3).map((s, idx) => ({
    ...s,
    comentario: [
      'Muy buen servicio, me atendieron rápido.',
      'Precio justo y producto en excelente estado.',
      'Recomendado, volvería a comprar.'
    ][idx] || 'Excelente vendedor.'
  }));

  return (
    <div className="app-container">
      {/* HEADER SUPERIOR */}
      <header className="nav-header">
        <img src={logo} alt="MarketPin" className="brand-logo" />
        <div className="search-pill">
          <FiSearch />
          <input 
            type="text" 
            placeholder="¿Qué buscás en San Martín? (ej: mesa, lavarropas...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="user-access">
          {usuario ? (
            <>
              <span className="welcome-text">Hola, {usuario.nombre} ({usuario.role})</span>
              <button className="btn-logout" onClick={() => setUsuario(null)}>SALIR</button>
            </>
          ) : (
            <button className="btn-registro" onClick={() => setMostrarRegistro(true)}>
              REGISTRO/INGRESO
            </button>
          )}
          <FiUser className="user-icon" />
        </div>
      </header>

      {/* FILTROS */}
      <div className="filters-bar">
        <div className="category-buttons">
          {['Todas', 'Ropa', 'Electrodomésticos', 'Servicios', 'Hogar', 'Alimentos'].map(cat => (
            <button 
              key={cat} 
              className={categoriaSeleccionada === cat ? 'active' : ''} 
              onClick={() => setCategoriaSeleccionada(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="condition-filter">
          <select value={condicionSeleccionada} onChange={(e) => setCondicionSeleccionada(e.target.value)}>
            <option value="Todas">Todas</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Usado">Usado</option>
          </select>
        </div>
      </div>

      {/* CUERPO PRINCIPAL (DASHBOARD GRID) */}
      <main className="main-content-grid">
        
        {/* COLUMNA IZQUIERDA: VENDEDORES */}
        <aside className="side-panel left-side">
          <h3>Mejores Vendedores ⭐</h3>
          <div className="sellers-list">
            {sellersConComentario.length > 0 ? sellersConComentario.map(v => (
              <div key={v.nombre} className="seller-card" onClick={() => abrirModalVendedor(v)}>
                <span className="seller-name">{v.nombre}</span>
                <span className="seller-stars">{'★'.repeat(Math.max(1, Math.min(5, Math.round(v.estrellas))))}</span>
              </div>
            )) : (
              <div className="seller-card">Cargando vendedores...</div>
            )}
          </div>
        </aside>

        {/* CENTRO: MAPA PROFESIONAL CON RE_CALCULO */}
        <section className="map-zone-wrapper">
          <MapaBarrio productos={productosFiltrados} locales={localesPublicitarios} onMapClick={abrirModalConClic} onCenterMap={mapCenterRef} />
        </section>

        {/* COLUMNA DERECHA: DESTACADOS Y OFERTAS */}
        <aside className="side-panel right-side">
          <h3>Destacados Premium</h3>
          <div className="premium-grid scrollable">
            {productosFiltrados.slice(0, 10).map(p => (
              <div key={p._id || p.id} className="premium-card" onClick={() => centrarMapaEnProducto(p)}>
                <img src={p.imgs?.[0] || p.foto} alt={p.title || p.titulo} />
                <div className="card-info">
                  <h4>{p.title || p.titulo}</h4>
                  <p>${(p.price || p.precio || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <h3><FiZap /> Ofertas en Imágenes</h3>
          <div className="premium-grid scrollable">
            {productosFiltrados
              .filter(p => (p.price || p.precio || 0) < 90000)
              .slice(0, 10)
              .map(p => (
                <div key={`oferta-${p._id || p.id}`} className="premium-card">
                  <img src={p.imgs?.[0] || p.foto} alt={p.title || p.titulo} />
                  <div className="card-info">
                    <h4>{p.title || p.titulo}</h4>
                    <p>${(p.price || p.precio || 0).toLocaleString()}</p>
                  </div>
                </div>
            ))}
          </div>
        </aside>
      </main>

      {/* FOOTER MARQUEE */}
      <footer className="footer-marquee">
        <div className="marquee-content">
          {localesPublicitarios.map(local => (
            <div key={`marquee-${local.id}`} className="marquee-item" onClick={() => centrarMapaEnLocal(local)}>
              <img src={local.imagen} alt={local.nombre} />
              <span>{local.nombre} - ¡Visítanos!</span>
            </div>
          ))}
        </div>
      </footer>

      {/* MODALES CENTRALES */}
      {mostrarModal && (
        <ModalVenderPro 
          coordenadas={coordsClic} 
          usuario={usuario}
          onAddProduct={handleNewProduct}
          onClose={() => setMostrarModal(false)} 
        />
      )}
      {mostrarRegistro && (
        <Registro 
          onClose={() => setMostrarRegistro(false)} 
          onRegister={handleRegistro} 
          onLogin={handleLogin} 
          usuario={usuario}
        />
      )}
      {mostrarModalVendedor && vendedorSeleccionado && (
        <div className="registro-overlay" onClick={() => setMostrarModalVendedor(false)}>
          <div className="registro-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Calificaciones de {vendedorSeleccionado.nombre}</h2>
            <div className="calificaciones-list">
              {[
                { nombre: 'Juan Pérez', estrellas: 5, comentario: 'Excelente vendedor, muy confiable.' },
                { nombre: 'María García', estrellas: 4, comentario: 'Buen producto, entrega rápida.' },
                { nombre: 'Carlos López', estrellas: 5, comentario: 'Recomiendo totalmente.' }
              ].map((calif, idx) => (
                <div key={idx} className="calificacion-item">
                  <strong>{calif.nombre}</strong>: {'★'.repeat(calif.estrellas)}
                  <p>{calif.comentario}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setMostrarModalVendedor(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;