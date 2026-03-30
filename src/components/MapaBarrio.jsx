import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiMessageSquare } from 'react-icons/fi'; // Necesitas react-icons: npm install react-icons
import './MapaBarrio.css';

// ESTO ARREGLA EL ERROR DE VISUALIZACIÓN
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => { map.invalidateSize(); }, 500);
  }, [map]);
  return null;
}

// ÍCONO PERSONALIZADO CON LA FOTO DEL PRODUCTO
const crearIcono = (urlFoto) => {
  return new L.DivIcon({
    html: `
      <div class="mp-pin-wrapper">
        <img src="${urlFoto}" alt="" />
        <div class="mp-pin-tip"></div>
      </div>
    `,
    className: 'custom-pin', // Quitamos el fondo blanco default
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });
};

const MapaBarrio = ({ productos = [], onMapClick }) => {
  const itemsConCoords = productos.filter((p) => {
    const hasLocation = p?.location?.lat !== undefined && p?.location?.lng !== undefined;
    const hasLatLng = p?.lat !== undefined && p?.lng !== undefined;
    return hasLocation || hasLatLng;
  });

  return (
    <MapContainer 
      center={[-34.57, -58.53]} 
      zoom={14} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ResizeMap /> 

      {itemsConCoords.map((p) => {
        const lat = p?.location?.lat ?? p?.lat;
        const lng = p?.location?.lng ?? p?.lng;
        return (
          <Marker 
            key={p._id || p.id} 
            position={[lat, lng]}
            icon={crearIcono(p.imgs?.[0])} // Usa la foto real
          >
          {/* EL POPUP PROFESIONAL ESTILO IMAGEN 2 */}
          <Popup className="mp-popup-wrapper">
            <div className="mp-popup-pro">
              
              <div className="mp-gallery">
                <img src={p.imgs?.[0]} alt="" className="mp-popup-img" />
                <div className="mp-dots">
                   <span class="active"></span><span></span><span></span>
                </div>
              </div>

              <div className="mp-info">
                <h4>{p.title}</h4>
                <p className="mp-price">${p.price.toLocaleString()}</p>
                <div className="mp-vendedor">👤 {p.vendedor || 'Usuario MarketPin'}</div>
                
                {/* Botones principales */}
                <div className="mp-actions">
                  <button className="btn-buy">COMPRAR</button>
                  <button className="btn-light">PERMUTAR</button>
                  <button className="btn-orange">OFERTAR</button>
                </div>

                {/* Botón WhatsApp */}
                <button className="btn-whatsapp">
                  <FiMessageSquare /> WHATSAPP
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapaBarrio;