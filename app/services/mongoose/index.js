import mongoose from 'mongoose'
import { mongo } from 'config'

Object.keys(mongo.options).forEach((key) => {
  mongoose.set(key, mongo.options[key])
})

mongoose.Promise = Promise
/* istanbul ignore next */
mongoose.connection.on('open', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`)
  process.exit(-1)
})

export default mongoose
