import { updateUsuarioDB, getUsuarioByIdDB } from "./usuario.model.js";
import { catchAsync, AppError } from "../../middleware/errorHandler.js";
import Logger from "../../utils/logger.js";
import path from 'path';
import fs from 'fs';

// Subir foto de perfil de usuario
export const uploadUserPhoto = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  Logger.info(`Subiendo foto de perfil para usuario ID: ${id}`, {
    uploadedBy: req.user.email,
    file: req.file ? req.file.filename : 'No file'
  });

  // Verificar que el usuario existe
  const existingUsuario = await getUsuarioByIdDB(id);
  if (!existingUsuario) {
    Logger.warn(`Intento de subir foto a usuario inexistente con ID: ${id}`);
    throw new AppError("Usuario no encontrado", 404);
  }

  // Verificar que se subió un archivo
  if (!req.file) {
    throw new AppError("No se proporcionó ningún archivo", 400);
  }

  // Eliminar foto anterior si existe
  if (existingUsuario.foto_perfil) {
    const oldPhotoPath = path.join(process.cwd(), 'uploads', 'usuarios', existingUsuario.foto_perfil);
    if (fs.existsSync(oldPhotoPath)) {
      try {
        fs.unlinkSync(oldPhotoPath);
        Logger.info(`Foto anterior eliminada: ${existingUsuario.foto_perfil}`);
      } catch (error) {
        Logger.warn(`Error al eliminar foto anterior: ${error.message}`);
      }
    }
  }

  // Actualizar usuario con nueva foto
  const updateData = {
    foto_perfil: req.file.filename
  };

  const result = await updateUsuarioDB(id, updateData);

  Logger.info(`Foto de perfil actualizada exitosamente`, {
    userId: id,
    filename: req.file.filename,
    fileSize: req.file.size,
    updatedBy: req.user.email
  });

  res.status(200).json({
    status: "ok",
    message: "Foto de perfil actualizada exitosamente",
    data: {
      id,
      foto_perfil: req.file.filename,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/usuarios/${req.file.filename}`
    },
    updatedBy: req.user.email,
    timestamp: new Date().toISOString()
  });
});

// Obtener foto de perfil de usuario
export const getUserPhoto = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  // Verificar que el usuario existe
  const usuario = await getUsuarioByIdDB(id);
  if (!usuario) {
    throw new AppError("Usuario no encontrado", 404);
  }

  if (!usuario.foto_perfil) {
    throw new AppError("El usuario no tiene foto de perfil", 404);
  }

  const photoPath = path.join(process.cwd(), 'uploads', 'usuarios', usuario.foto_perfil);
  
  if (!fs.existsSync(photoPath)) {
    Logger.warn(`Archivo de foto no encontrado: ${photoPath}`);
    throw new AppError("Archivo de foto no encontrado", 404);
  }

  // Enviar archivo
  res.sendFile(photoPath);
});

// Eliminar foto de perfil de usuario
export const deleteUserPhoto = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  Logger.info(`Eliminando foto de perfil para usuario ID: ${id}`, {
    deletedBy: req.user.email
  });

  // Verificar que el usuario existe
  const existingUsuario = await getUsuarioByIdDB(id);
  if (!existingUsuario) {
    throw new AppError("Usuario no encontrado", 404);
  }

  if (!existingUsuario.foto_perfil) {
    throw new AppError("El usuario no tiene foto de perfil", 400);
  }

  // Eliminar archivo físico
  const photoPath = path.join(process.cwd(), 'uploads', 'usuarios', existingUsuario.foto_perfil);
  if (fs.existsSync(photoPath)) {
    try {
      fs.unlinkSync(photoPath);
      Logger.info(`Archivo de foto eliminado: ${existingUsuario.foto_perfil}`);
    } catch (error) {
      Logger.error(`Error al eliminar archivo de foto: ${error.message}`);
    }
  }

  // Actualizar usuario removiendo referencia a la foto
  const updateData = {
    foto_perfil: null,
    actualizado_por: req.user.id,
    fecha_actualizacion: new Date()
  };

  await updateUsuarioDB(id, updateData);

  Logger.info(`Foto de perfil eliminada exitosamente`, {
    userId: id,
    deletedBy: req.user.email
  });

  res.status(200).json({
    status: "ok",
    message: "Foto de perfil eliminada exitosamente",
    data: {
      id,
      foto_perfil: null
    },
    deletedBy: req.user.email,
    timestamp: new Date().toISOString()
  });
});
