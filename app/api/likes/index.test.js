// import request from 'supertest'
// import app from 'app'

// describe('API Test /likes', () => {
//   it('POST /likes should fail without uuid', done => {
//     request(app)
//       .post('/likes')
//       .send({})
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err)
//         const { status } = res.body
//         status.should.equal('fail')
//         done()
//       })
//   })

//   it('POST /likes should success with uuid', done => {
//     request(app)
//       .post('/likes')
//       .send({ uuid: '1231231' })
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err)
//         const { status } = res.body
//         status.should.equal('success')
//         done()
//       })
//   })

//   it('GET /likes/count should return number', done => {
//     request(app)
//       .get('/likes/count')
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err)
//         const { status, data } = res.body
//         status.should.equal('success')
//         data.total.should.be.a('number')
//         done()
//       })
//   })
// })
