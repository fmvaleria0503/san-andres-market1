const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@marketpin.com';
const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const jwtSecret = process.env.JWT_SECRET || 'secret123';

router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ mensaje: 'Nombre, email y contraseña son obligatorios' });
    }

    try {
        const existingUser = await Usuario.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        const user = new Usuario({ nombre, email, password, role: 'user' });
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: { nombre: user.nombre, role: user.role, email: user.email, _id: user._id }
        });
    } catch (err) {
        console.error('Error register:', err);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. VERIFICACIÓN MAESTRA (Prioridad sobre la Base de Datos)
        if (email === defaultAdminEmail && password === defaultAdminPassword) {
            const token = jwt.sign(
                { role: 'admin', email: email }, 
                jwtSecret, 
                { expiresIn: '24h' }
            );

            return res.json({ 
                token, 
                user: { nombre: 'Director San Martín', role: 'admin', email } 
            });
        }

        // 2. BÚSQUEDA NORMAL (Para vecinos registrados)
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ mensaje: 'Credenciales incorrectas' });

        const passOk = await bcrypt.compare(password, usuario.password);
        if (!passOk) return res.status(400).json({ mensaje: 'Credenciales incorrectas' });

        const token = jwt.sign(
            { id: usuario._id, role: usuario.role }, 
            jwtSecret,
            { expiresIn: '24h' }
        );
        
        res.json({ token, user: { nombre: usuario.nombre, role: usuario.role, email: usuario.email, _id: usuario._id } });

    } catch (err) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

router.get('/verificar', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
        if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.role === 'admin') {
            return res.json({ usuario: { nombre: 'Director San Martín', role: 'admin', email: decoded.email } });
        }

        const usuario = await Usuario.findById(decoded.id).select('-password');
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        res.json({ usuario });
    } catch (err) {
        res.status(401).json({ mensaje: 'Sesión inválida' });
    }
});

module.exports = router;