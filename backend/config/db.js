const { Pool } = require('pg');
const { db } = require('./config');

let pool;

if (process.env.NODE_ENV === 'production') {
    console.log("🌍 Ejecutando en producción: Conectando a Cloud SQL...");
    pool = new Pool({
        user: process.env.DB_USER || db.user,
        password: process.env.DB_PASS || db.password,
        host: process.env.DB_HOST || db.host,  // Usar socket UNIX en Cloud Run
        database: process.env.DB_NAME || db.database,
        ssl: {
            rejectUnauthorized: false, // Requerido para Cloud SQL si usas conexión SSL
        }
    });
} else {
    console.log("🖥️ Ejecutando en desarrollo: Conectando a base de datos local...");
    pool = new Pool({
        user: db.user,
        password: db.password,
        host: db.host,
        port: db.port,
        database: db.database,
    });
}

module.exports = pool;
