# Sistema de Publicidades MarketPin

## 🎯 Cómo Gestionar Publicidades como Administrador

### Acceder al Panel de Administración

1. Ve a `http://localhost:5174/admin` en tu navegador
2. Verás el panel de administración con diferentes pestañas

### 📊 Dashboard de Publicidades

En la pestaña **"Publicidades"** encontrarás:

#### Estadísticas Generales
- **Total Publicidades**: Número total de anuncios
- **Ingresos Totales**: Suma de todos los ingresos por clicks
- **Impresiones**: Total de veces que se mostraron los anuncios

#### Gestión de Publicidades

##### Crear Nueva Publicidad
1. Haz clic en **"Nueva Publicidad"**
2. Completa el formulario:
   - **Texto**: El mensaje publicitario (máx. 200 caracteres)
   - **Prioridad**: Del 1-10 (más alto = más visible)
   - **Activa**: Si debe mostrarse o no
   - **Costo por click**: Cuánto cobras por cada click
   - **Costo total**: Monto total que cobra el anunciante
   - **Datos del anunciante**: Nombre, email y teléfono

##### Editar Publicidad Existente
1. Haz clic en el ícono de **lápiz** en cualquier publicidad
2. Modifica los campos necesarios
3. Guarda los cambios

##### Activar/Desactivar Publicidad
- Haz clic en el ícono de **ojo** para activar/desactivar

##### Eliminar Publicidad
- Haz clic en el ícono de **basura** (con confirmación)

### 💰 Modelo de Negocio

#### Ingresos por Publicidad
- **Costo por Click (CPC)**: Cobras cada vez que alguien hace click en la publicidad
- **Costo Total**: Cobro fijo al anunciante por publicar

#### Seguimiento Automático
- **Impresiones**: Se cuentan automáticamente cada vez que se muestra
- **Clicks**: Se registran cuando los usuarios hacen click
- **Ingresos**: Se calculan automáticamente (clicks × costo por click)

### 🎨 Visualización en la App

Las publicidades aparecen en el **footer marquee** (barra inferior deslizante) de la aplicación principal.

- Se muestran ordenadas por **prioridad** (más alta primero)
- Solo las **activas** son visibles
- Los usuarios pueden hacer click para interactuar

### 📈 Estrategias de Monetización

1. **CPC (Cost per Click)**: Ideal para conversiones
2. **CPM (Cost per Mille)**: Por cada 1000 impresiones
3. **Costo Fijo**: Contratos mensuales con anunciantes locales

### 🔧 Comandos Útiles

```bash
# Ejecutar seed de publicidades de ejemplo
cd marketpin-backend
node seedPublicidades.js

# Ver todas las publicidades (API)
curl http://localhost:5000/api/publicidades/admin

# Ver publicidades activas (frontend)
curl http://localhost:5000/api/publicidades
```

### 📞 Contactar Anunciantes

Cada publicidad incluye datos de contacto del anunciante:
- Nombre del negocio
- Email de contacto
- Teléfono

### 💡 Tips para Administradores

1. **Prioridades**: Usa números altos (8-10) para anuncios premium
2. **Texto atractivo**: Incluye emojis y llamadas a acción
3. **Rotación**: Mantén máximo 5-6 publicidades activas para buena UX
4. **Seguimiento**: Revisa las estadísticas semanalmente
5. **Actualización**: Renueva ofertas regularmente

¡Tu sistema de publicidades está listo para generar ingresos! 🚀