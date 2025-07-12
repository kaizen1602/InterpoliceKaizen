# Documentacion de ciudadano

-Crear ciudadanos
-Metodo: POST
-API : http://localhost:4100/ciudadanos/
-Formato a enviar por body:
{
  "codigo_universal": "CIT002",
  "qr_code": "qr987654",
  "nombre": "kevin",
  "apellido": "ocampo",
  "fecha_nacimiento": "1995-08-15",
  "planeta_origen": "Tierra",
  "ciudad_origen": "Medellín",
  "direccion_actual": "Calle Luna 456",
  "telefono": "321654987",
  "email": "kevin.ocampo@email.com",
  "foto": "url_foto",
  "estado": "activo",
  "registrado_por": 1
}

-Editar ciudadano
-Metodo: PUT
-API : http://localhost:4100/ciudadanos/id
-Formato a enviar por body:
{
  "codigo_universal": "CIT002",
  "qr_code": "qr987654",
  "nombre": "kevin",
  "apellido": "ocampo",
  "fecha_nacimiento": "1995-08-15",
  "planeta_origen": "Tierra",
  "ciudad_origen": "Medellín",
  "direccion_actual": "Calle Luna 456",
  "telefono": "321654987",
  "email": "kevin.ocampo@email.com",
  "foto": "url_foto",
  "estado": "activo",
  "registrado_por": 1
} -- o solo los campos que quiere cambiar

-Traer ciudadano
-Metodo :GET
API: http://localhost:4100/ciudadanos/
-Formato esperado:
{
    "status": "ok",
    "data": [
        {
            "id_ciudadano": 1,
            "codigo_universal": "CIT002",
            "qr_code": "asdmals",
            "nombre": "Estebeam",
            "apellido": "ospina",
            "fecha_nacimiento": "1995-08-15T05:00:00.000Z",
            "planeta_origen": "Tierra",
            "ciudad_origen": "Medellín",
            "direccion_actual": "Calle Luna 456",
            "telefono": "13123",
            "email": "esteban.ospina@email.com",
            "foto": "url_foto",
            "estado": "activo",
            "fecha_registro": "2025-07-12T14:42:22.000Z",
            "registrado_por": 1
        }
    ]
}

-Eliminar ciudadano
Metodo: Delete
API: -API : http://localhost:4100/ciudadanos/id
-Formato esperado:
{
    "status": "ok",
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
    }
}



## API: Usuarios

### Endpoints

- **GET /usuarios**
  - Listar todos los usuarios
- **GET /usuarios/:id**
  - Obtener usuario por ID
- **POST /usuarios**
  - Crear un nuevo usuario
- **PUT /usuarios/:id**
  - Actualizar usuario existente
- **DELETE /usuarios/:id**
  - Eliminar usuario

### Ejemplo de request para crear usuario
```json
{
  "codigo_empleado": "EMP001",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@email.com",
  "password": "123456",
  "rol": "administrador",
  "planeta": "Tierra",
  "ciudad": "Bogotá",
  "telefono": "123456789",
  "foto_perfil": "url_foto"
}
```

### Ejemplo de response exitoso
```json
{
  "status": "ok",
  "data": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 3,
    "info": "",
    "serverStatus": 2,
    "warningStatus": 0
  }
}
```

### Ejemplo de response de error
```json
{
  "status": "error",
  "message": "El email ya está asignado a otro usuario"
}
```

### Notas
- El campo `password` se encripta automáticamente antes de guardarse.
- El campo `email` debe ser único.
- El campo `rol` puede ser: `administrador`, `general`, `policia`, `secretaria`.
- Para actualizar, envía solo los campos a modificar (excepto el password, que requiere lógica especial si se quiere cambiar).
- Eliminar usuarios es una operación sensible, úsala solo para pruebas. 
    