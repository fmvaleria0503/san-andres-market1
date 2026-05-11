const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');
require('dotenv').config();

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Primero borramos si existe para evitar errores de duplicado o pass vieja
    await Usuario.deleteOne({ email: 'admin@marketpin.com' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new Usuario({
      nombre: 'Admin MarketPin',
      email: 'admin@marketpin.com',
      password: hashedPassword, // Lo guardamos ya hasheado
      role: 'admin'
    });

    await admin.save();
    console.log('🚀 ADMIN CREADO: admin@marketpin.com / admin123');
  } catch (e) {
    console.log('❌ Error:', e);
  } finally {
    mongoose.disconnect();
  }
};

crearAdmin();