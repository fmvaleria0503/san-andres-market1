import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import logo from "./assets/logo.png"; 

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const productos = [
  { id: 1, title: "MESA DE MADERA MACIZA", price: 10000, lat: -34.5652, lng: -58.5445, 
    // Ahora cada producto tiene una lista de fotos
    imgs: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400", // Foto principal
      "https://images.unsplash.com/photo-1593113110906-8a5061456d6f?w=400", // Foto 2
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400", // Foto 3
    ], vendedor: "Juan Muebles" },
  { id: 2, title: "HELADERA PATRICK NO FROST", price: 25000, lat: -34.5645, lng: -58.5455, 
    imgs: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
    ], vendedor: "Electro San Martín" },
];

const vendedores = [
  { id: 1, nombre: "Juan Muebles", rating: 5, ventas: 120, opinion: "Muy buena atención, cumplidor." },
  { id: 2, nombre: "Electro San Martín", rating: 4, ventas: 85, opinion: "Productos de calidad y buen precio." },
];

const locales = [
  { id: 1, nombre: "Ferretería Don Pepe", promo: "10% OFF EFECTIVO", img: "https://lh5.googleusercontent.com/p/AF1QipN3-ZJ9" },
  { id: 2, nombre: "Pinturería San Andrés", promo: "4x3 EN LATEX", img: "https://lh5.googleusercontent.com/p/AF1QipO9" }
];

