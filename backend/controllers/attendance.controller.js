const db = require('../db');

const registerAttendance = async (req, res) => {
  const { user_code, lab_code } = req.body;
  const att_time = new Date();

  try {
    const result = await db.query(
      'INSERT INTO attendance (att_time, user_code, lab_code) VALUES ($1, $2, $3) RETURNING *',
      [att_time, user_code, lab_code]
    );
    res.status(201).json({ message: 'Attendance registered successfully', attendance: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering attendance' });
  }
};

const endAttendance = async (req, res) => {
  const { user_code } = req.params;
  const att_end_time = new Date();

  try {
    // Verificar si el usuario pertenece a un grupo
    const groupResult = await db.query(
      `SELECT g.group_id FROM group_members gm
       JOIN attendance_group g ON gm.group_id = g.group_id
       WHERE gm.user_code = $1`, 
      [user_code]
    );

    if (groupResult.rows.length > 0) {
      const group_id = groupResult.rows[0].group_id;

      // Terminar la asistencia para todos los miembros del grupo
      const result = await db.query(
        `UPDATE attendance SET att_end_time = $1 
         WHERE user_code IN (SELECT user_code FROM group_members WHERE group_id = $2) 
         AND att_end_time IS NULL RETURNING *`,
        [att_end_time, group_id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'No active attendance found for the group members' });
      }

      res.status(200).json({ message: 'Attendance ended successfully for the group', attendance: result.rows });
    } else {
      // Si el usuario no está en un grupo, terminar su asistencia individualmente
      const result = await db.query(
        'UPDATE attendance SET att_end_time = $1 WHERE user_code = $2 AND att_end_time IS NULL RETURNING *',
        [att_end_time, user_code]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'No active attendance found for the user' });
      }

      res.status(200).json({ message: 'Attendance ended successfully', attendance: result.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error ending attendance' });
  }
};

const getAttendances = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const result = await db.query(`
      SELECT attendance.att_time, attendance.att_end_time, attendance.lab_code, dep_user.user_name, dep_user.user_surname, lab.lab_name
      FROM attendance
      JOIN dep_user ON attendance.user_code = dep_user.user_code
      JOIN lab ON attendance.lab_code = lab.lab_code
      ORDER BY attendance.att_time DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching attendances' });
  }
};

const getActiveAttendance = async (req, res) => {
  const { user_code } = req.params;
  
  try {
    const result = await db.query(
      `SELECT a.*, l.lab_name 
       FROM attendance a 
       JOIN lab l ON a.lab_code = l.lab_code 
       WHERE a.user_code = $1 AND a.att_end_time IS NULL`, 
      [user_code]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ active: true, lab_name: result.rows[0].lab_name });
      console.log("Pending Attendance in lab: " + result.rows[0].lab_name);
    } else {
      res.status(200).json({ active: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching active attendance' });
  }
};

module.exports = {
  registerAttendance,
  endAttendance,
  getAttendances,
  getActiveAttendance,
};