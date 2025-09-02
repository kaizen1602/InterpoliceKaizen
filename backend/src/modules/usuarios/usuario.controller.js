import {
  getUsuariosDB,
  getUsuarioByIdDB,
  createUsuarioDB,
  updateUsuarioDB,
  deleteUsuarioDB,
  getUsuariosConRolesDB,
  assignRoleToUserDB
} from './usuario.model.js';
import { hashPassword } from "../../libs/bysqcrip.js";
import { catchAsync, AppError } from "../../middleware/errorHandler.js";
import Logger from "../../utils/logger.js";

export const getAllUsuarios = catchAsync(async (req, res) => {
  Logger.info('Consultando todos los usuarios', { 
    requestedBy: req.user.email 
  });
  
  // Obtener usuarios con sus roles
  const usuarios = await getUsuariosConRolesDB();
  
  // Remover datos sensibles antes de enviar la respuesta
  const usuariosSafe = usuarios.map(usuario => {
    const { password_hash, ...usuarioSafe } = usuario;
    return usuarioSafe;
  });
  
  Logger.info(`Se encontraron ${usuariosSafe.length} usuarios`);
  
  res.status(200).json({ 
    status: "ok", 
    data: usuariosSafe,
    total: usuariosSafe.length,
    requestedBy: req.user.email,
    timestamp: new Date().toISOString()
  });
});

export const getUsuarioById = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  Logger.info(`Consultando usuario con ID: ${id}`, {
    requestedBy: req.user.email
  });
  
  const usuario = await getUsuarioByIdDB(id);
  
  if (!usuario) {
    Logger.warn(`Usuario con ID ${id} no encontrado`);
    throw new AppError("Usuario no encontrado", 404);
  }
  
  // Remover datos sensibles
  const { password_hash, ...usuarioSafe } = usuario;
  
  Logger.info(`Usuario encontrado: ${usuario.nombre} ${usuario.apellido}`);
  
  res.status(200).json({ 
    status: "ok", 
    data: usuarioSafe,
    requestedBy: req.user.email,
    timestamp: new Date().toISOString()
  });
});

export const createUsuario = catchAsync(async (req, res) => {
  const data = req.body;
  
  Logger.info('Creando nuevo usuario', { 
    codigo_empleado: data.codigo_empleado,
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    rol: data.rol,
    createdBy: req.user.email
  });
  
  // Validar que solo admins puedan crear otros admins
  const userRoles = req.user.roles || [];
  if (data.rol === 'administrador' && !userRoles.includes('Administrador')) {
    Logger.warn(`Intento de crear admin sin permisos`, {
      attemptedBy: req.user.email,
      userRoles: userRoles
    });
    throw new AppError("No tienes permisos para crear usuarios administradores", 403);
  }
  
  // Hash de contraseña
  let hashedPassword;
  if (data.password) {
    hashedPassword = await hashPassword(data.password);
  } else {
    throw new AppError("La contraseña es requerida", 400);
  }
  
  // Preparar datos del usuario (sin columna rol)
  const usuarioData = {
    codigo_empleado: data.codigo_empleado,
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    password_hash: hashedPassword,
    telefono: data.telefono || null,
    activo: true
  };
  
  const result = await createUsuarioDB(usuarioData);
  
  // Asignar rol en tabla usuarios_roles
  const roleMapping = {
    'administrador': 1,
    'general': 2,
    'policia': 3,
    'secretaria': 4
  };
  
  const rolId = roleMapping[data.rol];
  if (rolId) {
    await assignRoleToUserDB(result.insertId, rolId);
  }
  
  Logger.info(`Usuario creado exitosamente con ID: ${result.insertId}`, {
    insertId: result.insertId,
    email: data.email,
    rol: data.rol,
    createdBy: req.user.email
  });
  
  // Respuesta sin datos sensibles
  const responseData = {
    id: result.insertId,
    codigo_empleado: usuarioData.codigo_empleado,
    nombre: usuarioData.nombre,
    apellido: usuarioData.apellido,
    email: usuarioData.email,
    rol: usuarioData.rol,
    telefono: usuarioData.telefono,
    activo: usuarioData.activo,
    message: "Usuario creado exitosamente"
  };
  
  res.status(201).json({ 
    status: "ok", 
    data: responseData,
    createdBy: req.user.email,
    timestamp: new Date().toISOString()
  });
});

