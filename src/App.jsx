import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para los iconos de los marcadores
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const productos = [
  { id: 1, title: "🛋️ Mesa madera", price: 10000, lat: -34.5652, lng: -58.5445, img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300" },
  { id: 2, title: "❄️ Heladera", price: 25000, lat: -34.5645, lng: -58.5455, img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300" },
  { id: 3, title: "💺 Silla gaming", price: 8000, lat: -34.5658, lng: -58.5448, img: "https://images.unsplash.com/photo-1598550476439-6847785fce6c?w=300" }
];

const pubs = [
  { nombre: "🏪 Ferretería Don Pepe", promo: "10% OFF", color: "from-orange-500 to-red-600" },
  { nombre: "🍕 Pizzería La Esquina", promo: "2x1 Muzza", color: "from-red-600 to-yellow-500" },
  { nombre: "⚽ Fútbol San Martín", promo: "Inscripciones", color: "from-green-500 to-blue-600" }
];

function App() {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 overflow-hidden text-slate-900">
      
      {/* HEADER */}
      <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 z-[1001] shrink-0 border-b">
        <h1 className="text-xl font-black text-blue-600 uppercase tracking-tighter italic">
          Market Pin <span className="text-slate-400 font-normal not-italic">San Martín</span>
        </h1>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-blue-700 transition-all active:scale-95">
          + Publicar
        </button>
      </header>

      {/* CUERPO CENTRAL */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* IZQUIERDA: PRODUCTOS DESTACADOS */}
        <aside className="w-full lg:w-80 bg-white border-r overflow-hidden flex flex-col shrink-0 z-20 shadow-xl">
          <div className="p-4 bg-slate-50 border-b font-black text-[10px] text-slate-500 uppercase tracking-widest">
            ⭐ Destacados del barrio
          </div>
          <div className="flex-1 overflow-x-auto lg:overflow-y-auto p-4 flex lg:flex-col gap-4 scrollbar-hide">
            {productos.map(p => (
              <div key={p.id} className="min-w-[220px] lg:min-w-0 bg-white border rounded-2xl overflow-hidden shadow-sm hover:border-blue-400 transition-colors">
                <img src={p.img} alt={p.title} className="w-full h-28 object-cover" />
                <div className="p-3">
                  <h4 className="font-bold text-sm truncate">{p.title}</h4>
                  <p className="text-blue-600 font-black text-lg">${p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAPA (Centro) */}
        <main className="flex-1 relative z-10 bg-slate-200">
          <MapContainer 
            center={[-34.5652, -58.5444]} 
            zoom={15} 
            style={{ height: "100%", width: "100%", position: "absolute" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {productos.map(p => (
              <Marker key={p.id} position={[p.lat, p.lng]}>
                <Popup>
                  <div className="text-center font-bold">
                    {p.title} <br/> <span className="text-blue-600">${p.price}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </main>
      </div>

      {/* FOOTER: PUBLICIDADES */}
      <footer className="h-40 bg-slate-900 shrink-0 p-4 z-[1001] shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-2">Comercios Amigos</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-2">
          {pubs.map((pub, i) => (
            <div key={i} className={`min-w-[280px] bg-gradient-to-br ${pub.color} p-5 rounded-2xl text-white shadow-xl flex flex-col justify-between shrink-0 transition-transform hover:scale-105 cursor-pointer`}>
              <div>
                <h4 className="font-black text-lg leading-tight">{pub.nombre}</h4>
                <p className="text-white/80 text-sm font-medium">{pub.promo}</p>
              </div>
              <button className="mt-2 bg-white/20 backdrop-blur-md py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">Ver Local</button>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;