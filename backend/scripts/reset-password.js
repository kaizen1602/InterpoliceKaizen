#!/usr/bin/env node

/**
 * Script para resetear contraseña de usuario
 * Uso: node scripts/reset-password.js <email> <nueva_contraseña>
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

// Configuración de base de datos
const dbConfig = {
  host: process.env.HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'interpolice_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function resetPassword(email, newPassword) {
  let connection;
  
  try {
    // Crear conexión
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a la base de datos');

    // Verificar que el usuario existe
    const [users] = await connection.execute(
      'SELECT id_usuario, email, nombre FROM usuarios WHERE email = ? AND activo = 1',
      [email]
    );

    if (users.length === 0) {
      console.error(' Usuario no encontrado o inactivo:', email);
      return;
    }

    const user = users[0];
    console.log(`👤 Usuario encontrado: ${user.nombre} (${user.email})`);

    // Hash de la nueva contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    const [result] = await connection.execute(
      'UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?',
      [hashedPassword, user.id_usuario]
    );

    if (result.affectedRows === 1) {
      console.log('Contraseña actualizada exitosamente');
      console.log(` Email: ${email}`);
      console.log(` Nueva contraseña: ${newPassword}`);
      console.log('  Recuerda cambiar esta contraseña después del primer login');
    } else {
      console.error(' Error al actualizar la contraseña');
    }

  } catch (error) {
    console.error(' Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Validar argumentos
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log(' Uso: node scripts/reset-password.js <email> <nueva_contraseña>');
  console.log(' Ejemplo: node scripts/reset-password.js admin@interpolice.com nuevaPassword123');
  process.exit(1);
}

const [email, newPassword] = args;

// Validaciones básicas
if (!email.includes('@')) {
  console.error(' Email inválido');
  process.exit(1);
}

if (newPassword.length < 6) {
  console.error(' La contraseña debe tener al menos 6 caracteres');
  process.exit(1);
}

// Ejecutar reset
console.log('🔄 Reseteando contraseña...');
resetPassword(email, newPassword);
