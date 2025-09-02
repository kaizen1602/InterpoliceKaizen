# INTERPOLICE - Tecnologías y Arquitectura

## 🏗️ Arquitectura del Sistema

### Backend (Node.js + Express)
```
├── index.js                 # Punto de entrada principal
├── src/
│   ├── config/             # Configuración de base de datos
│   ├── middleware/         # Middlewares personalizados
│   ├── modules/            # Módulos por funcionalidad
│   │   ├── auth/          # Autenticación JWT
│   │   ├── usuarios/      # Gestión de usuarios
│   │   └── ciudadanos/    # Gestión de ciudadanos
│   ├── helpers/           # Validadores y utilidades
│   ├── libs/              # Librerías personalizadas
│   └── utils/             # Utilidades generales
├── scripts/               # Scripts de mantenimiento
└── uploads/               # Archivos subidos
```

---

## 🛠️ Stack Tecnológico

### Core Backend
- **Node.js 18+** - Runtime de JavaScript
- **Express.js 4.19.2** - Framework web minimalista
- **MySQL 8.0** - Base de datos relacional
- **mysql2** - Driver MySQL con soporte para promesas

### Autenticación y Seguridad
- **jsonwebtoken** - Tokens JWT para autenticación
- **bcryptjs** - Hash de contraseñas con salt
- **helmet** - Headers de seguridad HTTP
- **cors** - Control de acceso entre dominios
- **express-rate-limit** - Limitación de tasa de solicitudes

### Validación y Middleware
- **express-validator** - Validación de datos de entrada
- **multer** - Manejo de archivos multipart/form-data
- **morgan** - Logging de solicitudes HTTP

### Logging y Monitoreo
- **winston** - Sistema de logging avanzado
- **winston-daily-rotate-file** - Rotación automática de logs

### Desarrollo
- **nodemon** - Recarga automática en desarrollo
- **dotenv** - Variables de entorno
- **ES6 Modules** - Sintaxis moderna de JavaScript

---

## 🔧 Configuración y Variables de Entorno

### Archivo .env
```bash
# Servidor
PORT=4100
NODE_ENV=development

# Base de datos
HOST=localhost
DB_USER=root
DB_PASSWORD=123456789
DB_DATABASE=interpolice

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Scripts Disponibles
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm run reset-pwd  # Resetear contraseña de usuario
npm run setup-db   # Configurar usuarios por defecto
```

---

## 🗄️ Estructura de Base de Datos

### Tablas Principales

#### usuarios
```sql
- id_usuario (PK, AUTO_INCREMENT)
- codigo_empleado (UNIQUE)
- nombre, apellido, email (UNIQUE)
- password_hash
- telefono, foto_perfil
- activo, fecha_creacion, ultimo_acceso
```

#### roles
```sql
- id_rol (PK, AUTO_INCREMENT)
- nombre_rol (UNIQUE): Administrador, General, Policia, Secretaria
- descripcion, activo, fecha_creacion
```

#### usuarios_roles (Relación muchos a muchos)
```sql
- id_usuario (PK, FK)
- id_rol (PK, FK)
- activo, fecha_asignacion, asignado_por
```

#### ciudadanos
```sql
- id_ciudadano (PK, AUTO_INCREMENT)
- cedula (UNIQUE)
- nombre, apellido, email
- telefono, direccion
- fecha_nacimiento, estado_civil, ocupacion
- activo, fecha_creacion
```

---

## 🔐 Sistema de Autenticación

### Flujo JWT
1. **Login:** Usuario envía email/password
2. **Verificación:** Bcrypt compara hash de contraseña
3. **Token:** Se genera JWT con ID, email y roles
4. **Middleware:** Cada request verifica token
5. **Autorización:** Se validan roles para endpoints específicos

### Estructura del Token JWT
```json
{
  "id": 1,
  "email": "usuario@email.com",
  "roles": ["Administrador"],
  "iat": 1756386444,
  "exp": 1756472844
}
```

---

## 🛡️ Seguridad Implementada

### Headers de Seguridad (Helmet)
- **X-Content-Type-Options:** nosniff
- **X-Frame-Options:** DENY
- **X-XSS-Protection:** 1; mode=block
- **Strict-Transport-Security:** HTTPS enforcement

### Rate Limiting
- **Ventana:** 15 minutos
- **Límite:** 100 requests por IP
- **Aplicado a:** Rutas sensibles (login, creación)

