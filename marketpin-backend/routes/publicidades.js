const express = require('express');
const router = express.Router();
const Publicidad = require('../models/Publicidad');
const { auth, adminAuth } = require('../middleware/auth');

// GET - Obtener todas las publicidades activas (para mostrar en el frontend)
router.get('/', async (req, res) => {
    try {
        const publicidades = await Publicidad.find({ activa: true })
            .sort({ prioridad: -1, fechaCreacion: -1 });
        res.json(publicidades);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// GET - Obtener todas las publicidades (para admin)
router.get('/admin', auth, adminAuth, async (req, res) => {
    try {
        const publicidades = await Publicidad.find()
            .sort({ fechaCreacion: -1 });
        res.json(publicidades);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// POST - Crear nueva publicidad
router.post('/', auth, adminAuth, async (req, res) => {
    const nuevaPublicidad = new Publicidad(req.body);
    try {
        const guardada = await nuevaPublicidad.save();
        res.status(201).json(guardada);
    } catch (err) {
        res.status(400).json({ mensaje: err.message });
    }
});

// PUT - Actualizar publicidad
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const actualizada = await Publicidad.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!actualizada) {
            return res.status(404).json({ mensaje: 'Publicidad no encontrada' });
        }
        res.json(actualizada);
    } catch (err) {
        res.status(400).json({ mensaje: err.message });
    }
});

// DELETE - Eliminar publicidad
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const eliminada = await Publicidad.findByIdAndDelete(req.params.id);
        if (!eliminada) {
            return res.status(404).json({ mensaje: 'Publicidad no encontrada' });
        }
        res.json({ mensaje: 'Publicidad eliminada' });
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// PUT - Registrar click en publicidad
router.put('/:id/click', async (req, res) => {
    try {
        const publicidad = await Publicidad.findByIdAndUpdate(
            req.params.id,
            { $inc: { clicks: 1 } },
            { new: true }
        );
        if (!publicidad) {
            return res.status(404).json({ mensaje: 'Publicidad no encontrada' });
        }
        res.json(publicidad);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

// PUT - Registrar impresión de publicidad
router.put('/:id/impression', async (req, res) => {
    try {
        const publicidad = await Publicidad.findByIdAndUpdate(
            req.params.id,
            { $inc: { impresiones: 1 } },
            { new: true }
        );
        if (!publicidad) {
            return res.status(404).json({ mensaje: 'Publicidad no encontrada' });
        }
        res.json(publicidad);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
});

module.exports = router;