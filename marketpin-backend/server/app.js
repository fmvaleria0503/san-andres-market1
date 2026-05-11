require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// Servir imágenes de las publicidades/productos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- CONEXIÓN A MONGODB ---
// Usa la URI del .env o la local por defecto
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/marketpin';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB (MarketPin San Martín)'))
    .catch(err => console.error('❌ Error de conexión a la DB:', err));

// --- REGISTRO DE RUTAS (IMPORTANTE: El orden y los nombres) ---

// 1. Usuarios y Login Maestro
app.use('/api/auth', require('./routes/auth'));

// 2. Publicidades del Mapa (Donde corregimos el error 500)
app.use('/api/publicidades', require('./routes/publicidades'));

// 3. Productos del Mercado
app.use('/api/productos', require('./routes/productos'));

// 4. Panel de Administración (Estadísticas y Gestión)
app.use('/api/admin', require('./routes/admin'));

// --- RUTA DE PRUEBA ---
app.get('/', (req, res) => {
    res.send('🚀 Servidor de MarketPin San Martín Corriendo');
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`---`);
    console.log(`🚀 SERVIDOR LISTO EN PUERTO: ${PORT}`);
    console.log(`📍 Admin: ${process.env.ADMIN_EMAIL}`);
    console.log(`---`);
});