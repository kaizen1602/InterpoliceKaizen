import dbconn from "../../config/dbconexion.js";

export async function getUsuariosDB() {
  const [rows] = await dbconn.query("SELECT * FROM usuarios");
  return rows;
}

export async function getUsuarioByIdDB(id) {
  const [rows] = await dbconn.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);
  return rows[0];
}

export async function createUsuarioDB(usuarioData) {
  const [result] = await dbconn.query("INSERT INTO usuarios SET ?", [usuarioData]);
  return result;
}

export async function updateUsuarioDB(id, usuarioData) {
  const [result] = await dbconn.query("UPDATE usuarios SET ? WHERE id_usuario = ?", [usuarioData, id]);
  return result;
}

export async function deleteUsuarioDB(id) {
  const [result] = await dbconn.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);
  return result;
} 