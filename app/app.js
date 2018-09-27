import http from 'http'
import { env, mongo, port, ip, apiRoot } from 'config'
import mongoose from 'services/mongoose'
import express from 'services/express'
import api from 'api'

const app = express(apiRoot, api)
const server = http.createServer(app)

mongoose.connect(mongo.uri)
mongoose.Promise = Promise

server.listen(port, ip, () => {
  console.log(`Express server listening on ${port}, in ${env} mode`);
});

export default app;
