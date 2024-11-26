// labs.controller.js

const { validationResult } = require('express-validator');
const logger = require('../util/logger');
const {
  getAllLabsService,
  getLabByIdService,
  createLabService,
  updateLabService,
  deleteLabService,
} = require('../services/labs.service');

// Obtener todos los laboratorios
const getAllLabs = async (req, res) => {
  try {
    const labs = await getAllLabsService();
    logger.info('Consulta realizada para obtener todos los laboratorios');
    return res.status(200).json(labs);
  } catch (error) {
    logger.error(`Error al obtener los laboratorios: ${error.message}`);
    return res.status(500).json({ msg: 'Error al obtener los laboratorios' });
  }
};

// Obtener un laboratorio por ID
const getLabById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Intento de consulta de laboratorio con ID no válido');
    return res.status(400).json({ msg: 'ID no válido', errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const lab = await getLabByIdService(id);
    logger.info(`Consulta realizada para obtener laboratorio con ID: ${id}`);
    return res.status(200).json(lab);
  } catch (error) {
    logger.error(`Error al obtener el laboratorio con ID ${id}: ${error.message}`);
    if (error.message === 'Laboratorio no encontrado') {
      return res.status(404).json({ msg: error.message });
    } else {
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  }
};

// Crear un laboratorio
const createLab = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Intento de creación de laboratorio con datos inválidos');
    return res.status(400).json({ msg: 'Datos inválidos', errors: errors.array() });
  }

  const { lab_name } = req.body;

  try {
    const newLab = await createLabService(lab_name);
    logger.info(`Laboratorio creado con éxito: ${lab_name}`);
    return res.status(201).json(newLab);
  } catch (error) {
    logger.error(`Error al crear el laboratorio ${lab_name}: ${error.message}`);
    if (error.message === 'El laboratorio ya existe') {
      return res.status(400).json({ msg: error.message });
    } else {
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  }
};

// Actualizar un laboratorio
const updateLab = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Intento de actualización de laboratorio con datos inválidos');
    return res.status(400).json({ msg: 'Datos inválidos', errors: errors.array() });
  }

  const { id } = req.params;
  const { lab_name } = req.body;

  try {
    const updatedLab = await updateLabService(id, lab_name);
    logger.info(`Laboratorio actualizado con éxito, ID: ${id}, nuevo nombre: ${lab_name}`);
    return res.status(200).json(updatedLab);
  } catch (error) {
    logger.error(`Error al actualizar el laboratorio con ID ${id}: ${error.message}`);
    if (error.message === 'Laboratorio no encontrado') {
      return res.status(404).json({ msg: error.message });
    } else {
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  }
};

// Eliminar un laboratorio
const deleteLab = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Intento de eliminación de laboratorio con ID no válido');
    return res.status(400).json({ msg: 'ID no válido', errors: errors.array() });
  }

  const { id } = req.params;

  try {
    await deleteLabService(id);
    logger.info(`Laboratorio eliminado con éxito, ID: ${id}`);
    return res.status(200).json({ msg: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    logger.error(`Error al eliminar el laboratorio con ID ${id}: ${error.message}`);
    if (error.message === 'Laboratorio no encontrado') {
      return res.status(404).json({ msg: error.message });
    } else if (error.message === 'No se puede eliminar el laboratorio, ya tiene registros de asistencia asociados') {
      return res.status(400).json({ msg: error.message });
    } else {
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  }
};

module.exports = {
  getAllLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
};
