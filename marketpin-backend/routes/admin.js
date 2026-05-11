const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Publicidad = require('../models/Publicidad');
const { auth } = require('../middleware/auth');

// Middleware para verificar si es admin
const requireAdmin = (req, res, next) => {
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

// GET /api/admin/dashboard - Obtener estadísticas del dashboard
router.get('/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    // Estadísticas básicas
    const totalMiembros = await Usuario.countDocuments();
    const totalProductos = await Producto.countDocuments();
    const totalPublicidades = await Publicidad.countDocuments();
    const productosPendientes = await Producto.countDocuments({ aprobado: false });
    const publicidadesPremium = await Publicidad.countDocuments({ tipo: 'premium' });

    // Productos de la semana
    const semanaAtras = new Date();
    semanaAtras.setDate(semanaAtras.getDate() - 7);
    const productosSemana = await Producto.countDocuments({ createdAt: { $gte: semanaAtras } });

    // Impresiones y clicks de la semana
    const publicidades = await Publicidad.find();
    const impresionesSemana = publicidades.reduce((total, pub) => total + (pub.impresiones || 0), 0);
    const clicksSemana = publicidades.reduce((total, pub) => total + (pub.clicks || 0), 0);

    // Eventos del mes (simulado - puedes implementar eventos reales)
    const eventosMes = Math.floor(Math.random() * 50) + 10;

    // Total de clicks
    const totalClicks = publicidades.reduce((total, pub) => total + (pub.clicks || 0), 0);

    // Mejores vendedores
    const vendedores = await Usuario.find({ role: 'user' }).sort({ calificacion: -1 }).limit(5);

    // Miembros
    const miembros = await Usuario.find().select('nombre email role fechaCreacion');

    // Productos pendientes
    const productosPendientesList = await Producto.find({ aprobado: false })
      .populate('vendedor.id', 'nombre imagenPerfil whatsapp')
      .limit(20);

    // Publicidades
    const publicidadesList = await Publicidad.find()
      .populate('anunciante.id', 'nombre whatsapp imagenPerfil')
      .limit(20);

    res.json({
      stats: {
        totalMiembros,
        totalProductos,
        totalPublicidades,
        productosPendientes,
        publicidadesPremium,
        productosSemana,
        impresionesSemana,
        clicksSemana,
        eventosMes,
        totalClicks,
        topVendedores: vendedores.map(v => ({
          nombre: v.nombre,
          calificacion: v.calificacion,
          productosVendidos: v.productosVendidos,
          imagenPerfil: v.imagenPerfil
        }))
      },
      miembros,
      productosPendientes: productosPendientesList,
      publicidades: publicidadesList
    });
  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// PUT /api/admin/productos/:id/aprobar - Aprobar producto
router.put('/productos/:id/aprobar', auth, requireAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { aprobado: true },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto aprobado exitosamente', producto });
  } catch (error) {
    console.error('Error aprobando producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// PUT /api/admin/productos/:id/rechazar - Rechazar producto
router.put('/productos/:id/rechazar', auth, requireAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { aprobado: false },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto rechazado', producto });
  } catch (error) {
    console.error('Error rechazando producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// PUT /api/admin/publicidades/:id/aprobar - Aprobar publicidad
router.put('/publicidades/:id/aprobar', auth, requireAdmin, async (req, res) => {
  try {
    const publicidad = await Publicidad.findByIdAndUpdate(
      req.params.id,
      { activa: true },
      { new: true }
    );

    if (!publicidad) {
      return res.status(404).json({ mensaje: 'Publicidad no encontrada' });
    }

    res.json({ mensaje: 'Publicidad aprobada exitosamente', publicidad });
  } catch (error) {
    console.error('Error aprobando publicidad:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// PUT /api/admin/publicidades/:id/rechazar - Rechazar publicidad
router.put('/publicidades/:id/rechazar', auth, requireAdmin, async (req, res) => {
  try {
    const publicidad = await Publicidad.findByIdAndUpdate(
      req.params.id,
      { activa: false },
      { new: true }
    );

    if (!publicidad) {
      return res.status(404).json({ mensaje: 'Publicidad no encontrada' });
    }

    res.json({ mensaje: 'Publicidad rechazada', publicidad });
  } catch (error) {
    console.error('Error rechazando publicidad:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// PUT /api/admin/usuarios/:id/premium - Hacer usuario premium
router.put('/usuarios/:id/premium', auth, requireAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      {
        esPremium: true,
        fechaPremium: new Date()
      },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado a premium', usuario });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// GET /api/admin/usuarios - Listar usuarios registrados
router.get('/usuarios', auth, requireAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password').sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// PUT /api/admin/usuarios/:id/activo - Activar/desactivar usuario
router.put('/usuarios/:id/activo', auth, requireAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: req.body.activo },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado', usuario });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

module.exports = router;