import dbconn from "../../config/dbconexion.js";

export async function getUsuariosDB() {
  const [rows] = await dbconn.query("SELECT * FROM usuarios WHERE activo = 1");
  return rows;
}

export async function getUsuarioByIdDB(id) {
  const [rows] = await dbconn.query(`
    SELECT u.*, GROUP_CONCAT(r.nombre_rol) as roles
    FROM usuarios u
    LEFT JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    WHERE u.id_usuario = ? AND u.activo = 1
    GROUP BY u.id_usuario
  `, [id]);
  return rows[0];
}

export async function getUsuariosConRolesDB() {
  const [rows] = await dbconn.query(`
    SELECT u.*, GROUP_CONCAT(r.nombre_rol) as roles
    FROM usuarios u
    LEFT JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    WHERE u.activo = 1
    GROUP BY u.id_usuario
    ORDER BY u.nombre, u.apellido
  `);
  
  // Convertir roles de string a array
  return rows.map(user => ({
    ...user,
    roles: user.roles ? user.roles.split(',') : []
  }));
}

export async function createUsuarioDB(usuarioData) {
  const [result] = await dbconn.query("INSERT INTO usuarios SET ?", [usuarioData]);
  return result;
}

export async function updateUsuarioDB(id, usuarioData) {
  const [result] = await dbconn.query("UPDATE usuarios SET ? WHERE id_usuario = ?", [usuarioData, id]);
  return result;
}

export async function assignRoleToUserDB(userId, roleId) {
  const [result] = await dbconn.query(
    "INSERT INTO usuarios_roles (id_usuario, id_rol, activo, fecha_asignacion) VALUES (?, ?, 1, NOW())",
    [userId, roleId]
  );
  return result;
}

export async function deleteUsuarioDB(id) {
  // Soft delete - marcar como inactivo en lugar de eliminar
  const [result] = await dbconn.query("UPDATE usuarios SET activo = 0 WHERE id_usuario = ?", [id]);
  return result;
} 