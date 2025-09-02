import Logger from "../utils/logger.js";

// Clase personalizada para errores de aplicación
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Wrapper para funciones async para capturar errores automáticamente
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Middleware global de manejo de errores
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log del error
  Logger.error('Error capturado por middleware global:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : 'Stack trace oculto en producción',
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Si es un error operacional conocido
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }

  // Error de desarrollo - mostrar detalles limitados (SIN stack trace)
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message,
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  // Error de producción - solo mensaje genérico
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    timestamp: new Date().toISOString()
  });
};

// Enviar error detallado en desarrollo
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

// Enviar error simplificado en producción
const sendErrorProd = (err, res) => {
  // Errores operacionales: enviar mensaje al cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  } else {
    // Errores de programación: no filtrar detalles al cliente
    Logger.error('ERROR DE PROGRAMACIÓN:', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal en el servidor',
      timestamp: new Date().toISOString()
    });
  }
};
