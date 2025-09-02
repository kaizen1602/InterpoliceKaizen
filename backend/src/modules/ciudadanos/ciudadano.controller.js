import {
  getCiudadanosDB,
  getCiudadanoByIdDB,
  createCiudadanoDB,
  updateCiudadanoDB,
  deleteCiudadanoDB,
} from "./ciudadano.model.js";
import { catchAsync, AppError } from "../../middleware/errorHandler.js";
import Logger from "../../utils/logger.js";
import { body, param, validationResult } from 'express-validator';

// Helper para manejar errores de express-validator
const checkValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      })),
      timestamp: new Date().toISOString()
    });
  }
  return false;
};

export const getAllCiudadanos = catchAsync(async (req, res) => {
  Logger.info('Consultando todos los ciudadanos', { 
    requestedBy: req.user?.email || 'Sistema' 
  });
  
  const ciudadanos = await getCiudadanosDB();
  
  Logger.info(`Se encontraron ${ciudadanos.length} ciudadanos`);
  
  res.status(200).json({ 
    status: "ok", 
    data: ciudadanos,
    total: ciudadanos.length,
    timestamp: new Date().toISOString()
  });
});

export const getCiudadanoById = catchAsync(async (req, res) => {
  // Aplicar express-validator directamente en el controlador
  await param('id')
    .notEmpty()
    .withMessage('El ID es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
    .run(req);
  
  // Verificar errores de validación
  const hasErrors = checkValidationErrors(req, res);
  if (hasErrors) return; // Si hay errores, ya se envió la respuesta
  
  const { id } = req.params;
  
  Logger.info(`Consultando ciudadano con ID: ${id}`, {
    requestedBy: req.user?.email || 'Sistema'
  });
  
  const ciudadano = await getCiudadanoByIdDB(id);
  
  if (!ciudadano) {
    Logger.warn(`Ciudadano con ID ${id} no encontrado`);
    throw new AppError("Ciudadano no encontrado", 404);
  }
  
  Logger.info(`Ciudadano encontrado: ${ciudadano.nombre} ${ciudadano.apellido}`);
  
  res.status(200).json({ 
    status: "ok", 
    data: ciudadano,
    timestamp: new Date().toISOString()
  });
});

export const createCiudadano = catchAsync(async (req, res) => {
  // Aplicar todas las validaciones de express-validator directamente
  await body('codigo_universal')
    .trim()
    .notEmpty()
    .withMessage('El código universal es requerido')
    .isLength({ min: 2, max: 30 })
    .withMessage('El código universal debe tener entre 2 y 30 caracteres')
    .run(req);
  
  await body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
    .run(req);
  
  await body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios')
    .run(req);
  
  await body('fecha_nacimiento')
    .notEmpty()
    .withMessage('La fecha de nacimiento es requerida')
    .isISO8601()
    .withMessage('La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)')
    .custom((value) => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 120) {
        throw new Error('La edad debe estar entre 16 y 120 años');
      }
      return true;
    })
    .run(req);
  
  await body('planeta_origen')
    .trim()
    .notEmpty()
    .withMessage('El planeta de origen es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El planeta de origen debe tener entre 2 y 50 caracteres')
    .run(req);
  
  await body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido')
    .run(req);
  
  await body('telefono')
    .optional()
    .trim()
    .isMobilePhone('es-CO')
    .withMessage('Debe proporcionar un número de teléfono válido para Colombia')
    .run(req);
  
  await body('ciudad_origen')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La ciudad de origen no puede exceder 100 caracteres')
    .run(req);
  
  await body('direccion_actual')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La dirección actual no puede exceder 500 caracteres')
    .run(req);
  
  await body('qr_code')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El código QR no puede exceder 255 caracteres')
    .run(req);
  
  // Verificar errores de validación
  const hasErrors = checkValidationErrors(req, res);
  if (hasErrors) return; // Si hay errores, ya se envió la respuesta
  
  const data = req.body;
  
  Logger.info('Creando nuevo ciudadano', { 
    codigo_universal: data.codigo_universal,
    nombre: data.nombre,
    apellido: data.apellido,
    createdBy: req.user?.email || 'Sistema'
  });
  
  // Agregar información de auditoría
  const ciudadanoData = {
    ...data,
    registrado_por: req.user?.id || null,
    fecha_registro: new Date()
  };
  
  const result = await createCiudadanoDB(ciudadanoData);
  
  Logger.info(`Ciudadano creado exitosamente con ID: ${result.insertId}`, {
    insertId: result.insertId,
    createdBy: req.user?.email || 'Sistema'
  });
  
  res.status(201).json({ 
    status: "ok", 
    data: {
      id: result.insertId,
      message: "Ciudadano creado exitosamente",
      ...ciudadanoData
    },
    timestamp: new Date().toISOString()
  });
});

