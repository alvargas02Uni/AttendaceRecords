const { createLogger, format, transports } = require('winston');
const Transport = require('winston-transport');
const axios = require('axios');

class FluentdTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.host = opts.host || 'logs';
    this.port = opts.port || 24224;
    this.tag = opts.tag || 'backend.logs';
    this.retryInterval = opts.retryInterval || 5000; // Retry interval in ms
  }

  async log(info, callback) {
    const { message, level, timestamp } = info;

    try {
      await axios.post(`http://${this.host}:${this.port}`, {
        tag: this.tag,
        log: { level, message, timestamp },
      });
    } catch (err) {
      console.error(`Error sending log to Fluentd (${this.host}:${this.port}): ${err.message}`);
    }

    callback();
  }
}

// Verifica si Fluentd debe estar activo
const isFluentdEnabled = process.env.NODE_ENV !== 'production';

const loggerTransports = [new transports.Console()];

// Solo agregar Fluentd si NO estamos en producción
if (isFluentdEnabled) {
  loggerTransports.push(
    new FluentdTransport({
      host: process.env.FLUENTD_HOST || 'logs',
      port: process.env.FLUENTD_PORT || 24224,
      tag: process.env.FLUENTD_TAG || 'backend.logs',
      retryInterval: 5000, // Retry every 5 seconds
    })
  );
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // Allow dynamic log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()
  ),
  transports: loggerTransports,
});

module.exports = logger;
