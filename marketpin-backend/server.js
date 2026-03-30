// 1. IMPORTACIONES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 2. INICIALIZACIÓN DE LA APP
const app = express();

// 3. MIDDLEWARES
// Permite que tu frontend (HTML/JS) acceda al backend desde otro puerto
app.use(cors()); 
// Permite que el servidor entienda los datos JSON que enviamos desde el mapa
app.use(express.json()); 

// 4. CONEXIÓN A MONGODB
// Usamos la URL local por defecto, o la que esté en el archivo .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketpin';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("*****************************************");
        console.log("✅ CONECTADO EXITOSAMENTE A MONGODB");
        console.log("📂 Base de datos: MarketPin");
        console.log("*****************************************");
    })
    .catch(err => {
        console.error("❌ ERROR DE CONEXIÓN A MONGO:", err);
        console.log("👉 Asegurate de tener MongoDB Community Server instalado y corriendo.");
    });

// 5. IMPORTAR Y USAR LAS RUTAS
// Aquí conectamos el archivo que creaste en la carpeta 'routes'
const productosRoutes = require('./routes/productos');
const publicidadesRoutes = require('./routes/publicidades');
const authRoutes = require('./routes/auth');

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Todas las rutas de productos empezarán con /api/productos
app.use('/api/productos', productosRoutes);

// Todas las rutas de publicidades empezarán con /api/publicidades
app.use('/api/publicidades', publicidadesRoutes);

// 6. RUTA DE PRUEBA (Para saber si el servidor está vivo)
app.get('/', (req, res) => {
    res.send('🚀 Servidor MarketPin funcionando correctamente');
});

// 7. MANEJO DE ERRORES (Rutas no encontradas)
app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// 8. ENCENDER EL SERVIDOR
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📍 Endpoint de productos: http://localhost:${PORT}/api/productos`);
});