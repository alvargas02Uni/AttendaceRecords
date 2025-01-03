const { createLogger, format, transports } = require('winston');
const Transport = require('winston-transport');
const axios = require('axios');

class FluentdTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.host = opts.host || 'logs'; // Cambiado de 'localhost' a 'logs'
    this.port = opts.port || 24224;
    this.tag = opts.tag || 'backend.logs';
  }

  log(info, callback) {
    const { message, level, timestamp } = info;
    axios.post(`http://${this.host}:${this.port}`, {
      tag: this.tag,
      log: { level, message, timestamp },
    }).catch((err) => {
      console.error('Error sending log to Fluentd:', err.message);
    });
    callback();
  }
}

const fluentdTransport = new FluentdTransport({
  host: process.env.FLUENTD_HOST || 'logs', // Apuntamos al servicio 'logs'
  port: process.env.FLUENTD_PORT || 24224,
  tag: 'backend.logs',
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    fluentdTransport,
  ],
});

module.exports = logger;
