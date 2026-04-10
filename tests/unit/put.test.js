const request = require('supertest');
const app = require('../../src/app');

// TEST - PUT ROUTE
describe('PUT /v1/fragments/:id', () => {
  test('unauthenticated requests are rejected', async () => {

    const res = await request(app).put('/v1/fragments/some-id').send('data');
    expect(res.statusCode).toBe(401);
  });

  test('updating non existent fragment returns 404', async () => {

    const res = await request(app)
      .put('/v1/fragments/nonexistent')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('updated');
    expect(res.statusCode).toBe(404);
  });

  test('type does not match in update; should returns 400', async () => {

    const createRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('original');

    const id = createRes.body.fragment.id;

    const updateRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ data: 'updated' }));

    expect(updateRes.statusCode).toBe(400);
  });

  test('authenticated user can update an existing fragment with the same type', async () => {

    const createRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('original data');

    const id = createRes.body.fragment.id;

    const updateRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('updated data');

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.fragment.id).toBe(id);
    expect(updateRes.body.status).toBe('ok');
    

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe('updated data');
  });
});
