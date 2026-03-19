const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');

describe('404 error test', () => {
  test('should return 404 for an unknown route', async () => {
    const res = await request(app).get('/HelloWorld');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toBe('not found');
    expect(res.body.error.code).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
