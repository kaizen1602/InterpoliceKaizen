import {
  getCiudadanosDB,
  getCiudadanoByIdDB,
  createCiudadanoDB,
  updateCiudadanoDB,
  deleteCiudadanoDB,
} from "./ciudadano.model.js";

export async function getAllCiudadanos(req, res) {
  try {
    const ciudadanos = await getCiudadanosDB();
    res.status(200).json({ status: "ok", data: ciudadanos });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function getCiudadanoById(req, res) {
  try {
    const ciudadano = await getCiudadanoByIdDB(req.params.id);
    if (!ciudadano) return res.status(404).json({ status: "error", message: "Ciudadano no encontrado" });
    res.status(200).json({ status: "ok", data: ciudadano });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function createCiudadano(req, res) {
  try {
    let data = req.body;
    const result = await createCiudadanoDB(data);
    res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function updateCiudadano(req, res) {
  try {
    const result = await updateCiudadanoDB(req.params.id, req.body);
    if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Ciudadano no encontrado" });
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function deleteCiudadano(req, res) {
  try {
    const result = await deleteCiudadanoDB(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Ciudadano no encontrado" });
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
} 