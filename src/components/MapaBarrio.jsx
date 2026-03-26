import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import productos from "../data/productos.json";
import ProductCard from "./ProductCard";

// Fix íconos Leaflet UNA SOLA VEZ
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const center = [-34.56521, -58.54448];

function MapaBarrio() {
  useEffect(() => {
    // Forzar redimensionar mapa
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {productos.map((producto) => (
          <Marker key={producto.id} position={[producto.lat, producto.lng]}>
            <Popup maxWidth={320}>
              <ProductCard producto={producto} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapaBarrio;