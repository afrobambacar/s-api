import request from 'supertest'
import app from 'app'

describe('API Test /email', () => {
  before('POST /email, seed data as a@a.com', done => {
    request(app)
      .post('/email')
      .send({ email: 'a@a.com'})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  it('POST /email, status returns fail when body empty', done => {
    request(app)
      .post('/email')
      .send({})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const { status } = res.body
        status.should.equal('fail')
        done()
      })
  })

  it('POST /email, aaa must be fail', done => {
    request(app)
      .post('/email')
      .send({ email: 'aaa' })
      .expect(200)
      .end((err, res) => {
        if (err) return done()
        const { status } = res.body
        status.should.equal('fail')
        done()
      })
  })

  it('POST /email, b@b.com must be success', done => {
    request(app)
      .post('/email')
      .send({ email: 'b@b.com' })
      .expect(200)
      .end((err, res) => {
        if (err) return done()
        const { status } = res.body
        status.should.equal('success')
        done()
      })
  })

  it('POST /email, must check existence email', done => {
    request(app)
      .post('/email')
      .send({ email: 'a@a.com'})
      .expect(200)
      .end((err, res) => {
        if (err) return done()
        const { data } = res.body
        data.isExist.should.equal(true)
      })
  })
})
