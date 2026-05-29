import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MapaBarrio from './components/MapaBarrio';
import ModalVenderPro from './components/ModalVenderPro';
import Registro from './components/Registro';
import { FiSearch, FiZap, FiUser } from 'react-icons/fi';
import logo from './assets/logo.png'; 
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('marketpinUsuario');
    return saved ? JSON.parse(saved) : null;
  });
  const [productos, setProductos] = useState([]);
  const [publicidades, setPublicidades] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [coordsClic, setCoordsClic] = useState(null);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [mostrarModalVendedor, setMostrarModalVendedor] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarDetalleProducto, setMostrarDetalleProducto] = useState(false);
  const [detalleImagenIndex, setDetalleImagenIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [condicionSeleccionada, setCondicionSeleccionada] = useState('Todas');
  const [zonaSeleccionada, setZonaSeleccionada] = useState('Todas');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [sellerRatingSeleccionada, setSellerRatingSeleccionada] = useState('Todas');
  const [ofertaMonto, setOfertaMonto] = useState('');
  const [ofertaMensaje, setOfertaMensaje] = useState('');
  const mapCenterRef = useRef();

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('marketpinUsuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('marketpinUsuario');
    }
  }, [usuario]);

  // Locales publicitarios
  const localesPublicitarios = [
    { id: 1, nombre: 'Heladería Ballester', lat: -34.57, lng: -58.53, imagen: 'https://i.ibb.co/JpXgm06/default-product.jpg' },
    { id: 2, nombre: 'Ferretería Malaipu', lat: -34.572, lng: -58.535, imagen: 'https://i.ibb.co/JpXgm06/default-product.jpg' },
    { id: 3, nombre: 'Almacén Central', lat: -34.575, lng: -58.54, imagen: 'https://i.ibb.co/JpXgm06/default-product.jpg' }
  ];

  useEffect(() => {
    // Cargar productos
    fetch('http://localhost:5001/api/productos?aprobado=true')
      .then(res => res.json())
      .then(data => {
        console.log('Productos cargados:', data);
        setProductos(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error backend productos:', err);
        setProductos([]);
      });
  }, []);

  useEffect(() => {
    const query = zonaSeleccionada && zonaSeleccionada !== 'Todas' ? `?zona=${encodeURIComponent(zonaSeleccionada)}` : '';
    fetch(`http://localhost:5001/api/publicidades${query}`)
      .then(res => res.json())
      .then(data => {
        console.log('Publicidades cargadas:', data);
        setPublicidades(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error backend publicidades:', err);
        setPublicidades([]);
      });
  }, [zonaSeleccionada]);

  const handleRegistro = async ({ nombre, email, password }) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.mensaje || 'Error al registrar el usuario.');
        return;
      }

      setUsuario(data.user);
      localStorage.setItem('marketpinUsuario', JSON.stringify(data.user));
      setMostrarRegistro(false);
      alert('Usuario creado con éxito.');
    } catch (error) {
      console.error('Error registro:', error);
      alert('Error al registrar el usuario. Intenta de nuevo.');
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.mensaje || 'Credenciales incorrectas');
        return;
      }

      setUsuario(data.user);
      localStorage.setItem('marketpinUsuario', JSON.stringify(data.user));
      if (data.token && data.user.role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        localStorage.removeItem('adminToken');
      }

      setMostrarRegistro(false);
    } catch (error) {
      console.error('Error login:', error);
      alert('Error al iniciar sesión. Intenta de nuevo.');
    }
  };

  const handleNewProduct = (nuevoProducto) => {
    if (nuevoProducto.aprobado) {
      setProductos(prev => [nuevoProducto, ...prev]);
    }
    setMostrarModal(false);
  };

  const closeProductDetail = () => {
    setMostrarDetalleProducto(false);
    setProductoSeleccionado(null);
    setDetalleImagenIndex(0);
    setOfertaMonto('');
    setOfertaMensaje('');
  };

  const handleProductSelect = (producto) => {
    setProductoSeleccionado(producto);
    setDetalleImagenIndex(0);
    setOfertaMonto('');
    setOfertaMensaje('');
    setMostrarDetalleProducto(true);
  };

  const handlePrevImage = () => {
    if (!productoSeleccionado?.imgs?.length) return;
    setDetalleImagenIndex((prev) => (prev - 1 + productoSeleccionado.imgs.length) % productoSeleccionado.imgs.length);
  };

  const handleNextImage = () => {
    if (!productoSeleccionado?.imgs?.length) return;
    setDetalleImagenIndex((prev) => (prev + 1) % productoSeleccionado.imgs.length);
  };

  const resetFilters = () => {
    setCategoriaSeleccionada('Todas');
    setCondicionSeleccionada('Todas');
    setZonaSeleccionada('Todas');
    setPrecioMin('');
    setPrecioMax('');
    setSellerRatingSeleccionada('Todas');
    setSearchTerm('');
  };

  const handleEnviarOferta = () => {
    if (!ofertaMonto) {
      alert('Ingresá un monto para tu oferta.');
      return;
    }
    const numero = (productoSeleccionado.vendedor?.whatsapp || productoSeleccionado.whatsapp || '5491123456789').replace(/\D/g, '');
    const mensaje = `Hola, quiero hacer una oferta de $${ofertaMonto} por ${productoSeleccionado.title || productoSeleccionado.titulo}.${ofertaMensaje ? ' ' + ofertaMensaje : ''}`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
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

  const productosFiltrados = (productos || []).filter(p => {
    const titulo = (p.title || p.titulo || '').toLowerCase();
    const matchesSearch = titulo.includes(searchTerm.toLowerCase()) || (p.vendedor?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoriaSeleccionada === 'Todas' || (p.categoria || p.category) === categoriaSeleccionada;
    const matchesCondicion = condicionSeleccionada === 'Todas' || (p.condicion || p.condition) === condicionSeleccionada;
    const matchesZona = zonaSeleccionada === 'Todas' || (p.zona || p.zona_local || '').toLowerCase().includes(zonaSeleccionada.toLowerCase());
    const precioProducto = p.price ?? p.precio ?? 0;
    const minPrecio = precioMin ? parseFloat(precioMin) : null;
    const maxPrecio = precioMax ? parseFloat(precioMax) : null;
    const matchesPrecioMin = minPrecio === null || precioProducto >= minPrecio;
    const matchesPrecioMax = maxPrecio === null || precioProducto <= maxPrecio;
    const ratingMin = sellerRatingSeleccionada === 'Todas' ? null : parseInt(sellerRatingSeleccionada, 10);
    const matchesSellerRating = ratingMin === null || (p.vendedor?.estrellas || 0) >= ratingMin;
    return matchesSearch && matchesCategoria && matchesCondicion && matchesZona && matchesPrecioMin && matchesPrecioMax && matchesSellerRating;
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
            placeholder="Buscar producto, vendedor o palabra clave..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="user-access">
          {usuario ? (
            <>
              <span className="welcome-text">Hola, {usuario.nombre} ({usuario.role})</span>
              <Link to="/mis-publicaciones" className="btn-registro">
                Mis publicaciones
              </Link>
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
        <div className="price-filter">
          <input
            type="number"
            min="0"
            step="100"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            placeholder="Precio min"
          />
          <input
            type="number"
            min="0"
            step="100"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="Precio max"
          />
        </div>
        <div className="condition-filter">
          <select value={zonaSeleccionada} onChange={(e) => setZonaSeleccionada(e.target.value)}>
            <option value="Todas">Todas las zonas</option>
            <option value="Norte">Norte</option>
            <option value="Sur">Sur</option>
            <option value="Oeste">Oeste</option>
            <option value="CABA">CABA</option>
          </select>
        </div>
        <div className="seller-filter">
          <select value={sellerRatingSeleccionada} onChange={(e) => setSellerRatingSeleccionada(e.target.value)}>
            <option value="Todas">Mejores vendedores</option>
            <option value="3">3+ estrellas</option>
            <option value="4">4+ estrellas</option>
            <option value="5">5 estrellas</option>
          </select>
        </div>
        <button className="btn-clear-filters" onClick={resetFilters}>Limpiar filtros</button>
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
          <MapaBarrio
            productos={productosFiltrados}
            locales={localesPublicitarios}
            onMapClick={abrirModalConClic}
            onProductSelect={handleProductSelect}
            onCenterMap={mapCenterRef}
            zona={zonaSeleccionada}
          />
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
          {publicidades.length > 0 ? (
            publicidades.map(pub => (
              <div
                key={`pub-${pub._id}`}
                className="marquee-item"
                onClick={() => {
                  // Registrar click en publicidad
                  fetch(`http://localhost:5001/api/publicidades/${pub._id}/click`, {
                    method: 'PUT'
                  }).catch(err => console.error('Error registrando click:', err));
                }}
              >
                <span>{pub.texto}</span>
              </div>
            ))
          ) : (
            // Publicidades por defecto si no hay ninguna activa
            <>
              <div className="marquee-item">
                <span>🔥 HELADERIA BALLESTER: 2x1 en 1/4kg todos los jueves 🍦</span>
              </div>
              <div className="marquee-item">
                <span>🛠️ FERRETERIA MALAIPU: 15% OFF en herramientas</span>
              </div>
              <div className="marquee-item">
                <span>📦 MarketPin: Tu mercado local en San Martín</span>
              </div>
            </>
          )}
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
      {mostrarDetalleProducto && productoSeleccionado && (
        <div className="product-detail-overlay" onClick={closeProductDetail}>
          <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="product-detail-gallery">
              <img
                src={productoSeleccionado.imgs?.[detalleImagenIndex] || productoSeleccionado.foto || 'https://i.ibb.co/JpXgm06/default-product.jpg'}
                alt={productoSeleccionado.title || productoSeleccionado.titulo}
              />
              {(productoSeleccionado.imgs || []).length > 1 && (
                <>
                  <button className="gallery-control prev" onClick={handlePrevImage}>‹</button>
                  <button className="gallery-control next" onClick={handleNextImage}>›</button>
                  <div className="product-detail-thumbs">
                    {productoSeleccionado.imgs.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`product-detail-thumb ${idx === detalleImagenIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                        onClick={() => setDetalleImagenIndex(idx)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="product-detail-content">
              <div className="product-detail-header">
                <div>
                  <p className="product-detail-badge">Producto</p>
                  <h2>{productoSeleccionado.title || productoSeleccionado.titulo}</h2>
                </div>
                <button className="product-detail-close" onClick={closeProductDetail}>✕</button>
              </div>

              <p className="product-detail-price">${(productoSeleccionado.price || productoSeleccionado.precio || 0).toLocaleString()}</p>
              <p className="product-detail-description">{productoSeleccionado.descripcion || productoSeleccionado.descripcionCorta || 'Sin descripción disponible.'}</p>

              <div className="product-detail-vendor">
                <div>
                  <span className="vendor-label">Vendedor</span>
                  <strong>{productoSeleccionado.vendedor?.nombre || 'Vendedor MarketPin'}</strong>
                </div>
                <div className="vendor-rating">{'★'.repeat(Math.round(productoSeleccionado.vendedor?.estrellas || 0))}{'☆'.repeat(5 - Math.round(productoSeleccionado.vendedor?.estrellas || 0))}</div>
              </div>

              <div className="product-detail-actions">
                <button className="btn-buy" onClick={() => window.open(`https://wa.me/${(productoSeleccionado.vendedor?.whatsapp || productoSeleccionado.whatsapp || '5491123456789').replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me interesa comprar: ' + (productoSeleccionado.title || productoSeleccionado.titulo))}`, '_blank')}>
                  COMPRAR
                </button>
                <button className="btn-orange" onClick={() => window.open(`https://wa.me/${(productoSeleccionado.vendedor?.whatsapp || productoSeleccionado.whatsapp || '5491123456789').replace(/\D/g, '')}?text=${encodeURIComponent('Hola, quiero permutar: ' + (productoSeleccionado.title || productoSeleccionado.titulo))}`, '_blank')}>
                  PERMUTAR
                </button>
                <button className="btn-light" onClick={() => window.open(`https://wa.me/${(productoSeleccionado.vendedor?.whatsapp || productoSeleccionado.whatsapp || '5491123456789').replace(/\D/g, '')}?text=${encodeURIComponent('Hola, quiero hacer una oferta por: ' + (productoSeleccionado.title || productoSeleccionado.titulo))}`, '_blank')}>
                  OFERTAR
                </button>
              </div>
              <div className="offer-form">
                <h3>Enviar oferta</h3>
                <div className="offer-inputs">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={ofertaMonto}
                    onChange={(e) => setOfertaMonto(e.target.value)}
                    placeholder="Monto propuesto"
                  />
                  <textarea
                    value={ofertaMensaje}
                    onChange={(e) => setOfertaMensaje(e.target.value)}
                    placeholder="Mensaje opcional"
                  />
                </div>
                <button className="btn-send-offer" onClick={handleEnviarOferta}>
                  Enviar oferta por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
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