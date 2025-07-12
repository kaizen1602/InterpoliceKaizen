import dbconn from "../../config/dbconexion.js";

export async function getCiudadanosDB() {
  const [rows] = await dbconn.query("SELECT * FROM ciudadanos");
  return rows;
}

export async function getCiudadanoByIdDB(id) {
  const [rows] = await dbconn.query("SELECT * FROM ciudadanos WHERE id_ciudadano = ?", [id]);
  return rows[0];
}

export async function createCiudadanoDB(ciudadanoData) {
  const [result] = await dbconn.query("INSERT INTO ciudadanos SET ?", [ciudadanoData]);
  return result;
}

export async function updateCiudadanoDB(id, ciudadanoData) {
  const [result] = await dbconn.query("UPDATE ciudadanos SET ? WHERE id_ciudadano = ?", [ciudadanoData, id]);
  return result;
}

export async function deleteCiudadanoDB(id) {
  const [result] = await dbconn.query("DELETE FROM ciudadanos WHERE id_ciudadano = ?", [id]);
  return result;
} 