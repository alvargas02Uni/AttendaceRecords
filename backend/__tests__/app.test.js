const request = require('supertest');
const app = require('../index'); 

describe('API Endpoints', () => {
  it('GET / should return a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome to the Attendance Records API');
  });

  it('GET /attendance should return a list of attendance records', async () => {
    const response = await request(app).get('/attendance');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
