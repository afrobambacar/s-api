import request from 'supertest'
import app from 'app'

describe('Index test', () => {
  it('GET / should success', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        console.log(`res.body: ${JSON.stringify(res.body)}`)
        res.body.status.should.equal('success')
        done();
      })
  })

  it('GET /hello should 404 NotFound', done => {
    request(app)
      .get('/hello')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })
})