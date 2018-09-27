import http from 'http';
import { env, mongo, port, ip, apiRoot } from 'config/environment';
import mongoose from 'mongoose';
import express from 'services/express'
import api from 'api'

console.log('.... ', env, mongo, port, ip, apiRoot);
// mongoose.Promise = global.Promise;

// Connect to database
mongoose.connect(mongo.uri, mongo.options);
mongoose.connection.on('open', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

if (env === 'development') {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
  });
}

// Setup server
const app = express(apiRoot, api);
const server = http.createServer(app);

// config.express(app);

// app.use(api)
// app.use(errorHandler())

// Start server
server.listen(config.env.port, config.env.ip, () => {
  console.log(`Express server listening on ${config.env.port}, in ${app.get('env')} mode`);
});

// Expose app
export default app;
