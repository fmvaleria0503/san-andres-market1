const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

    try {
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = cifrado;
        next();
    } catch (e) {
        res.status(401).json({ mensaje: 'Sesión inválida' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.usuario && req.usuario.role === 'admin') {
        next();
    } else {
        res.status(403).json({ mensaje: 'Permisos de administrador requeridos' });
    }
};

module.exports = { auth, adminAuth };