import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import * as config from 'config';
import routes from 'routes';
// mongoose.Promise = global.Promise;

// Connect to database
mongoose.connect(config.env.mongo.uri, config.env.mongo.options);
mongoose.connection.on('open', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

if (config.env.evn === 'development') {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
  });
}

// Setup server
const app = express();
const server = http.createServer(app);

config.express(app);
routes.set(app);

// Start server
server.listen(config.env.port, config.env.ip, () => {
  console.log(`Express server listening on ${config.env.port}, in ${app.get('env')} mode`);
});

// Expose app
export default app;
