import {
  getUsersDB,
  getUserByIdDB,
  createUserDB,
  updateUserDB,
  deleteUserDB,
  authUserDB,
} from "./auth.model.js";

// Listar todos los usuarios
export async function getAllUsers(req, res) {
  try {
    const users = await getUsersDB();
    res.status(200).json({ status: "ok", data: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

// Obtener usuario por ID
export async function getUserById(req, res) {
  try {
    const user = await getUserByIdDB(req.params.id);
    if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    res.status(200).json({ status: "ok", data: user });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

// Crear nuevo usuario
export async function createUser(req, res) {
  try {
    let data = req.body;
    const result = await createUserDB(data);
    res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

// Actualizar usuario
export async function updateUser(req, res) {
  try {
    const result = await updateUserDB(req.params.id, req.body);
    if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

// Eliminar usuario
export async function deleteUser(req, res) {
  try {
    const result = await deleteUserDB(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

// Login de usuario
export async function authUser(req, res) {
  try {
    let data = req.body;
    const result = await authUserDB(data);
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(401).json({ status: "error", message: error.message });
  }
} 