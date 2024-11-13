// attendance.test.js
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
app.use('/api', attendanceRouter);

describe('Attendance Routes', () => {
  const studentToken = 'studentToken';
  const adminToken = 'adminToken';
  const invalidToken = 'invalidToken';

  const newAttendance = { lab_id: 1 };
  const attendanceRecord = { att_id: 1, user_id: 1, lab_id: 1, att_end_time: null };

  beforeEach(() => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      if (token === studentToken) {
        callback(null, { user_id: 1, role: 'student' });
      } else if (token === adminToken) {
        callback(null, { user_id: 2, role: 'admin' });
      } else {
        callback(new Error('Invalid token'));
      }
    });
  });

  describe('POST /attendance', () => {
    it('should register new attendance for student', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // No active attendance
      pool.query.mockResolvedValueOnce({ rows: [attendanceRecord] }); // Register new attendance

      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(newAttendance);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(attendanceRecord);
    });

    it('should return 409 if student already has active attendance', async () => {
      pool.query.mockResolvedValueOnce({ rows: [attendanceRecord] }); // Active attendance exists

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
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Invalid input: lab_id is required');
    });

    it('should return 403 if user is not a student', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newAttendance);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Requires student privileges');
    });

    it('should return 401 if token is missing or invalid', async () => {
      const response = await request(app).post('/api/attendance').send(newAttendance);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('PUT /attendance/:att_id/end', () => {
    it('should end attendance for student', async () => {
      pool.query.mockResolvedValueOnce({ rows: [attendanceRecord] }); // Active attendance exists
      pool.query.mockResolvedValueOnce({
        rows: [{ ...attendanceRecord, att_end_time: new Date().toISOString() }]
      }); // End attendance

      const response = await request(app)
        .put('/api/attendance/1/end')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.att_end_time).not.toBeNull();
    });

    it('should return 404 if no active attendance found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // No active attendance

      const response = await request(app)
        .put('/api/attendance/1/end')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('No se encontró una asistencia activa');
    });

    it('should return 403 if user is not a student', async () => {
      const response = await request(app)
        .put('/api/attendance/1/end')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Requires student privileges');
    });
  });

  describe('GET /attendance', () => {
    it('should get all attendances for admin', async () => {
      pool.query.mockResolvedValueOnce({ rows: [attendanceRecord, { ...attendanceRecord, att_id: 2 }] });

      const response = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should return 403 if user is not an admin', async () => {
      const response = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Requires admin privileges');
    });
  });

  describe('GET /attendance/active/:user_id', () => {
    it('should get active attendance for student', async () => {
      pool.query.mockResolvedValueOnce({ rows: [attendanceRecord] });

      const response = await request(app)
        .get('/api/attendance/active/1')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(attendanceRecord);
    });

    it('should return 404 if no active attendance for user', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // No active attendance

      const response = await request(app)
        .get('/api/attendance/active/1')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('No hay asistencias activas para este usuario');
    });

    it('should return 403 if user is not a student', async () => {
      const response = await request(app)
        .get('/api/attendance/active/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Requires student privileges');
    });
  });
});
