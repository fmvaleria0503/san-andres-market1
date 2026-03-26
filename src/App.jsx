import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix íconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function App() {
  // 4 productos HARDCODEADOS (FUNCIONA SIEMPRE)
  const productos = [
    { id: 1, title: "🛋️ Mesa madera", price: 10000, lat: -34.5652, lng: -58.5445 },
    { id: 2, title: "❄️ Heladera", price: 25000, lat: -34.5645, lng: -58.5455 },
    { id: 3, title: "🚲 Busco bici", price: 0, lat: -34.5660, lng: -58.5430 },
    { id: 4, title: "💺 Silla gaming", price: 8000, lat: -34.5658, lng: -58.5448 }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
        🏘️ San Andrés Market - 4 PINES ✅
      </h1>
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <MapContainer
          center={[-34.56521, -58.54448]}
          zoom={15}
          style={{ height: "70vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {productos.map((producto) => (
            <Marker key={producto.id} position={[producto.lat, producto.lng]}>
              <Popup>
                <div className="p-3">
                  <h3 className="font-bold text-lg mb-2">{producto.title}</h3>
                  {producto.price > 0 && (
                    <p className="text-2xl font-bold text-green-600 mb-3">
                      ${producto.price}
                    </p>
                  )}
                  <div className="space-y-2 text-sm">
                    <button className="w-full bg-green-500 text-white py-2 px-3 rounded font-medium">
                      💰 Comprar
                    </button>
                    <button className="w-full bg-orange-500 text-white py-2 px-3 rounded font-medium">
                      🔄 Permutar
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        🟢 {productos.length} productos en San Andrés | Zoom para ver mejor
      </div>
    </div>
  );
}

export default App;