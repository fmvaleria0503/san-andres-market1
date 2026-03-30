# MarketPin - Marketplace de San Martín

Una aplicación web para comprar y vender productos en el barrio de San Martín, Buenos Aires.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (versión 16 o superior)
- MongoDB Community Server
- npm o yarn

### Instalación

1. **Instalar dependencias del frontend:**
   ```bash
   npm install
   ```

2. **Instalar dependencias del backend:**
   ```bash
   cd marketpin-backend
   npm install
   ```

3. **Crear usuario administrador:**
   ```bash
   cd marketpin-backend
   node crearAdmin.js
   ```

4. **Iniciar MongoDB** (en una terminal separada):
   ```bash
   mongod
   ```

5. **Iniciar el backend** (en una terminal separada):
   ```bash
   cd marketpin-backend
   node server.js
   ```

6. **Iniciar el frontend** (en una terminal separada):
   ```bash
   npm run dev
   ```

## 🌐 Acceder a la Aplicación

- **Aplicación principal:** http://localhost:5173/
- **Panel de administración:** http://localhost:5173/admin

## 👤 Credenciales de Administrador

- **Email:** fmvaleria0503@gmail.com
- **Contraseña:** 151515

## 📁 Estructura del Proyecto

```
marketpin/
├── src/
│   ├── components/          # Componentes React
│   ├── pages/              # Páginas principales
│   ├── data/               # Datos estáticos
│   └── assets/             # Imágenes y recursos
├── marketpin-backend/
│   ├── models/             # Modelos de MongoDB
│   ├── routes/             # Rutas de la API
│   ├── middleware/         # Middleware de autenticación
│   └── server.js           # Servidor Express
└── public/                 # Archivos estáticos
```

## 🔧 Tecnologías Utilizadas

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Leaflet (mapas)

### Backend
- Node.js
- Express.js
- MongoDB con Mongoose
- JWT para autenticación
- bcryptjs para hash de contraseñas

## 📋 Funcionalidades

### Para Usuarios
- Ver productos en el mapa
- Filtrar por categoría y precio
- Contactar vendedores por WhatsApp
- Ver publicidades locales

### Para Administradores
- Gestionar productos pendientes de aprobación
- Crear y gestionar publicidades pagas
- Ver estadísticas de clics e impresiones
- Panel de control completo

## 🐛 Solución de Problemas

### Error 500 al cargar Admin.jsx
Asegúrate de acceder a la URL correcta:
- ✅ Correcto: http://localhost:5173/admin
- ❌ Incorrecto: http://localhost:5000/admin

### Error de conexión a MongoDB
1. Verifica que MongoDB esté corriendo: `mongod`
2. Revisa que el puerto 27017 no esté ocupado
3. Verifica la conexión en `marketpin-backend/server.js`

### Error de dependencias
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Si encuentras problemas, verifica:
1. Que todos los servidores estén corriendo
2. Que uses las URLs correctas
3. Que MongoDB esté conectado
4. Que las dependencias estén instaladas
