const pool = require('../../config/db');

// Obtener todos los laboratorios
const getAllLabs = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM labs');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al obtener los laboratorios' });
  }
};

// Obtener un laboratorio por ID
const getLabById = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ msg: 'ID no válido' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Laboratorio no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al obtener el laboratorio' });
  }
};

// Crear un laboratorio (solo administradores)
const createLab = async (req, res) => {
  const { lab_name } = req.body;

  // Validación de `lab_name`
  if (!lab_name) {
    return res.status(400).json({ msg: 'lab_name is required' });
  }
  if (lab_name.length > 255) {
    return res.status(400).json({ msg: 'lab_name exceeds maximum length' });
  }

  try {
    const { rows: existingLab } = await pool.query('SELECT * FROM labs WHERE lab_name = $1', [lab_name]);
    if (existingLab.length > 0) {
      return res.status(400).json({ msg: 'El laboratorio ya existe' });
    }

    const { rows: newLab } = await pool.query(
      'INSERT INTO labs (lab_name) VALUES ($1) RETURNING *',
      [lab_name]
    );

    res.status(201).json(newLab[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al crear el laboratorio' });
  }
};

// Actualizar un laboratorio (solo administradores)
const updateLab = async (req, res) => {
  const { id } = req.params;
  const { lab_name } = req.body;

  // Validación de `lab_name`
  if (!lab_name) {
    return res.status(400).json({ msg: 'lab_name is required' });
  }
  if (lab_name.length > 255) {
    return res.status(400).json({ msg: 'lab_name exceeds maximum length' });
  }

  try {
    const { rows: existingLab } = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
    if (existingLab.length === 0) {
      return res.status(404).json({ msg: 'Laboratorio no encontrado' });
    }

    const { rows: updatedLab } = await pool.query(
      'UPDATE labs SET lab_name = $1 WHERE lab_id = $2 RETURNING *',
      [lab_name, id]
    );

    res.status(200).json(updatedLab[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al actualizar el laboratorio' });
  }
};

// Eliminar un laboratorio (solo administradores)
const deleteLab = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: existingLab } = await pool.query('SELECT * FROM labs WHERE lab_id = $1', [id]);
    if (existingLab.length === 0) {
      return res.status(404).json({ msg: 'Laboratorio no encontrado' });
    }

    const { rows: attendanceRecords } = await pool.query('SELECT * FROM attendance WHERE lab_id = $1', [id]);
    if (attendanceRecords.length > 0) {
      return res.status(400).json({ msg: 'No se puede eliminar el laboratorio, ya tiene registros de asistencia asociados' });
    }

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
