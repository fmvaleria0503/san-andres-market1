import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // <-- Importamos Swiper
import 'swiper/css'; // <-- Importamos los estilos base
import './CarruselOfertas.css'; // Tus estilos personalizados

const CarruselOfertas = ({ productos }) => {
  // Manejo de carga de datos para evitar errores
  if (!productos || productos.length === 0) {
    return (
      <div className="cargando-fravega">
        <p>Cargando ofertas exclusivas en San Martín...</p>
      </div>
    );
  }

  // Configuración del Swiper (responsivo y elegante)
  const settings = {
    spaceBetween: 20, // Espacio entre tarjetas
    slidesPerView: 4, // 4 tarjetas a la vez
    breakpoints: { // Responsivo
      320: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 4 }
    }
  };

  return (
    <div className="carrusel-fravega-container">
      <Swiper {...settings}>
        {productos.map((p) => (
          <SwiperSlide key={p._id}>
            <div className="tarjeta-fravega-pro">
              {/* Badge de Oferta (Opcional) */}
              <div className="badge-oferta-naranja">¡OFERTA!</div>
              
              <img 
                src={p.imgs?.[0]} 
                alt={p.title} 
                className="p-image"
                // Si la imagen falla, mostramos un placeholder
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=No+Foto";
                }}
              />
              
              <div className="p-info">
                <h4>{p.title}</h4>
                <p className="p-price">${p.price?.toLocaleString()}</p>
                <span className="p-envio">Envío Gratis</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarruselOfertas;