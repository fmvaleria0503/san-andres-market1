const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. VERIFICACIÓN MAESTRA (Prioridad sobre la Base de Datos)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { role: 'admin', email: email }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );

            // Al usar return acá, evitamos que baje a buscar el hash a MongoDB
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
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ token, user: { nombre: usuario.nombre, role: usuario.role, email: usuario.email } });

    } catch (err) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

module.exports = router;