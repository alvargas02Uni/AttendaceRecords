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
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    logger.warn('Intento de consulta de laboratorio con ID no válido');
    return res.status(400).json({ msg: 'ID no válido' });
  }

  try {
    const lab = await getLabByIdService(id);
    logger.info(`Consulta realizada para obtener laboratorio con ID: ${id}`);
    return res.status(200).json(lab);
  } catch (error) {
    logger.error(`Error al obtener el laboratorio con ID ${id}: ${error.message}`);
    return res.status(400).json({ msg: error.message });
  }
};

// Crear un laboratorio
const createLab = async (req, res) => {
  const { lab_name } = req.body;

  if (!lab_name) {
    logger.warn('Intento de creación de laboratorio sin lab_name');
    return res.status(400).json({ msg: 'lab_name is required' });
  }

  if (lab_name.length > 255) {
    logger.warn('Intento de creación de laboratorio con lab_name que excede la longitud máxima permitida');
    return res.status(400).json({ msg: 'lab_name exceeds maximum length' });
  }

  try {
    const newLab = await createLabService(lab_name);
    logger.info(`Laboratorio creado con éxito: ${lab_name}`);
    return res.status(201).json(newLab);
  } catch (error) {
    logger.error(`Error al crear el laboratorio ${lab_name}: ${error.message}`);
    return res.status(400).json({ msg: error.message });
  }
};

// Actualizar un laboratorio
const updateLab = async (req, res) => {
  const { id } = req.params;
  const { lab_name } = req.body;

  if (!lab_name) {
    logger.warn('Intento de actualización de laboratorio sin lab_name');
    return res.status(400).json({ msg: 'lab_name is required' });
  }

  if (lab_name.length > 255) {
    logger.warn('Intento de actualización de laboratorio con lab_name que excede la longitud máxima permitida');
    return res.status(400).json({ msg: 'lab_name exceeds maximum length' });
  }

  try {
    const updatedLab = await updateLabService(id, lab_name);
    logger.info(`Laboratorio actualizado con éxito, ID: ${id}, nuevo nombre: ${lab_name}`);
    return res.status(200).json(updatedLab);
  } catch (error) {
    logger.error(`Error al actualizar el laboratorio con ID ${id}: ${error.message}`);
    return res.status(400).json({ msg: error.message });
  }
};

// Eliminar un laboratorio
const deleteLab = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteLabService(id);
    logger.info(`Laboratorio eliminado con éxito, ID: ${id}`);
    return res.status(200).json({ msg: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    logger.error(`Error al eliminar el laboratorio con ID ${id}: ${error.message}`);
    return res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
};