export const updateUsuario = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  
  Logger.info(`Actualizando usuario con ID: ${id}`, {
    updatedBy: req.user.email,
    fieldsToUpdate: Object.keys(data)
  });
  
  // Verificar que el usuario existe
  const existingUsuario = await getUsuarioByIdDB(id);
  if (!existingUsuario) {
    Logger.warn(`Intento de actualizar usuario inexistente con ID: ${id}`);
    throw new AppError("Usuario no encontrado", 404);
  }
  
  // Validar permisos para cambio de rol
  if (data.rol && data.rol !== existingUsuario.rol) {
    if (req.user.rol !== 'admin') {
      Logger.warn(`Intento de cambiar rol sin permisos`, {
        attemptedBy: req.user.email,
        userRole: req.user.rol,
        targetUserId: id
      });
      throw new AppError("No tienes permisos para cambiar roles de usuario", 403);
    }
    
    if (data.rol === 'admin' && req.user.rol !== 'admin') {
      Logger.warn(`Intento de asignar rol admin sin permisos`, {
        attemptedBy: req.user.email
      });
      throw new AppError("No tienes permisos para asignar rol de administrador", 403);
    }
  }
  
  // Preparar datos de actualización
  const updateData = {
    ...data,
    actualizado_por: req.user.id,
    fecha_actualizacion: new Date()
  };
  
  // Hash de nueva contraseña si se proporciona
  if (data.password) {
    updateData.password_hash = await hashPassword(data.password);
    delete updateData.password;
  }
  
  const result = await updateUsuarioDB(id, updateData);
  
  Logger.info(`Usuario actualizado exitosamente`, {
    id,
    affectedRows: result.affectedRows,
    updatedFields: Object.keys(data),
    updatedBy: req.user.email
  });
  
  res.status(200).json({ 
    status: "ok", 
    data: {
      id,
      affectedRows: result.affectedRows,
      message: "Usuario actualizado exitosamente",
      updatedFields: Object.keys(data)
    },
    updatedBy: req.user.email,
    timestamp: new Date().toISOString()
  });
});

export const deleteUsuario = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  Logger.warn(`Eliminando usuario con ID: ${id}`, {
    deletedBy: req.user.email
  });
  
  // Verificar que el usuario existe
  const existingUsuario = await getUsuarioByIdDB(id);
  if (!existingUsuario) {
    Logger.warn(`Intento de eliminar usuario inexistente con ID: ${id}`);
    throw new AppError("Usuario no encontrado", 404);
  }
  
  // Prevenir auto-eliminación
  if (parseInt(id) === req.user.id) {
    Logger.warn(`Intento de auto-eliminación`, {
      userId: req.user.id,
      email: req.user.email
    });
    throw new AppError("No puedes eliminar tu propio usuario", 400);
  }
  
  // Solo admin puede eliminar otros admins
  if (existingUsuario.rol === 'admin' && req.user.rol !== 'admin') {
    Logger.warn(`Intento de eliminar admin sin permisos`, {
      attemptedBy: req.user.email,
      targetUserId: id
    });
    throw new AppError("No tienes permisos para eliminar usuarios administradores", 403);
  }
  
  const result = await deleteUsuarioDB(id);
  
  Logger.warn(`Usuario eliminado`, {
    id,
    usuario: `${existingUsuario.nombre} ${existingUsuario.apellido}`,
    email: existingUsuario.email,
    rol: existingUsuario.rol,
    affectedRows: result.affectedRows,
    deletedBy: req.user.email
  });
  
  res.status(200).json({ 
    status: "ok", 
    data: {
      id,
      affectedRows: result.affectedRows,
      message: "Usuario eliminado exitosamente"
    },
    deletedBy: req.user.email,
    timestamp: new Date().toISOString()
  });
}); 