const pool = require('../../config/db');

// Obtener todos los laboratorios
const getAllLabsService = async () => {
  const { rows } = await pool.query('SELECT * FROM labs');
  return rows;
};

// Obtener un laboratorio por ID
const getLabByIdService = async (id) => {
  const { rows } = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
  if (rows.length === 0) {
    throw new Error('Laboratorio no encontrado');
  }
  return rows[0];
};

// Crear un laboratorio
const createLabService = async (lab_name) => {
  const { rows: existingLab } = await pool.query('SELECT * FROM labs WHERE lab_name = $1', [lab_name]);
  if (existingLab.length > 0) {
    throw new Error('El laboratorio ya existe');
  }

  const { rows: newLab } = await pool.query(
    'INSERT INTO labs (lab_name) VALUES ($1) RETURNING *',
    [lab_name]
  );
  return newLab[0];
};

// Actualizar un laboratorio
const updateLabService = async (id, lab_name) => {
  const { rows: existingLab } = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
  if (existingLab.length === 0) {
    throw new Error('Laboratorio no encontrado');
  }

  const { rows: updatedLab } = await pool.query(
    'UPDATE labs SET lab_name = $1 WHERE lab_id = $2 RETURNING *',
    [lab_name, id]
  );
  return updatedLab[0];
};

// Eliminar un laboratorio
const deleteLabService = async (id) => {
  const { rows: existingLab } = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
  if (existingLab.length === 0) {
    throw new Error('Laboratorio no encontrado');
  }

  const { rows: attendanceRecords } = await pool.query('SELECT * FROM attendance WHERE lab_id = $1', [id]);
  if (attendanceRecords.length > 0) {
    throw new Error('No se puede eliminar el laboratorio, ya tiene registros de asistencia asociados');
  }

  await pool.query('DELETE FROM labs WHERE lab_id = $1', [id]);
};

module.exports = {
  getAllLabsService,
  getLabByIdService,
  createLabService,
  updateLabService,
  deleteLabService,
};
