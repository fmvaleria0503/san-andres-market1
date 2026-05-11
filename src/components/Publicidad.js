const mongoose = require('mongoose');

const PublicidadSchema = new mongoose.Schema({
  texto: { type: String, required: true, maxlength: 200 },
  imagenes: [{ 
    type: String, 
    match: /^https?:\/\//i,
    default: []
  }],
  descuento: {
    porcentaje: { type: Number, min: 0, max: 100, default: 0 },
    texto: { type: String, maxlength: 100 },
    codigo: String
  },
  local: {
    nombre: { type: String, required: true },
    direccion: String,
    zona: { type: String, default: 'Don Torcuato' },
    telefono: String
  },
  productos: [String],
  activa: { type: Boolean, default: true },
  prioridad: { type: Number, default: 1, min: 1, max: 10 },
  fechaExpiracion: Date,
  clicks: { type: Number, default: 0 },
  impresiones: { type: Number, default: 0 },
  costoPorClick: { type: Number, default: 0 },
  costoTotal: { type: Number, default: 0 },
  anunciante: {
    nombre: String,
    email: String,
    telefono: String
  }
}, { timestamps: true });

PublicidadSchema.index({ 'local.zona': 1, activa: 1, prioridad: -1 });
PublicidadSchema.index({ fechaExpiracion: 1 });

module.exports = mongoose.model('Publicidad', PublicidadSchema);