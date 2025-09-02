import { authUserDB, refreshTokenDB, logoutUserDB } from "./auth.model.js";
import { generateToken } from "../../middleware/auth.js";
import { catchAsync, AppError } from "../../middleware/errorHandler.js";
import Logger from "../../utils/logger.js";

// Login de usuario
export const authUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  Logger.info(`Intento de login para usuario: ${email}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  const result = await authUserDB({ email, password });
  
  if (!result.success) {
    Logger.warn(`Login fallido para usuario: ${email}`, {
      reason: result.message,
      ip: req.ip
    });
    throw new AppError(result.message, 401);
  }
  
  // Generar token JWT
  const token = generateToken({
    id: result.user.id,
    email: result.user.email,
    roles: result.user.roles
  });
  
  // No incluir datos sensibles en la respuesta
  const userResponse = {
    id: result.user.id,
    codigo_empleado: result.user.codigo_empleado,
    nombre: result.user.nombre,
    apellido: result.user.apellido,
    email: result.user.email,
    roles: result.user.roles,
    ultimo_acceso: new Date().toISOString()
  };
  
  Logger.info(`Login exitoso para usuario: ${email}`, {
    userId: result.user.id,
    roles: result.user.roles,
    ip: req.ip
  });
  
  res.status(200).json({
    status: "ok",
    message: "Autenticación exitosa",
    data: {
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    timestamp: new Date().toISOString()
  });
});

// Refresh token
export const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new AppError("Token de refresco requerido", 400);
  }
  
  Logger.info('Solicitud de refresh token', {
    ip: req.ip
  });
  
  const result = await refreshTokenDB(refreshToken);
  
  if (!result.valid) {
    Logger.warn('Token de refresco inválido o expirado', {
      ip: req.ip
    });
    throw new AppError("Token de refresco inválido o expirado", 401);
  }
  
  const newToken = generateToken({
    id: result.user.id_usuario,
    email: result.user.email,
    rol: result.user.rol
  });
  
  Logger.info(`Token refrescado exitosamente para usuario: ${result.user.email}`);
  
  res.status(200).json({
    status: "ok",
    message: "Token refrescado exitosamente",
    data: { 
      token: newToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    timestamp: new Date().toISOString()
  });
});

// Logout
export const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const userEmail = req.user?.email || 'Usuario desconocido';
  
  Logger.info(`Logout solicitado por usuario: ${userEmail}`, {
    userId: req.user?.id,
    ip: req.ip
  });
  
  if (refreshToken) {
    await logoutUserDB(refreshToken);
  }
  
  Logger.info(`Logout exitoso para usuario: ${userEmail}`);
  
  res.status(200).json({
    status: "ok",
    message: "Sesión cerrada exitosamente",
    timestamp: new Date().toISOString()
  });
});

// Verificar estado del token
export const verifyTokenStatus = catchAsync(async (req, res) => {
  // Este endpoint es accedido cuando el middleware verifyToken ya validó el token
  const userInfo = {
    id: req.user.id,
    email: req.user.email,
    rol: req.user.rol,
    tokenValid: true
  };
  
  res.status(200).json({
    status: "ok",
    message: "Token válido",
    data: userInfo,
    timestamp: new Date().toISOString()
  });
}); 