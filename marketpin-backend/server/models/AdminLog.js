const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  productoTitle: { type: String, default: '' },
  accion: { type: String, required: true },
  mensaje: { type: String, default: '' },
  admin: { type: String, default: 'Admin' },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
