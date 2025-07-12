import dbconn from "../../config/dbconexion.js";
import bcrypt from "bcryptjs";

// Obtener todos los usuarios
export async function getUsersDB() {
  const [rows] = await dbconn.query("SELECT * FROM usuarios");
  return rows;
}

// Obtener usuario por ID
export async function getUserByIdDB(id) {
  const [rows] = await dbconn.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);
  return rows[0];
}

// Crear nuevo usuario con email único y contraseña encriptada
export async function createUserDB(userData) {
  let email = userData.email;
  // Verificar si el email ya existe
  const [emailExiste] = await dbconn.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
  if (emailExiste.length > 0) {
    throw new Error("El email ya está asignado a otro usuario");
  }
  // Encriptar la contraseña
  const userNuevo = {
    codigo_empleado: userData.codigo_empleado,
    nombre: userData.nombre,
    apellido: userData.apellido,
    email: userData.email,
    password_hash: bcrypt.hashSync(userData.password, 11),
    rol: userData.rol,
    planeta: userData.planeta,
    ciudad: userData.ciudad,
    telefono: userData.telefono,
    foto_perfil: userData.foto_perfil,
  };
  const [result] = await dbconn.query("INSERT INTO usuarios SET ?", [userNuevo]);
  return result;
}

// Actualizar usuario
export async function updateUserDB(id, userData) {
  const [result] = await dbconn.query("UPDATE usuarios SET ? WHERE id_usuario = ?", [userData, id]);
  return result;
}

// Eliminar usuario (no recomendado por ley, solo ejemplo)
export async function deleteUserDB(id) {
  const [result] = await dbconn.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);
  return result;
}

// Autenticación de usuario (login)
export async function authUserDB(userData) {
  let email = userData.email;
  let password = userData.password;
  // Buscar usuario por email
  const [consultaRegistro] = await dbconn.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
  if (consultaRegistro.length > 0) {
    // Comparar contraseña encriptada
    const siCoincide = bcrypt.compareSync(
      password,
      consultaRegistro[0].password_hash
    );
    if (siCoincide) {
      return consultaRegistro[0];
    } else {
      throw new Error("La clave ingresada no coincide");
    }
  } else {
    throw new Error("El usuario no existe en la base de datos");
  }
} 