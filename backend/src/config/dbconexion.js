// Conexión a la base de datos MySQL
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE ="ADSO"
  || 'ADSO',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 