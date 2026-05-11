import React, { useState } from 'react';

function ProductCard({ producto }) {
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = producto.imgs || [];
  const vendedor = producto.vendedor || {};

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">⭐</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">⭐</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">☆</span>);
    }
    return stars;
  };

  return (
    <div className="w-72 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
      {/* Imagen principal con navegación */}
      <div className="relative w-full h-48 bg-gray-100 rounded-lg mb-3 overflow-hidden group">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={producto.title}
              className="w-full h-full object-cover"
            />

            {/* Indicadores de imágenes */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Botón de más imágenes */}
            {images.length > 1 && (
              <button
                onClick={() => setShowMoreImages(!showMoreImages)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Modal de más imágenes */}
      {showMoreImages && images.length > 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMoreImages(false)}>
          <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Imágenes del producto</h3>
              <button onClick={() => setShowMoreImages(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setShowMoreImages(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Información del producto */}
      <div className="mb-3">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{producto.title}</h3>
        {producto.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{producto.descripcion}</p>
        )}
        {producto.price > 0 && (
          <p className="text-2xl font-bold text-green-600">${producto.price}</p>
        )}
      </div>

      {/* Información del vendedor */}
      <div className="mb-3 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          {vendedor.imagenPerfil && (
            <img
              src={vendedor.imagenPerfil}
              alt={vendedor.nombre}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium">{vendedor.nombre || 'Vendedor'}</span>
        </div>
        <div className="flex items-center space-x-1">
          {renderStars(vendedor.estrellas || 0)}
          <span className="text-xs text-gray-500 ml-1">
            ({vendedor.totalCalificaciones || 0})
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-2">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition-colors">
          💰 Comprar
        </button>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg font-medium transition-colors">
          🔄 Permutar
        </button>

        {/* WhatsApp */}
        {vendedor.whatsapp && (
          <a
            href={`https://wa.me/${vendedor.whatsapp.replace(/\D/g, '')}?text=Hola, me interesa tu producto: ${producto.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <span>📱</span>
            <span>Contactar por WhatsApp</span>
          </a>
        )}
      </div>

      {/* Categoría y fecha */}
      <div className="mt-3 text-xs text-gray-500 flex justify-between">
        <span>{producto.categoria || 'General'}</span>
        <span>{new Date(producto.fechaCreacion || Date.now()).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default ProductCard;

export default ProductCard;