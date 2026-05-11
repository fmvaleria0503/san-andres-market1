import React, { useState, useEffect } from 'react';

const Publicidades = ({ zona = 'Don Torcuato' }) => {
  const [publicidades, setPublicidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/publicidades?zona=${zona}&limit=6`)
      .then(res => res.json())
      .then(data => setPublicidades(data.publicidades || data))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, [zona]);

  const handleView = async (id) => {
    try {
      await fetch(`/api/publicidades/${id}/impresion`);
      window.open(`/publicidad/${id}`, '_blank');
    } catch {}
  };

  if (loading) return <div className="text-center py-12">Cargando publicidades locales...</div>;

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          🏪 Comercios en {zona}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicidades.map((pub) => (
            <div 
              key={pub._id} 
              className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${
                pub.tipo === 'premium' ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {/* Imagen del local */}
              <div className="relative h-64 overflow-hidden bg-gray-100 group">
                <img 
                  src={pub.imagenLocal || pub.imagenes[0] || 'https://via.placeholder.com/400x300/ccc?text=Comercio'} 
                  alt={pub.anunciante?.nombre || pub.texto}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge premium */}
                {pub.tipo === 'premium' && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-1">
                    ⭐ PREMIUM
                  </div>
                )}

                {/* Overlay info anunciante */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h3 className="font-bold text-xl mb-1">{pub.anunciante?.nombre}</h3>
                  <p className="text-sm opacity-90">{pub.zona}</p>
                  {pub.anunciante?.whatsapp && (
                    <a 
                      href={`https://wa.me/${pub.anunciante.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-green-300 hover:text-green-100 text-sm mt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📱 WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h4 className="font-bold text-xl mb-3 line-clamp-2">{pub.texto}</h4>
                
                {pub.productos?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 font-medium mb-2">Productos destacados:</p>
                    <div className="space-y-2">
                      {pub.productos.slice(0, 2).map((prod, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm font-medium">{prod.nombre}</span>
                          {prod.precio && <span className="text-sm text-green-600 font-bold">${prod.precio}</span>}
                          {prod.descuento && <span className="text-xs text-red-500">-{prod.descuento}%</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón */}
                <button
                  onClick={() => handleView(pub._id)}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    pub.tipo === 'premium' 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                  }`}
                >
                  Ver Comercio
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                {/* Métricas */}
                <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-4 border-t">
                  <span>👁️ {pub.impresiones.toLocaleString()}</span>
                  <span>🖱️ {pub.clicks.toLocaleString()} clicks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publicidades;