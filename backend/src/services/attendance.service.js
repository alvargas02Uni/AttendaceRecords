const pool = require('../../config/db');

// Registrar la asistencia de un estudiante
const registerAttendanceService = async (user_id, lab_id) => {
  const { rows: activeAttendance } = await pool.query(
    'SELECT * FROM attendance WHERE user_id = $1 AND lab_id = $2 AND att_end_time IS NULL',
    [user_id, lab_id]
  );

  if (activeAttendance.length > 0) {
    throw new Error('Ya tienes una asistencia activa en este laboratorio');
  }

  // Insertar correctamente la asistencia usando att_time en lugar de att_start_time
  const { rows: newAttendance } = await pool.query(
    'INSERT INTO attendance (user_id, lab_id, att_time) VALUES ($1, $2, NOW()) RETURNING *',
    [user_id, lab_id]
  );

  return newAttendance[0];
};

// Finalizar la asistencia de un estudiante
const endAttendanceService = async (att_id, user_id) => {
  const { rows: attendance } = await pool.query(
    'SELECT * FROM attendance WHERE att_id = $1 AND user_id = $2 AND att_end_time IS NULL',
    [att_id, user_id]
  );

  if (attendance.length === 0) {
    throw new Error('No se encontró una asistencia activa');
  }

  const { rows: updatedAttendance } = await pool.query(
    'UPDATE attendance SET att_end_time = NOW() WHERE att_id = $1 RETURNING *',
    [att_id]
  );

  return updatedAttendance[0];
};

// Obtener todas las asistencias
const getAllAttendancesService = async () => {
  const { rows: allAttendances } = await pool.query('SELECT * FROM attendance');
  return allAttendances;
};

// Obtener la asistencia activa de un usuario específico
const getAttendanceByUserService = async (user_id) => {
  const { rows: activeAttendance } = await pool.query(
    'SELECT * FROM attendance WHERE user_id = $1 AND att_end_time IS NULL',
    [user_id]
  );

  if (activeAttendance.length === 0) {
    throw new Error('No hay asistencias activas para este usuario');
  }

  return activeAttendance[0];
};

module.exports = {
  registerAttendanceService,
  endAttendanceService,
  getAllAttendancesService,
  getAttendanceByUserService,
};
