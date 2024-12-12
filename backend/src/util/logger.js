const { createLogger, format, transports } = require('winston');
require('winston-fluentd');

const fluentTransport = new transports.FluentTransport({
  tag: 'backend.logs',
  host: process.env.FLUENTD_HOST || 'localhost', 
  port: 24224, 
});

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(), // Logs en consola para desarrollo
    fluentTransport, // Logs enviados a Fluentd
  ],
});

module.exports = logger;
