const bcrypt = require('bcrypt');
const pool = require('../../config/db');
const generateToken = require('../util/generateToken');

// Registro de usuario
const registerUserService = async ({
  user_name,
  user_surname,
  user_email,
  user_password,
  user_gender,
  user_age,
  user_degree,
  user_zipcode,
  user_isnear
}) => {
  const { rows } = await pool.query('SELECT * FROM dep_user WHERE user_email = $1', [user_email]);
  if (rows.length > 0) {
    throw new Error('El usuario ya existe');
  }

  const hashedPassword = await bcrypt.hash(user_password, 10);
  const { rows: newUser } = await pool.query(
    `INSERT INTO dep_user 
    (user_name, user_surname, user_email, user_password, user_gender, user_age, user_degree, user_zipcode, user_isnear, created_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
    [user_name, user_surname, user_email, hashedPassword, user_gender, user_age, user_degree, user_zipcode, user_isnear || false]
  );

  const user = newUser[0];
  delete user.user_password;

  return { token: generateToken(user), user };
};

// Login de usuario
const loginUserService = async (user_email, user_password) => {
  const { rows } = await pool.query('SELECT * FROM dep_user WHERE user_email = $1', [user_email]);
  if (rows.length === 0) {
    throw new Error('Credenciales inválidas');
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(user_password, user.user_password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  delete user.user_password;

  return { token: generateToken(user), user };
};

// Obtener perfil del usuario
const getUserProfileService = async (user_id) => {
  const { rows } = await pool.query('SELECT * FROM dep_user WHERE user_id = $1', [user_id]);
  if (rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const user = rows[0];
  delete user.user_password;
  
  return user;
};

// Actualizar perfil del usuario
const updateUserProfileService = async (user_id, updates) => {
  const { rows: existingUser } = await pool.query('SELECT * FROM dep_user WHERE user_id = $1', [user_id]);
  if (existingUser.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const hashedPassword = updates.user_password ? await bcrypt.hash(updates.user_password, 10) : undefined;

  const { rows } = await pool.query(
    `UPDATE dep_user SET
      user_name = $1,
      user_surname = $2,
      user_email = $3,
      user_password = COALESCE($4, user_password),
      user_gender = $5,
      user_age = $6,
      user_degree = $7,
      user_zipcode = $8,
      user_isnear = $9
      WHERE user_id = $10 RETURNING *`,
    [
      updates.user_name, updates.user_surname, updates.user_email, hashedPassword,
      updates.user_gender, updates.user_age, updates.user_degree, updates.user_zipcode, 
      updates.user_isnear || false, user_id
    ]
  );

  const updatedUser = rows[0];
  delete updatedUser.user_password;

  return updatedUser;
};

module.exports = {
  registerUserService,
  loginUserService,
  getUserProfileService,
  updateUserProfileService,
};
