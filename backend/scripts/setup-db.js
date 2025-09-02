#!/usr/bin/env node

/**
 * Script para configuración inicial de la base de datos
 * Crea usuarios por defecto con contraseñas conocidas
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'interpolice_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const defaultUsers = [
  {
    codigo_empleado: 'ADM001',
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@interpolice.com',
    password: 'admin123',
    rol: 'administrador'
  },
  {
    codigo_empleado: 'GEN001',
    nombre: 'General',
    apellido: 'Sistema',
    email: 'general@interpolice.com', 
    password: 'general123',
    rol: 'general'
  },
  {
    codigo_empleado: 'POL001',
    nombre: 'Policia',
    apellido: 'Sistema',
    email: 'policia@interpolice.com',
    password: 'policia123', 
    rol: 'policia'
  }
];

async function setupDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a la base de datos');

    for (const userData of defaultUsers) {
      // Verificar si el usuario ya existe
      const [existing] = await connection.execute(
        'SELECT id_usuario FROM usuarios WHERE email = ?',
        [userData.email]
      );

      if (existing.length > 0) {
        console.log(`⚠️  Usuario ya existe: ${userData.email}`);
        
        // Actualizar contraseña del usuario existente
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        await connection.execute(
          'UPDATE usuarios SET password_hash = ? WHERE email = ?',
          [hashedPassword, userData.email]
        );
        console.log(`🔄 Contraseña actualizada para: ${userData.email}`);
        
      } else {
        // Crear nuevo usuario
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        await connection.execute(
          `INSERT INTO usuarios (codigo_empleado, nombre, apellido, email, password_hash, rol, activo, fecha_creacion) 
           VALUES (?, ?, ?, ?, ?, ?, 1, NOW())`,
          [userData.codigo_empleado, userData.nombre, userData.apellido, userData.email, hashedPassword, userData.rol]
        );
        console.log(`✅ Usuario creado: ${userData.email}`);
      }
      
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   🔑 Password: ${userData.password}`);
      console.log(`   👤 Rol: ${userData.rol}`);
      console.log('');
    }

    console.log('🎉 Configuración completada');
    console.log('🔐 Puedes usar cualquiera de estos usuarios para hacer login');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Solución:');
      console.log('1. Verifica las credenciales de MySQL en el archivo .env');
      console.log('2. Asegúrate de que MySQL esté ejecutándose');
      console.log('3. Verifica que la base de datos existe');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

console.log('🚀 Configurando usuarios por defecto...');
setupDatabase();
