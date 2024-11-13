const pool = require('./config/db');

module.exports = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Espera para que la DB esté lista
  await pool.query('DELETE FROM dep_user'); // Limpieza de tablas de prueba
};
