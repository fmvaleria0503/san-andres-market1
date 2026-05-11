import React, { useState, useEffect } from 'react';

const MejoresVendedores = ({ zona = 'Don Torcuato' }) => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/usuarios/mejores-vendedores?zona=${zona}&limit=6`)
      .then(res => res.json())
      .then(data => setVendedores(data.vendedores || []))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, [zona]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400 text-lg">⭐</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400 text-lg">⭐</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300 text-lg">☆</span>);
    }
    return stars;
  };

  if (loading) return <div className="text-center py-8">Cargando mejores vendedores...</div>;

  if (vendedores.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            ⭐ Mejores Vendedores en {zona}
          </h2>
          <p className="text-center text-gray-500">No hay vendedores calificados aún</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          ⭐ Mejores Vendedores en {zona}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendedores.map((vendedor) => (
            <div
              key={vendedor._id}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-blue-200"
            >
              {/* Avatar y nombre */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={vendedor.imagenPerfil || 'https://via.placeholder.com/60x60/ccc?text=V'}
                    alt={vendedor.nombre}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  {vendedor.esPremium && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                      <span className="text-xs">👑</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{vendedor.nombre}</h3>
                  <div className="flex items-center space-x-1">
                    {renderStars(vendedor.calificacion || 0)}
                    <span className="text-sm text-gray-600 ml-2">
                      ({vendedor.totalCalificaciones || 0})
                    </span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{vendedor.productosVendidos || 0}</p>
                  <p className="text-xs text-gray-600">Productos vendidos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{vendedor.productosActivos || 0}</p>
                  <p className="text-xs text-gray-600">Productos activos</p>
                </div>
              </div>

              {/* Badge premium */}
              {vendedor.esPremium && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 mb-4">
                  <p className="text-xs text-yellow-800 font-medium text-center">
                    🏆 Vendedor Premium
                  </p>
                </div>
              )}

              {/* Contacto */}
              {vendedor.whatsapp && (
                <a
                  href={`https://wa.me/${vendedor.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📱</span>
                  <span>Contactar</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MejoresVendedores;