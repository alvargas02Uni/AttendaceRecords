const request = require('supertest');
const express = require('express');
const userRouter = require('../src/routes/user.routes');
const bcrypt = require('bcrypt');
const pool = require('../config/db'); 
const jwt = require('jsonwebtoken');

// Mock de dependencias
jest.mock('bcrypt');
jest.mock('../config/db');
jest.mock('../src/util/generateToken', () => jest.fn().mockReturnValue('mockToken'));

const app = express();
app.use(express.json());
app.use('/api/users', userRouter);

describe('User Routes', () => {
  const newUser = {
    user_name: 'Test',
    user_surname: 'User',
    user_email: 'testuser@example.com',
    user_password: 'password123',
    user_gender: 'Male',
    user_age: 25,
    user_degree: 'Engineering',
    user_zipcode: '12345'
  };

  describe('POST /register', () => {
    it('should register a new user with valid data', async () => {
      // Simula que el usuario no existe:
      pool.query.mockResolvedValueOnce({ rows: [] });
      // Simula que bcrypt genera contraseña hasheada:
      bcrypt.hash.mockResolvedValueOnce('hashedPassword');
      // Simula la inserción del nuevo usuario en la BD:
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            user_id: 1,
            ...newUser,
            user_password: 'hashedPassword'
          }
        ]
      });

      const response = await request(app)
        .post('/api/users/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.token).toBe('mockToken');
    });

    it('should return 400 if user already exists', async () => {
      // Simula que el usuario ya existe en la BD:
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            user_email: 'testuser@example.com'
          }
        ]
      });

      const response = await request(app)
        .post('/api/users/register')
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('El usuario ya existe');
    });

    it('should return 400 if user_age is not a number', async () => {
      const invalidUser = {
        ...newUser,
        user_age: 'not-a-number'
      };

      // No simulamos nada especial para la BD aquí, 
      // porque se espera que falle antes (validación)
      const response = await request(app)
        .post('/api/users/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Invalid user_age, it must be a number');
    });

    it('should return 500 on server error', async () => {
      // Simulamos un error de BD:
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/users/register')
        .send(newUser);

      expect(response.status).toBe(500);
      // Ajustado para que coincida con el mensaje real que retorna el controlador
      expect(response.body.msg).toBe('Database error');
    });
  });

  describe('POST /login', () => {
    it('should login user with correct credentials', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            user_email: 'testuser@example.com',
            user_password: 'hashedPassword'
          }
        ]
      });
      bcrypt.compare.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          user_email: 'testuser@example.com',
          user_password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe('mockToken');
    });

    it('should return 400 if credentials are invalid', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            user_email: 'testuser@example.com',
            user_password: 'hashedPassword'
          }
        ]
      });
      bcrypt.compare.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          user_email: 'testuser@example.com',
          user_password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Credenciales inválidas');
    });

    it('should return 500 on server error', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/users/login')
        .send({
          user_email: 'testuser@example.com',
          user_password: 'password123'
        });

      expect(response.status).toBe(500);
      // Ajustado para que coincida con el mensaje real que retorna el controlador
      expect(response.body.msg).toBe('Database error');
    });
  });

  describe('Protected Routes', () => {
    beforeEach(() => {
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { user_id: 1, role: 'student' });
      });
    });

    describe('GET /profile', () => {
      it('should return user profile if authenticated', async () => {
        pool.query.mockResolvedValueOnce({
          rows: [
            {
              user_id: 1,
              user_name: 'Test',
              user_email: 'testuser@example.com',
              user_password: 'hashedPassword'
            }
          ]
        });

        const response = await request(app)
          .get('/api/users/profile')
          .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          user_id: 1,
          user_name: 'Test',
          user_email: 'testuser@example.com'
        });
      });

      it('should return 404 if user not found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const response = await request(app)
          .get('/api/users/profile')
          .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(404);
        expect(response.body.msg).toBe('Usuario no encontrado');
      });
    });

    describe('PUT /profile', () => {
      it('should update user profile with valid data', async () => {
        const updatedData = {
          user_name: 'Updated',
          user_surname: 'User',
          user_email: 'updateduser@example.com',
          user_age: 26,
          user_zipcode: '54321',
          user_gender: 'Male',
          user_degree: 'Engineering',
        };

        // Simulamos SELECT de usuario existente
        pool.query.mockResolvedValueOnce({
          rows: [
            {
              user_id: 1,
              user_name: 'Test',
              user_email: 'testuser@example.com',
              user_password: 'hashedPassword'
            }
          ]
        });

        // Simulamos UPDATE exitoso en la BD
        pool.query.mockResolvedValueOnce({
          rows: [
            {
              user_id: 1,
              ...updatedData,
              user_password: 'hashedPassword'
            }
          ]
        });

        const response = await request(app)
          .put('/api/users/profile')
          .set('Authorization', 'Bearer mockToken')
          .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedData);
      });
    });
  });
});
