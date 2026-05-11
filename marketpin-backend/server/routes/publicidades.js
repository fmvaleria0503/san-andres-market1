const express = require('express');
const router = express.Router();
const Publicidad = require('../models/Publicidad');
const { auth, adminAuth } = require('../middleware/auth');

// 1. GET para el Mapa (Filtra por zona, expira automáticamente, prioriza premium)
router.get('/', async (req, res) => {
    try {
        const { zona } = req.query;
        let filtro = { fechaExpiracion: { $gte: new Date() } }; // Solo anuncios no expirados
        if (zona && zona !== 'Todas') {
            filtro.zona = { $regex: zona, $options: 'i' };
        }
        const publicidades = await Publicidad.find(filtro).sort({ tipo: -1, fechaCreacion: -1 }); // Premium primero
        res.json(publicidades);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al cargar el mapa", error: err.message });
    }
});

// 2. POST para crear publicidad (Solo Admin)
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const nueva = new Publicidad(req.body);
        await nueva.save();
        res.status(201).json(nueva);
    } catch (err) {
        res.status(400).json({ mensaje: "Error al guardar", error: err.message });
    }
});

module.exports = router;