const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// RUTA PARA TRAER PRODUCTOS AL MAPA (Solo aprobados)
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find({ aprobado: true });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// RUTA PARA QUE EL USUARIO MANDE A VENDER
router.post('/vender', async (req, res) => {
    const nuevoProducto = new Producto(req.body);
    try {
        const guardado = await nuevoProducto.save();
        res.status(201).json(guardado);
    } catch (err) {
        res.status(400).json({ mensaje: err.message });
    }
});

// RUTA PARA ADMIN: Ver pendientes de aprobación
router.get('/pendientes', async (req, res) => {
    try {
        const pendientes = await Producto.find({ aprobado: false });
        res.json(pendientes);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

module.exports = router;