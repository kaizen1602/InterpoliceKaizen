# API INTERPOLICE - Documentación Completa

## 🚀 Configuración Inicial

**Base URL:** `http://localhost:4100`

**Headers requeridos:**
```
Content-Type: application/json
Authorization: Bearer <token> (para rutas protegidas)
```

---

## 🔐 AUTENTICACIÓN

### POST /auth/login
Autenticar usuario y obtener token JWT.

**Body:**
```json
{
  "email": "kevin.ocampo@email.com",
  "password": "admin123"
}
```

**Respuesta exitosa:**
```json
{
  "status": "ok",
  "message": "Autenticación exitosa",
  "data": {
    "user": {
      "id": 1,
      "codigo_empleado": "EMP002",
      "nombre": "kevin",
      "apellido": "ocampo",
      "email": "kevin.ocampo@email.com",
      "roles": ["Administrador"],
      "ultimo_acceso": "2025-08-28T13:07:24.852Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### POST /auth/logout
Cerrar sesión del usuario.

### POST /auth/refresh
Renovar token JWT.

### GET /auth/verify
Verificar validez del token.

---

## 👥 USUARIOS

### GET /usuarios
Obtener todos los usuarios (requiere autenticación).

**Headers:** `Authorization: Bearer <token>`

**Respuesta:**
```json
{
  "status": "ok",
  "data": [
    {
      "id": 1,
      "codigo_empleado": "EMP002",
      "nombre": "kevin",
      "apellido": "ocampo",
      "email": "kevin.ocampo@email.com",
      "roles": ["Administrador"],
      "telefono": "100000",
      "activo": true
    }
  ]
}
```

### GET /usuarios/:id
Obtener usuario por ID.

### POST /usuarios
Crear nuevo usuario (solo Administradores).

**Body:**
```json
{
  "codigo_empleado": "EMP006",
  "nombre": "ana",
  "apellido": "garcia",
  "email": "ana@gmail.com",
  "password": "Secure123!",
  "rol": "secretaria",
  "telefono": "3001234567"
}
```

**Roles disponibles:** `administrador`, `general`, `policia`, `secretaria`

**Validaciones de contraseña:**
- Mínimo 8 caracteres
- Al menos 1 minúscula
- Al menos 1 mayúscula
- Al menos 1 número
- Al menos 1 carácter especial (@$!%*?&)

### PUT /usuarios/:id
Actualizar usuario existente.

### DELETE /usuarios/:id
Eliminar usuario (soft delete).

---

## 📸 FOTOS DE PERFIL

### POST /usuarios/:id/photo
Subir foto de perfil.

**Content-Type:** `multipart/form-data`
**Campo:** `photo`
**Formatos:** JPG, JPEG, PNG, GIF
**Tamaño máximo:** 5MB

### GET /usuarios/:id/photo
Obtener foto de perfil.

### DELETE /usuarios/:id/photo
Eliminar foto de perfil.

---

## 👨‍👩‍👧‍👦 CIUDADANOS

### GET /ciudadanos
Obtener todos los ciudadanos.

### GET /ciudadanos/:id
Obtener ciudadano por ID.

### POST /ciudadanos
Crear nuevo ciudadano.

**Body:**
```json
{
  "cedula": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "direccion": "Calle 123 #45-67",
  "fecha_nacimiento": "1990-05-15",
  "estado_civil": "soltero",
  "ocupacion": "Ingeniero"
}
```

**Estados civiles válidos:** `soltero`, `casado`, `divorciado`, `viudo`, `union_libre`

### PUT /ciudadanos/:id
Actualizar ciudadano existente.

### DELETE /ciudadanos/:id
Eliminar ciudadano.

---

## 🔒 SISTEMA DE ROLES

### Roles Disponibles:
- **Administrador:** Acceso completo al sistema
- **General:** Acceso estándar
- **Policia:** Acceso para personal policial
- **Secretaria:** Acceso para personal administrativo

### Permisos por Rol:
- **Crear usuarios:** Solo Administradores
- **Gestionar ciudadanos:** Todos los roles autenticados
- **Subir fotos:** Todos los roles autenticados

---

## 📊 HEALTH CHECK

### GET /health
Verificar estado del servidor.

**Respuesta:**
```json
{
  "status": "ok",
  "message": "Servidor funcionando correctamente",
  "timestamp": "2025-08-28T13:07:24.852Z",
  "environment": "development",
  "database": "connected",
  "endpoints": {
    "auth": "/auth/*",
    "usuarios": "/usuarios/*",
    "ciudadanos": "/ciudadanos/*"
  }
}
```

---

## ⚠️ CÓDIGOS DE ERROR

- **400:** Datos de entrada inválidos
- **401:** No autorizado (token inválido/expirado)
- **403:** Prohibido (sin permisos)
- **404:** Recurso no encontrado
- **409:** Conflicto (email/cédula duplicada)
- **413:** Archivo muy grande
- **415:** Tipo de archivo no soportado
- **429:** Demasiadas solicitudes
- **500:** Error interno del servidor

---

## 🔧 EJEMPLOS DE USO

### 1. Flujo completo de autenticación y creación de usuario:

```bash
# 1. Login
curl -X POST http://localhost:4100/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "kevin.ocampo@email.com", "password": "admin123"}'

# 2. Crear usuario (usar token del paso 1)
curl -X POST http://localhost:4100/usuarios \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"codigo_empleado": "EMP007", "nombre": "test", "apellido": "user", "email": "test@gmail.com", "password": "Test123!", "rol": "general", "telefono": "3001111111"}'
```

### 2. Subir foto de perfil:

```bash
curl -X POST http://localhost:4100/usuarios/1/photo \
  -H "Authorization: Bearer <TOKEN>" \
  -F "photo=@/path/to/image.jpg"
```

### 3. Crear ciudadano:

```bash
curl -X POST http://localhost:4100/ciudadanos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"cedula": "87654321", "nombre": "Maria", "apellido": "Lopez", "email": "maria@email.com", "telefono": "3009876543", "direccion": "Av. Principal 456", "fecha_nacimiento": "1985-12-20", "estado_civil": "casado", "ocupacion": "Doctora"}'
```
