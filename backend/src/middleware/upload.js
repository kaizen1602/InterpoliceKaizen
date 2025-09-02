import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from './errorHandler.js';

// Crear directorio de uploads si no existe
const uploadsDir = path.join(process.cwd(), 'uploads', 'usuarios');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: userId_timestamp.extension
    const userId = req.params.id || req.user?.id || 'unknown';
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `user_${userId}_${timestamp}${extension}`;
    cb(null, filename);
  }
});

// Filtro de archivos - solo imágenes
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)', 400), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 1 // Solo un archivo por vez
  }
});

// Middleware para subir foto de perfil
export const uploadUserPhoto = upload.single('photo');

// Middleware para manejar errores de multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'El archivo es demasiado grande. Máximo 5MB permitido.',
        timestamp: new Date().toISOString()
      });
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Solo se permite un archivo por vez.',
        timestamp: new Date().toISOString()
      });
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Campo de archivo inesperado. Use "foto_perfil".',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  next(err);
};
