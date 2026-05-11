const express = require('express');
const router = express.Router();
const Publicidad = require('../models/Publicidad');
const Usuario = require('../models/Usuario');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/dashboard', auth, adminAuth, async (req, res) => {
    try {
        const stats = {
            totalPublicidades: await Publicidad.countDocuments(),
            totalMiembros: await Usuario.countDocuments({ role: 'user' })
        };
        const miembros = await Usuario.find({ role: 'user' }).select('-password');
        const publicidades = await Publicidad.find().sort({ fechaCreacion: -1 });

        res.json({ stats, miembros, publicidades });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al cargar el panel' });
    }
});

router.delete('/publicidades/:id', auth, adminAuth, async (req, res) => {
    await Publicidad.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Publicidad eliminada' });
});

// Nuevos endpoints para gestión de usuarios
router.get('/usuarios', auth, adminAuth, async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
});

router.put('/usuarios/:id/activo', auth, adminAuth, async (req, res) => {
    try {
        const { activo } = req.body;
        await Usuario.findByIdAndUpdate(req.params.id, { activo });
        res.json({ mensaje: 'Estado del usuario actualizado' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar usuario' });
    }
});

router.put('/usuarios/:id/premium', auth, adminAuth, async (req, res) => {
    try {
        const { premium } = req.body;
        await Usuario.findByIdAndUpdate(req.params.id, { premium });
        res.json({ mensaje: 'Estado premium del usuario actualizado' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar usuario premium' });
    }
});

module.exports = router;