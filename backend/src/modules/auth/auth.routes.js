import express from "express";
import { authUser, refreshToken, logout, verifyTokenStatus } from "./auth.controller.js";
import { validateAuth } from "../../helpers/validators.js";
import { authLimiter } from "../../middleware/security.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

// Rutas de autenticación (públicas)
router.post("/login", 
  authLimiter, // Limitar intentos de login
  validateAuth, // Validar email y password
  authUser
);

router.post("/refresh", 
  authLimiter,
  refreshToken
);

router.post("/logout", 
  logout // No requiere autenticación ya que puede ser llamado con token expirado
);

// Ruta para verificar si el token es válido (protegida)
router.get("/verify", 
  verifyToken,
  verifyTokenStatus
);

export default router; 