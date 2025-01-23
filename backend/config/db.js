const { Pool } = require('pg');
const { db } = require('./config');

const pool = new Pool(
  process.env.CI
    ? { // Configuración para CI (GitHub Actions)
        user: db.user,
        password: db.password,
        host: db.host,
        port: db.port,
        database: db.database
      }
    : { // Configuración para Producción (Railway)
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
      }
);

module.exports = pool;
