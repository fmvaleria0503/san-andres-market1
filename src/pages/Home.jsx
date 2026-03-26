import MapaBarrio from "../components/MapaBarrio";

function Home() {
  return (
    <div className="max-w-7xl mx-auto h-[70vh] lg:h-[80vh]">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full gap-6">
        {/* Mapa principal - ALTURA 100% CLAVE */}
        <div className="lg:col-span-3 h-full">
          <div className="h-full w-full rounded-xl shadow-2xl overflow-hidden">
            <MapaBarrio />
          </div>
        </div>
        
        {/* Panel lateral */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📍 Productos cerca
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Filtrá por:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700">
                  Venta
                </button>
                <button className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full hover:bg-orange-700">
                  Canje
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Aparecen según zoom del mapa</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;