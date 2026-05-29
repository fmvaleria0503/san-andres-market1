const express = require('express');
const router = express.Router();
const Publicidad = require('../models/Publicidad');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const AdminLog = require('../models/AdminLog');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/dashboard', auth, adminAuth, async (req, res) => {
    try {
        const stats = {
            totalPublicidades: await Publicidad.countDocuments(),
            totalMiembros: await Usuario.countDocuments({ role: 'user' }),
            totalProductos: await Producto.countDocuments(),
            productosPendientes: await Producto.countDocuments({ aprobado: false })
        };
        const miembros = await Usuario.find({ role: 'user' }).select('-password');
        const publicidades = await Publicidad.find().sort({ fechaCreacion: -1 });
        const eventos = await AdminLog.find().sort({ fecha: -1 }).limit(15);

        res.json({ stats, miembros, publicidades, eventos });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al cargar el panel' });
    }
});

router.get('/eventos', auth, adminAuth, async (req, res) => {
    try {
        const eventos = await AdminLog.find().sort({ fecha: -1 }).limit(30);
        res.json(eventos);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error cargando eventos de administración' });
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

router.put('/productos/:id/aprobar', auth, adminAuth, async (req, res) => {
    console.log('Aprobando producto:', req.params.id);
    console.log('Usuario:', req.usuario);
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            console.log('Producto no encontrado');
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        producto.aprobado = true;
        producto.estado = 'aprobado';
        await producto.save();
        await AdminLog.create({
            tipo: 'producto',
            productoId: producto._id,
            productoTitle: producto.title,
            accion: 'aprobado',
            mensaje: `Producto aprobado por ${req.usuario.nombre || req.usuario.email || 'Admin'}`,
            admin: req.usuario.nombre || req.usuario.email || 'Admin'
        });
        console.log('Producto aprobado:', producto._id);
        res.json({ mensaje: 'Producto aprobado exitosamente', producto });
    } catch (err) {
        console.error('Error al aprobar producto:', err);
        res.status(500).json({ mensaje: 'Error al aprobar producto' });
    }
});

router.put('/productos/:id/rechazar', auth, adminAuth, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        await Producto.findByIdAndDelete(req.params.id);
        await AdminLog.create({
            tipo: 'producto',
            productoId: producto._id,
            productoTitle: producto.title,
            accion: 'rechazado',
            mensaje: `Producto rechazado y eliminado por ${req.usuario.nombre || req.usuario.email || 'Admin'}`,
            admin: req.usuario.nombre || req.usuario.email || 'Admin'
        });
        res.json({ mensaje: 'Producto rechazado y eliminado' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al rechazar producto' });
    }
});

router.delete('/productos/:id', auth, adminAuth, async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        await AdminLog.create({
            tipo: 'producto',
            productoId: producto._id,
            productoTitle: producto.title,
            accion: 'eliminado',
            mensaje: `Producto eliminado por ${req.usuario.nombre || req.usuario.email || 'Admin'}`,
            admin: req.usuario.nombre || req.usuario.email || 'Admin'
        });
        res.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }
});

module.exports = router;