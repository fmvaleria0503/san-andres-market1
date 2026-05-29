import React, { useState, useEffect } from 'react';
import MapaBarrio from "../components/MapaBarrio";
import MejoresVendedores from "../components/MejoresVendedores";

const zonas = ['Todas', 'Norte', 'Sur', 'Oeste', 'CABA'];

function Home() {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('Todas');
  const [publicidades, setPublicidades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const query = zonaSeleccionada !== 'Todas' ? `?zona=${encodeURIComponent(zonaSeleccionada)}` : '';
        const res = await fetch(`http://localhost:5000/api/publicidades${query}`);
        const data = await res.json();
        setPublicidades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando publicidades:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [zonaSeleccionada]);

  return (
    <div>
      <div className="max-w-7xl mx-auto h-[70vh] lg:h-[80vh]">
        <div className="grid grid-cols-1 lg:grid-cols-4 h-full gap-6">
          <div className="lg:col-span-3 h-full">
            <div className="h-full w-full rounded-xl shadow-2xl overflow-hidden">
              <MapaBarrio />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">📍 Buscar por zona</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {zonas.map((zona) => (
                  <button
                    key={zona}
                    onClick={() => setZonaSeleccionada(zona)}
                    className={`px-3 py-2 rounded-full text-sm font-semibold ${zonaSeleccionada === zona ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`}
                  >
                    {zona}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Resultados para: <strong>{zonaSeleccionada}</strong></p>
                <p className="text-xs text-blue-800 mt-1">Las publicidades premium se muestran primero.</p>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[50vh]">
                {loading ? (
                  <p className="text-sm text-gray-600">Cargando publicidades...</p>
                ) : publicidades.length > 0 ? (
                  publicidades.map((pub) => (
                    <div key={pub._id} className="border rounded-xl p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        {pub.imagenes?.[0] ? (
                          <img src={pub.imagenes[0]} alt={pub.texto} className="w-20 h-20 object-cover rounded-lg" />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                            Sin imagen
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-800">{pub.texto.slice(0, 55)}{pub.texto.length > 55 ? '...' : ''}</h3>
                          <p className="text-xs text-gray-500">{pub.tipo === 'premium' ? 'Destacado Premium' : 'Publicidad normal'}</p>
                          <p className="text-sm text-gray-700 mt-2">Zona: {pub.zona || 'No especificada'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No se encontraron publicidades para esta zona.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MejoresVendedores zona={zonaSeleccionada !== 'Todas' ? zonaSeleccionada : 'Don Torcuato'} />
    </div>
  );
}

export default Home;node server.js