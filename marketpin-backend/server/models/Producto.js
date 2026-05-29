const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, default: 0 },
  descripcion: { type: String, default: '' },
  categoria: { type: String, default: 'General' },
  imgs: { type: [String], default: [] },
  location: { lat: Number, lng: Number },
  aprobado: { type: Boolean, default: false },
  estado: { type: String, enum: ['pendiente', 'aprobado', 'rechazado', 'vendido'], default: 'pendiente' },
  ultimaEdicion: { type: Date },
  adminNotas: { type: [String], default: [] },
  vendedor: {
    nombre: { type: String, default: 'Usuario MarketPin' },
    estrellas: { type: Number, default: 0 }
  },
  vendedorEmail: { type: String, default: '' },
  vendedorId: { type: String, default: '' },
  whatsapp: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Producto', ProductoSchema);