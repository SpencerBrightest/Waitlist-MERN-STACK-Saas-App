// server/models/Signup.js
import mongoose from 'mongoose'

const signupSchema = new mongoose.Schema({
  waitlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Waitlist',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  }
}, { timestamps: true })

export default mongoose.model('Signup', signupSchema)