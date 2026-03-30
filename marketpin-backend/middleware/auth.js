const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ mensaje: 'Acceso denegado. Token requerido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_jwt');
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Token inválido.' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario inactivo.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido.' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

module.exports = { auth, adminAuth };