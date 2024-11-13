const request = require('supertest');
const app = require('../server'); // Importar el servidor para probar las rutas

describe('User Endpoints', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        user_name: 'John',
        user_surname: 'Doe',
        user_email: 'john.doe@example.com',
        user_password: 'password123',
        user_gender: 'Male',
        user_age: '1995-10-10',
        user_degree: 'Computer Science',
        user_zipcode: '12345'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user_id');
  });
});
