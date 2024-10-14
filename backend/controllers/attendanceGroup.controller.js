const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const createGroup = async (req, res) => {
    const { created_by } = req.body;
    const group_code = uuidv4().slice(0, 10); // Generar un código único de grupo

    try {
        const result = await db.query(
            'INSERT INTO attendance_group (group_code, created_by) VALUES ($1, $2) RETURNING *',
            [group_code, created_by]
        );
        res.status(201).json({ message: 'Group created successfully', group: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating group' });
    }
};

const joinGroup = async (req, res) => {
    const { group_code, user_code } = req.body;

    try {
        // Verificar si el grupo existe
        const groupResult = await db.query('SELECT * FROM attendance_group WHERE group_code = $1', [group_code]);
        if (groupResult.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const group_id = groupResult.rows[0].group_id;

        // Verificar si el grupo ya tiene 8 miembros
        const memberCountResult = await db.query('SELECT COUNT(*) FROM group_members WHERE group_id = $1', [group_id]);
        if (parseInt(memberCountResult.rows[0].count) >= 8) {
            return res.status(400).json({ message: 'Group is full' });
        }

        // Obtener la asistencia activa del creador del grupo
        const leaderAttendanceResult = await db.query(
            `SELECT * FROM attendance WHERE user_code = $1 AND att_end_time IS NULL`,
            [groupResult.rows[0].created_by]
        );

        if (leaderAttendanceResult.rows.length === 0) {
            return res.status(400).json({ message: 'The group leader has not registered attendance in any lab' });
        }

        const leaderAttendance = leaderAttendanceResult.rows[0];

        // Registrar la asistencia del miembro en el mismo lab y con el mismo tiempo que el líder
        await db.query(
            'INSERT INTO attendance (att_time, user_code, lab_code) VALUES ($1, $2, $3)',
            [leaderAttendance.att_time, user_code, leaderAttendance.lab_code]
        );

        // Agregar usuario al grupo
        const result = await db.query(
            'INSERT INTO group_members (group_id, user_code) VALUES ($1, $2) RETURNING *',
            [group_id, user_code]
        );

        res.status(201).json({ message: 'Joined group successfully and attendance registered', member: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error joining group' });
    }
};

const getGroupMembers = async (req, res) => {
    const { group_code } = req.params;

    try {
        const groupResult = await db.query('SELECT * FROM attendance_group WHERE group_code = $1', [group_code]);
        if (groupResult.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const group_id = groupResult.rows[0].group_id;

        const membersResult = await db.query(
            `SELECT dep_user.user_name, dep_user.user_surname 
             FROM group_members 
             JOIN dep_user ON group_members.user_code = dep_user.user_code 
             WHERE group_id = $1`,
            [group_id]
        );

        res.status(200).json({ members: membersResult.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching group members' });
    }
};

module.exports = {
    createGroup,
    joinGroup,
    getGroupMembers,
};