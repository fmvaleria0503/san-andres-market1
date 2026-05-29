import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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

const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) onMapClick(e.latlng);
    }
  });
  return null;
};

const MapaBarrio = ({ productos = [], locales = [], onMapClick, onProductSelect, onCenterMap, zona = 'Todas' }) => {
  const mapRef = useRef();

  const centroPorZona = {
    Todas: { center: [-34.57, -58.53], zoom: 13 },
    Norte: { center: [-34.556, -58.513], zoom: 14 },
    Sur: { center: [-34.593, -58.544], zoom: 14 },
    Oeste: { center: [-34.569, -58.575], zoom: 14 },
    CABA: { center: [-34.608, -58.377], zoom: 12 }
  };

  useEffect(() => {
    if (mapRef.current) {
      const view = centroPorZona[zona] || centroPorZona.Todas;
      mapRef.current.setView(view.center, view.zoom);
    }
  }, [zona]);

  useEffect(() => {
    if (onCenterMap) {
      onCenterMap.current = (producto) => {
        if (mapRef.current) {
          const lat = producto?.location?.lat ?? producto?.lat;
          const lng = producto?.location?.lng ?? producto?.lng;
          if (lat && lng) {
            mapRef.current.setView([lat, lng], 16);
          }
        }
      };
    }
  }, [onCenterMap]);

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
      ref={mapRef}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ResizeMap /> 
      <ClickHandler onMapClick={onMapClick} />

      {itemsConCoords.map((p) => {
        const lat = p?.location?.lat ?? p?.lat;
        const lng = p?.location?.lng ?? p?.lng;
        const fotoPin = p.imgs?.[0] || p.foto || 'https://i.ibb.co/JpXgm06/default-product.jpg';
        const precio = p.price ?? p.precio ?? 0;
        const vendedorNombre = p.vendedor?.nombre || 'Vendedor MarketPin';
        const estrellas = Math.round(p.vendedor?.estrellas || 0);
        const whatsAppNumber = (p.vendedor?.whatsapp || p.whatsapp || '5491123456789').replace(/\D/g, '');
        const whatsappLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hola, me interesa tu producto: ' + (p.title || p.titulo || ''))}`;
        return (
          <Marker 
            key={p._id || p.id} 
            position={[lat, lng]}
            icon={crearIcono(fotoPin)}
            eventHandlers={{
              click: () => {
                if (onProductSelect) onProductSelect(p);
              }
            }}
          >
          {/* EL POPUP PROFESIONAL ESTILO IMAGEN 2 */}
          <Popup className="mp-popup-wrapper">
            <div className="mp-popup-pro">
              
              <div className="mp-gallery">
                <img src={fotoPin} alt={p.title || p.titulo} className="mp-popup-img" />
                <div className="mp-dots">
                  <span className="active"></span><span></span><span></span>
                </div>
              </div>

              <div className="mp-info">
                <h4>{p.title || p.titulo || 'Producto'}</h4>
                <p className="mp-price">${precio.toLocaleString()}</p>
                <div className="mp-vendedor">👤 {vendedorNombre}</div>
                <div className="mp-vendedor">{'★'.repeat(estrellas)}{'☆'.repeat(5 - estrellas)}</div>

                <div className="mp-actions">
                  <button className="btn-buy" onClick={() => window.open(whatsappLink, '_blank')}>COMPRAR</button>
                  <button className="btn-light" onClick={() => window.open(`${whatsappLink}%20(Quiero%20permutar)`, '_blank')}>PERMUTAR</button>
                  <button className="btn-orange" onClick={() => window.open(`${whatsappLink}%20(Quiero%20ofertar)`, '_blank')}>OFERTAR</button>
                </div>

                <button className="btn-more-details" onClick={() => onProductSelect?.(p)}>
                  Ver más detalles
                </button>
                <button className="btn-whatsapp" onClick={() => window.open(whatsappLink, '_blank')}>
                  <FiMessageSquare /> WHATSAPP
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
        );
      })}

      {/* Marcadores para locales publicitarios */}
      {locales.map((local) => (
        <Marker 
          key={`local-${local.id}`} 
          position={[local.lat, local.lng]}
          icon={crearIcono(local.imagen)} // Usa la imagen del local
        >
          <Popup className="mp-popup-wrapper">
            <div className="mp-popup-pro">
              <div className="mp-gallery">
                <img src={local.imagen} alt="" className="mp-popup-img" />
              </div>
              <div className="mp-info">
                <h4>{local.nombre}</h4>
                <p className="mp-price">Local Publicitario</p>
                <div className="mp-vendedor">🏪 Comercio Local</div>
                <button className="btn-orange">VISITAR</button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapaBarrio;