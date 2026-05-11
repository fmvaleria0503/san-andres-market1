const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imgs: [String], // Múltiples imágenes
  location: { lat: Number, lng: Number },
  aprobado: { type: Boolean, default: false }, // <--- CAMPO CLAVE
  vendedor: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    nombre: String, 
    estrellas: Number,
    whatsapp: String,
    imagenPerfil: String
  },
  descripcion: {
    type: String,
    default: ''
  },
  categoria: {
    type: String,
    default: 'general'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Producto', ProductoSchema);