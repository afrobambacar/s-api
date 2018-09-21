import request from 'supertest'
import app from 'app'

describe('API Test /kitty', () => {
  let kittyId;

  before('POST /kitty (should success)', done => {
    request(app)
      .post('/kitty')
      .send({ name: 'fluppy' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        res.body.status.should.equal('success');
        kittyId = res.body.data._id
        done()
      })
  })

  it('GET /kitty/:id (should success)', done => {
    request(app)
      .get(`/kitty/${kittyId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        res.body.status.should.equal('success')
        res.body.data.should.be.a('object')
        done()
      })
  })
})
