const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imgs: [String],
  location: { lat: Number, lng: Number },
  aprobado: { type: Boolean, default: false }, // <--- CAMPO CLAVE
  vendedor: { nombre: String, estrellas: Number }
});

module.exports = mongoose.model('Producto', ProductoSchema);