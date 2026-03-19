const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('Unsupported content-type return 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'image/png')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .send(JSON.stringify({ data: '123heyhey' }));
    expect(res.statusCode).toBe(415);
  });

  test('Request without .auth', async () => {
    const res = await request(app).post('/v1/fragments').send('123heyhey');
    expect(res.statusCode).toBe(401);
  });

  test('wrong email and password', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('ops@gmail.com', 'mypass')
      .send('123heyhey');
    expect(res.statusCode).toBe(401);
  });

  test('supported content-type is actually supported', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .send('123heyhey');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toBeDefined();
  });

  test('fragment has all required properties', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('test123test');
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(11);
  });

  test('response has a location header', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('test123');

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toBeDefined();
    expect(res.headers.location).toMatch(/^http:\/\/.+\/v1\/fragments\/.+$/);
  });

  test('fragment handles application/json and json body', async () => {
    const jsonData = { name: 'anna' };
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'application/json')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .send(JSON.stringify(jsonData));
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toBeDefined();
    expect(res.body.fragment.type).toBe('application/json');
    expect(res.body.fragment.size).toBe(Buffer.byteLength(JSON.stringify(jsonData)));
  });
});
