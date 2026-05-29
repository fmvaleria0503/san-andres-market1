const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const { auth, adminAuth } = require('../middleware/auth');

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
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    }
});

// RUTA PARA TRAER PRODUCTOS AL MAPA (Solo aprobados)
router.get('/', async (req, res) => {
    try {
        const filtro = {};
        if (req.query.aprobado === 'true') filtro.aprobado = true;
        const productos = await Producto.find(filtro).sort({ createdAt: -1 });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA QUE EL USUARIO MANDE A VENDER
router.post('/vender', upload.array('imagenes', 5), async (req, res) => {
    try {
        const { title, price, descripcion, categoria, vendedorId, vendedorNombre, vendedorEmail, whatsapp } = req.body;
        const location = req.body.location ? JSON.parse(req.body.location) : {};
        const imagenesUrls = Array.isArray(req.files) ? req.files.map(file => `/uploads/${file.filename}`) : [];

        if (!title) {
            return res.status(400).json({ mensaje: 'El título del producto es obligatorio' });
        }

        let vendedor = null;
        if (vendedorId && mongoose.Types.ObjectId.isValid(vendedorId)) {
            vendedor = await Usuario.findById(vendedorId);
        }

        const nombreVendedor = vendedorNombre || vendedor?.nombre || 'Usuario MarketPin';
        const emailVendedor = vendedorEmail || vendedor?.email || '';

        const nuevoProducto = new Producto({
            title,
            price: parseFloat(price) || 0,
            descripcion,
            categoria: categoria || 'General',
            imgs: imagenesUrls,
            location,
            aprobado: false,
            vendedor: {
                nombre: nombreVendedor,
                estrellas: vendedor?.calificacion || 0
            },
            vendedorEmail: emailVendedor,
            vendedorId: vendedorId || (vendedor?._id?.toString() ?? ''),
            whatsapp: whatsapp || vendedor?.whatsapp || ''
        });

        const guardado = await nuevoProducto.save();
        res.status(201).json(guardado);
    } catch (err) {
        console.error('Error creando producto:', err);
        res.status(400).json({ mensaje: err.message });
    }
});

// RUTA PARA ADMIN: Ver pendientes de aprobación
router.get('/pendientes', auth, adminAuth, async (req, res) => {
    try {
        const pendientes = await Producto.find({ aprobado: false }).sort({ createdAt: -1 });
        res.json(pendientes);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA ADMIN: Aprobar un producto
router.put('/:id/aprobar', auth, adminAuth, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        producto.aprobado = true;
        producto.estado = 'aprobado';
        await producto.save();
        res.json({ mensaje: 'Producto aprobado', producto });
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA OBTENER UN PRODUCTO (muestra no aprobados sólo a admin o propietario)
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

        if (producto.aprobado) return res.json(producto);

        // Si no está aprobado, intentar verificar token para chequear permisos
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
        if (!token) return res.status(403).json({ mensaje: 'Acceso restringido a esta publicación' });

        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const isOwner = producto.vendedorId === (decoded.id || decoded._id) || producto.vendedorEmail === decoded.email;
            if (decoded.role === 'admin' || isOwner) {
                return res.json(producto);
            }
            return res.status(403).json({ mensaje: 'Acceso restringido a esta publicación' });
        } catch (e) {
            return res.status(401).json({ mensaje: 'Sesión inválida' });
        }
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA EDITAR UNA PUBLICACIÓN PROPIA O POR ADMIN
router.put('/:id', auth, upload.array('imagenes', 5), async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        const usuario = req.usuario;
        const ownerId = usuario?.id || usuario?._id;
        const ownerEmail = usuario?.email;
        const isOwner = producto.vendedorId === ownerId || producto.vendedorEmail === ownerEmail;
        const isAdmin = usuario?.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ mensaje: 'No autorizado para editar esta publicación' });
        }

        const { title, price, descripcion, categoria, whatsapp, location, imagenesExistentes } = req.body;

        producto.title = title || producto.title;
        producto.price = price !== undefined ? parseFloat(price) || 0 : producto.price;
        producto.descripcion = descripcion !== undefined ? descripcion : producto.descripcion;
        producto.categoria = categoria || producto.categoria;
        producto.whatsapp = whatsapp || producto.whatsapp;
        producto.ultimaEdicion = new Date();
        producto.aprobado = false;
        producto.estado = 'pendiente';

        if (location) {
            try {
                producto.location = JSON.parse(location);
            } catch (parseError) {
                producto.location = producto.location;
            }
        }

        const previousImages = Array.isArray(imagenesExistentes)
            ? imagenesExistentes
            : imagenesExistentes
                ? JSON.parse(imagenesExistentes)
                : producto.imgs || [];
        const fileImages = Array.isArray(req.files)
            ? req.files.map(file => `/uploads/${file.filename}`)
            : [];

        const finalImages = [...previousImages, ...fileImages].slice(0, 5);
        if (finalImages.length === 0) {
            return res.status(400).json({ mensaje: 'Debes conservar al menos una imagen.' });
        }
        producto.imgs = finalImages;

        await producto.save();
        res.json({ mensaje: 'Producto actualizado y enviado a revisión', producto });
    } catch (err) {
        console.error('Error actualizando producto:', err);
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA OBTENER LAS PUBLICACIONES DEL USUARIO
router.get('/mis', async (req, res) => {
    try {
        const { email, vendedorId } = req.query;
        const filtro = {};
        if (email) filtro.vendedorEmail = email;
        if (vendedorId) filtro.$or = [
            { vendedorId },
            { 'vendedor.id': vendedorId }
        ];
        if (!email && !vendedorId) {
            return res.status(400).json({ mensaje: 'Falta email o vendedorId para obtener publicaciones propias' });
        }
        const productos = await Producto.find(filtro).sort({ createdAt: -1 });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA ELIMINAR UNA PUBLICACIÓN (ADMIN)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});
module.exports = router;
