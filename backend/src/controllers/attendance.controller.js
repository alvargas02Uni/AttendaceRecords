const pool = require('../../config/db');

// Registrar la asistencia de un estudiante
// Registrar la asistencia de un estudiante
const registerAttendance = async (req, res) => {
  const { lab_id } = req.body;
  const user_id = req.user.user_id;

  // Validación: Verificar si lab_id está presente
  if (!lab_id) {
    return res.status(400).json({ msg: 'Invalid input: lab_id is required' });
  }

  try {
    // Verificar si el estudiante ya tiene una asistencia activa en el laboratorio
    const { rows: activeAttendance } = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND lab_id = $2 AND att_end_time IS NULL',
      [user_id, lab_id]
    );

    if (activeAttendance.length > 0) {
      return res.status(409).json({ msg: 'Ya tienes una asistencia activa en este laboratorio' }); 
    }

    // Registrar nueva asistencia
    const { rows: newAttendance } = await pool.query(
      'INSERT INTO attendance (user_id, lab_id) VALUES ($1, $2) RETURNING *',
      [user_id, lab_id]
    );

    res.status(201).json(newAttendance[0]);
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
    const { rows: attendance } = await pool.query(
      'SELECT * FROM attendance WHERE att_id = $1 AND user_id = $2 AND att_end_time IS NULL',
      [att_id, user_id]
    );

    if (attendance.length === 0) {
      return res.status(404).json({ msg: 'No se encontró una asistencia activa' });
    }

    // Finalizar la asistencia
    const { rows: updatedAttendance } = await pool.query(
      'UPDATE attendance SET att_end_time = NOW() WHERE att_id = $1 RETURNING *',
      [att_id]
    );

    res.status(200).json(updatedAttendance[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al finalizar la asistencia' });
  }
};

// Obtener todas las asistencias (solo administradores)
const getAllAttendances = async (req, res) => {
  try {
    const { rows: allAttendances } = await pool.query('SELECT * FROM attendance');
    res.status(200).json(allAttendances);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al obtener las asistencias' });
  }
};

// Obtener la asistencia activa de un usuario específico
const getAttendanceByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const { rows: activeAttendance } = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND att_end_time IS NULL',
      [user_id]
    );

    if (activeAttendance.length === 0) {
      return res.status(404).json({ msg: 'No hay asistencias activas para este usuario' });
    }

    res.status(200).json(activeAttendance[0]);
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
