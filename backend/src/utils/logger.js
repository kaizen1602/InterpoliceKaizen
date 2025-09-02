import fs from 'fs';
import path from 'path';

// Crear directorio de logs si no existe
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Niveles de log
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Colores para consola
const COLORS = {
  ERROR: '\x1b[31m', // Rojo
  WARN: '\x1b[33m',  // Amarillo
  INFO: '\x1b[36m',  // Cian
  DEBUG: '\x1b[37m', // Blanco
  RESET: '\x1b[0m'   // Reset
};

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
  }

  // Formatear mensaje de log
  formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : '';
    
    return {
      timestamp,
      level,
      message,
      metadata,
      formatted: `[${timestamp}] ${level}: ${message} ${metaString}`.trim()
    };
  }

  // Escribir a archivo
  writeToFile(level, formattedLog) {
    const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
    const logEntry = formattedLog.formatted + '\n';
    
    fs.appendFileSync(logFile, logEntry, 'utf8');
  }

  // Escribir a consola con colores
  writeToConsole(level, formattedLog) {
    const color = COLORS[level] || COLORS.INFO;
    const coloredMessage = `${color}${formattedLog.formatted}${COLORS.RESET}`;
    
    if (level === 'ERROR') {
      console.error(coloredMessage);
    } else if (level === 'WARN') {
      console.warn(coloredMessage);
    } else {
      console.log(coloredMessage);
    }
  }

  // Método base de logging
  log(level, message, metadata = {}) {
    const formattedLog = this.formatMessage(level, message, metadata);
    
    // Escribir a consola en desarrollo
    if (process.env.NODE_ENV === 'development') {
      this.writeToConsole(level, formattedLog);
    }
    
    // Escribir a archivo en producción
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile(level, formattedLog);
    }
  }

  // Métodos específicos por nivel
  error(message, metadata = {}) {
    this.log(LOG_LEVELS.ERROR, message, metadata);
  }

  warn(message, metadata = {}) {
    this.log(LOG_LEVELS.WARN, message, metadata);
  }

  info(message, metadata = {}) {
    this.log(LOG_LEVELS.INFO, message, metadata);
  }

  debug(message, metadata = {}) {
    if (this.logLevel === 'DEBUG') {
      this.log(LOG_LEVELS.DEBUG, message, metadata);
    }
  }
}

// Middleware para logging de requests
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log de request entrante
  logger.info('Request entrante', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user?.email || 'No autenticado'
  });

  // Interceptar el final de la respuesta
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    logger.info('Request completado', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      user: req.user?.email || 'No autenticado'
    });
    
    originalSend.call(this, data);
  };

  next();
};

// Instancia singleton
const logger = new Logger();

export default logger;
