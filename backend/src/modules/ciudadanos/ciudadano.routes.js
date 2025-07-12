// Rutas para ciudadanos
import express from "express";
import { getAllCiudadanos, getCiudadanoById, createCiudadano, updateCiudadano, deleteCiudadano } from "./ciudadano.controller.js";

const router = express.Router();

router.post("/", createCiudadano);
router.get("/", getAllCiudadanos);
router.get("/:id", getCiudadanoById);
router.put("/:id", updateCiudadano);
router.delete("/:id", deleteCiudadano);

export default router; 