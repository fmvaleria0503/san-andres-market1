const mongoose = require('mongoose');
const Producto = require('./models/Producto'); // Asegurate que la ruta sea correcta
require('dotenv').config();

const productosIniciales = [
    {
        title: "Bicicleta Mountain Bike",
        price: 45000,
        lat: -34.5652,
        lng: -58.5444,
        imgs: ["https://images.unsplash.com/photo-1532298229144-0ee0c9e91590?w=500"],
        vendedorNombre: "Carlos",
        whatsapp: "5491100000000",
        aprobado: true,
        destacado: true
    },
    {
        title: "Silla de Escritorio Ergonómica",
        price: 12000,
        lat: -34.5720,
        lng: -58.5350,
        imgs: ["https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500"],
        vendedorNombre: "Marta",
        whatsapp: "5491100000001",
        aprobado: true,
        destacado: false
    },
    {
        title: "Cámara Réflex Canon",
        price: 85000,
        lat: -34.5600,
        lng: -58.5500,
        imgs: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"],
        vendedorNombre: "Pedro",
        whatsapp: "5491100000002",
        aprobado: true,
        destacado: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketpin');
        console.log("🌱 Conectado para sembrar datos...");
        
        // Limpiamos la base para no duplicar cada vez que corramos el script
        await Producto.deleteMany({}); 
        
        // Insertamos los productos
        await Producto.insertMany(productosIniciales);
        
        console.log("✅ ¡Base de datos poblada con éxito!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error sembrando datos:", error);
    }
};

seedDB();