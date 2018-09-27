import request from 'supertest'
import app from 'app'

describe('API Test /auth', () => {
  let accessToken
  
  it('POST /auth/local 200', async () => {
    const { status, body } = await request(app)
      .post('/auth/local')

    expect(status).equal(200)
  })

  it('POST /auth/refresh 200', async () => {
    const { status, body } = await request(app)
      .post('/auth/refresh')

    expect(status).equal(200)
  })

  it('DELETE /auth 200', async () => {
    const { status, body } = await request(app)
      .delete('/auth')

    expect(status).equal(200)
  })
})