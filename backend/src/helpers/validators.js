import { body, param, query, validationResult } from 'express-validator';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// ===== VALIDACIONES PARA CIUDADANOS =====
export const validateCreateCiudadano = [
  body('cedula')
    .trim()
    .notEmpty()
    .withMessage('La cédula es requerida')
    .isLength({ min: 8, max: 12 })
    .withMessage('La cédula debe tener entre 8 y 12 caracteres')
    .isNumeric()
    .withMessage('La cédula solo puede contener números'),
  
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('telefono')
    .optional()
    .trim()
    .isMobilePhone('es-CO')
    .withMessage('Debe proporcionar un número de teléfono válido para Colombia'),
  
  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),
  
  body('fecha_nacimiento')
    .optional()
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
    }),
    
  handleValidationErrors
];

export const validateUpdateCiudadano = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('telefono')
    .optional()
    .trim()
    .isMobilePhone('es-CO')
    .withMessage('Debe proporcionar un número de teléfono válido para Colombia'),
  
  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),
    
  handleValidationErrors
];

// ===== VALIDACIONES PARA USUARIOS =====
export const validateCreateUsuario = [
  body('codigo_empleado')
    .trim()
    .notEmpty()
    .withMessage('El código de empleado es requerido')
    .isLength({ min: 3, max: 20 })
    .withMessage('El código de empleado debe tener entre 3 y 20 caracteres')
    .isAlphanumeric()
    .withMessage('El código de empleado solo puede contener letras y números'),
  
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'),
  
  body('rol')
    .trim()
    .notEmpty()
    .withMessage('El rol es requerido')
    .isIn(['administrador', 'general', 'policia', 'secretaria'])
    .withMessage('El rol debe ser: administrador, general, policia o secretaria'),
  
  body('telefono')
    .optional()
    .trim()
    .isMobilePhone('es-CO')
    .withMessage('Debe proporcionar un número de teléfono válido para Colombia'),
    
  handleValidationErrors
];

export const validateUpdateUsuario = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'),
  
  body('rol')
    .optional()
    .isIn(['administrador', 'general', 'policia', 'secretaria'])
    .withMessage('El rol debe ser: administrador, general, policia o secretaria'),
  
  handleValidationErrors
];

// ===== VALIDACIONES PARA AUTENTICACIÓN =====
export const validateAuth = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 1 })
    .withMessage('La contraseña no puede estar vacía'),
  
  handleValidationErrors
];

// ===== VALIDACIONES DE PARÁMETROS =====
export const validateId = [
  param('id')
    .notEmpty()
    .withMessage('El ID es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
  
  handleValidationErrors
];

// ===== VALIDACIONES DE QUERY PARAMETERS =====
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El orden debe ser "asc" o "desc"'),
  
  handleValidationErrors
];

// ===== VALIDACIONES PARA BÚSQUEDA =====
export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El término de búsqueda debe tener entre 2 y 100 caracteres'),
  
  handleValidationErrors
];