// attendance.controller.js

const { validationResult } = require('express-validator');
const logger = require('../util/logger');
const {
  registerAttendanceService,
  endAttendanceService,
  getAllAttendancesService,
  getAttendanceByUserService,
} = require('../services/attendance.service');

// Registrar la asistencia de un estudiante
const registerAttendance = async (req, res) => {
  const { lab_id } = req.body;
  const user_id = req.user.user_id;

  if (!lab_id) {
    logger.warn(`Intento de registro de asistencia sin lab_id, usuario ID: ${user_id}`);
    return res.status(400).json({ msg: 'Invalid input: lab_id is required' });
  }

  try {
    const attendance = await registerAttendanceService(user_id, lab_id);
    logger.info(`Asistencia registrada con éxito, usuario ID: ${user_id}, laboratorio ID: ${lab_id}`);
    return res.status(201).json(attendance);
  } catch (error) {
    logger.error(`Error al registrar asistencia, usuario ID: ${user_id}, laboratorio ID: ${lab_id}: ${error.message}`);
    if (error.message === 'Ya tienes una asistencia activa en este laboratorio') {
      return res.status(409).json({ msg: error.message });
    } else {
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  }
};

// Finalizar la asistencia de un estudiante
const endAttendance = async (req, res) => {
  const { att_id } = req.params;
  const user_id = req.user.user_id;

  try {
    const updatedAttendance = await endAttendanceService(att_id, user_id);
    logger.info(`Asistencia finalizada con éxito, usuario ID: ${user_id}, asistencia ID: ${att_id}`);
    return res.status(200).json(updatedAttendance);
  } catch (error) {
    logger.error(`Error al finalizar asistencia, usuario ID: ${user_id}, asistencia ID: ${att_id}: ${error.message}`);
    if (error.message === 'No se encontró una asistencia activa') {
      return res.status(404).json({ msg: error.message });
    } else {
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  }
};

// Obtener todas las asistencias
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

// Obtener la asistencia activa de un usuario específico
const getAttendanceByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const activeAttendance = await getAttendanceByUserService(user_id);
    logger.info(`Consulta de asistencia activa para el usuario ID: ${user_id}`);
    return res.status(200).json(activeAttendance);
  } catch (error) {
    logger.error(`Error al obtener la asistencia activa para el usuario ID ${user_id}: ${error.message}`);
    if (error.message === 'No hay asistencias activas para este usuario') {
      return res.status(404).json({ msg: error.message });
    } else {
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  }
};

module.exports = {
  registerAttendance,
  endAttendance,
  getAllAttendances,
  getAttendanceByUser,
};
