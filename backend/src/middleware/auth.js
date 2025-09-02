import jwt from "jsonwebtoken";
import { AppError, catchAsync } from "./errorHandler.js";
import Logger from "../utils/logger.js";

// Generar token JWT
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Verificar token JWT
export const verifyToken = catchAsync(async (req, res, next) => {
  // 1) Obtener token del header
  let token;
  const authHeader = req.headers.authorization;

  // Soportar múltiples encabezados de token
  if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  } else if (req.headers['token']) {
    token = req.headers['token'];
  } else if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Permitir Authorization con el token crudo
      token = authHeader.trim();
    }
  }

  if (!token) {
    Logger.warn('Acceso denegado - Token no proporcionado', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method
    });
    throw new AppError('Token de acceso requerido. Usa uno de: x-auth-token, x-access-token, token o Authorization: Bearer <token>', 401);
  }

  // 2) Verificar token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  } catch (error) {
    Logger.warn('Token inválido o expirado', {
      ip: req.ip,
      error: error.message
    });
    
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expirado', 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token inválido', 401);
    } else {
      throw new AppError('Error de autenticación', 401);
    }
  }

  // 3) Agregar información del usuario al request
  req.user = {
    id: decoded.id,
    email: decoded.email,
    roles: decoded.roles || []
  };

  Logger.info('Usuario autenticado correctamente', {
    userId: decoded.id,
    email: decoded.email,
    roles: decoded.roles,
    url: req.originalUrl
  });

  next();
});

// Middleware para verificar roles
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      Logger.warn('Verificación de rol sin usuario autenticado');
      throw new AppError('Usuario no autenticado', 401);
    }

    // Verificar si el usuario tiene alguno de los roles permitidos
    const userRoles = req.user.roles || [];
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasPermission) {
      Logger.warn('Acceso denegado por rol insuficiente', {
        userId: req.user.id,
        userRoles: userRoles,
        requiredRoles: allowedRoles,
        url: req.originalUrl
      });
      throw new AppError('No tienes permisos para acceder a este recurso', 403);
    }

    Logger.info('Acceso autorizado por rol', {
      userId: req.user.id,
      userRoles: userRoles,
      url: req.originalUrl
    });

    next();
  };
};
