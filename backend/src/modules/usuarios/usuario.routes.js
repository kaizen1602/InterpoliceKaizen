// Rutas para usuarios
import express from "express";
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from "./usuario.controller.js";

const router = express.Router();

router.post("/", createUsuario);
router.get("/", getAllUsuarios);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

export default router; 