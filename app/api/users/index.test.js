import request from 'supertest'
import app from 'app'

describe('API Test /users', () => {
  let userId

  it('POST /users 200: create user', async () => {
    const { status, body } = await request(app)
      .post('/users')
    
    expect(status).equal(200)
  })

  it('GET /users/me 200: get me', async () => {
    const { status, body } = await request(app)
      .get('/users/me')

    expect(status).equal(200)
  })

  it('GET /users/:id 200: get user', async () => {
    const { status, body } = await request(app)
      .get(`/users/${userId}`)

    expect(status).equal(200)
  })

  it('PATCH /users/me 200: update me', async () => {
    const { status, body } = await request(app)
      .patch('/users/me')

    expect(status).equal(200)
  })

  it('DELETE /users/me 200: delete user', async () => {
    const { status, body } = await request(app)
      .delete('/users/me')

    expect(status).equal(200)
  })
})
