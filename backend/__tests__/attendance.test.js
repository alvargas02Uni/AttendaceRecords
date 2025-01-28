const request = require('supertest');
const express = require('express');
const attendanceRouter = require('../src/routes/attendance.routes');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

jest.mock('../config/db');
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

const app = express();
app.use(express.json());
// Monta en /api/attendance. Por eso tus tests llaman a /api/attendance, /api/attendance/active/:id, etc.
app.use('/api/attendance', attendanceRouter);

describe('Attendance Routes', () => {
  const studentToken = 'studentToken';
  const adminToken = 'adminToken';
  const invalidToken = 'invalidToken';

  const newAttendance = { lab_id: 1 };
  const attendanceRecord = {
    att_id: 1,
    user_id: 1,
    lab_id: 1,
    att_end_time: null
  };

  beforeEach(() => {
    // Mock del token
    jwt.verify.mockImplementation((token, secret, callback) => {
      if (token === studentToken) {
        callback(null, { user_id: 1, role: 'student' });
      } else if (token === adminToken) {
        callback(null, { user_id: 2, role: 'admin' });
      } else {
        callback(new Error('Invalid token'));
      }
    });

    // Reseteamos los mocks de la BD antes de cada test
    pool.query.mockReset();
  });

  describe('POST /attendance', () => {
    it('should register new attendance for student', async () => {
      // 1) El usuario no tiene asistencia activa
      pool.query.mockResolvedValueOnce({ rows: [] });
      // 2) Insertar nueva asistencia
      pool.query.mockResolvedValueOnce({ rows: [attendanceRecord] });

      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(newAttendance);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(attendanceRecord);
    });

    it('should return 409 if student already has active attendance', async () => {
      // Existe asistencia activa
      pool.query.mockResolvedValueOnce({ rows: [attendanceRecord] });

      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(newAttendance);

      expect(response.status).toBe(409);
      expect(response.body.msg).toBe('Ya tienes una asistencia activa en este laboratorio');
    });

    it('should return 400 if lab_id is missing', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({}); // Sin lab_id

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Invalid input');
    });

    it('should return 401 if token is missing or invalid', async () => {
      // Sin token
      const response = await request(app)
        .post('/api/attendance')
        .send(newAttendance);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('PUT /attendance/:att_id/end', () => {
    it('should end attendance for student', async () => {
      // El usuario tiene una asistencia activa
      pool.query.mockResolvedValueOnce({ rows: [attendanceRecord] });
      // Se actualiza con att_end_time
      pool.query.mockResolvedValueOnce({
        rows: [{ ...attendanceRecord, att_end_time: new Date().toISOString() }]
      });

      const response = await request(app)
        .put('/api/attendance/1/end')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.att_end_time).not.toBeNull();
    });

    it('should return 404 if no active attendance found', async () => {
      // No existe asistencia activa
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/attendance/1/end')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('No se encontró una asistencia activa');
    });
  });

  describe('GET /attendance', () => {
    it('should get all attendances for admin', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          attendanceRecord,
          { ...attendanceRecord, att_id: 2 }
        ]
      });

      const response = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });
});
