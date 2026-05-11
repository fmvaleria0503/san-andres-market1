const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');

// GET /api/usuarios/mejores-vendedores - Obtener mejores vendedores
router.get('/mejores-vendedores', async (req, res) => {
  try {
    const { zona, limit = 6 } = req.query;

    // Obtener vendedores con productos activos en la zona
    const vendedores = await Usuario.find({
      role: 'user',
      activo: true
    })
    .sort({ calificacion: -1, productosVendidos: -1 })
    .limit(parseInt(limit));

    // Enriquecer con estadísticas de productos
    const vendedoresConStats = await Promise.all(
      vendedores.map(async (vendedor) => {
        const productosActivos = await Producto.countDocuments({
          'vendedor.id': vendedor._id,
          aprobado: true
        });

        return {
          ...vendedor.toObject(),
          productosActivos
        };
      })
    );

    res.json({ vendedores: vendedoresConStats });
  } catch (error) {
    console.error('Error obteniendo mejores vendedores:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// GET /api/usuarios/:id - Obtener perfil de usuario
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id)
      .select('-password');

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Obtener productos del usuario
    const productos = await Producto.find({
      'vendedor.id': usuario._id,
      aprobado: true
    }).limit(10);

    res.json({
      usuario,
      productos
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// PUT /api/usuarios/:id/calificar - Calificar un vendedor
router.put('/:id/calificar', async (req, res) => {
  try {
    const { calificacion } = req.body;

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ mensaje: 'La calificación debe estar entre 1 y 5' });
    }

    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar calificación
    const totalCalificaciones = usuario.totalCalificaciones + 1;
    const nuevaCalificacion = ((usuario.calificacion * usuario.totalCalificaciones) + calificacion) / totalCalificaciones;

    usuario.calificacion = nuevaCalificacion;
    usuario.totalCalificaciones = totalCalificaciones;

    await usuario.save();

    res.json({
      mensaje: 'Calificación registrada exitosamente',
      nuevaCalificacion: usuario.calificacion,
      totalCalificaciones: usuario.totalCalificaciones
    });
  } catch (error) {
    console.error('Error calificando usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

module.exports = router;