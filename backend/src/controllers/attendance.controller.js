const { validationResult } = require('express-validator');
const logger = require('../util/logger');
const {
  registerAttendanceService,
  endAttendanceService,
  getAllAttendancesService,
  getAttendanceByUserService,
} = require('../services/attendance.service');

// Registrar la asistencia de un usuario (no se chequea rol)
const registerAttendance = async (req, res) => {
  // Validaciones con express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(
      `Intento de registro de asistencia con datos inválidos, usuario ID: ${req.user.user_id}`,
      { errors: errors.array() }
    );
    return res.status(400).json({ msg: 'Invalid input', errors: errors.array() });
  }

  try {
    const attendance = await registerAttendanceService(req.user.user_id, req.body.lab_id);

    logger.info(
      `Asistencia registrada con éxito, usuario ID: ${req.user.user_id}, laboratorio ID: ${req.body.lab_id}`
    );
    return res.status(201).json(attendance);
  } catch (error) {
    logger.error(`Error al registrar asistencia: ${error.message}`);
    if (error.message.includes('asistencia activa')) {
      // Podríamos devolver 409 si ya hay una asistencia activa
      return res.status(409).json({ msg: error.message });
    }
    return res.status(500).json({ msg: error.message });
  }
};

// Finalizar la asistencia de un usuario (no se chequea rol)
const endAttendance = async (req, res) => {
  const { att_id } = req.params;
  const user_id = req.user.user_id;  // Obtenemos el ID de usuario del token

  try {
    const updatedAttendance = await endAttendanceService(att_id, user_id);
    logger.info(`Asistencia finalizada con éxito, usuario ID: ${user_id}, asistencia ID: ${att_id}`);
    return res.status(200).json(updatedAttendance);
  } catch (error) {
    logger.error(
      `Error al finalizar asistencia, usuario ID: ${user_id}, asistencia ID: ${att_id}: ${error.message}`
    );
    if (error.message === 'No se encontró una asistencia activa') {
      return res.status(404).json({ msg: error.message });
    }
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Obtener todas las asistencias (no se chequea rol)
const getAllAttendances = async (req, res) => {
  try {
    const allAttendances = await getAllAttendancesService();
    logger.info('Consulta realizada para obtener todas las asistencias');
    return res.status(200).json(allAttendances);
  } catch (error) {
    logger.error(`Error al obtener todas las asistencias: ${error.message}`);
    return res.status(500).json({ msg: 'Error al obtener las asistencias' });
  }
};

// Obtener la asistencia activa de un usuario (no se chequea rol)
const getAttendanceByUser = async (req, res) => {
  try {
    const activeAttendance = await getAttendanceByUserService(req.user.user_id);
    logger.info(`Consulta de asistencia activa para el usuario ID: ${req.user.user_id}`);
    return res.status(200).json(activeAttendance);
  } catch (error) {
    logger.error(`Error al obtener la asistencia activa: ${error.message}`);
    if (error.message === 'No hay asistencias activas para este usuario') {
      return res.status(404).json({ msg: error.message });
    }
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

module.exports = {
  registerAttendance,
  endAttendance,
  getAllAttendances,
  getAttendanceByUser,
};
