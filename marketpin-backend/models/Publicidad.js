const mongoose = require('mongoose');

const PublicidadSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true,
    maxlength: 200
  },
  imagenes: [{
    type: String,  // URLs como "https://cloudinary.com/imagen.jpg"
    required: false
  }],
  activa: {
    type: Boolean,
    default: true
  },
  prioridad: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  fechaExpiracion: {
    type: Date,
    default: null
  },
  clicks: {
    type: Number,
    default: 0
  },
  impresiones: {
    type: Number,
    default: 0
  },
  costoPorClick: {
    type: Number,
    default: 0
  },
  costoTotal: {
    type: Number,
    default: 0
  },
  anunciante: {
    nombre: { type: String },
    email: { type: String },
    telefono: { type: String }
  }
}, { 
  timestamps: true 
});

// Índices
PublicidadSchema.index({ prioridad: 1, activa: 1 });
PublicidadSchema.index({ fechaExpiracion: 1, activa: 1 });

module.exports = mongoose.model('Publicidad', PublicidadSchema);