### Validación de Datos
- **Sanitización:** Trim, escape de caracteres
- **Tipos:** Email, teléfono, longitud, patrones regex
- **Contraseñas:** Complejidad obligatoria

### Manejo de Archivos
- **Tipos permitidos:** JPG, JPEG, PNG, GIF
- **Tamaño máximo:** 5MB
- **Ubicación:** `/uploads/usuarios/`
- **Validación MIME:** Verificación de tipo real

---

## 📊 Logging y Monitoreo

### Winston Configuration
```javascript
// Niveles: error, warn, info, debug
// Formatos: JSON para producción, colorizado para desarrollo
// Rotación: Archivos diarios con compresión
// Transports: Console + File
```

### Logs Capturados
- **Autenticación:** Login exitoso/fallido
- **Autorización:** Acceso denegado por roles
- **CRUD:** Creación, actualización, eliminación
- **Errores:** Stack traces (solo en desarrollo)
- **HTTP:** Requests con Morgan

---

## 🔄 Middleware Pipeline

### Orden de Ejecución
1. **Helmet** - Headers de seguridad
2. **CORS** - Control de acceso
3. **Morgan** - Logging HTTP
4. **Express.json** - Parsing JSON
5. **Rate Limiting** - Control de tasa
6. **Static Files** - Archivos estáticos
7. **Routes** - Rutas de la aplicación
8. **Error Handler** - Manejo global de errores

### Middlewares Personalizados
- **authenticateToken** - Verificación JWT
- **requireRole** - Autorización por roles
- **upload** - Manejo de archivos con Multer
- **handleValidationErrors** - Procesamiento de errores de validación

---

## 🚀 Optimizaciones Implementadas

### Performance
- **Connection Pooling** - MySQL2 con pool de conexiones
- **Async/Await** - Operaciones no bloqueantes
- **Streaming** - Archivos grandes con streams
- **Compression** - Respuestas comprimidas (opcional)

### Escalabilidad
- **Modular Architecture** - Separación por responsabilidades
- **Environment Variables** - Configuración flexible
- **Error Boundaries** - Manejo robusto de errores
- **Graceful Shutdown** - Cierre controlado del servidor

### Mantenimiento
- **Code Standards** - ES6+ con imports/exports
- **Error Handling** - Centralizado con AppError
- **Documentation** - Comentarios y documentación completa
- **Scripts** - Automatización de tareas comunes

---

## 🔧 Comandos de Mantenimiento

### Scripts Funcionales
```bash
# Resetear contraseña de usuario
node scripts/reset-password.js email@domain.com nueva_password

# Configurar usuarios por defecto
node scripts/setup-db.js
```

### Comandos de Base de Datos
```sql
-- Verificar estructura
DESCRIBE usuarios;
DESCRIBE roles;
DESCRIBE usuarios_roles;

-- Ver roles de usuario
SELECT u.nombre, GROUP_CONCAT(r.nombre_rol) as roles
FROM usuarios u
LEFT JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario
LEFT JOIN roles r ON ur.id_rol = r.id_rol
GROUP BY u.id_usuario;
```

---

## 📈 Métricas y Monitoreo

### Health Check Endpoint
- **URL:** `/health`
- **Información:** Estado servidor, BD, endpoints
- **Uso:** Monitoring y load balancers

### Logs para Análisis
- **Ubicación:** `/logs/`
- **Formato:** JSON estructurado
- **Rotación:** Diaria con compresión
- **Retención:** Configurable por ambiente

---

## 🛠️ Desarrollo y Despliegue

### Ambiente de Desarrollo
```bash
npm install          # Instalar dependencias
npm run dev         # Servidor con recarga automática
# Puerto: 4100
# Logs: Console colorizado
# Debug: Habilitado
```

### Preparación para Producción
1. **Variables de entorno** - Configurar .env
2. **Base de datos** - Crear esquema y datos iniciales
3. **Certificados SSL** - HTTPS obligatorio
4. **Process Manager** - PM2 o similar
5. **Reverse Proxy** - Nginx recomendado
6. **Monitoring** - Logs centralizados

### Consideraciones de Seguridad
- **Secrets Management** - No hardcodear credenciales
- **Database Security** - Usuario con permisos mínimos
- **File Permissions** - Restricción de acceso a uploads
- **Input Validation** - Validación en todos los endpoints
- **Error Messages** - No exponer información sensible
