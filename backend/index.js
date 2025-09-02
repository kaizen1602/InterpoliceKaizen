// Importamos las librerías principales
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";

// Importamos middlewares de seguridad y utilidades
import { securityMiddleware, limiter } from "./src/middleware/security.js";
import { globalErrorHandler } from "./src/middleware/errorHandler.js";
import { requestLogger } from "./src/utils/logger.js";
import Logger from "./src/utils/logger.js";

// Importamos las rutas de los módulos
import authRoutes from "./src/modules/auth/auth.routes.js";
import usuarioRoutes from "./src/modules/usuarios/usuario.routes.js";
import ciudadanoRoutes from "./src/modules/ciudadanos/ciudadano.routes.js";


const app = express();

// Middlewares de seguridad
app.use(securityMiddleware);
app.use(limiter);

// Middlewares básicos
app.use(express.json({ limit: '10mb' })); // Para leer JSON en las peticiones
app.use(cors()); // Permitir peticiones de otros orígenes

// Servir archivos estáticos para imágenes de usuarios
app.use('/uploads', express.static('uploads'));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan("tiny")); // Para ver logs sencillos en consola
}
app.use(requestLogger);

// Usamos las rutas de los módulos
// AUTH: Solo autenticación (públicas)
app.use("/auth", authRoutes);

// USUARIOS: CRUD de usuarios (protegidas con autenticación)
app.use("/usuarios", usuarioRoutes);

// CIUDADANOS: Gestión de ciudadanos (protegidas con autenticación)
app.use("/ciudadanos", ciudadanoRoutes);

// Ruta de health check (pública)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    modules: {
      auth: "Autenticación",
      usuarios: "Gestión de usuarios",
      ciudadanos: "Gestión de ciudadanos"
    }
  });
});

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Ruta ${req.originalUrl} no encontrada`,
    availableRoutes: [
      "/health - GET (pública)",
      "/auth/login - POST (pública)",
      "/auth/refresh - POST (pública)",
      "/auth/logout - POST (pública)",
      "/auth/verify - GET (protegida)",
      "/usuarios - GET,POST (protegida)",
      "/usuarios/:id - GET,PUT,DELETE (protegida)",
      "/usuarios/:id/photo - POST,GET,DELETE (protegida)",
      "/ciudadanos - GET,POST (protegida)",
      "/ciudadanos/:id - GET,PUT,DELETE (protegida)",
      "/uploads/usuarios/* - GET (estático)"
    ]
  });
});

// Middleware global de manejo de errores (debe ir al final)
app.use(globalErrorHandler);

// Puerto desde .env o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  Logger.info(`API funcionando en puerto: ${PORT}`);
  Logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  Logger.info(`Autenticación: ACTIVADA en rutas protegidas`);
  Logger.info(`Módulo usuarios: REFACTORIZADO (solo CRUD)`);
  Logger.info(`Módulo auth: REFACTORIZADO (solo autenticación)`);
});