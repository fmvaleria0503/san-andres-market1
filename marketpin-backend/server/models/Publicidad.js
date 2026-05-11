const mongoose = require('mongoose');

const publicidadSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number },
    zona: { type: String, default: 'San Martín' },
    categoria: { type: String },
    imagenes: [String],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fechaCreacion: { type: Date, default: Date.now },
    // Nuevos campos para anuncios premium
    tipo: { type: String, enum: ['normal', 'premium'], default: 'normal' },
    fechaExpiracion: { type: Date, default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) }, // 15 días por defecto
    costoPorClick: { type: Number, default: 0 },
    costoTotal: { type: Number, default: 0 },
    imagenLocal: { type: String } // Para imágenes locales en premium
});

module.exports = mongoose.model('Publicidad', publicidadSchema);