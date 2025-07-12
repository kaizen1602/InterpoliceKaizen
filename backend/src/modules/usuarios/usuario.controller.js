import {
  getUsuariosDB,
  getUsuarioByIdDB,
  createUsuarioDB,
  updateUsuarioDB,
  deleteUsuarioDB,
} from "./usuario.model.js";
import { hashPassword } from "../../libs/bysqcrip.js";

export async function getAllUsuarios(req, res) {
  try {
    const usuarios = await getUsuariosDB();
    res.status(200).json({ status: "ok", data: usuarios });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function getUsuarioById(req, res) {
  try {
    const usuario = await getUsuarioByIdDB(req.params.id);
    if (!usuario) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    res.status(200).json({ status: "ok", data: usuario });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function createUsuario(req, res) {
  try {
    let data = req.body;
    data.password_hash = await hashPassword(data.password);
    delete data.password;
    const result = await createUsuarioDB(data);
    res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function updateUsuario(req, res) {
  try {
    const result = await updateUsuarioDB(req.params.id, req.body);
    if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function deleteUsuario(req, res) {
  try {
    const result = await deleteUsuarioDB(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
} 