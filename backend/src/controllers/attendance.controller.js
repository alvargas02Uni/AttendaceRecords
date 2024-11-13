const pool = require('../../config/db'); // Asumiendo que tienes un pool de conexión a la base de datos PostgreSQL

// Registrar la asistencia de un estudiante
const registerAttendance = async (req, res) => {
  const { lab_id } = req.body;
  const user_id = req.user.user_id;

  try {
    // Verificar si el estudiante ya tiene una asistencia activa en el laboratorio
    const activeAttendance = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND lab_id = $2 AND att_end_time IS NULL',
      [user_id, lab_id]
    );

    if (activeAttendance.rows.length > 0) {
      return res.status(400).json({ msg: 'Ya tienes una asistencia activa en este laboratorio' });
    }

    // Registrar nueva asistencia
    const newAttendance = await pool.query(
      'INSERT INTO attendance (user_id, lab_id) VALUES ($1, $2) RETURNING *',
      [user_id, lab_id]
    );

    res.status(201).json(newAttendance.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al registrar la asistencia' });
  }
};

// Finalizar la asistencia de un estudiante
const endAttendance = async (req, res) => {
  const { att_id } = req.params;
  const user_id = req.user.user_id;

  try {
    // Verificar si la asistencia está activa
    const attendance = await pool.query(
      'SELECT * FROM attendance WHERE att_id = $1 AND user_id = $2 AND att_end_time IS NULL',
      [att_id, user_id]
    );

    if (attendance.rows.length === 0) {
      return res.status(404).json({ msg: 'No se encontró una asistencia activa' });
    }

    // Finalizar la asistencia
    const updatedAttendance = await pool.query(
      'UPDATE attendance SET att_end_time = NOW() WHERE att_id = $1 RETURNING *',
      [att_id]
    );

    res.status(200).json(updatedAttendance.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al finalizar la asistencia' });
  }
};

// Obtener todas las asistencias (solo administradores)
const getAllAttendances = async (req, res) => {
  try {
    const allAttendances = await pool.query('SELECT * FROM attendance');
    res.status(200).json(allAttendances.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al obtener las asistencias' });
  }
};

// Obtener la asistencia activa de un usuario específico
const getAttendanceByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const activeAttendance = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND att_end_time IS NULL',
      [user_id]
    );

    if (activeAttendance.rows.length === 0) {
      return res.status(404).json({ msg: 'No hay asistencias activas para este usuario' });
    }

    res.status(200).json(activeAttendance.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al obtener la asistencia del usuario' });
  }
};

module.exports = {
  registerAttendance,
  endAttendance,
  getAllAttendances,
  getAttendanceByUser
};
