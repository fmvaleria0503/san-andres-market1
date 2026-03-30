// crearAdmin.js - Script para crear el usuario administrador inicial
const mongoose = require('mongoose');
require('dotenv').config();
const Usuario = require('./models/Usuario');

async function crearAdmin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketpin');
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ role: 'admin' });
    if (adminExistente) {
      console.log('⚠️  Ya existe un administrador en el sistema');
      console.log('Email del admin actual:', adminExistente.email);
      return;
    }

    // Crear el admin con los datos proporcionados
    const nuevoAdmin = new Usuario({
      nombre: 'Valeria',
      email: 'fmvaleria0503@gmail.com',
      password: '151515', // Se hasheará automáticamente
      role: 'admin'
    });

    await nuevoAdmin.save();

    console.log('🎉 Administrador creado exitosamente!');
    console.log('📧 Email:', nuevoAdmin.email);
    console.log('👤 Nombre:', nuevoAdmin.nombre);
    console.log('🔐 Contraseña: 151515');
    console.log('⚡ Rol: admin');

  } catch (error) {
    console.error('❌ Error creando admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
crearAdmin();