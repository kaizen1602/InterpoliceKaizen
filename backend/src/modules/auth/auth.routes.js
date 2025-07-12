import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authUser,
} from "./auth.controller.js";

const router = express.Router();

// Rutas para usuarios
router.get("/listartodos", getAllUsers);
router.get("/listarporid/:id", getUserById);
router.post("/crear", createUser);
router.post("/login", authUser);
router.put("/actualizar/:id", updateUser);
router.delete("/borrar/:id", deleteUser);

export default router; 