const request = require('supertest');
const express = require('express');
const labsRouter = require('../src/routes/labs.routes');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

jest.mock('../config/db');
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api', labsRouter);

describe('Labs Routes', () => {
  const studentToken = 'studentToken';
  const adminToken = 'adminToken';

  const labData = { lab_name: 'Lab 1' };
  const labRecord = { lab_id: 1, lab_name: 'Lab 1' };

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

    pool.query.mockReset();
  });

  describe('GET /get/:id', () => {
    it('should return 404 if lab not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/get/999')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Laboratorio no encontrado');
    });

    it('should return 400 for invalid ID format', async () => {
        const response = await request(app)
          .get('/api/get/invalid')
          .set('Authorization', `Bearer ${studentToken}`);
    
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('ID must be an integer');
    });
  });

  describe('POST /create', () => {
    it('should create a new lab for admin', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); 
      pool.query.mockResolvedValueOnce({ rows: [labRecord] }); 

      const response = await request(app)
        .post('/api/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(labData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(labRecord);
    });

    it('should return 400 if lab_name is missing', async () => {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('lab_name is required');
    });

    it('should return 400 if lab_name is too long', async () => {
      const longLabName = 'L'.repeat(256); 
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ lab_name: longLabName });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('lab_name exceeds maximum length');
    });

    it('should return 403 if user is not an admin', async () => {
      const response = await request(app)
        .post('/api/create')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(labData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Requires admin privileges');
    });
  });

  describe('PUT /update/:id', () => {
    it('should return 404 if lab not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // Lab no existe

      const response = await request(app)
        .put('/api/update/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ lab_name: 'Updated Lab' });

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Laboratorio no encontrado');
    });

    it('should update lab for admin', async () => {
      pool.query.mockResolvedValueOnce({ rows: [labRecord] }); // Lab exists
      pool.query.mockResolvedValueOnce({ rows: [{ ...labRecord, lab_name: 'Updated Lab' }] }); // Lab updated

      const response = await request(app)
        .put('/api/update/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ lab_name: 'Updated Lab' });

      expect(response.status).toBe(200);
      expect(response.body.lab_name).toBe('Updated Lab');
    });

    it('should return 400 if lab_name is missing in update', async () => {
      const response = await request(app)
        .put('/api/update/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('lab_name is required');
    });

    it('should return 404 if lab not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/update/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ lab_name: 'Updated Lab' });

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Laboratorio no encontrado');
    });

    it('should return 403 if user is not an admin', async () => {
      const response = await request(app)
        .put('/api/update/1')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ lab_name: 'Updated Lab' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Requires admin privileges');
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should return 404 if lab not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // Lab no existe

      const response = await request(app)
        .delete('/api/delete/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Laboratorio no encontrado');
    });

    it('should delete lab for admin', async () => {
      pool.query.mockResolvedValueOnce({ rows: [labRecord] }); // Lab exists
      pool.query.mockResolvedValueOnce({ rows: [] }); // No attendance records
      pool.query.mockResolvedValueOnce({}); // Lab deleted

      const response = await request(app)
        .delete('/api/delete/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Laboratorio eliminado correctamente');
    });

    it('should return 404 if lab not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .delete('/api/delete/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Laboratorio no encontrado');
    });

    it('should return 400 if lab has associated attendance records', async () => {
      pool.query.mockResolvedValueOnce({ rows: [labRecord] }); // Lab exists
      pool.query.mockResolvedValueOnce({ rows: [{ att_id: 1 }] }); // Attendance records exist

      const response = await request(app)
        .delete('/api/delete/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('No se puede eliminar el laboratorio, ya tiene registros de asistencia asociados');
    });

    it('should return 403 if user is not an admin', async () => {
      const response = await request(app)
        .delete('/api/delete/1')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Requires admin privileges');
    });
  });
});
