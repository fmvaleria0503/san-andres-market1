require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketpin')
    .then(() => console.log('✅ Conectado a MongoDB Local'))
    .catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/publicidades', require('./routes/publicidades'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/productos', require('./routes/productos'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});