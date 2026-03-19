const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('metadata is returned for an existing fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .send('test');
    const id = postRes.body.fragment.id;

    const infoRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(infoRes.statusCode).toBe(200);
    expect(infoRes.body.status).toBe('ok');
    expect(infoRes.body.fragment).toHaveProperty('id', id);
    expect(infoRes.body.fragment).toHaveProperty('ownerId');
    expect(infoRes.body.fragment).toHaveProperty('created');
    expect(infoRes.body.fragment).toHaveProperty('updated');
    expect(infoRes.body.fragment).toHaveProperty('type', 'text/plain');
    expect(infoRes.body.fragment).toHaveProperty('size', 4);
  });

  test('non-existent fragment returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/nonexistentfragment/info')
      .auth('test-user1@fragments-testing.com', 'test-password1');
    expect(res.statusCode).toBe(404);
  });

  test('unauthorized returns 401', async () => {
    const res = await request(app).get('/v1/fragments/someid/info');
    expect(res.statusCode).toBe(401);
  });
});
