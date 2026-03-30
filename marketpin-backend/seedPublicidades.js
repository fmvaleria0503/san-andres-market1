// seedPublicidades.js - Script para poblar publicidades de ejemplo
const mongoose = require('mongoose');
require('dotenv').config();

const Publicidad = require('./models/Publicidad');

const publicidadesEjemplo = [
  {
    texto: "🔥 HELADERIA BALLESTER: 2x1 en 1/4kg todos los jueves 🍦",
    prioridad: 10,
    activa: true,
    costoPorClick: 0.50,
    costoTotal: 50,
    anunciante: {
      nombre: "Heladería Ballester",
      email: "contacto@heladeriaballester.com",
      telefono: "011-1234-5678"
    }
  },
  {
    texto: "🛠️ FERRETERIA MALAIPU: 15% OFF en herramientas eléctricas",
    prioridad: 8,
    activa: true,
    costoPorClick: 0.30,
    costoTotal: 30,
    anunciante: {
      nombre: "Ferretería Malaipu",
      email: "ventas@ferreteriaMalaipu.com",
      telefono: "011-8765-4321"
    }
  },
  {
    texto: "🏪 ALMACEN CENTRAL: Precios bajos todos los días",
    prioridad: 6,
    activa: true,
    costoPorClick: 0.20,
    costoTotal: 25,
    anunciante: {
      nombre: "Almacén Central",
      email: "info@almacencentral.com",
      telefono: "011-5555-1234"
    }
  },
  {
    texto: "📱 CELULAR CENTER: Últimos modelos con garantía",
    prioridad: 7,
    activa: true,
    costoPorClick: 0.40,
    costoTotal: 40,
    anunciante: {
      nombre: "Celular Center",
      email: "ventas@celularcenter.com",
      telefono: "011-9999-8888"
    }
  }
];

async function seedPublicidades() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketpin');
    console.log('✅ Conectado a MongoDB');

    // Limpiar publicidades existentes
    await Publicidad.deleteMany({});
    console.log('🧹 Publicidades anteriores eliminadas');

    // Insertar publicidades de ejemplo
    const publicidadesInsertadas = await Publicidad.insertMany(publicidadesEjemplo);
    console.log(`✅ ${publicidadesInsertadas.length} publicidades insertadas`);

    // Mostrar resumen
    console.log('\n📊 Resumen de publicidades:');
    publicidadesInsertadas.forEach((pub, index) => {
      console.log(`${index + 1}. ${pub.texto}`);
      console.log(`   Prioridad: ${pub.prioridad}, Costo/click: $${pub.costoPorClick}`);
      console.log(`   Anunciante: ${pub.anunciante.nombre}\n`);
    });

    console.log('🎉 Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error en el seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el seed
seedPublicidades();