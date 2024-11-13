const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db'); // Asumiendo que tienes un pool de conexión a la base de datos PostgreSQL
const { validationResult } = require('express-validator');

// Función para generar tokens JWT
const generateToken = (user) => {
  return jwt.sign({ user_id: user.user_id, email: user.user_email, isAdmin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registro de usuario
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_name, user_surname, user_email, user_password, user_gender, user_age, user_degree, user_zipcode } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await pool.query('SELECT * FROM dep_user WHERE user_email = $1', [user_email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Insertar nuevo usuario
    const newUser = await pool.query(
      'INSERT INTO dep_user (user_name, user_surname, user_email, user_password, user_gender, user_age, user_degree, user_zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user_name, user_surname, user_email, hashedPassword, user_gender, user_age, user_degree, user_zipcode]
    );

    // Generar token JWT
    const token = generateToken(newUser.rows[0]);

    return res.status(201).json({ token });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await pool.query('SELECT * FROM dep_user WHERE user_email = $1', [user_email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Comparar las contraseñas
    const isMatch = await bcrypt.compare(user_password, user.rows[0].user_password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = generateToken(user.rows[0]);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario
const getUserProfile = async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM dep_user WHERE user_id = $1', [req.user.user_id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    return res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Actualizar perfil del usuario
const updateUserProfile = async (req, res) => {
  const { user_name, user_surname, user_email, user_password, user_gender, user_age, user_degree, user_zipcode } = req.body;

  try {
    const hashedPassword = user_password ? await bcrypt.hash(user_password, 10) : undefined;

    const updatedUser = await pool.query(
      `UPDATE dep_user SET
      user_name = $1,
      user_surname = $2,
      user_email = $3,
      user_password = COALESCE($4, user_password),
      user_gender = $5,
      user_age = $6,
      user_degree = $7,
      user_zipcode = $8
      WHERE user_id = $9 RETURNING *`,
      [user_name, user_surname, user_email, hashedPassword, user_gender, user_age, user_degree, user_zipcode, req.user.user_id]
    );

    return res.status(200).json(updatedUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
