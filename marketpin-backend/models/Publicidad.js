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
  imagenLocal: {
    type: String, // Imagen del local/comercio
    default: null
  },
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
  tipo: {
    type: String,
    enum: ['normal', 'premium'],
    default: 'normal'
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
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    nombre: { type: String },
    email: { type: String },
    telefono: { type: String },
    whatsapp: { type: String },
    imagenPerfil: { type: String }
  },
  productos: [{
    nombre: String,
    precio: Number,
    descuento: Number
  }],
  zona: {
    type: String,
    default: 'Don Torcuato'
  }
}, { 
  timestamps: true 
});

// Índices
PublicidadSchema.index({ prioridad: 1, activa: 1 });
PublicidadSchema.index({ fechaExpiracion: 1, activa: 1 });

module.exports = mongoose.model('Publicidad', PublicidadSchema);