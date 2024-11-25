const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: 'info', // Nivel de log (info, warn, error, debug)
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(), // Mostrar logs en la consola
    new transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d' // Guardar los logs por 14 días
    })
  ],
});

module.exports = logger;
