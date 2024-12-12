const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json() 
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: '/var/log/backend/AttendanceRecords-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d'
    })
  ],
});

module.exports = logger;