import mongoose, { Schema } from 'mongoose'
import validator from 'validator'

const EmailSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email is required']
  },
  created: { type: Date, default: Date.now }
})

EmailSchema
  .path('email')
  .validate((email) => {
    return validator.isEmail(email)
  }, 'the email validation was failed')

const Email = mongoose.model('Email', EmailSchema);

export default Email