export const updateCiudadano = catchAsync(async (req, res) => {
  // Validar ID primero
  await param('id')
    .notEmpty()
    .withMessage('El ID es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
    .run(req);
  
  // Validaciones opcionales para update
  await body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
    .run(req);
  
  await body('apellido')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios')
    .run(req);
  
  await body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido')
    .run(req);
  
  await body('telefono')
    .optional()
    .trim()
    .isMobilePhone('es-CO')
    .withMessage('Debe proporcionar un número de teléfono válido para Colombia')
    .run(req);
  
  // Verificar errores de validación
  const hasErrors = checkValidationErrors(req, res);
  if (hasErrors) return;
  
  const { id } = req.params;
  const data = req.body;
  
  Logger.info(`Actualizando ciudadano con ID: ${id}`, {
    updatedBy: req.user?.email || 'Sistema',
    fieldsToUpdate: Object.keys(data)
  });
  
  // Verificar que el ciudadano existe
  const existingCiudadano = await getCiudadanoByIdDB(id);
  if (!existingCiudadano) {
    Logger.warn(`Intento de actualizar ciudadano inexistente con ID: ${id}`);
    throw new AppError("Ciudadano no encontrado", 404);
  }
  
  // Agregar información de auditoría
  const updateData = {
    ...data,
    actualizado_por: req.user?.id || null,
    fecha_actualizacion: new Date()
  };
  
  const result = await updateCiudadanoDB(id, updateData);
  
  Logger.info(`Ciudadano actualizado exitosamente`, {
    id,
    affectedRows: result.affectedRows,
    updatedBy: req.user?.email || 'Sistema'
  });
  
  res.status(200).json({ 
    status: "ok", 
    data: {
      id,
      affectedRows: result.affectedRows,
      message: "Ciudadano actualizado exitosamente"
    },
    timestamp: new Date().toISOString()
  });
});

export const deleteCiudadano = catchAsync(async (req, res) => {
  // Validar ID con express-validator
  await param('id')
    .notEmpty()
    .withMessage('El ID es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
    .run(req);
  
  // Verificar errores de validación
  const hasErrors = checkValidationErrors(req, res);
  if (hasErrors) return;
  
  const { id } = req.params;
  
  Logger.warn(`Eliminando ciudadano con ID: ${id}`, {
    deletedBy: req.user?.email || 'Sistema'
  });
  
  // Verificar que el ciudadano existe
  const existingCiudadano = await getCiudadanoByIdDB(id);
  if (!existingCiudadano) {
    Logger.warn(`Intento de eliminar ciudadano inexistente con ID: ${id}`);
    throw new AppError("Ciudadano no encontrado", 404);
  }
  
  const result = await deleteCiudadanoDB(id);
  
  Logger.warn(`Ciudadano eliminado`, {
    id,
    ciudadano: `${existingCiudadano.nombre} ${existingCiudadano.apellido}`,
    affectedRows: result.affectedRows,
    deletedBy: req.user?.email || 'Sistema'
  });
  
  res.status(200).json({ 
    status: "ok", 
    data: {
      id,
      affectedRows: result.affectedRows,
      message: "Ciudadano eliminado exitosamente"
    },
    timestamp: new Date().toISOString()
  });
}); 