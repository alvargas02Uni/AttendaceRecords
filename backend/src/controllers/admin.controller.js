const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db'); // Asumiendo que tienes un pool de conexión a la base de datos PostgreSQL
const { validationResult } = require('express-validator');

// Función para generar tokens JWT para administradores
const generateAdminToken = (admin) => {
  return jwt.sign({ admin_id: admin.admin_id, email: admin.admin_email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registro de administrador
const registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { admin_name, admin_surname, admin_email, admin_password } = req.body;

  try {
    // Verificar si el administrador ya existe
    const existingAdmin = await pool.query('SELECT * FROM dep_admin WHERE admin_email = $1', [admin_email]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ msg: 'El administrador ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(admin_password, 10);

    // Insertar nuevo administrador
    const newAdmin = await pool.query(
      'INSERT INTO dep_admin (admin_name, admin_surname, admin_email, admin_password) VALUES ($1, $2, $3, $4) RETURNING *',
      [admin_name, admin_surname, admin_email, hashedPassword]
    );

    // Generar token JWT
    const token = generateAdminToken(newAdmin.rows[0]);

    return res.status(201).json({ token });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Login de administrador
const loginAdmin = async (req, res) => {
  const { admin_email, admin_password } = req.body;

  try {
    // Verificar si el administrador existe
    const admin = await pool.query('SELECT * FROM dep_admin WHERE admin_email = $1', [admin_email]);
    if (admin.rows.length === 0) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Comparar las contraseñas
    const isMatch = await bcrypt.compare(admin_password, admin.rows[0].admin_password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = generateAdminToken(admin.rows[0]);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Obtener todos los administradores
const getAllAdmins = async (req, res) => {
  try {
    const admins = await pool.query('SELECT * FROM dep_admin');
    return res.status(200).json(admins.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Actualizar información de un administrador
const updateAdmin = async (req, res) => {
  const { admin_name, admin_surname, admin_email, admin_password } = req.body;

  try {
    // Hashear la nueva contraseña si se proporciona
    const hashedPassword = admin_password ? await bcrypt.hash(admin_password, 10) : undefined;

    const updatedAdmin = await pool.query(
      `UPDATE dep_admin SET
      admin_name = $1,
      admin_surname = $2,
      admin_email = $3,
      admin_password = COALESCE($4, admin_password)
      WHERE admin_id = $5 RETURNING *`,
      [admin_name, admin_surname, admin_email, hashedPassword, req.params.id]
    );

    return res.status(200).json(updatedAdmin.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  updateAdmin
};
