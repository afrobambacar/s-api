import request from 'supertest'
import app from 'app'

describe('Index test', () => {
  it('GET / 200', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) done(err)

        res.body.status.should.equal('success')
        done();
      })
  })

  it('GET /hello 404', async () => {
    const { status } = await request(app)
      .get('/hello')
      
      expect(status).equal(404)
  })
})