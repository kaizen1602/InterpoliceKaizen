// Rutas para usuarios
import express from "express";
import { 
  getAllUsuarios, 
  getUsuarioById, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
} from "./usuario.controller.js";
import { 
  uploadUserPhoto, 
  getUserPhoto, 
  deleteUserPhoto 
} from "./usuario.upload.controller.js";
import { verifyToken, requireRole } from "../../middleware/auth.js";
import {
  validateCreateUsuario,
  validateUpdateUsuario,
  validateId
} from "../../helpers/validators.js";
import { authLimiter } from "../../middleware/security.js";
import { uploadUserPhoto as uploadMiddleware, handleMulterError } from "../../middleware/upload.js";

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Listar todos los usuarios (solo Administrador y General)
router.get("/", 
  requireRole(['Administrador', 'General']), 
  getAllUsuarios
);

// Obtener usuario por ID (Administrador, General y Policia pueden ver)
router.get("/:id", 
  requireRole(['Administrador', 'General', 'Policia']), 
  validateId,
  getUsuarioById
);

// Crear nuevo usuario (solo Administrador)
router.post("/", 
  requireRole(['Administrador']), 
  validateCreateUsuario,
  createUsuario
);

// Actualizar usuario (solo Administrador)
router.put("/:id", 
  requireRole(['Administrador']), 
  validateId,
  validateUpdateUsuario,
  updateUsuario
);

// Eliminar usuario por ID (solo Administrador)
router.delete("/:id", 
  authLimiter,
  validateId,
  requireRole(['Administrador']), 
  deleteUsuario
);

// ============================================
// RUTAS PARA MANEJO DE FOTOS DE PERFIL
// ============================================

// Subir foto de perfil (Administrador y General pueden subir a cualquier usuario)
router.post("/:id/photo", 
  authLimiter,
  validateId,
  requireRole(['Administrador', 'General']),
  uploadMiddleware,
  handleMulterError,
  uploadUserPhoto
);

// Obtener foto de perfil (todos los usuarios autenticados)
router.get("/:id/photo", 
  validateId,
  getUserPhoto
);

// Eliminar foto de perfil (Administrador y General)
router.delete("/:id/photo", 
  authLimiter,
  validateId,
  requireRole(['Administrador', 'General']),
  deleteUserPhoto
);

export default router; 