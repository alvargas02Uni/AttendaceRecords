const request = require('supertest');
const express = require('express');
const adminRouter = require('../src/routes/admin.routes');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const generateToken = require('../src/util/generateToken');

jest.mock('bcrypt');
jest.mock('../config/db');
jest.mock('../src/util/generateToken', () => jest.fn().mockReturnValue('mockToken'));
jest.mock('../src/util/logger');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

describe('Admin Routes', () => {
  const newAdmin = {
    admin_name: 'Admin',
    admin_surname: 'User',
    admin_email: 'adminuser@example.com',
    admin_password: 'password123'
  };

  const updatedAdmin = {
    admin_name: 'Updated',
    admin_surname: 'Admin',
    admin_email: 'updatedadmin@example.com'
  };

  beforeAll(() => {
    console.error = jest.fn();
    console.log = jest.fn();
  });

  beforeEach(() => {
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(null, { admin_id: 1, role: 'admin' });
    });
    pool.query.mockReset();
  });

  describe('POST /register', () => {
    it('should register a new admin with valid data', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ admin_id: 1, ...newAdmin, admin_password: 'hashedPassword' }] });

      bcrypt.hash.mockResolvedValueOnce('hashedPassword');

      const response = await request(app).post('/api/admin/register').send(newAdmin);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', 'mockToken');
      expect(generateToken).toHaveBeenCalledWith(expect.objectContaining({ admin_id: 1 }));
    });
  });

  describe('POST /login', () => {
    it('should login admin with correct credentials', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ admin_email: 'adminuser@example.com', admin_password: 'hashedPassword' }] });
      bcrypt.compare.mockResolvedValueOnce(true);

      const response = await request(app).post('/api/admin/login').send({
        admin_email: 'adminuser@example.com',
        admin_password: 'password123'
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mockToken');
    });
  });

  describe('GET /admins', () => {
    it('should return all admins if authenticated', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          { admin_id: 1, admin_name: 'Admin', admin_surname: 'User', admin_email: 'admin1@example.com' },
          { admin_id: 2, admin_name: 'Admin', admin_surname: 'Two', admin_email: 'admin2@example.com' }
        ]
      });

      const response = await request(app).get('/api/admin/admins').set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('PUT /admins/:id', () => {
    it('should update admin info with valid data', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ admin_id: 1, ...updatedAdmin }] });

      const response = await request(app)
        .put('/api/admin/admins/1')
        .set('Authorization', 'Bearer mockToken')
        .send(updatedAdmin);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updatedAdmin);
    });
  });
});
  