function App() {
  const [vendedorSel, setVendedorSel] = useState(null);
  
  // Estado para controlar qué foto se está viendo en cada popup individual
  // Usamos un objeto { productId: photoIndex }
  const [fotoSelPorProducto, setFotoSelPorProducto] = useState({});

  const st = {
    header: { display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0', backgroundColor: '#fff', zIndex: 1001 },
    logoContainer: { height: '45px', marginBottom: '8px' },
    logoImg: { height: '100%', width: 'auto', objectFit: 'contain' },
    search: { width: '100%', maxWidth: '380px', padding: '10px 20px', borderRadius: '50px', border: '2px solid #1e3a8a', textAlign: 'center', fontWeight: 'bold', fontSize: '13px', backgroundColor: '#fff' },
    appBody: { display: 'flex', height: 'calc(100vh - 175px)', overflow: 'hidden' },
    sidebarLeft: { width: '240px', borderRight: '1px solid #eee', padding: '15px', overflowY: 'auto', backgroundColor: '#fff' },
    mapContainer: { flex: 1, position: 'relative' },
    sidebarRight: { width: '260px', borderLeft: '1px solid #eee', padding: '15px', overflowY: 'auto', backgroundColor: '#fff' },
    footer: { height: '105px', backgroundColor: '#020617', padding: '10px 20px', color: '#fff' },
    // Estilos del Popup
    popupTitle: { margin: '0', fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '8px' },
    popupPrice: { margin: '2px 0', fontSize: '16px', fontWeight: '900', color: '#f97316' },
    popupBtnGroup: { display: 'flex', gap: '3px', marginTop: '10px' },
    popupBtn: { padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', border: 'none', color: 'white', flex: 1, textTransform: 'uppercase' },
    // Estilos de la galería en el Popup
    gallery: { display: 'flex', gap: '3px', marginTop: '5px', overflowX: 'auto', scrollbarWidth: 'thin', paddingBottom: '3px' },
    thumbnail: { width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' },
    activeThumbnail: { borderColor: '#f97316' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', fontFamily: 'sans-serif' }}>
      
      {/* HEADER PULIDO */}
      <header style={st.header}>
        <div style={{ alignSelf: 'flex-end', paddingRight: '20px', fontSize: '11px', color: '#64748b' }}>
            <span style={{ marginRight: '15px', cursor: 'pointer' }}>Ingresar</span>
            <span style={{ color: '#1e3a8a', border: '1px solid #1e3a8a', padding: '2px 10px', borderRadius: '20px', fontWeight: 'bold' }}>REGISTRARSE</span>
        </div>
        <div style={st.logoContainer}><img src={logo} alt="MarketPin" style={st.logoImg} /></div>
        <input type="text" placeholder="¿Qué buscás en San Martín?..." style={st.search} />
      </header>

      <div style={st.appBody}>
        {/* IZQUIERDA: VENDEDORES */}
        <aside style={st.sidebarLeft}>
          <div style={{ backgroundColor: '#1e3a8a', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '5px 10px', borderRadius: '4px', marginBottom: '15px' }}>RANKING VENDEDORES</div>
          {vendedores.map(v => (
            <div key={v.id} style={{ marginBottom: '15px' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#1e3a8a' }}>{v.nombre.toUpperCase()}</p>
              <p style={{ margin: 0, color: '#facc15' }}>{"★".repeat(v.rating)} <span style={{ color: '#94a3b8', fontSize: '9px' }}>{v.ventas} ventas</span></p>
            </div>
          ))}
        </aside>

        {/* CENTRO: MAPA CON PINES INTERACTIVOS */}
        <main style={st.mapContainer}>
          <MapContainer center={[-34.5652, -58.5444]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {productos.map(p => {
              // Obtenemos el índice de la foto seleccionada para este producto específico (0 por defecto)
              const fotoIndexSel = fotoSelPorProducto[p.id] || 0;
              const fotoPrincipal = p.imgs[fotoIndexSel] || p.imgs[0];

              return (
                <Marker key={p.id} position={[p.lat, p.lng]}>
                  <Popup minWidth={190}>
                    <div style={{ textAlign: 'center', padding: '5px' }}>
                      
                      {/* FOTO PRINCIPAL GRANDE */}
                      <img 
                        src={fotoPrincipal} 
                        style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                      />
                      
                      {/* GALERÍA DE MINIATURAS (más fotos) */}
                      {p.imgs.length > 1 && (
                        <div style={st.gallery}>
                          {p.imgs.map((imgUrl, index) => (
                            <img 
                              key={index}
                              src={imgUrl} 
                              onClick={() => setFotoSelPorProducto({...fotoSelPorProducto, [p.id]: index})} // Cambia la foto principal al hacer clic
                              style={{ 
                                ...st.thumbnail, 
                                ...(index === fotoIndexSel ? st.activeThumbnail : {}) 
                              }} 
                            />
                          ))}
                          {/* El botón "más fotos" */}
                          <div style={{ ...st.thumbnail, backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', textAlign: 'center', p: '2px', border: '1px solid #ddd' }} title="Toca las fotos para ver más">
                            MÁS FOTOS
                          </div>
                        </div>
                      )}
                      
                      <p style={st.popupTitle}>{p.title}</p>
                      <p style={st.popupPrice}>${p.price.toLocaleString()}</p>
                      
                      {/* BOTONES DE ACCIÓN */}
                      <div style={st.popupBtnGroup}>
                        <button style={{ ...st.popupBtn, backgroundColor: '#16a34a' }}>COMPRAR</button>
                        <button style={{ ...st.popupBtn, backgroundColor: '#1d4ed8' }}>PERMUTAR</button>
                        <button style={{ ...st.popupBtn, backgroundColor: '#f97316' }}>OFERTAR</button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </main>

        {/* DERECHA: DESTACADOS */}
        <aside style={st.sidebarRight}>
          <div style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '5px 10px', borderRadius: '4px', marginBottom: '15px' }}>⭐ PRODUCTOS DESTACADOS</div>
          {productos.map(p => (
            <div key={p.id} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
              <img src={p.imgs[0]} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
              <div style={{ padding: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', margin: 0 }}>{p.title}</p>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a', margin: '3px 0' }}>${p.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* FOOTER LOCALES */}
      <footer style={st.footer}>
        <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '10px' }}>COMERCIOS DEL BARRIO (Tipo Google Maps)</p>
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto' }}>
          {locales.map(l => (
            <div key={l.nombre} style={{ display: 'flex', gap: '10px', backgroundColor: '#fff', padding: '8px', borderRadius: '12px', minWidth: '220px', alignItems: 'center', color: '#000' }}>
              <img src={l.img} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <p style={{ fontSize: '10px', fontWeight: 'bold', margin: 0 }}>{l.nombre.toUpperCase()}</p>
                <p style={{ color: '#f97316', fontSize: '9px', fontWeight: 'bold', margin: '2px 0' }}>{l.promo}</p>
                <span style={{ fontSize: '8px', border: '1px solid #ddd', padding: '2px 6px', borderRadius: '10px', color: '#333' }}>VER LOCAL</span>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;