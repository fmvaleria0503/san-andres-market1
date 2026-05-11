// Servidor simple para probar
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketpin';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Conectado a MongoDB");
    })
    .catch(err => {
        console.error("❌ Error de conexión:", err);
    });

// Rutas básicas
app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' });
});

app.get('/', (req, res) => {
    res.send('🚀 Servidor MarketPin funcionando');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
    console.log(`📍 Prueba: http://localhost:${PORT}/api/test`);
});