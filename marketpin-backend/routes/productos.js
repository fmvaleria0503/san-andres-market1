const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// RUTA PARA TRAER PRODUCTOS AL MAPA (Solo aprobados)
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find({ aprobado: true })
            .populate('vendedor.id', 'nombre imagenPerfil whatsapp calificacion totalCalificaciones')
            .sort({ fechaCreacion: -1 });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA QUE EL USUARIO MANDE A VENDER
router.post('/vender', upload.array('imagenes', 5), async (req, res) => {
    try {
        const { title, price, descripcion, categoria, vendedorId, whatsapp } = req.body;

        // Obtener información del vendedor
        const vendedor = await Usuario.findById(vendedorId);
        if (!vendedor) {
            return res.status(404).json({ mensaje: 'Vendedor no encontrado' });
        }

        // Procesar imágenes subidas
        const imagenesUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const nuevoProducto = new Producto({
            title,
            price: parseFloat(price) || 0,
            descripcion,
            categoria: categoria || 'general',
            imgs: imagenesUrls,
            location: JSON.parse(req.body.location || '{}'),
            vendedor: {
                id: vendedor._id,
                nombre: vendedor.nombre,
                imagenPerfil: vendedor.imagenPerfil,
                whatsapp: whatsapp || vendedor.whatsapp,
                estrellas: vendedor.calificacion
            }
        });

        const guardado = await nuevoProducto.save();
        res.status(201).json(guardado);
    } catch (err) {
        console.error('Error creando producto:', err);
        res.status(400).json({ mensaje: err.message });
    }
});

// RUTA PARA CALIFICAR UN VENDEDOR
router.post('/:id/calificar', async (req, res) => {
    try {
        const { calificacion, comentario } = req.body;
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        const vendedor = await Usuario.findById(producto.vendedor.id);
        if (!vendedor) {
            return res.status(404).json({ mensaje: 'Vendedor no encontrado' });
        }

        // Actualizar calificación del vendedor
        const totalCalificaciones = vendedor.totalCalificaciones + 1;
        const nuevaCalificacion = ((vendedor.calificacion * vendedor.totalCalificaciones) + calificacion) / totalCalificaciones;

        await Usuario.findByIdAndUpdate(vendedor._id, {
            calificacion: nuevaCalificacion,
            totalCalificaciones: totalCalificaciones
        });

        res.json({ mensaje: 'Calificación registrada exitosamente' });
    } catch (err) {
        console.error('Error calificando vendedor:', err);
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA ADMIN: Ver pendientes de aprobación
router.get('/pendientes', async (req, res) => {
    try {
        const pendientes = await Producto.find({ aprobado: false })
            .populate('vendedor.id', 'nombre imagenPerfil whatsapp')
            .sort({ fechaCreacion: -1 });
        res.json(pendientes);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA OBTENER UN PRODUCTO ESPECÍFICO
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id)
            .populate('vendedor.id', 'nombre imagenPerfil whatsapp calificacion totalCalificaciones');

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

module.exports = router;