const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are rejected', async () => {
    const res = await request(app).get('/v1/fragments/myuserid');
    expect(res.statusCode).toBe(401);
  });

  test('non-existent fragment id returns not found', async () => {
    const res = await request(app)
      .get('/v1/fragments/nonexistent')
      .auth('test-user1@fragments-testing.com', 'test-password1');
    expect(res.statusCode).toBe(404);
  });

  test('authenticated user can get their fragment by id', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('Testing a user can get their fragments by id');

    const id = res1.body.fragment.id;
    const res2 = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.text).toBe('Testing a user can get their fragments by id');
    expect(res2.headers['content-type']).toBe('text/plain');
  });

  test('get a json fragment by id', async () => {
    const jsonData = { country: 'Canada' };
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'application/json')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .send(JSON.stringify(jsonData));
    const id = res.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toMatch(/application\/json/);
    expect(getRes.text).toBe(JSON.stringify(jsonData));
  });

  test('get a markdown fragment as html', async () => {
    const markdown = '# Seneca Polytechnic';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/markdown')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .send(markdown);

    const id = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('test-user1@fragments-testing.com', 'test-password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toMatch(/text\/html/);
    expect(getRes.text).toContain('<h1>Seneca Polytechnic</h1>');
  });
});
