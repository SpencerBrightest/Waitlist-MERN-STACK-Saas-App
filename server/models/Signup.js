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
  },
  verificationCode: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  codeExpiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true })

export default mongoose.model('Signup', signupSchema)