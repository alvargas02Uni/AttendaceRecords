const { validationResult } = require('express-validator');
const logger = require('../util/logger');
const {
  registerUserService,
  loginUserService,
  getUserProfileService,
  updateUserProfileService,
} = require('../services/user.service');

// Registro de usuario
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Intento de registro de usuario con datos inválidos', { errors: errors.array() });
    return res.status(400).json({ msg: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const { token, user } = await registerUserService(req.body);
    logger.info(`Usuario registrado con éxito: ${user.user_email}`);
    return res.status(201).json({ token, user });
  } catch (error) {
    // Ajustamos el error "El usuario ya existe" para devolver 400
    if (error.message === 'El usuario ya existe') {
      logger.error(`Error al registrar usuario: ${error.message}`);
      return res.status(400).json({ msg: error.message });
    }
    // Para cualquier otro error, devolvemos 500
    logger.error(`Error al registrar usuario: ${error.message}`);
    return res.status(500).json({ msg: error.message });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { token, user } = await loginUserService(req.body.user_email, req.body.user_password);
    logger.info(`Usuario inició sesión: ${user.user_email}`);
    return res.status(200).json({ token, user });
  } catch (error) {
    // Ajustamos el error de "Credenciales inválidas" para 400
    if (error.message === 'Credenciales inválidas') {
      logger.warn(`Intento fallido de login para usuario: ${req.body.user_email}`);
      return res.status(400).json({ msg: error.message });
    }
    // Para cualquier otro error (p.ej. de base de datos), devolvemos 500
    logger.error(`Error al iniciar sesión para usuario: ${req.body.user_email} - ${error.message}`);
    return res.status(500).json({ msg: error.message });
  }
};

// Obtener perfil del usuario
const getUserProfile = async (req, res) => {
  try {
    const userProfile = await getUserProfileService(req.user.user_id);
    logger.info(`Consulta del perfil del usuario ID: ${req.user.user_id}`);
    return res.status(200).json(userProfile);
  } catch (error) {
    logger.error(`Error al obtener el perfil del usuario ID ${req.user.user_id}: ${error.message}`);
    // Para "Usuario no encontrado" usas 404 (coincide con el test)
    return res.status(404).json({ msg: error.message });
  }
};

// Actualizar perfil del usuario
const updateUserProfile = async (req, res) => {
  try {
    const updatedProfile = await updateUserProfileService(req.user.user_id, req.body);
    logger.info(`Perfil actualizado con éxito para usuario ID: ${req.user.user_id}`);
    return res.status(200).json(updatedProfile);
  } catch (error) {
    logger.error(`Error al actualizar el perfil del usuario ID ${req.user.user_id}: ${error.message}`);
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
