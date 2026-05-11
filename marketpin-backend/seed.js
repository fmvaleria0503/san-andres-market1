const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const Usuario = require('./models/Usuario');
const Publicidad = require('./models/Publicidad');
require('dotenv').config();

const usuariosIniciales = [
    {
        nombre: "Carlos Rodríguez",
        email: "carlos@example.com",
        password: "123456",
        role: "user",
        imagenPerfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        whatsapp: "5491123456789",
        calificacion: 4.8,
        totalCalificaciones: 25,
        productosVendidos: 15,
        esPremium: true,
        fechaPremium: new Date()
    },
    {
        nombre: "María González",
        email: "maria@example.com",
        password: "123456",
        role: "user",
        imagenPerfil: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
        whatsapp: "5491123456790",
        calificacion: 4.6,
        totalCalificaciones: 18,
        productosVendidos: 12,
        esPremium: false
    },
    {
        nombre: "Pedro López",
        email: "pedro@example.com",
        password: "123456",
        role: "user",
        imagenPerfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        whatsapp: "5491123456791",
        calificacion: 4.9,
        totalCalificaciones: 32,
        productosVendidos: 20,
        esPremium: true,
        fechaPremium: new Date()
    },
    {
        nombre: "Admin MarketPin",
        email: "admin@marketpin.com",
        password: "admin123",
        role: "admin"
    }
];

const productosIniciales = [
    {
        title: "Bicicleta Mountain Bike Specialized",
        price: 45000,
        lat: -34.5652,
        lng: -58.5444,
        imgs: ["https://images.unsplash.com/photo-1532298229144-0ee0c9e91590?w=500"],
        descripcion: "Bicicleta de montaña en excelente estado, suspensiones Fox, frenos de disco hidráulicos. Ideal para senderos.",
        categoria: "Deportes",
        aprobado: true
    },
    {
        title: "Silla de Escritorio Ergonómica",
        price: 12000,
        lat: -34.5720,
        lng: -58.5350,
        imgs: ["https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500"],
        descripcion: "Silla ergonómica con ajuste de altura, respaldo reclinable y apoyabrazos ajustables. Perfecta para home office.",
        categoria: "Hogar",
        aprobado: true
    },
    {
        title: "Cámara Réflex Canon EOS Rebel",
        price: 85000,
        lat: -34.5600,
        lng: -58.5500,
        imgs: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"],
        descripcion: "Cámara réflex Canon EOS Rebel T7i con lente 18-55mm. Incluye batería, cargador y tarjeta SD.",
        categoria: "Electrónica",
        aprobado: true
    },
    {
        title: "Herramientas Makita 2x1",
        price: 25000,
        lat: -34.5580,
        lng: -58.5420,
        imgs: ["https://images.unsplash.com/photo-1581147036324-c40b2c9c2778?w=500"],
        descripcion: "Set de herramientas Makita: taladro percutor, amoladora angular y sierra circular. En promoción 2x1.",
        categoria: "Herramientas",
        aprobado: true
    }
];

const publicidadesIniciales = [
    {
        texto: "¡Oferta especial en herramientas Makita! 2x1 en taladros y amoladoras",
        imagenes: ["https://images.unsplash.com/photo-1581147036324-c40b2c9c2778?w=500"],
        imagenLocal: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        activa: true,
        tipo: "premium",
        prioridad: 10,
        zona: "Don Torcuato",
        productos: [
            { nombre: "Taladro Percutor Makita", precio: 15000, descuento: 50 },
            { nombre: "Amoladora Angular Makita", precio: 12000, descuento: 50 }
        ],
        anunciante: {
            nombre: "Ferretería Don Torcuato",
            email: "contacto@ferreteriadt.com",
            telefono: "5491123456792",
            whatsapp: "5491123456792"
        }
    },
    {
        texto: "Café artesanal tostado en San Andrés - Precio especial",
        imagenes: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500"],
        imagenLocal: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400",
        activa: true,
        tipo: "normal",
        prioridad: 5,
        zona: "Don Torcuato",
        productos: [
            { nombre: "Café Premium 1kg", precio: 2500 }
        ],
        anunciante: {
            nombre: "Café San Andrés",
            email: "info@cafesanandres.com",
            telefono: "5491123456793",
            whatsapp: "5491123456793"
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketpin');
        console.log("🌱 Conectado para sembrar datos...");

        // Limpiamos las bases
        await Usuario.deleteMany({});
        await Producto.deleteMany({});
        await Publicidad.deleteMany({});

        // Insertamos usuarios
        const usuariosCreados = await Usuario.insertMany(usuariosIniciales);
        console.log(`✅ ${usuariosCreados.length} usuarios creados`);

        // Asignamos vendedores a productos
        productosIniciales[0].vendedor = {
            id: usuariosCreados[0]._id,
            nombre: usuariosCreados[0].nombre,
            estrellas: usuariosCreados[0].calificacion,
            whatsapp: usuariosCreados[0].whatsapp,
            imagenPerfil: usuariosCreados[0].imagenPerfil
        };
        productosIniciales[1].vendedor = {
            id: usuariosCreados[1]._id,
            nombre: usuariosCreados[1].nombre,
            estrellas: usuariosCreados[1].calificacion,
            whatsapp: usuariosCreados[1].whatsapp,
            imagenPerfil: usuariosCreados[1].imagenPerfil
        };
        productosIniciales[2].vendedor = {
            id: usuariosCreados[2]._id,
            nombre: usuariosCreados[2].nombre,
            estrellas: usuariosCreados[2].calificacion,
            whatsapp: usuariosCreados[2].whatsapp,
            imagenPerfil: usuariosCreados[2].imagenPerfil
        };
        productosIniciales[3].vendedor = {
            id: usuariosCreados[0]._id,
            nombre: usuariosCreados[0].nombre,
            estrellas: usuariosCreados[0].calificacion,
            whatsapp: usuariosCreados[0].whatsapp,
            imagenPerfil: usuariosCreados[0].imagenPerfil
        };

        // Insertamos productos
        await Producto.insertMany(productosIniciales);
        console.log(`✅ ${productosIniciales.length} productos creados`);

        // Asignamos anunciantes a publicidades
        publicidadesIniciales[0].anunciante.id = usuariosCreados[0]._id;
        publicidadesIniciales[1].anunciante.id = usuariosCreados[1]._id;

        // Insertamos publicidades
        await Publicidad.insertMany(publicidadesIniciales);
        console.log(`✅ ${publicidadesIniciales.length} publicidades creadas`);

        console.log("🎉 ¡Base de datos sembrada exitosamente!");
        console.log("👤 Usuarios creados:");
        usuariosCreados.forEach(u => console.log(`   - ${u.nombre} (${u.email})`));

    } catch (error) {
        console.error("❌ Error sembrando la base de datos:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();