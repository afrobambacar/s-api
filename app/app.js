import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import config from 'config/environment';
// mongoose.Promise = global.Promise;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('open', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// Setup server
const app = express();
const server = http.createServer(app);

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, () => {
  console.log(`Express server listening on ${config.port}, in ${app.get('env')} mode`);
});

// Expose app
export default app;
