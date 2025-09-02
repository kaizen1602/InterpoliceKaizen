// Rutas para ciudadanos
import express from "express";
import { 
  getAllCiudadanos, 
  getCiudadanoById, 
  createCiudadano, 
  updateCiudadano, 
  deleteCiudadano 
} from "./ciudadano.controller.js";
import { verifyToken, requireRole } from "../../middleware/auth.js";
import { authLimiter } from "../../middleware/security.js";

const router = express.Router();

// Aplicar autenticación a todas las rutas de ciudadanos
router.use(verifyToken);

// Crear ciudadano (solo Administrador y General)
router.post("/", 
  requireRole(['Administrador', 'General']),
  createCiudadano
);

// Listar todos los ciudadanos
router.get("/", 
  requireRole(['Administrador', 'General', 'Policia', 'Secretaria']),
  getAllCiudadanos
);

// Obtener ciudadano por ID
router.get("/:id", 
  requireRole(['Administrador', 'General', 'Policia', 'Secretaria']),
  getCiudadanoById
);

// Actualizar ciudadano (solo Administrador y General)
router.put("/:id", 
  requireRole(['Administrador', 'General']),
  updateCiudadano
);

// Eliminar ciudadano (solo Administrador)
router.delete("/:id", 
  requireRole(['Administrador']),
  authLimiter,
  deleteCiudadano
);

export default router; 