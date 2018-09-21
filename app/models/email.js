import mongoose, { Schema } from 'mongoose'

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
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email.text); // Assuming email has a text attribute
  }, 'the email validation was failed')

const Email = mongoose.model('Email', EmailSchema);

export default Email
