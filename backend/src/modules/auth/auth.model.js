import dbconn from "../../config/dbconexion.js";
import bcrypt from "bcryptjs";

// Autenticación de usuario (login)
export async function authUserDB(userData) {
  try {
    let email = userData.email;
    let password = userData.password;
    
    // Buscar usuario por email con sus roles (relación muchos a muchos)
    const [consultaRegistro] = await dbconn.query(`
      SELECT u.*, GROUP_CONCAT(r.nombre_rol) as roles
      FROM usuarios u
      LEFT JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario AND ur.activo = 1
      LEFT JOIN roles r ON ur.id_rol = r.id_rol AND r.activo = 1
      WHERE u.email = ? AND u.activo = 1
      GROUP BY u.id_usuario
    `, [email]);
    
    if (consultaRegistro.length > 0) {
      const usuario = consultaRegistro[0];
      
      // Comparar contraseña encriptada
      const siCoincide = bcrypt.compareSync(password, usuario.password_hash);
      
      if (siCoincide) {
        // Verificar si el usuario está bloqueado
        if (usuario.bloqueado_hasta && new Date() < new Date(usuario.bloqueado_hasta)) {
          throw new Error("Usuario bloqueado temporalmente");
        }
        
        // Resetear intentos fallidos si el login es exitoso
        if (usuario.intentos_fallidos > 0) {
          await dbconn.query(
            "UPDATE usuarios SET intentos_fallidos = 0 WHERE id_usuario = ?",
            [usuario.id_usuario]
          );
        }
        
        // Convertir roles de string separado por comas a array
        const rolesArray = usuario.roles ? usuario.roles.split(',') : [];
        
        // Actualizar último acceso
        await dbconn.query(
          'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?',
          [usuario.id_usuario]
        );
        
        return {
          success: true,
          user: {
            id: usuario.id_usuario,
            codigo_empleado: usuario.codigo_empleado,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            roles: rolesArray,
            ultimo_acceso: new Date()
          }
        };
      } else {
        // Incrementar intentos fallidos
        await dbconn.query(
          "UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1 WHERE id_usuario = ?",
          [usuario.id_usuario]
        );
        
        // Bloquear usuario si excede intentos fallidos
        if (usuario.intentos_fallidos >= 4) { // 5 intentos total
          const bloqueoHasta = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
          await dbconn.query(
            "UPDATE usuarios SET bloqueado_hasta = ? WHERE id_usuario = ?",
            [bloqueoHasta, usuario.id_usuario]
          );
          throw new Error("Usuario bloqueado por múltiples intentos fallidos");
        }
        
        throw new Error("La clave ingresada no coincide");
      }
    } else {
      throw new Error("El usuario no existe en la base de datos");
    }
  } catch (error) {
    throw error;
  }
}

// Refresh token
export async function refreshTokenDB(refreshToken) {
  try {
    // Aquí implementarías la lógica para validar el refresh token
    // Por ahora retornamos un resultado básico
    return {
      valid: false,
      message: "Funcionalidad de refresh token no implementada"
    };
  } catch (error) {
    throw error;
  }
}

// Logout
export async function logoutUserDB(refreshToken) {
  try {
    // Aquí implementarías la lógica para invalidar el refresh token
    // Por ahora solo retornamos éxito
    return true;
  } catch (error) {
    throw error;
  }
} 