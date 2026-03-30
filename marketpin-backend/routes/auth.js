const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST - Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son requeridos.' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario inactivo.' });
    }

    const isPasswordValid = await usuario.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Actualizar último login
    usuario.ultimoLogin = new Date();
    await usuario.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET || 'tu_clave_secreta_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// POST - Registro (solo para crear admin inicialmente)
router.post('/registro-admin', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos.' });
    }

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ role: 'admin' });
    if (adminExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un administrador.' });
    }

    const nuevoAdmin = new Usuario({
      nombre,
      email: email.toLowerCase(),
      password,
      role: 'admin'
    });

    await nuevoAdmin.save();

    res.status(201).json({ mensaje: 'Administrador creado exitosamente.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El email ya está registrado.' });
    }
    console.error('Error en registro admin:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// GET - Verificar token (middleware auth)
router.get('/verificar', auth, async (req, res) => {
  res.json({
    usuario: {
      id: req.usuario._id,
      nombre: req.usuario.nombre,
      email: req.usuario.email,
      role: req.usuario.role
    }
  });
});

// POST - Logout (cliente maneja el token)
router.post('/logout', (req, res) => {
  res.json({ mensaje: 'Logout exitoso.' });
});

module.exports = router;