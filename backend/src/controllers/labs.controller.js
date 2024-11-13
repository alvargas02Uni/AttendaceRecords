const pool = require('../../config/db'); // Asumiendo que tienes un pool de conexión a la base de datos PostgreSQL

// Obtener todos los laboratorios
const getAllLabs = async (req, res) => {
  try {
    const labs = await pool.query('SELECT * FROM labs');
    res.status(200).json(labs.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al obtener los laboratorios' });
  }
};

// Obtener un laboratorio por ID
const getLabById = async (req, res) => {
  const { id } = req.params;
  try {
    const lab = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
    if (lab.rows.length === 0) {
      return res.status(404).json({ msg: 'Laboratorio no encontrado' });
    }
    res.status(200).json(lab.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al obtener el laboratorio' });
  }
};

// Crear un laboratorio (solo administradores)
const createLab = async (req, res) => {
  const { lab_name } = req.body;

  try {
    // Verificar si ya existe un laboratorio con el mismo nombre
    const existingLab = await pool.query('SELECT * FROM labs WHERE lab_name = $1', [lab_name]);
    if (existingLab.rows.length > 0) {
      return res.status(400).json({ msg: 'El laboratorio ya existe' });
    }

    // Insertar nuevo laboratorio
    const newLab = await pool.query(
      'INSERT INTO labs (lab_name) VALUES ($1) RETURNING *',
      [lab_name]
    );

    res.status(201).json(newLab.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al crear el laboratorio' });
  }
};

// Actualizar un laboratorio (solo administradores)
const updateLab = async (req, res) => {
  const { id } = req.params;
  const { lab_name } = req.body;

  try {
    // Verificar si el laboratorio existe
    const existingLab = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
    if (existingLab.rows.length === 0) {
      return res.status(404).json({ msg: 'Laboratorio no encontrado' });
    }

    // Actualizar el laboratorio
    const updatedLab = await pool.query(
      'UPDATE labs SET lab_name = $1 WHERE lab_id = $2 RETURNING *',
      [lab_name, id]
    );

    res.status(200).json(updatedLab.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al actualizar el laboratorio' });
  }
};

// Eliminar un laboratorio (solo administradores)
const deleteLab = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el laboratorio existe
    const existingLab = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
    if (existingLab.rows.length === 0) {
      return res.status(404).json({ msg: 'Laboratorio no encontrado' });
    }

    // Eliminar el laboratorio
    await pool.query('DELETE FROM labs WHERE lab_id = $1', [id]);

    res.status(200).json({ msg: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al eliminar el laboratorio' });
  }
};

module.exports = {
  getAllLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
};
