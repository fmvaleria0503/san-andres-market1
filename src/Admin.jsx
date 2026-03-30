import React, { useState, useEffect } from 'react';
import MapaBarrio from './components/MapaBarrio';
import ModalVenderPro from './components/ModalVenderPro';
import Registro from './components/Registro';
import { FiSearch, FiZap, FiUser } from 'react-icons/fi';
import logo from './assets/logo.png'; 
import './App.css';

const App = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [coordsClic, setCoordsClic] = useState(null);

  useEffect(() => {
    // Cargar productos aprobados desde el backend
    fetch("http://localhost:5000/api/productos?aprobado=true")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error backend:", err));
  }, []);

  const abrirModalConClic = (coordenadas) => {
    setCoordsClic(coordenadas);
    setMostrarModal(true);
  };

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
          <button className="btn-registro" onClick={() => setMostrarRegistro(true)}>
            REGISTRO
          </button>
          <FiUser className="user-icon" />
        </div>
      </header>

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